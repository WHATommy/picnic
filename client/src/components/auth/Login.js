import React, { useState, useEffect  } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Navigate } from "react-router-dom";
import { Formik, Field, Form, ErrorMessage } from "formik";
import * as Yup from "yup";

// Slices
import { login } from "../../slices/auth";
import { clearMessage } from "../../slices/message";

import "bootstrap/dist/css/bootstrap.min.css";

const Login = (props) => {
  const [loading, setLoading] = useState(false);

  const { isAuthenticated } = useSelector((state) => state.auth);
  const { message } = useSelector((state) => state.message);

  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(clearMessage());
  }, [dispatch]);

  const initialValues = {
    email: "",
    password: "",
  };

  const validationSchema = Yup.object().shape({
    email: Yup.string().required("Email is required").email("Email must be valid"),
    password: Yup.string().required("Password is required"),
  });

  const handleLogin = (formValue) => {
    const { email, password } = formValue;
    setLoading(true);

    dispatch(login({ email, password }))
      .unwrap()
      .catch(() => {
        setLoading(false);
      });
  };

  if (isAuthenticated) {
    return <Navigate to="/dashboard" />;
  }
  
  return (
    <div className="col-md-12 login-form">
      <div className="card card-container">
        {message && (
          <div className="mb-2">
            <div className="alert alert-danger" role="alert">
              {message}
            </div>
          </div>
        )}
        <Formik
          initialValues={initialValues}
          validationSchema={validationSchema}
          onSubmit={handleLogin}
        >
          <Form>
            <div className="mb-2">
              <label htmlFor="email">Email</label>
              <Field name="email" type="text" className="form-control" />
              <ErrorMessage
                name="email"
                component="div"
                className="text-danger"
              />
            </div>

            <div className="mb-2">
              <label htmlFor="password">Password</label>
              <Field name="password" type="password" className="form-control" />
              <ErrorMessage
                name="password"
                component="div"
                className="text-danger"
              />
            </div>

            <div className="mb-2 row">
              <div className="col-6">
                <button type="submit" className="btn btn-primary btn-block" disabled={loading}>
                  {loading && (
                    <span className="spinner-border spinner-border-sm"></span>
                  )}
                  <span>Login</span>
                </button>
              </div>
              <div className="col-6 text-end">
                <p>
                  Need a account?&nbsp;
                  <a href="/register" className="" disabled={loading}>
                    <span style={{whiteSpace: "nowrap"}}>Sign up</span>
                  </a>
                </p>
              </div>
            </div>
          </Form>
        </Formik>
      </div>
    </div>
  );
};

export default Login;