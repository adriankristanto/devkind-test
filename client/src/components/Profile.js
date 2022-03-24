import React, { useState } from "react";
import { useAuth } from "../contexts/AuthContext";
import { Formik, Field, Form } from "formik";
import { useNavigate } from "react-router-dom";

export default function Profile() {
  const { currentUser, logout, updateUserProfile, setCurrentUser } = useAuth();
  const [isUpdating, setIsUpdating] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (values) => {
    const { name, birthdate, email, password } = values;
    try {
      const updateResponse = await updateUserProfile(
        email,
        password,
        name,
        birthdate
      );
      const user = updateResponse.data;
      setCurrentUser(user);
    } catch (exception) {
      console.error(exception.response.data);
      if (
        exception.response.data.error &&
        (exception.response.data.error === "token missing or invalid" ||
          exception.response.data.error === "invalid token")
      ) {
        logout();
        navigate("/login");
      }
    }
  };

  const handleClickUpdateProfile = () => setIsUpdating(true);
  const handleClickViewProfile = () => setIsUpdating(false);
  const handleClickLogOut = () => {
    logout();
    navigate("/login");
  };

  return (
    <div className="container max-w-sm flex-1 flex flex-col items-center justify-center">
      <div className="bg-white px-6 py-8 rounded shadow-md text-black w-full">
        <h1 className="mb-8 text-3xl text-center">Profile</h1>
        {isUpdating ? (
          <>
            <Formik
              initialValues={{
                name: `${currentUser.name}`,
                birthdate: `${currentUser.birthdate}`,
                email: `${currentUser.email}`,
                password: "",
              }}
              onSubmit={handleSubmit}
            >
              <Form>
                <label htmlFor="name">Name</label>
                <Field
                  id="name"
                  name="name"
                  placeholder={`${currentUser.name}`}
                  className="w-full my-3 border border-gray-300 rounded p-3"
                />

                <label htmlFor="birthdate">Birthdate</label>
                <Field
                  id="birthdate"
                  name="birthdate"
                  placeholder={`${currentUser.birthdate}`}
                  className="w-full my-3 border border-gray-300 rounded p-3"
                />

                <label htmlFor="email">Email</label>
                <Field
                  id="email"
                  name="email"
                  placeholder={`${currentUser.email}`}
                  type="email"
                  className="w-full my-3 border border-gray-300 rounded p-3"
                />

                <label htmlFor="password">Password</label>
                <Field
                  id="password"
                  name="password"
                  placeholder="Enter a new password here..."
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
            <button
              className="w-full text-center py-3 mt-3 rounded bg-purple-300 text-gray-50 shadow-md"
              onClick={handleClickViewProfile}
            >
              View Profile
            </button>
            <button
              className="w-full text-center py-3 mt-3 rounded bg-gray-400 text-gray-50 shadow-md"
              onClick={handleClickLogOut}
            >
              Log Out
            </button>
          </>
        ) : (
          <>
            <div className="w-full text-xl text-center">
              <strong>{currentUser.name}</strong>
            </div>
            <div className="w-full text-gray-400 text-center">
              {currentUser.email}
            </div>
            <div className="w-full my-4 text-center">
              {currentUser.birthdate}
            </div>
            <button
              className="w-full text-center py-3 mt-3 rounded bg-purple-300 text-gray-50 shadow-md"
              onClick={handleClickUpdateProfile}
            >
              Update Profile
            </button>
            <button
              className="w-full text-center py-3 mt-3 rounded bg-gray-400 text-gray-50 shadow-md"
              onClick={handleClickLogOut}
            >
              Log Out
            </button>
          </>
        )}
      </div>
    </div>
  );
}
