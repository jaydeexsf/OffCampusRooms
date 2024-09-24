import React, { useContext } from 'react';
import { GlobalContext } from '../GlobalContext';

const DeleteFaq = ({ faqId }) => {
    const { deleteFaq } = useContext(GlobalContext);

    const handleDelete = () => {
        deleteFaq(faqId);
    };

    return (
        <button onClick={handleDelete}>
            Delete FAQ
        </button>
    );
};

export default DeleteFaq;
