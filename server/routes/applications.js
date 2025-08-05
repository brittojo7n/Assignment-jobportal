const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const { Application, Job, User, Resume } = require('../models');

router.get('/', auth, async (req, res) => {
  if (req.user.role !== 'recruiter') return res.status(403).json({ msg: 'Access denied' });
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
  } catch (err) { res.status(500).send('Server Error'); }
});

router.get('/me', auth, async (req, res) => {
  try {
    const applications = await Application.findAll({
      where: { UserId: req.user.id },
      include: [{ model: Job, attributes: ['title', 'company', 'location'] }],
      order: [['createdAt', 'DESC']]
    });
    res.json(applications);
  } catch (err) { res.status(500).send('Server Error'); }
});

router.get('/job/:jobId', auth, async (req, res) => {
  if (req.user.role !== 'recruiter') {
    return res.status(403).json({ msg: 'Access denied' });
  }
  try {
    // First, verify the recruiter owns the job they are requesting applications for
    const job = await Job.findByPk(req.params.jobId);
    if (!job) {
      return res.status(404).json({ msg: 'Job not found' });
    }
    if (job.recruiterId !== req.user.id) {
      return res.status(401).json({ msg: 'User not authorized' });
    }

    // If they own the job, fetch the applications
    const applications = await Application.findAll({
      where: { JobId: req.params.jobId },
      include: [
        { model: User, attributes: ['firstName', 'lastName', 'email'] },
        { model: Resume }
      ],
      order: [['createdAt', 'DESC']]
    });
    res.json(applications);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

router.put('/:id/status', auth, async (req, res) => {
  if (req.user.role !== 'recruiter') return res.status(403).json({ msg: 'Access denied' });
  const { status } = req.body;
  if (!['shortlisted', 'rejected'].includes(status)) return res.status(400).json({ msg: 'Invalid status' });
  try {
    const application = await Application.findByPk(req.params.id);
    if (!application) return res.status(404).json({ msg: 'Application not found' });
    application.status = status;
    await application.save();
    res.json(application);
  } catch (err) { res.status(500).send('Server Error'); }
});

router.delete('/:id', auth, async (req, res) => {
  try {
    const application = await Application.findByPk(req.params.id);
    if (!application) return res.status(404).json({ msg: 'Application not found' });
    if (application.UserId !== req.user.id) return res.status(401).json({ msg: 'User not authorized' });
    await application.destroy();
    res.json({ msg: 'Application withdrawn' });
  } catch (err) { res.status(500).send('Server Error'); }
});

module.exports = router;