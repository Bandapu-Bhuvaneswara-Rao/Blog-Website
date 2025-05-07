import 'react-quill/dist/quill.snow.css';
import { useState } from "react";
import { Navigate } from "react-router-dom";
import Editor from "../Editor";


export default function CreateNewPost() {
  const [title, setTitle] = useState('');
  const [summary, setSummary] = useState('');
  const [content, setContent] = useState('');
  const [files, setFiles] = useState(null);
  const [redirect, setRedirect] = useState(false);

  async function createNewPost(e) {
    e.preventDefault();

    if (!content || content.trim() === '') {
      alert('Content is required');
      return; // Prevent submitting empty content
    }

    const data = new FormData();
    data.set('title', title);
    data.set('summary', summary);
    data.set('content', content);

    if (files) {
      data.append('file', files[0]);
    }

    try {
      const response = await fetch('https://saba-blog.onrender.com/post', {
        method: 'POST',
        body: data,
        credentials: 'include',
      });

      if (!response.ok) {
        const errorData = await response.json();
        console.error("Error:", errorData);
        alert(errorData.error); 
      } else {
        const postData = await response.json();
        console.log("Post Created:", postData);
        setRedirect(true);  // Set redirect to true on successful post creation
        alert("Post created successfully");
      }
    } catch (error) {
      console.error("Error creating post:", error);
      alert("Error creating post");
    }
  }

  if (redirect) {
    return <Navigate to="/" />;
  }

  return (
    <form onSubmit={createNewPost}>
      <input
        type="text" // Changed type to "text"
        placeholder={"Title"}
        value={title}
        onChange={e => setTitle(e.target.value)} />
      <input
        type="text" 
        placeholder={"Summary"}
        value={summary}
        onChange={e => setSummary(e.target.value)} />
      <input type="file" onChange={e => setFiles(e.target.files)} />
      <Editor value={content} onChange={setContent} /> 
      <button style={{ marginTop: '5px' }}>Create post</button>
    </form>
  );
}
