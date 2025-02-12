import React from 'react';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import axios from 'axios';
import axiosInstance from '@/lib/axiosInstance';

const CreateUserModal = ({ isOpen, onClose, onUserCreated }) => {
    const validationSchema = Yup.object({
        username: Yup.string().required('Username is required'),
        name: Yup.string().required('Name is required'),
        email: Yup.string().email('Invalid email format').required('Email is required'),
        password: Yup.string().required('Password is required'),
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
                const response = await axiosInstance.post('/users/', values, {
                    headers: {
                        'accept': 'application/json',
                        'Content-Type': 'application/json',
                    }
                });
                console.log('User created:', response.data.user);
                onUserCreated(response.data.user);
                onClose();
            } catch (error) {
                console.error('Error creating user:', error);
            }
        },
    });

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
            <div className="bg-white p-6 rounded shadow-lg">
                <h2 className="text-lg font-bold mb-4">Create User</h2>
                <form onSubmit={formik.handleSubmit}>
                    <input
                        type="text"
                        name="username"
                        placeholder="Username"
                        onChange={formik.handleChange}
                        value={formik.values.username}
                        className="border rounded w-full p-2 mb-2"
                    />
                    <input
                        type="text"
                        name="name"
                        placeholder="Name"
                        onChange={formik.handleChange}
                        value={formik.values.name}
                        className="border rounded w-full p-2 mb-2"
                    />
                    <input
                        type="email"
                        name="email"
                        placeholder="Email"
                        onChange={formik.handleChange}
                        value={formik.values.email}
                        className="border rounded w-full p-2 mb-2"
                    />
                    <input
                        type="password"
                        name="password"
                        placeholder="Password"
                        onChange={formik.handleChange}
                        value={formik.values.password}
                        className="border rounded w-full p-2 mb-2"
                    />
                    <button type="submit" className="bg-indigo-600 text-white rounded py-2 px-4">Create User</button>
                    <button type="button" onClick={onClose} className="ml-2 border rounded py-2 px-4">Cancel</button>
                </form>
            </div>
        </div>
    );
};

export default CreateUserModal;