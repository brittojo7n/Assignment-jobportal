const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const { Job, Application, Resume, User, SavedJob } = require('../models');
const multer = require('multer');
const path = require('path');
const sendEmail = require('../utils/mailer');

// Multer storage configuration
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads/');
  },
  filename: function (req, file, cb) {
    cb(null, `${Date.now()}-${file.originalname}`);
  }
});
const upload = multer({ storage: storage });

// GET all jobs
router.get('/', async (req, res) => {
  try {
    const jobs = await Job.findAll({ order: [['createdAt', 'DESC']] });
    res.json(jobs);
  } catch (err) {
    res.status(500).send('Server Error');
  }
});

// GET a single job by ID
router.get('/:id', async (req, res) => {
  try {
    const job = await Job.findByPk(req.params.id);
    if (!job) return res.status(404).json({ msg: 'Job not found' });
    res.json(job);
  } catch (err) {
    res.status(500).send('Server Error');
  }
});

// POST (create) a new job (Recruiter only)
router.post('/', auth, async (req, res) => {
  if (req.user.role !== 'recruiter') {
    return res.status(403).json({ msg: 'Access denied' });
  }
  const { title, description, location, company } = req.body;
  try {
    const newJob = await Job.create({ title, description, location, company, recruiterId: req.user.id });
    res.json(newJob);
  } catch (err) {
    res.status(500).send('Server Error');
  }
});

// POST apply for a job
router.post('/:id/apply', [auth, upload.single('resume')], async (req, res) => {
  try {
    const job = await Job.findByPk(req.params.id);
    if (!job) return res.status(404).json({ msg: 'Job not found' });

    const existingApplication = await Application.findOne({ where: { JobId: job.id, UserId: req.user.id } });
    if (existingApplication) return res.status(400).json({ msg: 'You have already applied for this job' });

    const application = await Application.create({ JobId: job.id, UserId: req.user.id });

    if (req.file) {
      await Resume.create({ filename: req.file.originalname, path: req.file.path, ApplicationId: application.id });
    }

    const user = await User.findByPk(req.user.id);
    const emailHtml = `<h1>Application Confirmation</h1><p>Hi ${user.firstName},</p><p>Your application for the <strong>${job.title}</strong> position at ${job.company} has been successfully received. We will review your application and get back to you soon.</p>`;
    sendEmail(user.email, `Application Received: ${job.title}`, emailHtml);

    res.json({ msg: 'Application submitted successfully' });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// POST save a job
router.post('/:id/save', auth, async (req, res) => {
  try {
    const existingSavedJob = await SavedJob.findOne({ where: { JobId: req.params.id, UserId: req.user.id } });
    if (existingSavedJob) return res.status(400).json({ msg: 'Job already saved' });

    await SavedJob.create({ JobId: req.params.id, UserId: req.user.id });
    res.json({ msg: 'Job saved successfully' });
  } catch (err) {
    res.status(500).send('Server Error');
  }
});

// GET saved jobs for a user
router.get('/saved/me', auth, async (req, res) => {
  try {
    const savedJobs = await SavedJob.findAll({
      where: { UserId: req.user.id },
      include: [{ model: Job }]
    });
    res.json(savedJobs);
  } catch (err) {
    res.status(500).send('Server Error');
  }
});

module.exports = router;