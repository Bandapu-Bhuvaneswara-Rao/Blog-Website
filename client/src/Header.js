import { useEffect, useContext } from "react";
import { Link, useNavigate } from "react-router-dom"; 
import { UserContext } from "./userContext";
import { ImBlog } from "react-icons/im";

export default function Header() {
  const { setUserInfo, userInfo } = useContext(UserContext); 
  const navigate = useNavigate(); 

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const response = await fetch('https://saba-blog.onrender.com/profile', {
          credentials: 'include', // Include cookies
        });

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`); // Throw error for non-200 responses
        }

        const data = await response.json();
        setUserInfo(data); 
      } catch (error) {
        console.error("Error fetching profile:", error); // Log error
        setUserInfo(null); // Clear user info if there's an error
      }
    };

    fetchProfile();
  }, [setUserInfo]);

  const logout = async () => {
    try {
      await fetch('https://saba-blog.onrender.com/logout', {
        credentials: 'include', // Include cookies
        method: 'POST', 
      });
      setUserInfo(null); 
      navigate('/login'); 
    } catch (error) {
      console.error("Error logging out:", error); // Log error
    }
  };

  const username = userInfo?.username;

  return (
    <header>
      <Link to="/" className="logo">
        <ImBlog className="blog-logo " />
        <img
          src="https://see.fontimg.com/api/rf5/BLXDd/YzZjYWJmMmE0ZGZkNGY3NmE5M2VlMGNhNmFkZWIzOTgub3Rm/U0FCQQ/nocture-free-regular.png?r=fs&h=44&w=1250&fg=000000&bg=FFFFFF&tb=1&s=35"
          alt="Horror fonts"
          className="font-image"
        />
      </Link>

      <nav>
        {username ? (
          <>
            <Link to="/create">Create new post</Link> 
            <a onClick={logout} style={{ cursor: 'pointer' }}><strong>Logout</strong></a> 
          </>
        ) : (
          <>
            <Link to="/login"><strong>Login</strong></Link> 
            <Link to="/register"><strong>Register</strong></Link> 
          </>
        )}
      </nav>
    </header>
  );
}
