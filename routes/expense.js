const express = require('express');
const router = express.Router();
const Expense = require('../models/Expense');
const { default: mongoose } = require('mongoose');

// Thêm chi tiêu
router.post('/', async (req, res) => {
  const { userId, name, amount } = req.body;
  const expense = new Expense({ userId, name, amount });
  await expense.save();
  res.status(201).send('Thêm chi tiêu thành công');
});

// Lấy tổng chi tiêu
router.get('/:userId/:type', async (req, res) => {
  const { userId, type } = req.params;
  let match = { userId:  new mongoose.Types.ObjectId(userId) };
  if (type === 'day') {
    match.date = { $gte: new Date(new Date().setHours(0, 0, 0)) };
  } else if (type === 'week') {
    match.date = { $gte: new Date(new Date() - 7 * 24 * 60 * 60 * 1000) };
  } else if (type === 'month') {
    match.date = { $gte: new Date(new Date().setDate(1)) };
  }
  const total = await Expense.aggregate([
    { $match: match },
    { $group: { _id: null, total: { $sum: '$amount' } } }
  ]);
  res.json({ total: total[0]?.total || 0 });
});

// Lấy danh sách chi tiêu của user
router.get('/:userId', async (req, res) => {
  const { userId } = req.params;
  const expenses = await Expense.find({ userId });
  res.json(expenses);
});
// xóa 1 chi tiêu của user
router.delete('/:id', async (req, res) => {
  const { id } = req.params;
  try {
    await Expense.findByIdAndDelete(id);
    res.status(200).send('Xóa chi tiêu thành công');
  } catch (error) {
    res.status(400).send('Lỗi khi xóa chi tiêu');
  }
});
module.exports = router;