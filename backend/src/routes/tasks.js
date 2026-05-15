const express = require('express');
const Task = require('../models/Task');
const { protect } = require('../middleware/auth');
const router = express.Router();
router.use(protect);

router.get('/', async (req, res) => {
  try {
    const filter = { user: req.user._id };
    const tasks = await Task.find(filter).sort({ createdAt: -1 });
    res.json({ count: tasks.length, tasks });
  } catch (err) { res.status(500).json({ message: err.message }); }
});

router.post('/', async (req, res) => {
  try {
    const { text, priority } = req.body;
    if (!text) return res.status(400).json({ message: 'Text required.' });
    const task = await Task.create({ user: req.user._id, text, priority });
    res.status(201).json({ task });
  } catch (err) { res.status(500).json({ message: err.message }); }
});

router.put('/:id', async (req, res) => {
  try {
    const task = await Task.findOne({ _id: req.params.id, user: req.user._id });
    if (!task) return res.status(404).json({ message: 'Task not found.' });
    const { text, done, priority } = req.body;
    if (text !== undefined) task.text = text;
    if (done !== undefined) task.done = done;
    if (priority !== undefined) task.priority = priority;
    await task.save();
    res.json({ task });
  } catch (err) { res.status(500).json({ message: err.message }); }
});

router.delete('/:id', async (req, res) => {
  try {
    const task = await Task.findOneAndDelete({ _id: req.params.id, user: req.user._id });
    if (!task) return res.status(404).json({ message: 'Task not found.' });
    res.json({ message: 'Deleted' });
  } catch (err) { res.status(500).json({ message: err.message }); }
});

module.exports = router;
