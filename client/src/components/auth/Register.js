import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Formik, Field, Form, ErrorMessage } from "formik";
import * as Yup from "yup";

import { register } from "../../slices/auth";
import { clearMessage } from "../../slices/message";
import axios from "axios";
import baseUrl from "../../util/baseUrl";

const Register = () => {
  const [successful, setSuccessful] = useState(false);

  const { message } = useSelector((state) => state.message);
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(clearMessage());
  }, [dispatch]);

  const initialValues = {
    image: null,
    username: "",
    email: "",
    password: "",
    confirmPassword: ""
  };

  const validationSchema = Yup.object().shape({
    username: Yup.string()
      .required("Username is required")
      .test(
        "len",
        "The username must be between 3 and 20 characters.",
        (val) =>
          val &&
          val.toString().length >= 3 &&
          val.toString().length <= 20
      )
      .test(
        "checkUsernameUnique", 
        "This username is already registered", 
        async (username) => { 
          const response = await axios.get(`${baseUrl}/signup/checkusername/${username}`);
          return response.data
        }
      ),
    email: Yup.string()
      .email("This is not a valid email.")
      .required("Email is required")
      .test(
        "checkEmailUnique", 
        "This email is already registered", 
        async (email) => { 
          const response = await axios.get(`${baseUrl}/signup/checkemail/${email}`);
          return response.data
        }
      ),
    password: Yup.string()
      .required("Password is required")
      .test(
        "len",
        "The password must be between 6 and 40 characters.",
        (val) =>
          val &&
          val.toString().length >= 6 &&
          val.toString().length <= 40
      ),
    confirmPassword: Yup.string()
      .required('Confirming your password is required')
      .oneOf([Yup.ref('password'), null], "Password and confirm password must match")
  });

  const handleRegister = (formValue) => {
    const { image, username, email, password, confirmPassword } = formValue;

    setSuccessful(false);

    dispatch(register({ image, username, email, password, confirmPassword }))
      .unwrap()
      .then(() => {
        setSuccessful(true);
      })
      .catch(() => {
        setSuccessful(false);
      });
  };

  return (
    <div className="col-md-12 signup-form">
      <div className="card card-container">
        <Formik
          initialValues={initialValues}
          validationSchema={validationSchema}
          onSubmit={handleRegister}
        >
          <Form>
            {!successful && (
              <div>
                <div className="form-group">
                  <label htmlFor="username">Username</label>
                  <Field name="username" type="text" className="form-control" />
                  <ErrorMessage
                    name="username"
                    component="div"
                    className="alert alert-danger"
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="email">Email</label>
                  <Field name="email" type="email" className="form-control" />
                  <ErrorMessage
                    name="email"
                    component="div"
                    className="alert alert-danger"
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="password">Password</label>
                  <Field
                    name="password"
                    type="password"
                    className="form-control"
                  />
                  <ErrorMessage
                    name="password"
                    component="div"
                    className="alert alert-danger"
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="password">Confirm Password</label>
                  <Field
                    name="confirmPassword"
                    type="password"
                    className="form-control"
                  />
                  <ErrorMessage
                    name="confirmPassword"
                    component="div"
                    className="alert alert-danger"
                  />
                </div>

                <div className="form-group">
                  <button type="submit" className="btn btn-primary btn-block">Sign Up</button>
                </div>
              </div>
            )}
          </Form>
        </Formik>
      </div>
    </div>
  );
};

export default Register;
