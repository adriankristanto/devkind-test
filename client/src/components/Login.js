import React from "react";
import { useAuth } from "../contexts/AuthContext";
import { Formik, Field, Form } from "formik";
import { useNavigate, Link } from "react-router-dom";

export default function Login({ setMessage }) {
  const { login, setCurrentUser, setToken } = useAuth();

  const navigate = useNavigate();

  const handleSubmit = async (values) => {
    const { email, password } = values;
    try {
      const loginResponse = await login(email, password);
      const user = loginResponse.data;
      window.localStorage.setItem("loggedInUser", JSON.stringify(user));
      setCurrentUser(user);
      setToken(user.token);
      setMessage({
        text: "User Login Successful!",
        error: false,
      });
      navigate("/");
    } catch (exception) {
      if (exception.response.data.errors) {
        setMessage({
          text: `User Login Error: ${exception.response.data.errors.map(
            (error) => `${error.msg} for ${error.param}`
          )}`,
          error: true,
        });
      } else if (exception.response.data.error) {
        setMessage({
          text: `Invalid username or password`,
          error: true,
        });
      } else {
        setMessage({
          text: "Something went wrong",
          error: true,
        });
      }
    }
  };

  return (
    <div className="container max-w-sm flex-1 flex flex-col items-center justify-center">
      <div className="bg-white px-6 py-8 rounded shadow-md text-black w-full">
        <h1 className="mb-8 text-3xl text-center">Login</h1>
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
              className="w-full my-3 border border-gray-300 rounded p-3"
            />

            <label htmlFor="password" className="w-full">
              Password
            </label>
            <Field
              id="password"
              name="password"
              placeholder="Enter your password here..."
              type="password"
              className="w-full my-3 border border-gray-300 rounded p-3"
            />

            <button
              type="submit"
              className="w-full text-center py-3 mt-3 rounded bg-sky-400 text-gray-50 shadow-md"
            >
              Submit
            </button>
          </Form>
        </Formik>
      </div>
      <div className="text-center mt-6">
        Don't have an account?{" "}
        <Link to="/register" className="text-blue-500 border-blue-500 border-b">
          Register
        </Link>{" "}
      </div>
    </div>
  );
}
