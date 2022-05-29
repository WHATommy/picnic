import React, { useEffect, useState } from 'react';
import { useDispatch } from "react-redux";
import {OverlayTrigger, Tooltip, Modal} from 'react-bootstrap';
import * as Yup from "yup";
import { Formik, Field, Form, ErrorMessage } from "formik";

import { clearMessage, setMessage } from "../../../slices/message";
import axios from "axios";
import baseUrl from "../../../util/baseUrl";

import userService from '../../../services/userService';
import { loadUser } from '../../../slices/user';

export const Account = (props) => {
    // Loading state
    const [loading, setLoading] = useState(false);

    // Message state
    const [message, setMessage] = useState();

    // Redux dispatch
    const dispatch = useDispatch();

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

    const [currentValues, setCurrentValues] = useState({
        username: props.user.username,
        email: props.user.email
    })
    const { username, email } = currentValues;

    const onChange = (e) => {
        setCurrentValues({ ...currentValues, [e.target.name]: e.target.value });
    };

    // Form initial values
    const initialValues = {
        image: null,
        username: props.user.username,
        email: props.user.email,
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
                if(username !== props.user.username) {
                    const response = await axios.get(`${baseUrl}/signup/checkusername/${username}`);
                    return response.data;
                }
                return (username === props.user.username);
            }
          ),
        email: Yup.string()
          .email("This is not a valid email.")
          .required("Email is required")
          .test(
            "checkEmailUnique", 
            "This email is already registered", 
            async (email) => { 
                if(email !== props.user.email) {
                    const response = await axios.get(`${baseUrl}/signup/checkemail/${email}`);
                    return response.data;
                }
                return (email === props.user.email);
            }
          )
    });

    const handleUpdateAccount = async (formData) => {
        setLoading(true);
        const { username, email } = formData
        const response = await userService.updateAccount({ username, email });
        if (response) {
            dispatch(loadUser({}));
        }
        setLoading(false);
        setMessage("Account updated");
    }

    return (
        <div>
            <OverlayTrigger placement="left" overlay={(renderTooltip())}>
                <button id={props.user._id} type="button" className="btn p-0 m-1" onClick={handleShow}>
                    <img className="border border-2 border-primary rounded-circle" src={props.user.profilePic.image} height="65" width="65" alt="Account info" />
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
                        {message && (
                            <div className="mb-2">
                                <div className="alert alert-success" role="alert">
                                    {message}
                                </div>
                            </div>
                        )}
                        <div className="mb-2">
                            <div className="mb-2">
                            <label htmlFor="username">Username</label>
                            <Field 
                                name="username" 
                                type="text" 
                                className="form-control" 
                                value={username} 
                                onChange={onChange}
                            />
                            <ErrorMessage
                                name="username"
                                component="div"
                                className="text-danger"
                            />
                            </div>

                            <div className="mb-2">
                            <label htmlFor="email">Email</label>
                            <Field 
                                name="email"
                                type="email" 
                                className="form-control" 
                                value={email}
                                onChange={onChange}
                            />
                            <ErrorMessage
                                name="email"
                                component="div"
                                className="text-danger"
                            />
                            </div>
                        
                            <div className="mb-2 row">
                                <div className="col-6">
                                    <button type="submit" className="btn btn-primary btn-block" disabled={loading || ((username === props.user.username) && (email === props.user.email))}>
                                        {loading && (
                                            <span className="spinner-border spinner-border-sm"></span>
                                        )}
                                        <span>Update</span>
                                    </button>
                                </div>
                            </div>
                        </div>
                    </Form>
                </Formik>
            </Modal>
        </div>
    )
}
