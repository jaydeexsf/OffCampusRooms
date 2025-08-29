import React, { useState } from 'react';
import { FiTrash2, FiAlertCircle } from 'react-icons/fi';
import { apiClient, API_ENDPOINTS } from '../../config/api';

const DeleteFaq = ({ faq, onDelete, onError }) => {
    const [showConfirm, setShowConfirm] = useState(false);
    const [deleting, setDeleting] = useState(false);

    const handleDeleteClick = () => {
        setShowConfirm(true);
    };

    const handleDeleteConfirm = async () => {
        setDeleting(true);
        
        try {
            console.log('🗑️ Deleting FAQ:', faq._id);
            await apiClient.delete(`${API_ENDPOINTS.DELETE_FAQ}/${faq._id}`);
            console.log('✅ FAQ deleted successfully');
            
            if (onDelete) {
                onDelete(faq._id, 'FAQ deleted successfully!');
            }
            setShowConfirm(false);
        } catch (error) {
            console.error('❌ Error deleting FAQ:', error);
            if (onError) {
                onError(error.response?.data?.message || 'Failed to delete FAQ. Please try again.');
            }
        } finally {
            setDeleting(false);
        }
    };

    const handleDeleteCancel = () => {
        setShowConfirm(false);
    };

    return (
        <>
            <button
                onClick={handleDeleteClick}
                disabled={deleting}
                className={`bg-red-500/20 hover:bg-red-500/30 text-red-400 p-2 rounded-lg transition-all duration-200 flex items-center justify-center gap-1 ${
                    deleting ? 'opacity-50 cursor-not-allowed' : ''
                }`}
                title="Delete FAQ"
            >
                {deleting ? (
                    <div className="w-4 h-4 border-2 border-red-400/30 border-t-red-400 rounded-full animate-spin"></div>
                ) : (
                    <FiTrash2 className="w-4 h-4" />
                )}
            </button>

            {/* Delete Confirmation Modal */}
            {showConfirm && (
                <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
                    <div className="bg-gray-900 border border-red-500/30 rounded-2xl max-w-md w-full p-6 shadow-2xl">
                        <div className="text-center">
                            <div className="w-16 h-16 bg-red-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
                                <FiAlertCircle className="w-8 h-8 text-red-400" />
                            </div>
                            
                            <h3 className="text-xl font-bold text-white mb-2">Delete FAQ</h3>
                            <p className="text-gray-400 mb-4">
                                Are you sure you want to delete this FAQ? This action cannot be undone.
                            </p>
                            
                            <div className="bg-red-500/10 border border-red-500/20 rounded-lg p-3 mb-6">
                                <p className="text-red-300 font-medium text-sm break-words">
                                    "{faq.question}"
                                </p>
                            </div>
                            
                            <div className="flex gap-3">
                                <button
                                    onClick={handleDeleteCancel}
                                    disabled={deleting}
                                    className="flex-1 bg-white/10 border border-white/20 text-white font-semibold py-3 px-4 rounded-xl hover:bg-white/20 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                    Cancel
                                </button>
                                <button
                                    onClick={handleDeleteConfirm}
                                    disabled={deleting}
                                    className={`flex-1 bg-gradient-to-r from-red-600 to-red-500 hover:from-red-500 hover:to-red-400 text-white font-semibold py-3 px-4 rounded-xl transition-all duration-200 flex items-center justify-center gap-2 ${
                                        deleting ? 'opacity-50 cursor-not-allowed' : 'shadow-lg hover:shadow-xl'
                                    }`}
                                >
                                    {deleting ? (
                                        <>
                                            <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                                            <span>Deleting...</span>
                                        </>
                                    ) : (
                                        <>
                                            <FiTrash2 className="w-4 h-4" />
                                            <span>Delete FAQ</span>
                                        </>
                                    )}
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
};

export default DeleteFaq;
