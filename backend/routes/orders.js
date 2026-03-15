const express = require('express');
const router = express.Router();
const { createOrder, getMyPurchases, getMySales } = require('../controllers/orderController');
const authMiddleware = require('../middleware/authMiddleware');

router.post('/', authMiddleware, createOrder);
router.get('/my-purchases', authMiddleware, getMyPurchases);
router.get('/my-sales', authMiddleware, getMySales);

module.exports = router;
