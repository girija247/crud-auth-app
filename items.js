const express = require('express');
const router = express.Router();
const Item = require('../models/item'); // or 'Item' with capital I, match your file
const authMiddleware = require('../middleware/auth');

// Show dashboard with search + pagination
router.get('/dashboard', authMiddleware, async (req, res) => {
  const search = req.query.search || '';
  const page = parseInt(req.query.page) || 1;
  const limit = 5;
  const skip = (page - 1) * limit;

  const query = {
    user: req.session.userId,
    title: { $regex: search, $options: 'i' }
  };

  try {
    const items = await Item.find(query).skip(skip).limit(limit);
    const totalItems = await Item.countDocuments(query);
    const totalPages = Math.ceil(totalItems / limit);

    res.render('dashboard', { items, search, page, totalPages });
  } catch (err) {
    res.status(500).send("Error loading dashboard");
  }
});

// Edit Form
router.get('/:id/edit', authMiddleware, async (req, res) => {
  try {
    const item = await Item.findById(req.params.id);
    res.render('edit', { item });
  } catch (err) {
    res.status(500).send("Error loading item");
  }
});

// Update Item
router.post('/:id', authMiddleware, async (req, res) => {
  const { title, description } = req.body;
  try {
    await Item.findByIdAndUpdate(req.params.id, { title, description });
    res.redirect('/dashboard');
  } catch (err) {
    res.status(500).send("Error updating item");
  }
});

// Delete Item
router.post('/:id/delete', authMiddleware, async (req, res) => {
  try {
    await Item.findByIdAndDelete(req.params.id);
    res.redirect('/dashboard');
  } catch (err) {
    res.status(500).send("Error deleting item");
  }
});

module.exports = router;
