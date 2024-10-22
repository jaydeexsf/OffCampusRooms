import React, { useState, useEffect } from 'react';
import { FaUserCircle } from 'react-icons/fa';
import { useUser, useSignIn } from "@clerk/clerk-react"; // import useSignIn for redirecting
import axios from 'axios';

const Comments = () => {
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState('');
  const [message, setMessage] = useState('');
  const [isAddingComment, setIsAddingComment] = useState(false);
  const [gettingComments, setGettingComments] = useState(true);

  const { user, isLoaded } = useUser();
  const { signIn } = useSignIn();

  useEffect(() => {
    const fetchComments = async () => {
      try {
        const response = await axios.get('https://offcampusrooms.onrender.com/api/comments');
        const sortedComments = response.data.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
        setComments(Array.isArray(response.data) ? sortedComments : []);
      } catch {
        setComments([]);
        setGettingComments(false);
      } finally {
        setGettingComments(false);
      }
    };
    fetchComments();
  }, []);

  const handleCommentSubmit = async () => {
    if (!user) {
      signIn.redirectToSignIn(); 
      return;
    }

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
      // Add new comment and sort again
      const updatedComments = [response.data, ...comments];
      const sortedComments = updatedComments.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
      setComments(sortedComments);
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

  const timeAgo = (createdAt) => {
    const now = new Date();
    const createdDate = new Date(createdAt);
    const diffMs = now - createdDate;

    const diffYears = Math.floor(diffMs / (1000 * 60 * 60 * 24 * 365));
    const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));
    const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
    const diffMinutes = Math.floor(diffMs / (1000 * 60));

    if (diffYears > 0) {
      return `${diffYears} year${diffYears > 1 ? 's' : ''} ago`;
    } else if (diffDays > 0) {
      return `${diffDays} day${diffDays > 1 ? 's' : ''} ago`;
    } else if (diffHours > 0) {
      return `${diffHours} hour${diffHours > 1 ? 's' : ''} ago`;
    } else if (diffMinutes > 0) {
      return `${diffMinutes} minute${diffMinutes > 1 ? 's' : ''} ago`;
    } else {
      return 'Just now';
    }
  };

  return (
    <div className="w-full max-w-3xl relative md:mt-4 pt-16 mx-auto p-4">
      <h2 className="text-xl text-center mb-12 text-primary md:text-2xl font-bold">Tell Us What You Think of Our Website</h2>

      {message && (
        <div className='absolute z-[11] top-[70px] left-1/2 bg-primary px-4 py-2 text-white rounded-md translate-x-[-50%]'>
          {message}
        </div>
      )}
      
      <div className="mb-8 relative flex flex-col items-end">
        <div className="flex items-center mb-2 justify-star w-full gap-2">
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
            className="w-full p-2 pr-[70px] outline-none text-sm border-b-primary border-b-2"
            maxLength={400}
          />
        </div>

        {isAddingComment ? (
          <div className='border-gray-400 absolute top-2 right-4 h-6 w-6 border-t-primary border-2 rounded-full animate-spin'></div>
        ) : (
          <button
            onClick={handleCommentSubmit}
            className="bg-primary absolute hover:bg-dark text-[12px] transition-all duration-300 text-white px-[12px] py-[6px] rounded-full mt-2"
          >
            Submit
          </button>
        )}
      </div>

      <h1 className='mb-4 text-lg font-bold'>All Comments</h1>
      {Array.isArray(comments) ? (
        comments.map((comment) => (
          <div key={comment.commentId} className="bg-gray-100 flex items-start gap-2 text-[13px] px-1 py-2 mb-[2px] rounded">
            <div className="flex rounded-full items-center gap-2 border-dark">
              {comment.imageUrl ? (
                <div className="rounded-full border-[1px] border-dark h-6 w-6">
                  <img className="rounded-full" src={comment.imageUrl} alt={comment.userName} />
                </div>
              ) : (
                <FaUserCircle size={24} className="w-6 h-6 rounded-full" />
              )}
            </div>
            <div>
              <div className="flex gap-4">
                <strong className="text-xs sm:text-sm font-semibold md:text-md">{comment.userName}</strong>
                <p className="text-gray-500 text-[10px]">{timeAgo(comment.createdAt)}</p>
                </div>
              <p className="text-[10px] sm:text-xs md:text-sm">{comment.content}</p>
            </div>
          </div>
        ))
      ) : <div className="border-gray-400 text-center border-t-black h-8 w-8 border-4 rounded-full animate-spin"></div>
    }
    {!gettingComments ? (
      <div></div>
    ) : (
      <div className="border-gray-500 text-center flex justify-cente self-center border-t-primary border-[3px] rounded-full border-t-[3px] animate-spin w-6 h-6"> </div>
    )}

       {!gettingComments && comments.length === 0 ? (
        <p>No comments available.</p>
      ) : ''}
    </div>
  );
};

export default Comments;
