import React from 'react';
import { useDispatch } from 'react-redux';
import { createUser } from '../services/userService';
import * as Yup from 'yup';
import { useFormik } from 'formik';

const RegisterForm = () => {
    const dispatch = useDispatch();

    const validationSchema = Yup.object({
        username: Yup.string().required('Username is required'),
        name: Yup.string().required('Name is required'),
        email: Yup.string().email('Invalid email format').required('Email is required'),
        password: Yup.string().min(6, 'Password must be at least 6 characters').required('Password is required'),
    });

    const formik = useFormik({
        initialValues: {
            username: '',
            name: '',
            email: '',
            password: '',
        },
        validationSchema,
        onSubmit: async (values) => {
            try {
                const user = await createUser(values);
                console.log('User created:', user);
                // Handle successful registration (e.g., redirect or show a success message)
            } catch (error) {
                console.error('Error creating user:', error);
                // Handle error (e.g., show an error message)
            }
        },
    });

    return (
        <form onSubmit={formik.handleSubmit} className="bg-white p-6 rounded-lg shadow-md space-y-4">
            <h2 className="text-xl font-semibold mb-4">Create an Account</h2>
            <input
                type="text"
                name="username"
                placeholder="Username"
                onChange={formik.handleChange}
                value={formik.values.username}
                className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            {formik.errors.username && <div className="text-red-500">{formik.errors.username}</div>}

            <input
                type="text"
                name="name"
                placeholder="Name"
                onChange={formik.handleChange}
                value={formik.values.name}
                className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            {formik.errors.name && <div className="text-red-500">{formik.errors.name}</div>}

            <input
                type="email"
                name="email"
                placeholder="Email"
                onChange={formik.handleChange}
                value={formik.values.email}
                className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            {formik.errors.email && <div className="text-red-500">{formik.errors.email}</div>}

            <input
                type="password"
                name="password"
                placeholder="Password"
                onChange={formik.handleChange}
                value={formik.values.password}
                className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            {formik.errors.password && <div className="text-red-500">{formik.errors.password}</div>}

            <button type="submit" className="w-full p-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition duration-200">
                Register
            </button>
        </form>
    );
};

export default RegisterForm; 