import React, { Fragment, useState } from "react";
import { connect } from "react-redux";
import { Link, Navigate } from "react-router-dom";
import { register } from "../../actions/auth";
import PropTypes from "prop-types";

const Register = ({ register, isAuthenticated }) => {
    const [registerData, setRegisterData] = useState({
        firstName: "",
        lastName: "",
        username: "",
        email: "",
        password: "",
        confirmPassword: "",
    });

    const { firstName, lastName, username, email, password, confirmPassword } = registerData;

    const onChange = (e) => setRegisterData({ ...registerData, [e.target.name]: e.target.value });

    const onSubmit = async (e) => {
        e.preventDefault();
        if (password !== confirmPassword) {
            console.log("Passwords do not match");
        } else {
            register({
                firstName,
                lastName,
                username,
                email,
                password,
                confirmPassword
            });
        }
    };

    if (isAuthenticated) {
        return <Navigate to="/dashboard" />;
    }

    return (
    <Fragment>
        <h1 className="">Sign Up</h1>
            <p className="">
            <i className="" /> Create Your Account
            </p>
            <form className="" onSubmit={onSubmit}>
            <div className="">
                <input
                type="text"
                placeholder="First name"
                name="firstName"
                value={firstName}
                onChange={onChange}
                />
            </div>
            <div className="">
                <input
                type="text"
                placeholder="Last name"
                name="lastName"
                value={lastName}
                onChange={onChange}
                />
            </div>
            <div className="">
                <input
                type="text"
                placeholder="username"
                name="username"
                value={username}
                onChange={onChange}
                />
            </div>
            <div className="">
                <input
                type="email"
                placeholder="Email Address"
                name="email"
                value={email}
                onChange={onChange}
                />
                <small className="form-text">
                This site uses Gravatar so if you want a profile image, use a
                Gravatar email
                </small>
            </div>
            <div className="">
                <input
                type="password"
                placeholder="Password"
                name="password"
                value={password}
                onChange={onChange}
                />
            </div>
            <div className="">
                <input
                type="password"
                placeholder="Confirm Password"
                name="confirmPassword"
                value={confirmPassword}
                onChange={onChange}
                />
            </div>
            <input type="submit" className="" value="Register" />
            </form>
            <p className="">
            Already have an account? <Link to="/login">Sign In</Link>
            </p>
        </Fragment>
    );
};

Register.propTypes = {
register: PropTypes.func.isRequired,
isAuthenticated: PropTypes.bool,
};

const mapStateToProps = (state) => ({
isAuthenticated: state.auth.isAuthenticated,
});

export default connect(mapStateToProps, { register })(Register);
