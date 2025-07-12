 const express = require('express');
const router = express.Router();
const Item = require('../models/Item');

// Middleware to check if user is logged in
function authMiddleware(req, res, next) {
  if (!req.session.userId) {
    return res.redirect('/login');
  }
  next();
}

// View Dashboard
router.get('/dashboard', authMiddleware, async (req, res) => {
  const items = await Item.find({ user: req.session.userId });
  res.render('dashboard', { items });
});

// Create Item
router.post('/items', authMiddleware, async (req, res) => {
  await Item.create({
    title: req.body.title,
    description: req.body.description,
    user: req.session.userId
  });
  res.redirect('/dashboard');
});

// Edit Item - Form
router.get('/items/:id/edit', authMiddleware, async (req, res) => {
  const item = await Item.findById(req.params.id);
  if (item.user.toString() !== req.session.userId) {
    return res.send('Not authorized');
  }
  res.render('edit', { item });
});

// Update Item
router.post('/items/:id/update', authMiddleware, async (req, res) => {
  const item = await Item.findById(req.params.id);
  if (item.user.toString() !== req.session.userId) {
    return res.send('Not authorized');
  }
  await Item.findByIdAndUpdate(req.params.id, req.body);
  res.redirect('/dashboard');
});

// Delete Item
router.post('/items/:id/delete', authMiddleware, async (req, res) => {
  const item = await Item.findById(req.params.id);
  if (item.user.toString() !== req.session.userId) {
    return res.send('Not authorized');
  }
  await Item.findByIdAndDelete(req.params.id);
  res.redirect('/dashboard');
});

module.exports = router;

