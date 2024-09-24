const FaqsSection = ({ faqs, deleteFaq }) => {
    return (
      <div className="faqs-section">
        <button className="bg-red-500 text-white py-2 px-4 rounded hover:bg-red-600 mb-4">
          Add New FAQ
        </button>
  
        <div className="grid grid-cols-1 gap-6">
          {faqs.map((faq) => (
            <div key={faq._id} className="bg-white p-4 rounded shadow-md">
              <h3 className="text-xl font-semibold mb-2">{faq.question}</h3>
              <p>{faq.answer}</p>
              <div className="flex space-x-4 mt-4">
                <button className="bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600">
                  Edit
                </button>
                <button
                  className="bg-red-500 text-white py-2 px-4 rounded hover:bg-red-600"
                  onClick={() => deleteFaq(faq._id)}
                >
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
  
        <button className="bg-red-500 text-white py-2 px-4 rounded hover:bg-red-600 mt-4">
          Add New FAQ
        </button>
      </div>
    );
  };
  
  export default FaqsSection;
  