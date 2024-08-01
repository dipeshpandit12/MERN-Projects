const express = require('express');
const Todo = require('../models/todo'); 

// Middleware to check if the user is authenticated
function ensureAuthenticated(req, res, next) {
  if (req.isAuthenticated()) {
    return next();
  } else {
    res.status(401).send('Unauthorized');
  }
}


const router = express.Router();

// Route to get all to-dos for the authenticated user
router.get('/', ensureAuthenticated, async (req, res) => {
  try {
    const todos = await Todo.find({ userId: req.user._id });
    res.status(200).json(todos);
  } catch (err) {
    res.status(500).send('Server error');
  }
});

// Route to add a new to-do for the authenticated user
router.post('/', ensureAuthenticated, async (req, res) => {
  const { description } = req.body;
  try {
    const newTodo = new Todo({
      userId: req.user._id,
      description,
    });
    await newTodo.save();
    res.status(201).json(newTodo);
  } catch (err) {
    res.status(500).send('Server error');
  }
});

router.put('/:id', ensureAuthenticated, async (req, res) => {
    const { id } = req.params;
    const { description } = req.body;
    try {
      const todo = await Todo.findOneAndUpdate(
        { _id: id, userId: req.user._id },
        { description },
        { new: true }
      );
      if (!todo) {
        return res.status(404).send('To-do not found');
      }
      res.status(200).json(todo);
    } catch (err) {
      res.status(500).send('Server error');
    }
  });

// Route to delete a to-do
router.delete('/:id', ensureAuthenticated, async (req, res) => {
  const { id } = req.params;
  try {
    const todo = await Todo.findOne({ _id: id, userId: req.user._id });
    if (!todo) {
      return res.status(404).send('To-do not found');
    }
    await Todo.findByIdAndDelete(id);
    res.status(200).send('To-do deleted');
  } catch (err) {
    res.status(500).send('Server error');
  }
});

module.exports = router;
