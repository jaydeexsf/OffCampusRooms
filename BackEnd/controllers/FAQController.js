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
        const question = await FAQ.find({}, 'question');
        res.status(200).json(question);
    } catch (error) {
        res.status(500).send('érror fetching wuestions');
    }
}

const addQandA = async (req, res) => {
    const { question, answer } = req.body; 
    try {
        const newFAQ = new FAQ({ question, answer });
        await newFAQ.save(); 
        res.status(201).json({ message: 'Question and answer added successfully' });
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
        consle.log('error deleting qanda')
        res.status(400).json({message: `eror deleting qanda ${err}`})
    }
}

module.exports = { getAnswer, getQuestions, addQandA , deleteFaq}