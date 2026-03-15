const express = require('express');
const router = express.Router();
const { createExchangeRequest, getExchangeRequests, updateExchangeRequest } = require('../controllers/exchangeController');
const authMiddleware = require('../middleware/authMiddleware');

router.post('/', authMiddleware, createExchangeRequest);
router.get('/', authMiddleware, getExchangeRequests);
router.put('/:id', authMiddleware, updateExchangeRequest);

module.exports = router;
