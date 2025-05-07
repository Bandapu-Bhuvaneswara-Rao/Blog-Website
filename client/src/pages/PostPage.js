import { useContext, useEffect, useState } from "react";
import { useParams, Link, Navigate } from "react-router-dom";
import { format } from 'date-fns'; 
import { UserContext } from "../userContext";
import { MdModeEdit } from "react-icons/md";
import { RiAdminFill } from "react-icons/ri";

export default function PostPage() {
    const [postInfo, setPostInfo] = useState(null);
    const [isDeleted, setIsDeleted] = useState(false);
    const { userInfo } = useContext(UserContext);
    const { id } = useParams();

    useEffect(() => {
        fetch(`https://saba-blog.onrender.com/post/${id}`) // Fetch post data
            .then(response => response.json())
            .then(postInfo => {
                setPostInfo(postInfo);
            });
    }, [id]);

    if (!postInfo) {
        return ''; // Consider returning a loading state or message
    }

    async function deletePost() {
        const confirmed = window.confirm("Are you sure you want to delete this post?");
        if (!confirmed) return;

        const response = await fetch(`https://saba-blog.onrender.com/post/${id}`, {
            method: 'DELETE',
            credentials: 'include',
        });

        if (response.ok) {
            setIsDeleted(true);
        } else {
            alert('Failed to delete post');
        }
    }

    if (isDeleted) {
        return <Navigate to="/" />;
    }

    return (
        <div className="post-page">
            <h1>{postInfo.title}</h1>
            <time>{format(new Date(postInfo.createdAt), 'MMM d, yyyy HH:mm')}</time>
            <div className="author">
                <RiAdminFill className="author-logo" /> by {postInfo.author.username}
            </div>
            {userInfo && userInfo.id === postInfo.author._id && (
                <div className="edit-row">
                    <Link className="edit-btn" to={`/edit/${postInfo._id}`}>
                        <MdModeEdit className="pen" /> Edit this Post
                    </Link>
                    
                </div>
            )}
            <div className="image-view">
                <img src={`https://saba-blog.onrender.com/${postInfo.cover}`} alt={postInfo.title} />
            </div>
            <div dangerouslySetInnerHTML={{ __html: postInfo.content }} />
        </div>
    );
}
