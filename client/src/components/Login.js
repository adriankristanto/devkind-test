import React from "react";
import { useAuth } from "../contexts/AuthContext";
import { Formik, Field, Form } from "formik";
import { useNavigate } from "react-router-dom";

export default function Login() {
  const { login, setCurrentUser, setToken } = useAuth();

  const navigate = useNavigate();

  const handleSubmit = async (values) => {
    const { email, password } = values;
    try {
      const user = await login(email, password);
      window.localStorage.setItem("loggedInUser", JSON.stringify(user));
      setCurrentUser(user);
      setToken(user.token);
      navigate("/");
    } catch (exception) {
      console.error(exception.response.data);
    }
  };

  return (
    <div>
      <h1>Register</h1>
      <Formik
        initialValues={{
          email: "",
          password: "",
        }}
        onSubmit={handleSubmit}
      >
        <Form>
          <label htmlFor="email">Email</label>
          <Field
            id="email"
            name="email"
            placeholder="Enter your email here..."
            type="email"
          />

          <label htmlFor="password">Password</label>
          <Field
            id="password"
            name="password"
            placeholder="Create a new password here..."
            type="password"
          />
          <button type="submit">Submit</button>
        </Form>
      </Formik>
    </div>
  );
}
