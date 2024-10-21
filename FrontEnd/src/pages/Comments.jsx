import React, { useState, useEffect } from 'react';
import { FaUserCircle } from 'react-icons/fa';
import { useUser } from "@clerk/clerk-react";
import axios from 'axios';

const Comments = () => {
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState('');
  const [message, setMessage] = useState('');
  const [isAddingComment, setIsAddingComment] = useState(false);

  const { user, isLoaded } = useUser();

  useEffect(() => {
    const fetchComments = async () => {
      try {
        const response = await axios.get('https://offcampusrooms.onrender.com/api/comments');
        setComments(Array.isArray(response.data) ? response.data : []);
      } catch {
        setComments([]);
      }
    };
    fetchComments();
  }, []);

  const handleCommentSubmit = async () => {
    if (newComment.length > 300) {
      alert('Comment is too long! Maximum 300 characters.');
      return;
    }

    const newCommentData = {
      userName: user?.fullName || "Anonymous",
      content: newComment,
      userId: user?.id,
      imageUrl: user?.imageUrl,
    };

    try {
      setIsAddingComment(true);
      setMessage('Adding your comment...');

      const response = await axios.post('https://offcampusrooms.onrender.com/api/comments', newCommentData);
      setMessage('Comment Added');
      setComments([...comments, response.data]);
      setNewComment('');
    } catch {
      setMessage('Error submitting comment');
    } finally {
      setIsAddingComment(false);
    }
  };

  useEffect(() => {
    const timeout = setTimeout(() => setMessage(''), 3000);
    return () => clearTimeout(timeout);
  }, [message]);

  return (
    <div className="w-full max-w-3xl relative pt-16 mx-auto p-4">
      <h2 className="text-2xl text-center mb-8 text-primary font-bold">Tell Us What You Think of Our Website</h2>

      {message && (
        <div className='absolute z-[11] top-[70px] left-1/2 bg-primary px-4 py-2 text-white rounded-md translate-x-[-50%]'>
          {message}
        </div>
      )}
      
      <div className="mb-8 relative flex flex-col items-end">
        <div className="flex items-center mb-2 justify-start w-full gap-2">
          <div className="mb-6">
            {isLoaded && user ? (
              <div className="rounded-full border-2 border-dark h-8 w-8">
                <img className="rounded-full" src={user.imageUrl} alt={user.fullName} />
              </div>
            ) : (
              <FaUserCircle size={34} />
            )}
          </div>

          <input
            type="text"
            value={newComment}
            onChange={(e) => setNewComment(e.target.value)}
            placeholder="Write your comment..."
            className="w-full p-2 outline-none border-b-dark border-b-2"
            maxLength={300}
          />
        </div>

        {isAddingComment ? (
          <div className='border-gray-400 absolute top-2 right-4 h-6 w-6 border-t-primary border-2 rounded-full animate-spin'></div>
        ) : (
          <button
            onClick={handleCommentSubmit}
            className="bg-primary absolute hover:bg-dark text-[13px] transition-all duration-300 text-white px-[12px] py-[6px] rounded-full mt-2"
          >
            Submit
          </button>
        )}
      </div>

      {Array.isArray(comments) && comments.length > 0 ? (
        comments.map((comment) => (
          <div key={comment.commentId} className="bg-gray-100 flex items-start gap-2 text-[13px] p-4 mb-4 rounded">
            <div className="flex rounded-full items-center gap-2 border-dark">
              {comment.imageUrl ? (
                <div className="rounded-full border-2 border-dark h-7 w-7">
                  <img className="rounded-full" src={comment.imageUrl} alt={comment.userName} />
                </div>
              ) : (
                <FaUserCircle size={24} className="w-6 h-6 rounded-full" />
              )}
            </div>
            <div>
              <strong className="text-sm md:text-md">{comment.userName}</strong>
              <p className="text-xs md:text-sm">{comment.content}</p>
            </div>
          </div>
        ))
      ) : (
        <p>No comments available.</p>
      )}
    </div>
  );
};

export default Comments;
