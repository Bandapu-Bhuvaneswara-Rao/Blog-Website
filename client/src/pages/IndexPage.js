import { useEffect, useState, useContext } from "react";
import Post from "../Post";
import { UserContext } from "../userContext";

export default function IndexPage() {
  const [posts, setPosts] = useState([]);
  const { userInfo } = useContext(UserContext); 

  useEffect(() => {
    fetch('https://saba-blog.onrender.com/post', {
      credentials: 'include', 
    })
      .then(response => response.json())
      .then(posts => {
        setPosts(posts);
      })
      .catch(error => {
        console.error("Error fetching posts:", error);
      });
  }, []);

  return (
    <>
      {posts.length > 0 && posts.map(post => (
        <Post
          key={post._id}
          {...post} 
          initialLikes={post.likes.length} 
          userHasLiked={post.likes.includes(userInfo?.id)}
        />
      ))}
    </>
  );
}
