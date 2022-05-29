import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Navigate } from "react-router-dom";
import { Formik, Field, Form, ErrorMessage } from "formik";
import * as Yup from "yup";

import { register } from "../../slices/auth";
import { clearMessage } from "../../slices/message";
import axios from "axios";
import baseUrl from "../../util/baseUrl";

const Register = () => {
  const [loading, setLoading] = useState(false);

  const { isAuthenticated } = useSelector((state) => state.auth);
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(clearMessage());
  }, [dispatch]);

  const initialValues = {
    username: "",
    email: "",
    password: "",
    confirmPassword: ""
  };

  const [image, setImage] = useState();
  const [imageError, setImageError] = useState(false);

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
      .oneOf([Yup.ref('password'), null], "Confirm password must match with password")
  });

  const handleRegister = (formValue) => {
    const { username, email, password, confirmPassword } = formValue;

    setLoading(false);

    dispatch(register({ image, username, email, password, confirmPassword }))
      .unwrap()
      .catch(() => {
        setLoading(false);
      });
  };

  if (isAuthenticated) {
    return <Navigate to="/dashboard" />;
  }

  return (
    <div className="col-md-12 signup-form">
      <div className="card card-container">
        <Formik
          initialValues={initialValues}
          validationSchema={validationSchema}
          onSubmit={handleRegister}
        >
          <Form>
            {!loading && (
              <div>

                <div className="mb-2">
                  {imageError && (
                    <div className="mb-2">
                        <div className="alert alert-danger" role="alert">
                            Image file size is too large. Choose a file that is 3MB or lower.
                        </div>
                    </div>
                  )}
                </div>

                <div className="mb-2">
                  <label htmlFor="username">Image</label>
                  <input id="file" name="file" type="file" 
                    onChange={(event) => {
                        let file = event.currentTarget.files[0];
                        if(file.size <= (3 * (1024 * 1024))) {
                            setImageError(false);
                            let reader = new FileReader();
                            reader.onloadend = () => {
                                setImage(reader.result);
                            };
                            reader.readAsDataURL(file);
                        } else {
                            setImage(null);
                            setImageError(true);
                        }
                    }} className="form-control" />
                    <ErrorMessage
                        name="image"
                        component="div"
                        className="text-danger"
                  />
                </div>

                <div className="mb-2">
                  <label htmlFor="username">Username</label>
                  <Field name="username" type="text" className="form-control" />
                  <ErrorMessage
                    name="username"
                    component="div"
                    className="text-danger"
                  />
                </div>

                <div className="mb-2">
                  <label htmlFor="email">Email</label>
                  <Field name="email" type="email" className="form-control" />
                  <ErrorMessage
                    name="email"
                    component="div"
                    className="text-danger"
                  />
                </div>

                <div className="mb-2">
                  <label htmlFor="password">Password</label>
                  <Field
                    name="password"
                    type="password"
                    className="form-control"
                  />
                  <ErrorMessage
                    name="password"
                    component="div"
                    className="text-danger"
                  />
                </div>

                <div className="mb-2">
                  <label htmlFor="password">Confirm Password</label>
                  <Field
                    name="confirmPassword"
                    type="password"
                    className="form-control"
                  />
                  <ErrorMessage
                    name="confirmPassword"
                    component="div"
                    className="text-danger"
                  />
                </div>
              
                <div className="mb-2 row">
                  <div className="col-6">
                    <button type="submit" className="btn btn-primary btn-block" disabled={loading || imageError}>
                      {loading && (
                        <span className="spinner-border spinner-border-sm"></span>
                      )}
                      <span>Sign up</span>
                    </button>
                  </div>
                  <div className="col-6 text-end">
                    <p>
                      Already have an account?&nbsp;
                      <a href="/login" className="" disabled={loading}>
                        <span style={{whiteSpace: "nowrap"}}>Login</span>
                      </a>
                    </p>
                  </div>
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
