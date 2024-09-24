import React, { useState, useContext } from 'react';
import { GlobalContext } from '../GlobalContext';

const AddFaq = () => {
    const { addFaq, isPostingFaq } = useContext(GlobalContext);
    const [newFaq, setNewFaq] = useState({
        question: '',
        answer: '',
    });

    const handleChange = (e) => {
        setNewFaq({ ...newFaq, [e.target.name]: e.target.value });
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        addFaq(newFaq);
    };

    return (
        <form onSubmit={handleSubmit}>
            <input
                type="text"
                name="question"
                placeholder="FAQ Question"
                value={newFaq.question}
                onChange={handleChange}
                required
            />
            <textarea
                name="answer"
                placeholder="FAQ Answer"
                value={newFaq.answer}
                onChange={handleChange}
                required
            ></textarea>
            <button type="submit" disabled={isPostingFaq}>
                {isPostingFaq ? 'Adding FAQ...' : 'Add FAQ'}
            </button>
        </form>
    );
};

export default AddFaq;
