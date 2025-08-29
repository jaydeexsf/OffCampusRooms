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
        console.log('✅ FAQs fetched successfully:', faqs.length, 'items');
        res.status(200).json({ faqs, count: faqs.length });
    } catch (error) {
        console.error('❌ Error fetching FAQs:', error);
        res.status(500).json({ message: 'Error fetching FAQs', error: error.message });
    }
}

const addQandA = async (req, res) => {
    const { question, answer } = req.body; 
    console.log('📝 Creating new FAQ:', { question, answer });
    
    try {
        const newFAQ = new FAQ({ question, answer });
        const saved = await newFAQ.save(); 
        console.log('✅ FAQ created successfully:', saved._id);
        res.status(201).json({ 
            message: 'FAQ created successfully!', 
            faq: saved,
            success: true 
        });
    } catch (error) {
        console.error('❌ Error adding FAQ:', error);
        res.status(500).json({ 
            message: 'Error adding FAQ', 
            error: error.message,
            success: false 
        });
    }
};

const updateFaq = async (req, res) => {
    const faqId = req.params.id;
    const { question, answer } = req.body;
    console.log('📝 Updating FAQ:', faqId, { question, answer });
    
    try {
        const updatedFAQ = await FAQ.findByIdAndUpdate(
            faqId, 
            { question, answer, updatedAt: new Date() }, 
            { new: true }
        );
        
        if (!updatedFAQ) {
            console.log('❌ FAQ not found:', faqId);
            return res.status(404).json({ message: "FAQ not found", success: false });
        }
        
        console.log('✅ FAQ updated successfully:', faqId);
        res.status(200).json({
            message: "FAQ updated successfully!",
            faq: updatedFAQ,
            success: true
        });
    } catch (error) {
        console.error('❌ Error updating FAQ:', error);
        res.status(500).json({
            message: 'Error updating FAQ',
            error: error.message,
            success: false
        });
    }
};

const deleteFaq = async (req, res)=> {
    const qandAId = req.params.id;
    console.log('🗑️ Deleting FAQ:', qandAId);
    
    try {
        const dQandA = await FAQ.findByIdAndDelete(qandAId)
        if (!dQandA) {
            console.log('❌ FAQ not found:', qandAId);
            return res.status(404).json({message: "FAQ not found", success: false});
        }
        console.log('✅ FAQ deleted successfully:', qandAId);
        res.status(200).json({
            message: "FAQ deleted successfully!", 
            success: true,
            deletedId: qandAId
        });
    } catch (err) {
        console.error('❌ Error deleting FAQ:', err);
        res.status(400).json({
            message: `Error deleting FAQ: ${err.message}`, 
            success: false,
            error: err.message
        });
    }
}

module.exports = { getAnswer, getQuestions, addQandA, updateFaq, deleteFaq}