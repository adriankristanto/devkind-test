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
    <div>
      <h1>Profile</h1>
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
              />

              <label htmlFor="birthdate">Birthdate</label>
              <Field
                id="birthdate"
                name="birthdate"
                placeholder={`${currentUser.birthdate}`}
              />

              <label htmlFor="email">Email</label>
              <Field
                id="email"
                name="email"
                placeholder={`${currentUser.email}`}
                type="email"
              />

              <label htmlFor="password">Password</label>
              <Field
                id="password"
                name="password"
                placeholder="Enter a new password here..."
                type="password"
              />
              <button type="submit">Submit</button>
            </Form>
          </Formik>
          <button onClick={handleClickViewProfile}>View Profile</button>
          <button onClick={handleClickLogOut}>Log Out</button>
        </>
      ) : (
        <>
          <div>{currentUser.name}</div>
          <div>{currentUser.birthdate}</div>
          <div>{currentUser.email}</div>
          <button onClick={handleClickUpdateProfile}>Update Profile</button>
          <button onClick={handleClickLogOut}>Log Out</button>
        </>
      )}
    </div>
  );
}
