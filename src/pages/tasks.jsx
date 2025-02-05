import Layout from '@/components/Layout';
import TaskList from '@/components/TaskList';
import React from 'react';

const TasksPage = () => {
    return (
        <Layout>
            <h1 className='mb-6 text-2xl font-bold'>Task List</h1>
            <TaskList />
        </Layout>
    );
};

export default TasksPage; 