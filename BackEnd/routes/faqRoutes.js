const express = require('express')
const { getQuestions, getAnswer, addQandA, deleteFaq } = require("../controllers/FAQController")
const router = express.Router()

// endpoints for getting QandQ from mongo db
router.get('/questions', getQuestions);
router.get('/answer/:id', getAnswer);
router.post('/add-qanda', addQandA);
router.delete('/:id', deleteFaq);


module.exports = router;