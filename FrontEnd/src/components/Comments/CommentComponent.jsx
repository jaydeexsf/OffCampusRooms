import React, { useState, useEffect } from 'react';
import { useAuth, useUser } from '@clerk/clerk-react';
import { FiMessageCircle, FiSend, FiTrash2, FiEdit3 } from 'react-icons/fi';
import LoginPopup from '../LoginPopup/LoginPopup';
import { apiClient } from '../../config/api';
import { API_ENDPOINTS } from '../../config/api';

const CommentComponent = ({ roomId }) => {
  const { isSignedIn, user } = useAuth();
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showLoginPopup, setShowLoginPopup] = useState(false);
  const [editingComment, setEditingComment] = useState(null);
  const [editText, setEditText] = useState('');

  // Fetch comments
  useEffect(() => {
    if (roomId) {
      fetchComments();
    }
  }, [roomId]);

  const fetchComments = async () => {
    try {
              const response = await apiClient.get(`${API_ENDPOINTS.GET_ROOM_COMMENTS}/${roomId}`);
      setComments(response.data);
    } catch (error) {
      console.error('Error fetching comments:', error);
    }
  };

  const handleAddComment = async () => {
    if (!isSignedIn) {
      setShowLoginPopup(true);
      return;
    }

    if (!newComment.trim()) {
      alert('Please enter a comment');
      return;
    }

    setIsSubmitting(true);
    try {
      const commentData = {
        roomId,
        content: newComment.trim()
      };

              await apiClient.post(API_ENDPOINTS.ADD_COMMENT, commentData);
      setNewComment('');
      fetchComments(); // Refresh comments
    } catch (error) {
      console.error('Error adding comment:', error);
      alert('Failed to add comment. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleEditComment = async (commentId) => {
    if (!editText.trim()) {
      alert('Please enter a comment');
      return;
    }

    try {
              await apiClient.put(`${API_ENDPOINTS.UPDATE_COMMENT}/${commentId}`, {
        content: editText.trim()
      });
      setEditingComment(null);
      setEditText('');
      fetchComments(); // Refresh comments
    } catch (error) {
      console.error('Error updating comment:', error);
      alert('Failed to update comment. Please try again.');
    }
  };

  const handleDeleteComment = async (commentId) => {
    if (window.confirm('Are you sure you want to delete this comment?')) {
      try {
        await apiClient.delete(`${API_ENDPOINTS.DELETE_COMMENT}/${commentId}`);
        fetchComments(); // Refresh comments
      } catch (error) {
        console.error('Error deleting comment:', error);
        alert('Failed to delete comment. Please try again.');
      }
    }
  };

  const startEditing = (comment) => {
    setEditingComment(comment._id);
    setEditText(comment.content);
  };

  const cancelEditing = () => {
    setEditingComment(null);
    setEditText('');
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <>
      <div className="bg-white/5 backdrop-blur-lg border border-white/10 rounded-xl p-6">
        <div className="flex items-center gap-2 mb-6">
          <FiMessageCircle className="text-blue-400" />
          <h3 className="text-lg font-semibold text-white">Comments</h3>
          <span className="text-gray-400 text-sm">({comments.length})</span>
        </div>

        {/* Add Comment Form */}
        <div className="mb-6">
          <div className="flex gap-3">
            <textarea
              value={newComment}
              onChange={(e) => setNewComment(e.target.value)}
              placeholder="Write a comment..."
              className="flex-1 bg-white/10 border border-white/20 rounded-lg p-3 text-white placeholder-gray-400 focus:outline-none focus:border-blue-500 resize-none"
              rows="2"
              maxLength="300"
            />
            <button
              onClick={handleAddComment}
              disabled={isSubmitting || !newComment.trim()}
              className="bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-500 hover:to-blue-400 text-white px-4 py-3 rounded-lg transition-all duration-200 shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
            >
              <FiSend size={16} />
              {isSubmitting ? 'Posting...' : 'Post'}
            </button>
          </div>
          <p className="text-xs text-gray-400 mt-1">
            {newComment.length}/300 characters
          </p>
        </div>

        {/* Comments List */}
        <div className="space-y-4">
          {comments.length === 0 ? (
            <p className="text-gray-400 text-center py-8">No comments yet. Be the first to comment!</p>
          ) : (
            comments.map((comment) => (
              <div key={comment._id} className="bg-white/5 rounded-lg p-4">
                {editingComment === comment._id ? (
                  // Edit Mode
                  <div className="space-y-3">
                    <textarea
                      value={editText}
                      onChange={(e) => setEditText(e.target.value)}
                      className="w-full bg-white/10 border border-white/20 rounded-lg p-3 text-white placeholder-gray-400 focus:outline-none focus:border-blue-500 resize-none"
                      rows="2"
                      maxLength="300"
                    />
                    <div className="flex gap-2">
                      <button
                        onClick={() => handleEditComment(comment._id)}
                        className="bg-green-600 hover:bg-green-500 text-white px-3 py-1 rounded text-sm transition-colors duration-200"
                      >
                        Save
                      </button>
                      <button
                        onClick={cancelEditing}
                        className="bg-gray-600 hover:bg-gray-500 text-white px-3 py-1 rounded text-sm transition-colors duration-200"
                      >
                        Cancel
                      </button>
                    </div>
                  </div>
                ) : (
                  // View Mode
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 bg-gradient-to-r from-blue-600 to-blue-500 rounded-full flex items-center justify-center">
                          <span className="text-white text-sm font-semibold">
                            {comment.userName.charAt(0).toUpperCase()}
                          </span>
                        </div>
                        <div>
                          <p className="text-white font-medium">{comment.userName}</p>
                          <p className="text-gray-400 text-xs">{formatDate(comment.createdAt)}</p>
                        </div>
                      </div>
                      
                      {/* Edit/Delete buttons for comment owner */}
                      {isSignedIn && user?.id === comment.userId && (
                        <div className="flex gap-2">
                          <button
                            onClick={() => startEditing(comment)}
                            className="text-blue-400 hover:text-blue-300 transition-colors duration-200"
                          >
                            <FiEdit3 size={14} />
                          </button>
                          <button
                            onClick={() => handleDeleteComment(comment._id)}
                            className="text-red-400 hover:text-red-300 transition-colors duration-200"
                          >
                            <FiTrash2 size={14} />
                          </button>
                        </div>
                      )}
                    </div>
                    <p className="text-gray-200 leading-relaxed">{comment.content}</p>
                  </div>
                )}
              </div>
            ))
          )}
        </div>
      </div>

      {/* Login Popup */}
      <LoginPopup
        isOpen={showLoginPopup}
        onClose={() => setShowLoginPopup(false)}
        action="comment"
      />
    </>
  );
};

export default CommentComponent;
