import React from 'react';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { createTeam } from '@/services/teamService'; // Import the createTeam function

const CreateTeamModal = ({ isOpen, onClose }) => {
    const validationSchema = Yup.object({
        team_name: Yup.string().required('Team Name is required'),
        limit: Yup.number().min(1, 'Limit must be at least 1').required('Limit is required'),
    });

    const formik = useFormik({
        initialValues: {
            team_name: '',
            limit: 0,
        },
        validationSchema,
        onSubmit: async (values) => {
            try {
                await createTeam(values); // Call the createTeam API
                console.log('Team created:', values);
                onClose(); // Close the modal after submission
            } catch (error) {
                console.error('Error creating team:', error);
            }
        },
    });

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
            <div className="bg-white p-6 rounded shadow-lg">
                <h2 className="text-lg font-bold mb-4">Create Team</h2>
                <form onSubmit={formik.handleSubmit}>
                    <input
                        type="text"
                        name="team_name"
                        placeholder="Team Name"
                        onChange={formik.handleChange}
                        value={formik.values.team_name}
                        className="border rounded w-full p-2 mb-2"
                    />
                    {formik.errors.team_name && <div className="text-red-500">{formik.errors.team_name}</div>}

                    <input
                        type="number"
                        name="limit"
                        placeholder="Limit"
                        onChange={formik.handleChange}
                        value={formik.values.limit}
                        className="border rounded w-full p-2 mb-2"
                    />
                    {formik.errors.limit && <div className="text-red-500">{formik.errors.limit}</div>}

                    <button type="submit" className="bg-indigo-600 text-white rounded py-2 px-4">Create Team</button>
                    <button type="button" onClick={onClose} className="ml-2 border rounded py-2 px-4">Cancel</button>
                </form>
            </div>
        </div>
    );
};

export default CreateTeamModal;