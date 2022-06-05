import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from "react-redux";
import { Formik, Field, Form, ErrorMessage } from "formik";
import { Modal, Button } from 'react-bootstrap';
import * as Yup from "yup";

// Slices
import { clearMessage } from "../../../slices/message";
import { addContentInfo } from "../../../slices/content";
import { loadTrip } from "../../../slices/trip";

export const AddContentIcon = (props) => {
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
      website: Yup.string().url(),
      cost: Yup.number().moreThan(-1).integer().required("Cost is required, leave a 0 if no cost"),
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
  const initialValues = {
      image: "",
      contentType: "event",
      name: "",
      location: "",
      cost: 0,
      website: "",
      startDate: "",
      startTime: "",
      endDate: "",
      endTime: ""
  };

  const [fieldValue, setFieldValue] = useState();

  // Create trip
  const handleAddContent = async (formValue) => {
      setLoading(true);
      let startDateISO;
      let endDateISO;
      formValue.startDate ? startDateISO = (new Date(`${formValue.startDate} ${formValue.startTime}`)).toISOString() : startDateISO = null;
      formValue.endDate ? endDateISO = (new Date(`${formValue.endDate} ${formValue.endTime}`)).toISOString() : endDateISO = null;
      const contentInfo = {
        image: fieldValue,
        name: formValue.name,
        location: formValue.location,
        cost: formValue.cost,
        website: formValue.website,
        startDate: startDateISO,
        endDate: endDateISO,
        poster: props.userId
      }
      await dispatch(addContentInfo({tripId: props.tripId, contentInfo: contentInfo, contentType: formValue.contentType }));
      await dispatch(loadTrip({ tripId: props.tripId }));
      setLoading(false);
      handleClose();
  }
  return (
    <div>
      <button type="button" className="btn p-0 m-1" onClick={handleShow}>
          <i className="bi bi-plus-square" style={{fontSize: "40px"}}></i>
      </button>
        <Modal
            show={show}
            onHide={handleClose}
        >
          <Modal.Header closeButton>
              <Modal.Title>Create Content</Modal.Title>
          </Modal.Header>
          <Formik
              initialValues={initialValues}
              validationSchema={validationSchema}
              onSubmit={handleAddContent}
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
                    <label htmlFor="contentType">Content Type</label>
                    <Field as="select" name="contentType" className="form-select">
                      <option value="event">Event</option>
                      <option value="housing">Housing</option>
                      <option value="restaurant">Restaurant</option>
                    </Field>
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
                          Create
                      </Button>
                  </div>
              </Form>
            </Formik>
          </Modal>
    </div>
  )
}
