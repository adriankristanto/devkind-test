import React from "react";
import { useAuth } from "../contexts/AuthContext";
import { Formik, Field, Form } from "formik";
import { useNavigate } from "react-router-dom";

export default function Register() {
  const { register, setCurrentUser, setToken } = useAuth();

  const navigate = useNavigate();

  const handleSubmit = async (values) => {
    const { name, birthdate, email, password } = values;
    try {
      const user = await register(email, password, name, birthdate);
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
          name: "",
          birthdate: "",
          email: "",
          password: "",
        }}
        onSubmit={handleSubmit}
      >
        <Form>
          <label htmlFor="name">Name</label>
          <Field id="name" name="name" placeholder="Enter your name here..." />

          <label htmlFor="birthdate">Birthdate</label>
          <Field
            id="birthdate"
            name="birthdate"
            placeholder="Enter your birthdate here (YYYY/MM/DD)..."
          />

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
