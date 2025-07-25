import { createContext, useContext, useEffect, useState } from "react";

export const NewContext = createContext();

export const useAuth = () => useContext(NewContext);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true); 

  const login = (userData, token) => {
    localStorage.setItem("token", token);
    localStorage.setItem("user", JSON.stringify(userData));
    setUser(userData);
  };

  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    setUser(null);
  };

  useEffect(() => {
    const token = localStorage.getItem("token");
    const storedUser = localStorage.getItem("user");

    if (token && storedUser) {
      setUser(JSON.parse(storedUser));
    }

    setLoading(false); 
  }, []);

  return (
    <NewContext.Provider value={{ user, login, logout, loading }}>
      {children}
    </NewContext.Provider>
  );
};
