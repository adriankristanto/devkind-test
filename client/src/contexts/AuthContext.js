import React, { useContext, useState, useEffect } from "react";
import axios from "axios";

const baseUrl = "/api/";

const AuthContext = React.createContext();

export function useAuth() {
  return useContext(AuthContext);
}

export function AuthProvider({ children }) {
  const [currentUser, setCurrentUser] = useState();
  const [token, setToken] = useState();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loggedInUser = window.localStorage.getItem("loggedInUser");
    if (loggedInUser) {
      const user = JSON.parse(loggedInUser);
      setCurrentUser(user);
      setToken(`bearer ${user.token}`);
    }
    setLoading(false);
  }, []);

  function register(email, password, name, birthdate) {
    return axios.post(`${baseUrl}users`, { email, password, name, birthdate });
  }

  function login(email, password) {
    return axios.post(`${baseUrl}login`, { email, password });
  }

  function logout() {
    window.localStorage.removeItem("loggedInUser");
    setCurrentUser();
    setToken();
  }

  function updateUserProfile(email, password, name, birthdate) {
    return axios.post(
      `${baseUrl}users/profile`,
      {
        email,
        password,
        name,
        birthdate,
      },
      { headers: { Authorization: `Bearer ${token}` } }
    );
  }

  function getUserProfile() {
    return axios.get(`${baseUrl}users/profile`);
  }

  const value = {
    currentUser,
    token,
    register,
    login,
    logout,
    setCurrentUser,
    setToken,
    getUserProfile,
    updateUserProfile,
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
}
