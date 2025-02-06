import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { createTask } from '@/services/slices/taskSlice'; // Import the createTask action
import * as Yup from 'yup';
import { useFormik } from 'formik';

const CreateTaskModal = ({ isOpen, onClose }) => {
    const dispatch = useDispatch();

    const validationSchema = Yup.object({
        task_id: Yup.string().required('Task ID is required').transform(value => value.toUpperCase()),
        task_name: Yup.string().required('Task Name is required'),
        ask_description: Yup.string().required('Description is required'),
        priority: Yup.string().required('Priority is required'),
        visibility: Yup.string().required('Visibility is required'),
    });

    const formik = useFormik({
        initialValues: {
            task_id: '',
            task_name: '',
            ask_description: '',
            priority: 'Normal',
            visibility: 'Private',
        },
        validationSchema,
        onSubmit: async (values) => {
            const payload = {
                task_id: values.task_id,
                task_name: values.task_name,
                ask_description: values.ask_description,
                priority: values.priority,
                visibility: values.visibility,
            };

            // Dispatch the createTask action
            await dispatch(createTask(payload));
            onClose(); // Close the modal after submission
        },
    });

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
            <div className="bg-white p-6 rounded shadow-lg" style={{ width: "400px" }}>
                <h2 className="text-lg font-bold mb-4">Create Task</h2>
                <form onSubmit={formik.handleSubmit}>
                    <div className="mb-4">
                        <label className="block mb-1">Task ID</label>
                        <input
                            type="text"
                            name="task_id"
                            onChange={formik.handleChange}
                            value={formik.values.task_id}
                            className="border rounded w-full p-2"
                        />
                        {formik.errors.task_id && <div className="text-red-500">{formik.errors.task_id}</div>}
                    </div>
                    <div className="mb-4">
                        <label className="block mb-1">Task Name</label>
                        <input
                            type="text"
                            name="task_name"
                            onChange={formik.handleChange}
                            value={formik.values.task_name}
                            className="border rounded w-full p-2"
                        />
                        {formik.errors.task_name && <div className="text-red-500">{formik.errors.task_name}</div>}
                    </div>
                    <div className="mb-4">
                        <label className="block mb-1">Description</label>
                        <textarea
                            name="ask_description"
                            onChange={formik.handleChange}
                            value={formik.values.ask_description}
                            className="border rounded w-full p-2"
                        />
                        {formik.errors.ask_description && <div className="text-red-500">{formik.errors.ask_description}</div>}
                    </div>
                    <div className="mb-4">
                        <label className="block mb-1">Priority</label>
                        <select
                            name="priority"
                            onChange={formik.handleChange}
                            value={formik.values.priority}
                            className="border rounded w-full p-2"
                        >
                            <option value="High">High</option>
                            <option value="Medium">Medium</option>
                            <option value="Normal">Normal</option>
                        </select>
                        {formik.errors.priority && <div className="text-red-500">{formik.errors.priority}</div>}
                    </div>
                    <div className="mb-4">
                        <label className="block mb-1">Visibility</label>
                        <select
                            name="visibility"
                            onChange={formik.handleChange}
                            value={formik.values.visibility}
                            className="border rounded w-full p-2"
                        >
                            <option value="Private">Private</option>
                            <option value="Public">Public</option>
                        </select>
                        {formik.errors.visibility && <div className="text-red-500">{formik.errors.visibility}</div>}
                    </div>
                    <button type="submit" className="bg-indigo-600 text-white rounded py-2 px-4">Create Task</button>
                    <button type="button" onClick={onClose} className="ml-2 border rounded py-2 px-4">Cancel</button>
                </form>
            </div>
        </div>
    );
};

export default CreateTaskModal;