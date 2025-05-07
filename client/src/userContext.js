import { createContext, useState, useEffect } from "react";

export const UserContext = createContext({});

export function UserContextProvider({ children }) {
    const [userInfo, setUserInfo] = useState(null); // Change initial state to null

    useEffect(() => {
        const fetchUserInfo = async () => {
            try {
                const response = await fetch("https://saba-blog.onrender.com/user", {
                    credentials: 'include', 
                });

                if (!response.ok) {
                    throw new Error("Failed to fetch user info");
                }

                const data = await response.json();
                setUserInfo(data); // Set fetched user data
            } catch (error) {
                console.error(error);
                // Optionally handle errors, e.g., setUserInfo(null) or set a default user
            }
        };

        fetchUserInfo();
    }, []); 

    return (
        <UserContext.Provider value={{ userInfo, setUserInfo }}>
            {children}
        </UserContext.Provider>
    );
}
