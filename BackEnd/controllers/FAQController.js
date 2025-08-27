const FAQ = require('../models/FAQModel')

const getAnswer = async (req, res) => {
    const id = req.params.id;
    try {
        const answer = await FAQ.findById(id, 'answer');
        res.status(200).json(answer);
    } catch (error) {
        res.status(500).send('Error fetching answer');
    }
};

const getQuestions = async (req, res)=> {
    try {
        const faqs = await FAQ.find({}, 'question answer createdAt');
        res.status(200).json(faqs);
    } catch (error) {
        console.error('Error fetching FAQs:', error);
        res.status(500).json({ message: 'Error fetching FAQs' });
    }
}

const addQandA = async (req, res) => {
    const { question, answer } = req.body; 
    try {
        const newFAQ = new FAQ({ question, answer });
        const saved = await newFAQ.save(); 
        res.status(201).json(saved);
    } catch (error) {
        console.error('Error adding question:', error);
        res.status(500).json({ message: 'Error adding question' });
    }
};

const deleteFaq = async (req, res)=> {
    const qandAId = req.params.id;
    try {
        const dQandA = await FAQ.findByIdAndDelete(qandAId)
        res.status(200).json({message: "qanda deleted sucsessfully"})
    } catch (err) {
        console.log('error deleting qanda')
        res.status(400).json({message: `eror deleting qanda ${err}`})
    }
}

module.exports = { getAnswer, getQuestions, addQandA , deleteFaq}