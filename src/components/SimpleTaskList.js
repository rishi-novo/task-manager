import React, { useEffect, useState, useMemo } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchAllTasks } from '@/services/slices/taskSlice';
import { fetchTasksByUserId } from '@/services/slices/assigneeSlice';
import TaskCard from './TaskCard';

const SimpleTaskList = () => {
    const dispatch = useDispatch();
    const { allTasks, loading } = useSelector(state => state.tasks);
    const { userTasks } = useSelector(state => state.assignees);
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [userId, setUserId] = useState(null);

    // Check login status
    useEffect(() => {
        const userData = localStorage.getItem('user_data');
        if (userData) {
            const parsedData = JSON.parse(userData);
            setIsLoggedIn(true);
            setUserId(parsedData.uuid);
        }
    }, []);

    // Fetch all tasks
    useEffect(() => {
        dispatch(fetchAllTasks());
    }, [dispatch]);

    // Fetch user's tasks if logged in
    useEffect(() => {
        if (isLoggedIn && userId) {
            dispatch(fetchTasksByUserId(userId));
        }
    }, [isLoggedIn, userId, dispatch]);

    // Filter tasks based on visibility and user assignment
    const filteredTasks = useMemo(() => {
        if (!isLoggedIn) {
            return allTasks.filter(task => task.visibility === 'Public');
        }

        const userTaskIds = new Set(
            (userTasks[userId] || []).map(assignee => assignee.task_id)
        );

        return allTasks.filter(task =>
            task.visibility === 'Public' || userTaskIds.has(task.id)
        );
    }, [allTasks, isLoggedIn, userId, userTasks]);

    const priorityColumns = {
        High: filteredTasks.filter(task => task.priority === 'High'),
        Medium: filteredTasks.filter(task => task.priority === 'Medium'),
        Normal: filteredTasks.filter(task => task.priority === 'Normal')
    };

    const PRIORITY_COLUMNS = {
        'High': { id: 'High', title: 'High Priority', bgColor: 'bg-red-50/30' },
        'Medium': { id: 'Medium', title: 'Medium Priority', bgColor: 'bg-yellow-50/30' },
        'Normal': { id: 'Normal', title: 'Normal Priority', bgColor: 'bg-blue-50/30' }
    };

    if (loading) return <div>Loading tasks...</div>;

    return (
        <div className="grid grid-cols-3 gap-4 p-4">
            {Object.entries(PRIORITY_COLUMNS).map(([priority, column]) => (
                <div
                    key={priority}
                    className={`rounded-lg ${column.bgColor}`}
                    style={{ minHeight: "calc(100vh - 150px)" }}
                >
                    <div className="p-4 flex items-center justify-between border-b border-gray-200">
                        <h3 className="font-medium text-gray-700">
                            {column.title} ({priorityColumns[priority]?.length || 0})
                        </h3>
                    </div>
                    <div className="p-2">
                        {priorityColumns[priority]?.map((task) => (
                            <TaskCard
                                key={task.id}
                                task={task}
                            />
                        ))}
                    </div>
                </div>
            ))}
        </div>
    );
};

export default SimpleTaskList; 