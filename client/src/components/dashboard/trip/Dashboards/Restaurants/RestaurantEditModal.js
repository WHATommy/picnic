import React, { useState, useEffect } from 'react';
import { Modal, Button } from 'react-bootstrap';
import { Formik, Field, Form, ErrorMessage } from "formik";
import { useDispatch, useSelector } from "react-redux";
import * as Yup from "yup";

// Slices
import { clearMessage } from "../../../../../slices/message";
import { loadTrip, loadPersonalCost } from "../../../../../slices/trip";
import { editContentInfo, loadAllContent } from "../../../../../slices/content";

export const RestaurantEditModal = (props) => {
     // Loading state
    const [loading, setLoading] = useState(false);
    const [imageError, setImageError] = useState(false);
    const [fieldValue, setFieldValue] = useState();

    const { message } = useSelector((state) => state.message);

    const dispatch = useDispatch();

    useEffect(() => {
        dispatch(clearMessage());
    }, [dispatch]);

    // Form validation
    const validationSchema = Yup.object().shape({
        name: Yup.string().required("Name is required"),
        location: Yup.string().required("Location is required"),
        website: Yup.string().url(),
        cost: Yup.number().moreThan(-1).integer().required("Cost is required, leave a 0 if no cost"),
        startDate: Yup.string().required("Start date is required"),
        endDate: Yup.string().required("End date is required"),
    });

    const startDate = new Date(props.restaurant.startDate);
    const startIsoDate = startDate.toISOString().substring(0, 10);
    const startTime = new Date(props.restaurant.startDate).toLocaleTimeString('en', { timeStyle: 'short', hour12: false, timeZone: 'UTC' });
    const endDate = new Date(props.restaurant.endDate);
    const endIsoDate = endDate.toISOString().substring(0, 10);
    const endTime = new Date(props.restaurant.endDate).toLocaleTimeString('en', { timeStyle: 'short', hour12: false, timeZone: 'UTC' });

    const initialValues = {
        _id: props.restaurant._id,
        name: props.restaurant.name,
        location: props.restaurant.location,
        cost: props.restaurant.cost,
        website: props.restaurant.website,
        startDate: startIsoDate,
        startTime: startTime,
        endDate: endIsoDate,
        endTime: endTime
    };

    const handleEditRestaurant = async (formValue) => {
        formValue.image = fieldValue;
        await dispatch(editContentInfo({ 
            tripId: props.tripId, 
            contentInfo: formValue, 
            contentType: "restaurant" 
        }));
        await dispatch(loadTrip({tripId: props.tripId}));
        await dispatch(loadAllContent({tripId: props.tripId, contentType: "restaurant"}));
        await dispatch(loadPersonalCost({tripId: props.tripId, userId: props.userId}));
        props.handleCloseEdit();
    };

    return (
        <>
            <Modal.Header closeButton>
                <Modal.Title>Edit {props.restaurant.name}</Modal.Title>
            </Modal.Header>
            <Formik
                initialValues={initialValues}
                validationSchema={validationSchema}
                onSubmit={handleEditRestaurant}
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
                        onChange={(restaurant) => {
                            let file = restaurant.currentTarget.files[0];
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
                    <div className="mb-2">
                        <label htmlFor="cost">Cost</label>
                        <Field name="cost" type="text" className="form-control" />
                        <div id="costHelp" class="form-text">Dollar values only. Valid: 123, Invalid: 123.45</div>
                        <ErrorMessage
                            name="cost"
                            component="div"
                            className="text-danger"
                        />
                    </div>
                    <div className="mb-2">
                        <label htmlFor="website">Website</label>
                        <Field name="website" type="text" className="form-control" />
                        <ErrorMessage
                            name="website"
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
                            Update
                        </Button>
                    </div>
                </Form>
            </Formik>
        </>
  )
}
