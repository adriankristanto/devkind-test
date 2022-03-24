import React, { useState, useEffect } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "../contexts/AuthContext";
import Login from "./Login";
import NotFound from "./NotFound";
import Profile from "./Profile";
import Register from "./Register";
import RequireAuth from "./RequireAuth";

function App() {
  const [message, setMessage] = useState({ text: "", error: false });

  useEffect(() => {
    if (message.text) {
      const cleanup = setTimeout(
        () => setMessage({ text: "", error: false }),
        5000
      );
      return cleanup;
    }
  }, [message.text]);

  return (
    <div className="bg-gray-200 min-h-screen flex items-center justify-center">
      {message.text && (
        <div className="fixed top-0 my-1 py-3">
          <div
            className={`py-5 px-5 ${
              message.error ? "bg-red-400" : "bg-green-600"
            } rounded shadow-md text-bold text-white text-lg`}
          >
            {message.text}
          </div>
        </div>
      )}
      <BrowserRouter>
        <AuthProvider>
          <Routes>
            <Route path="/login" element={<Login setMessage={setMessage} />} />
            <Route
              path="/register"
              element={<Register setMessage={setMessage} />}
            />
            <Route
              path="/"
              element={
                <RequireAuth>
                  <Profile setMessage={setMessage} />
                </RequireAuth>
              }
            />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </AuthProvider>
      </BrowserRouter>
    </div>
  );
}

export default App;
