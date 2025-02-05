import React from 'react';
import { useDispatch } from 'react-redux';
import { loginUser } from '../services/userService';
import * as Yup from 'yup';
import { useFormik } from 'formik';

const LoginForm = () => {
    const dispatch = useDispatch();

    const validationSchema = Yup.object({
        email: Yup.string().email('Invalid email format').required('Email is required'),
        password: Yup.string().required('Password is required'),
    });

    const formik = useFormik({
        initialValues: {
            email: '',
            password: '',
        },
        validationSchema,
        onSubmit: async (values) => {
            try {
                const user = await loginUser(values);
                console.log('User logged in:', user);
                // Handle successful login (e.g., redirect or show a success message)
            } catch (error) {
                console.error('Error logging in:', error);
                // Handle error (e.g., show an error message)
            }
        },
    });

    return (
        <form onSubmit={formik.handleSubmit} className="bg-white p-6 rounded-lg shadow-md space-y-4">
            <h2 className="text-xl font-semibold mb-4">Login to Your Account</h2>
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
                Login
            </button>
        </form>
    );
};

export default LoginForm; 