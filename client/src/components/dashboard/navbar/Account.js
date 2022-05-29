import React, { useState } from 'react'
import {OverlayTrigger, Tooltip, Modal} from 'react-bootstrap';
import * as Yup from "yup";
import { Formik, Field, Form, ErrorMessage } from "formik";

import { clearMessage } from "../../../slices/message";
import axios from "axios";
import baseUrl from "../../../util/baseUrl";

export const Account = (props) => {
    // Loading state
    const [loading, setLoading] = useState(false);

    // Tool tip
    const renderTooltip = () => (
        <Tooltip>Account</Tooltip>
    );

    // Modal show state
    const [show, setShow] = useState(false);

    // Modal toggle
    const handleClose = () => {
        setShow(false);
    };
    const handleShow = (e) => {
        e.preventDefault();
        setShow(true);
    };

    // Form initial values
    const initialValues = {
        image: null,
        username: props.username,
        email: props.email,
    };

    // Form validation
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
          )
    });

    const handleUpdateAccount = () => {

    }

    return (
        <div>
            <OverlayTrigger placement="left" overlay={(renderTooltip())}>
                <button id={props.user._id} type="button" className="btn p-0 m-1" onClick={handleShow}>
                    <img className="border border-primary rounded-circle" src={props.user.profilePic.image} height="55" width="55" alt="Account info" />
                </button>
            </OverlayTrigger>

            <Modal
                show={show}
                onHide={handleClose}
            >
                <Modal.Header closeButton>
                    <Modal.Title>Update Account</Modal.Title>
                </Modal.Header>
                <Formik
                    initialValues={initialValues}
                    validationSchema={validationSchema}
                    onSubmit={handleUpdateAccount}
                 >
                    <Form className="p-3">
                        {!loading && (
                        <div className="mb-2">
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
                        
                            <div className="mb-2 row">
                                <div className="col-6">
                                    <button type="submit" className="btn btn-primary btn-block" disabled={loading}>
                                        {loading && (
                                            <span className="spinner-border spinner-border-sm"></span>
                                        )}
                                        <span>Update</span>
                                    </button>
                                </div>
                            </div>
                        </div>
                        )}
                    </Form>
                    </Formik>

            </Modal>
        </div>
    )
}
