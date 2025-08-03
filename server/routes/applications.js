const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const { Application, Job, User, Resume } = require('../models');

// GET all applications for a recruiter's jobs
router.get('/', auth, async (req, res) => {
  if (req.user.role !== 'recruiter') {
    return res.status(403).json({ msg: 'Access denied' });
  }
  try {
    const applications = await Application.findAll({
      include: [
        { model: Job, where: { recruiterId: req.user.id }, attributes: ['title'] },
        { model: User, attributes: ['firstName', 'lastName', 'email'] },
        { model: Resume }
      ],
      order: [['createdAt', 'DESC']]
    });
    res.json(applications);
  } catch (err) {
    res.status(500).send('Server Error');
  }
});

// GET all applications for the logged-in user
router.get('/me', auth, async (req, res) => {
  try {
    const applications = await Application.findAll({
      where: { UserId: req.user.id },
      include: [{ model: Job, attributes: ['title', 'company', 'location'] }],
      order: [['createdAt', 'DESC']]
    });
    res.json(applications);
  } catch (err) {
    res.status(500).send('Server Error');
  }
});

// PUT update application status (shortlist/reject)
router.put('/:id/status', auth, async (req, res) => {
  if (req.user.role !== 'recruiter') {
    return res.status(403).json({ msg: 'Access denied' });
  }
  const { status } = req.body;
  if (!['shortlisted', 'rejected'].includes(status)) {
    return res.status(400).json({ msg: 'Invalid status' });
  }
  try {
    const application = await Application.findByPk(req.params.id, { include: [User, Job] });
    if (!application) return res.status(404).json({ msg: 'Application not found' });

    application.status = status;
    await application.save();

    res.json(application);
  } catch (err) {
    res.status(500).send('Server Error');
  }
});

module.exports = router;