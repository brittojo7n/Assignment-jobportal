const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const { Job, Application, Resume, User, SavedJob } = require('../models');
const multer = require('multer');
const sendEmail = require('../utils/mailer');
const { sequelize } = require('../models');

const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, 'uploads/'),
  filename: (req, file, cb) => cb(null, `${Date.now()}-${file.originalname}`),
});
const upload = multer({ storage });

router.get('/', async (req, res) => {
  try {
    const jobs = await Job.findAll({ order: [['createdAt', 'DESC']], include: ['Recruiter'] });
    res.json(jobs);
  } catch (err) { res.status(500).send('Server Error'); }
});

router.get('/:id', async (req, res) => {
  try {
    const job = await Job.findByPk(req.params.id, { include: ['Recruiter'] });
    if (!job) return res.status(404).json({ msg: 'Job not found' });
    res.json(job);
  } catch (err) { res.status(500).send('Server Error'); }
});

router.post('/', auth, async (req, res) => {
  if (req.user.role !== 'recruiter') return res.status(403).json({ msg: 'Access denied' });
  const { title, description, location, company } = req.body;
  try {
    const newJob = await Job.create({ title, description, location, company, recruiterId: req.user.id });
    res.json(newJob);
  } catch (err) { res.status(500).send('Server Error'); }
});

router.delete('/:id', auth, async (req, res) => {
  try {
    const job = await Job.findByPk(req.params.id);
    if (!job) return res.status(404).json({ msg: 'Job not found' });
    if (job.recruiterId !== req.user.id) return res.status(401).json({ msg: 'User not authorized' });
    await job.destroy();
    res.json({ msg: 'Job removed' });
  } catch (err) { res.status(500).send('Server Error'); }
});

router.get('/my-jobs/all', auth, async (req, res) => {
  if (req.user.role !== 'recruiter') {
    return res.status(403).json({ msg: 'Access denied' });
  }
  try {
    const jobs = await Job.findAll({
      where: { recruiterId: req.user.id },
      attributes: {
        include: [[sequelize.fn("COUNT", sequelize.col("Applications.id")), "applicationCount"]]
      },
      include: [{
        model: Application, attributes: []
      }],
      group: ['Job.id'],
      order: [['createdAt', 'DESC']]
    });
    res.json(jobs);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

router.post('/:id/apply', [auth, upload.single('resume')], async (req, res) => {
  try {
    const job = await Job.findByPk(req.params.id);
    if (!job) return res.status(404).json({ msg: 'Job not found' });
    const existingApplication = await Application.findOne({ where: { JobId: job.id, UserId: req.user.id } });
    if (existingApplication) return res.status(400).json({ msg: 'You have already applied' });
    const application = await Application.create({ JobId: job.id, UserId: req.user.id });
    if (req.file) await Resume.create({ filename: req.file.originalname, path: req.file.path, ApplicationId: application.id });
    const user = await User.findByPk(req.user.id);
    const emailHtml = `<h1>Application Confirmation</h1><p>Hi ${user.firstName},</p><p>Your application for the <strong>${job.title}</strong> position has been received.</p>`;
    sendEmail(user.email, `Application Received: ${job.title}`, emailHtml);
    res.json({ msg: 'Application submitted' });
  } catch (err) { res.status(500).send('Server Error'); }
});

router.get('/saved/me', auth, async (req, res) => {
  try {
    const savedJobs = await SavedJob.findAll({ where: { UserId: req.user.id }, include: [{ model: Job }] });
    res.json(savedJobs);
  } catch (err) { res.status(500).send('Server Error'); }
});

router.post('/:id/save', auth, async (req, res) => {
  try {
    const existingSavedJob = await SavedJob.findOne({ where: { JobId: req.params.id, UserId: req.user.id } });
    if (existingSavedJob) return res.status(400).json({ msg: 'Job already saved' });
    await SavedJob.create({ JobId: req.params.id, UserId: req.user.id });
    res.json({ msg: 'Job saved' });
  } catch (err) { res.status(500).send('Server Error'); }
});

router.delete('/saved/:id', auth, async (req, res) => {
  try {
    const savedJob = await SavedJob.findByPk(req.params.id);
    if (!savedJob) return res.status(404).json({ msg: 'Saved job not found' });
    if (savedJob.UserId !== req.user.id) return res.status(401).json({ msg: 'User not authorized' });
    await savedJob.destroy();
    res.json({ msg: 'Job unsaved' });
  } catch (err) { res.status(500).send('Server Error'); }
});

module.exports = router;