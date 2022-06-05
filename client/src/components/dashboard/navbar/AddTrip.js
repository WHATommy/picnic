import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from "react-redux";
import { Formik, Field, Form, ErrorMessage } from "formik";
import { Button, Modal } from 'react-bootstrap';
import * as Yup from "yup";
import {OverlayTrigger, Tooltip} from 'react-bootstrap';

// Slices
import { clearMessage } from "../../../slices/message";

// Services
import tripService from "../../../services/tripService";
import { loadUser } from '../../../slices/user';

export const AddTrip = () => {
    const renderTooltip = () => (
        <Tooltip>Create a trip</Tooltip>
    );

    // Loading state
    const [loading, setLoading] = useState(false);
    const [imageError, setImageError] = useState(false);

    const { message } = useSelector((state) => state.message);

    const dispatch = useDispatch();

    useEffect(() => {
        dispatch(clearMessage());
    }, [dispatch]);

    // Form validation
    const validationSchema = Yup.object().shape({
        name: Yup.string().required("Name is required"),
        location: Yup.string().required("Location is required"),
        startDate: Yup.string().required("Start date is required"),
        endDate: Yup.string().required("End date is required"),
    });

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

    // Trip form state
    const newTrip = {
        image: "",
        name: "",
        location: "",
        startDate: "",
        startTime: "",
        endDate: "",
        endTime: ""
    };

    const [fieldValue, setFieldValue] = useState();

    // Create trip
    const handleAddTrip = async (formValue) => {
        setLoading(true);
        const { name, location, startDate, endDate, startTime, endTime } = formValue;
        // Convert date time to ISO format --> YYYY-MM-DDTHH:mm:ss.sssZ
        let startDateISO;
        let endDateISO;
        startDate ? startDateISO = (new Date(`${startDate} ${startTime}`)).toISOString() : startDateISO = null;
        endDate ? endDateISO = (new Date(`${endDate} ${endTime}`)).toISOString() : endDateISO = null;
        try {
            await tripService.addTrip(fieldValue, name, location, startDateISO, endDateISO);
            await dispatch(loadUser({}));
            setShow(false);
            setLoading(false);
        } catch (error) {
            setLoading(false);
            console.log(error)
        }
    }

    return (
        <div>
            <OverlayTrigger placement="bottom" overlay={(renderTooltip())}>
                <button onClick={handleShow} id="addTrip" type="button" className="btn p-0 m-1">
                    <a href="/"><i className="bi bi-plus-square success" style={{fontSize: "50px"}}></i></a>
                </button> 
            </OverlayTrigger>
            <Modal
                show={show}
                onHide={handleClose}
            >
                <Modal.Header closeButton>
                    <Modal.Title>Create Trip</Modal.Title>
                </Modal.Header>
                <Formik
                    initialValues={newTrip}
                    validationSchema={validationSchema}
                    onSubmit={handleAddTrip}
                >
                    <Form className="p-3"> 
                        <div className="mb-2">
                            {imageError && (
                                <div className="mb-2">
                                    <div className="alert alert-danger" role="alert">
                                        Image file size is too large. Choose a file that is 3MB or lower.
                                    </div>
                                </div>
                            )}
                            {message && (
                                <div className="mb-2">
                                    <div className="alert alert-danger" role="alert">
                                    {message}
                                    </div>
                                </div>
                            )}
                            <label htmlFor="image">Image</label>
                            <input id="file" name="file" type="file" 
                            onChange={(event) => {
                                let file = event.currentTarget.files[0];
                                if(file.size <= (3 * (1024 * 1024))) {
                                    setImageError(false);
                                    let reader = new FileReader();
                                    reader.onloadend = () => {
                                        setFieldValue(reader.result);
                                    };
                                    reader.readAsDataURL(file);
                                } else {
                                    setFieldValue(null);
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
                            <label htmlFor="name">Name</label>
                            <Field name="name" type="text" className="form-control" />
                            <ErrorMessage
                                name="name"
                                component="div"
                                className="text-danger"
                            />
                        </div>
                        <div className="mb-2">
                            <label htmlFor="location">Location</label>
                            <Field name="location" type="text" className="form-control" />
                            <ErrorMessage
                                name="location"
                                component="div"
                                className="text-danger"
                            />
                        </div>
                        <hr />
                        <div className="mb-2">
                            <label htmlFor="location">Start Date</label>
                            <Field name="startDate" type="date" className="form-control" />
                            <ErrorMessage
                                name="startDate"
                                component="div"
                                className="text-danger"
                            />
                        </div>
                        <div className="mb-2">
                            <label htmlFor="location">Start Time</label>
                            <Field name="startTime" type="time" className="form-control" />
                            <ErrorMessage
                                name="startTime"
                                component="div"
                                className="text-danger"
                            />
                        </div>
                        <hr />
                        <div className="mb-2">
                            <label htmlFor="endDate">End Date</label>
                            <Field name="endDate" type="date" className="form-control" />
                            <ErrorMessage
                                name="endDate"
                                component="div"
                                className="text-danger"
                            />
                        </div>
                        <div className="mb-2">
                            <label htmlFor="endTime">End Time</label>
                            <Field name="endTime" type="time" className="form-control" />
                            <ErrorMessage
                                name="endTime"
                                component="div"
                                className="text-danger"
                            />
                        </div>
                        
                        <div className="text-center">
                            <Button variant="primary" type="submit" disabled={imageError}>
                                {loading && (
                                    <span className="spinner-border spinner-border-sm"></span>
                                )}
                                Create
                            </Button>
                        </div>
                    </Form>
                 </Formik>
            </Modal>
        </div>
    )
}
