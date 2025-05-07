import { useEffect, useState } from "react";
import { Navigate, useParams } from "react-router-dom";
import Editor from "../Editor";

export default function EditPost() {
  const { id } = useParams();
  const [title, setTitle] = useState('');
  const [summary, setSummary] = useState('');
  const [content, setContent] = useState('');
  const [files, setFiles] = useState(null);
  const [redirect, setRedirect] = useState(false);
  const [isDeleted, setIsDeleted] = useState(false); // New state for tracking deletion

  useEffect(() => {
    const fetchPost = async () => {
      const response = await fetch('https://saba-blog.onrender.com/post/' + id);
      if (response.ok) {
        const postInfo = await response.json();
        setTitle(postInfo.title);
        setContent(postInfo.content);
        setSummary(postInfo.summary);
      } else {
        console.error('Error fetching post:', response.statusText);
      }
    };

    fetchPost();
  }, [id]);

  async function updatePost(ev) {
    ev.preventDefault();
    const data = new FormData();
    data.set('title', title);
    data.set('summary', summary);
    data.set('content', content);
    data.set('id', id);
    
    if (files?.[0]) {
      data.set('file', files?.[0]);
    }

    const response = await fetch('https://saba-blog.onrender.com/post', {
      method: 'PUT',
      body: data,
      credentials: 'include',
    });

    if (response.ok) {
      setRedirect(true);
    } else {
      console.error('Error updating post:', response.statusText);
    }
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
      console.error('Error deleting post:', response.statusText);
    }
  }

  if (redirect) {
    return <Navigate to={'/post/' + id} />;
  }

  if (isDeleted) {
    return <Navigate to="/" />;
  }

  return (
    <form onSubmit={updatePost}>
      <input
        type="text"
        placeholder="Title"
        value={title}
        onChange={e => setTitle(e.target.value)}
      />
      <input
        type="text"
        placeholder="Summary"
        value={summary}
        onChange={e => setSummary(e.target.value)}
      />
      <input type="file" onChange={e => setFiles(e.target.files)} />
      <Editor onChange={setContent} value={content} />
      
      <div style={{ marginTop: '5px' }}>
        {/* Update Post button */}
        <button type="submit" style={{ marginRight: '10px' }}>Update post</button>
        
        {/* Delete Post button */}
        <button 
          type="button" 
          onClick={deletePost} 
          style={{ backgroundColor: 'red', color: 'white' }}>
          Delete post
        </button>
      </div>
    </form>
  );

}
