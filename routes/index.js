const express = require('express');
const { suggestion, user } = require('../services');

const router = new express.Router();

router.get('/suggestion', suggestion.get);

router.get('/user', user.get);
router.post('/user', user.post);

module.exports = router;
