import { createContext, useContext, useState, useEffect } from "react";
import axios from "axios";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(localStorage.getItem("ml_token"));
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const saved = localStorage.getItem("ml_user");
    if (saved && token) {
      setUser(JSON.parse(saved));
      axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;
    }
    setLoading(false);
  }, [token]);

  const login = (userData, tokenData) => {
    setUser(userData);
    setToken(tokenData);
    localStorage.setItem("ml_token", tokenData);
    localStorage.setItem("ml_user", JSON.stringify(userData));
    axios.defaults.headers.common["Authorization"] = `Bearer ${tokenData}`;
  };

  const logout = () => {
    setUser(null);
    setToken(null);
    localStorage.removeItem("ml_token");
    localStorage.removeItem("ml_user");
    delete axios.defaults.headers.common["Authorization"];
  };

  const updateUser = (updated) => {
    setUser(updated);
    localStorage.setItem("ml_user", JSON.stringify(updated));
  };

  return (
    <AuthContext.Provider
      value={{ user, token, loading, login, logout, updateUser }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
