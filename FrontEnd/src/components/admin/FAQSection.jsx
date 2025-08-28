import React, { useState, useEffect } from 'react';
import { FiPlus, FiEdit, FiTrash2, FiMessageCircle, FiX, FiSave, FiCheck, FiAlertCircle } from 'react-icons/fi';
import { apiClient, API_ENDPOINTS } from '../../config/api';

const FAQSection = () => {
  const [faqs, setFaqs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showAddModal, setShowAddModal] = useState(false);
  const [editingFaq, setEditingFaq] = useState(null);
  const [formData, setFormData] = useState({ question: '', answer: '' });
  const [submitting, setSubmitting] = useState(false);
  const [message, setMessage] = useState({ type: '', text: '' });

  useEffect(() => {
    fetchFAQs();
  }, []);

  // Auto-hide messages after 5 seconds
  useEffect(() => {
    if (message.text) {
      const timeout = setTimeout(() => {
        setMessage({ type: '', text: '' });
      }, 5000);
      return () => clearTimeout(timeout);
    }
  }, [message.text]);

  const fetchFAQs = async () => {
    try {
      const response = await apiClient.get(API_ENDPOINTS.GET_FAQS);
      setFaqs(response.data.faqs || []);
      console.log('✅ FAQs fetched successfully:', response.data.faqs?.length || 0);
    } catch (error) {
      console.error('Error fetching FAQs:', error);
      // Use dummy data as fallback
      const dummyFAQs = [
        { _id: '1', question: 'How do I book a room?', answer: 'You can book a room through our website by selecting your preferred location and dates.' },
        { _id: '2', question: 'What payment methods do you accept?', answer: 'We accept all major credit cards, debit cards, and mobile payments.' },
        { _id: '3', question: 'Can I cancel my booking?', answer: 'Yes, you can cancel your booking up to 24 hours before check-in for a full refund.' }
      ];
      setFaqs(dummyFAQs);
      setMessage({ 
        type: 'error', 
        text: 'Failed to load FAQs from server. Showing demo data.' 
      });
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.question.trim() || !formData.answer.trim()) return;

    setSubmitting(true);
    setMessage({ type: '', text: '' });
    
    try {
      if (editingFaq) {
        await apiClient.put(`${API_ENDPOINTS.ADD_FAQ}/${editingFaq._id}`, formData);
        setMessage({ type: 'success', text: 'FAQ updated successfully!' });
      } else {
        await apiClient.post(API_ENDPOINTS.ADD_FAQ, formData);
        setMessage({ type: 'success', text: 'FAQ created successfully!' });
      }
      await fetchFAQs();
      resetForm();
    } catch (error) {
      console.error('Error saving FAQ:', error);
      setMessage({ 
        type: 'error', 
        text: error.response?.data?.message || 'Failed to save FAQ. Please try again.' 
      });
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this FAQ?')) return;
    
    try {
      await apiClient.delete(`${API_ENDPOINTS.DELETE_FAQ}/${id}`);
      setMessage({ type: 'success', text: 'FAQ deleted successfully!' });
      await fetchFAQs();
    } catch (error) {
      console.error('Error deleting FAQ:', error);
      setMessage({ 
        type: 'error', 
        text: error.response?.data?.message || 'Failed to delete FAQ. Please try again.' 
      });
    }
  };

  const handleEdit = (faq) => {
    setEditingFaq(faq);
    setFormData({ question: faq.question, answer: faq.answer });
    setShowAddModal(true);
  };

  const resetForm = () => {
    setFormData({ question: '', answer: '' });
    setEditingFaq(null);
    setShowAddModal(false);
    setMessage({ type: '', text: '' });
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="w-8 h-8 border-2 border-white/30 border-t-blue-400 rounded-full animate-spin"></div>
        <span className="ml-3 text-gray-400">Loading FAQs...</span>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <FiMessageCircle className="w-6 h-6 text-blue-400" />
          <h2 className="text-xl sm:text-2xl font-bold text-white">FAQ Management</h2>
        </div>
        <button
          onClick={() => setShowAddModal(true)}
          className="bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-500 hover:to-blue-400 text-white px-4 sm:px-6 py-2 sm:py-3 rounded-xl font-medium transition-all duration-200 flex items-center gap-2 shadow-lg hover:shadow-xl text-sm sm:text-base w-full sm:w-auto justify-center"
        >
          <FiPlus className="w-4 h-4" />
          <span className="sm:inline">Add New FAQ</span>
        </button>
      </div>

      {/* Message Display */}
      {message.text && (
        <div className={`p-4 rounded-xl border ${
          message.type === 'success'
            ? 'bg-green-500/20 border-green-500/30 text-green-400'
            : 'bg-red-500/20 border-red-500/30 text-red-400'
        } flex items-center gap-3`}>
          {message.type === 'success' ? <FiCheck className="w-5 h-5" /> : <FiAlertCircle className="w-5 h-5" />}
          <span className="font-medium">{message.text}</span>
        </div>
      )}

      {/* FAQ List */}
      {faqs.length === 0 ? (
        <div className="text-center py-12">
          <FiMessageCircle className="w-16 h-16 text-gray-600 mx-auto mb-4" />
          <h3 className="text-xl font-semibold text-gray-400 mb-2">No FAQs Found</h3>
          <p className="text-gray-500 mb-6">Create your first FAQ to help users find answers quickly</p>
          <button
            onClick={() => setShowAddModal(true)}
            className="bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-500 hover:to-blue-400 text-white px-6 py-3 rounded-xl font-medium transition-all duration-200"
          >
            Create First FAQ
          </button>
        </div>
      ) : (
        <div className="grid gap-4">
          {faqs.map((faq) => (
            <div key={faq._id} className="bg-white/5 border border-white/10 rounded-2xl p-4 sm:p-6 hover:bg-white/10 transition-all duration-200">
              <div className="flex flex-col sm:flex-row justify-between items-start gap-4">
                <div className="flex-1 w-full">
                  <h3 className="text-base sm:text-lg font-semibold text-white mb-2 sm:mb-3 break-words">{faq.question}</h3>
                  <p className="text-gray-300 leading-relaxed text-sm sm:text-base break-words">{faq.answer}</p>
                </div>
                <div className="flex gap-2 flex-shrink-0 w-full sm:w-auto justify-end">
                  <button
                    onClick={() => handleEdit(faq)}
                    className="bg-blue-500/20 hover:bg-blue-500/30 text-blue-400 p-2 sm:p-2 rounded-lg transition-all duration-200 flex-1 sm:flex-none flex items-center justify-center gap-1 sm:gap-0"
                  >
                    <FiEdit className="w-4 h-4" />
                    <span className="sm:hidden text-xs">Edit</span>
                  </button>
                  <button
                    onClick={() => handleDelete(faq._id)}
                    className="bg-red-500/20 hover:bg-red-500/30 text-red-400 p-2 sm:p-2 rounded-lg transition-all duration-200 flex-1 sm:flex-none flex items-center justify-center gap-1 sm:gap-0"
                  >
                    <FiTrash2 className="w-4 h-4" />
                    <span className="sm:hidden text-xs">Delete</span>
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Add/Edit Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-2 sm:p-4">
          <div className="bg-gray-900 border border-white/10 rounded-2xl sm:rounded-3xl max-w-2xl w-full max-h-[95vh] sm:max-h-[90vh] overflow-y-auto">
            <div className="p-4 sm:p-8">
              <div className="flex items-center justify-between mb-4 sm:mb-6">
                <h3 className="text-lg sm:text-2xl font-bold text-white">
                  {editingFaq ? 'Edit FAQ' : 'Add New FAQ'}
                </h3>
                <button
                  onClick={resetForm}
                  className="bg-white/10 hover:bg-white/20 text-white p-2 rounded-full transition-all duration-200"
                >
                  <FiX className="w-4 h-4 sm:w-5 sm:h-5" />
                </button>
              </div>

              <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-6">
                <div className="space-y-2">
                  <label className="text-white font-medium text-sm sm:text-base">Question *</label>
                  <input
                    type="text"
                    value={formData.question}
                    onChange={(e) => setFormData({ ...formData, question: e.target.value })}
                    placeholder="Enter the frequently asked question"
                    required
                    className="w-full bg-white/10 border border-white/20 rounded-xl px-3 sm:px-4 py-2 sm:py-3 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 text-sm sm:text-base"
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-white font-medium text-sm sm:text-base">Answer *</label>
                  <textarea
                    value={formData.answer}
                    onChange={(e) => setFormData({ ...formData, answer: e.target.value })}
                    placeholder="Provide a clear and helpful answer"
                    rows={4}
                    required
                    className="w-full bg-white/10 border border-white/20 rounded-xl px-3 sm:px-4 py-2 sm:py-3 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 resize-none text-sm sm:text-base"
                  />
                </div>

                <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 pt-2 sm:pt-4">
                  <button
                    type="button"
                    onClick={resetForm}
                    className="w-full sm:flex-1 bg-white/10 border border-white/20 text-white font-semibold py-2 sm:py-3 px-4 sm:px-6 rounded-xl hover:bg-white/20 transition-all duration-200 text-sm sm:text-base"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={submitting || !formData.question.trim() || !formData.answer.trim()}
                    className={`w-full sm:flex-1 bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-500 hover:to-blue-400 text-white font-semibold py-2 sm:py-3 px-4 sm:px-6 rounded-xl transition-all duration-200 flex items-center justify-center gap-2 text-sm sm:text-base ${
                      submitting || !formData.question.trim() || !formData.answer.trim() ? 'opacity-50 cursor-not-allowed' : 'shadow-lg hover:shadow-xl'
                    }`}
                  >
                    {submitting ? (
                      <>
                        <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                        <span>{editingFaq ? 'Updating...' : 'Creating...'}</span>
                      </>
                    ) : (
                      <>
                        <FiSave className="w-4 h-4" />
                        <span>{editingFaq ? 'Update FAQ' : 'Create FAQ'}</span>
                      </>
                    )}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default FAQSection;