import { format } from 'date-fns';
import { Link } from "react-router-dom";
import { RiAdminFill } from "react-icons/ri";
import { MdTimer } from "react-icons/md";
import { AiFillHeart, AiOutlineHeart } from "react-icons/ai";
import { useState } from 'react';

export default function Post({ _id, title, summary, cover, createdAt, author, initialLikes, userHasLiked }) {
  const [likes, setLikes] = useState(initialLikes);
  const [liked, setLiked] = useState(userHasLiked);
  const [loading, setLoading] = useState(false);

  const handleLikeClick = async () => {
    setLoading(true); 
    try {
      const response = await fetch(`https://saba-blog.onrender.com/post/${_id}/like`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include' // Ensure user authentication token is sent
      });
      const data = await response.json();
      
      if (response.ok) {
        setLiked(data.liked); // Toggle liked state
        setLikes(data.likesCount); // Update likes count
      } else {
        console.error("Error liking post:", data.error);
      }
    } catch (error) {
      console.error("Error handling like:", error);
    } finally {
      setLoading(false); // Reset loading state
    }
  };

  return (
    <div className="post">
      <div className="image">
        <Link to={`/post/${_id}`}>
          <img src={`https://saba-blog.onrender.com/${cover}`} alt={title} />
        </Link>
      </div>
      <div className="texts">
        <Link to={`/post/${_id}`}>
          <h2>{title}</h2>
        </Link>
        <div className='content-post'>
          <div className="info">
            <a className="author">
              <RiAdminFill className="author-logo"/>{author?.username || 'Unknown Author'}
            </a>
            <time>
              <MdTimer className='time-logo' /> {format(new Date(createdAt), 'MMM d, yyyy HH:mm')}
            </time>
          </div>
          <p className="summary">{summary}</p>
        </div>

        {/* Like Button with Heart Icon */}
        <div className="like-section">
          <button 
            className="like-button" 
            onClick={handleLikeClick} 
            disabled={loading} // Disable button during loading
            aria-label={liked ? "Unlike this post" : "Like this post"} // Accessibility
          >
            {liked ? <AiFillHeart className="heart-icon filled" /> : <AiOutlineHeart className="heart-icon outline" />}
          </button>
          <span className="likes-count">{likes} Likes</span> {/* Display likes count */}
        </div>
      </div>
    </div>
  );
}
