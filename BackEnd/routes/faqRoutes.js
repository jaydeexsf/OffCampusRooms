const express = require('express')
const { getQuestions, getAnswer, addQandA, deleteFaq } = require("../controllers/FAQController")
const router = express.Router()

// endpoints for getting QandQ from mongo db
router.get('/questions', getQuestions);
router.get('/answer/:id', getAnswer);

//endpoint for adding QandA
router.post('/add-qanda', addQandA);

//endpoint for deleting qanda
router.delete('/del-faq/:id', deleteFaq)

module.exports = router;