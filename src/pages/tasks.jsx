import React, { useState } from 'react';
import Layout from '@/components/Layout';
import TaskList from '@/components/TaskList';
import CreateTaskModal from '@/components/CreateTaskModal';

const TasksPage = () => {
    const [isModalOpen, setIsModalOpen] = useState(false);

    const handleOpenModal = () => {
        const authToken = localStorage.getItem('auth_token');
        if (!authToken) {
            alert('Please log in to create a task.');
            return;
        }
        setIsModalOpen(true);
    };

    return (
        <Layout>
            <div className="flex items-center justify-between mb-4">
                <h1 className='text-2xl font-bold'>Task List</h1>
                <button
                    onClick={handleOpenModal}
                    className='button rounded bg-indigo-600 text-white font-medium py-2 px-4 text-sm'
                >
                    Add New Task
                </button>
            </div>
            <TaskList />
            <CreateTaskModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
        </Layout>
    );
};

export default TasksPage;