import React, { useEffect, useState, useMemo } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchAllTasks, fetchTaskById, changeTaskPriority } from '@/services/slices/taskSlice';
import { fetchTasksByUserId } from '@/services/slices/assigneeSlice';
import { addAssignee, removeAssignee } from '@/services/assigneeService';
import TaskCard from './TaskCard';
import {
    DndContext,
    DragOverlay,
    closestCorners,
    KeyboardSensor,
    PointerSensor,
    useSensor,
    useSensors,
} from '@dnd-kit/core';
import {
    SortableContext,
    sortableKeyboardCoordinates,
    verticalListSortingStrategy,
} from '@dnd-kit/sortable';
import { SortableTask } from './SortableTask';

const TaskList = () => {
    const dispatch = useDispatch();
    const { allTasks, loading } = useSelector(state => state.tasks);
    const { userTasks } = useSelector(state => state.assignees);
    const [activeId, setActiveId] = useState(null);
    const [selectedTask, setSelectedTask] = useState(null);
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [userId, setUserId] = useState(null);

    const sensors = useSensors(
        useSensor(PointerSensor),
        useSensor(KeyboardSensor, {
            coordinateGetter: sortableKeyboardCoordinates,
        })
    );

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

    const handleDragStart = (event) => {
        setActiveId(event.active.id);
    };

    const handleDragEnd = async (event) => {
        const { active, over } = event;

        if (!over) return;

        const activeTask = allTasks.find(task => task.id === active.id);

        // Directly map to priority based on which column it's dropped into
        let newPriority;
        if (over.id === 'High') newPriority = 'High';
        else if (over.id === 'Medium') newPriority = 'Medium';
        else if (over.id === 'Normal') newPriority = 'Normal';

        if (activeTask && activeTask.priority !== newPriority) {
            try {
                await changeTaskPriority({
                    task_id: activeTask.id,
                    priority: newPriority
                });
                // Refresh tasks after successful priority change
                dispatch(fetchAllTasks());
            } catch (error) {
                console.error('Error updating task priority:', error);
            }
        }

        setActiveId(null);
    };

    // Handle task click and fetch assignees
    const handleTaskClick = async (task) => {
        setSelectedTask(task);
    };

    // Handle assignee removal
    const handleRemoveAssignee = async (assigneeId) => {
        try {
            await removeAssignee(assigneeId);
            if (selectedTask) {
                dispatch(fetchTasksByUserId(userId));
            }
        } catch (error) {
            console.error('Error removing assignee:', error);
        }
    };

    // Handle assignee addition
    const handleAddAssignee = async (newAssignee) => {
        try {
            await addAssignee({
                task_id: selectedTask.id,
                team_id: 2, // Your team ID
                ...newAssignee
            });
            dispatch(fetchTasksByUserId(userId));
        } catch (error) {
            console.error('Error adding assignee:', error);
        }
    };

    if (loading) return <div>Loading tasks...</div>;

    const priorityColumns = {
        High: filteredTasks?.filter(task => task.priority === 'High'),
        Medium: filteredTasks?.filter(task => task.priority === 'Medium'),
        Normal: filteredTasks?.filter(task => task.priority === 'Normal')
    };

    const columnStyles = {
        High: 'bg-red-50/30',
        Medium: 'bg-yellow-50/30',
        Normal: 'bg-blue-50/30'
    };

    const columnHeaders = {
        High: { title: 'High Priority', count: priorityColumns.High?.length || 0 },
        Medium: { title: 'Medium Priority', count: priorityColumns.Medium?.length || 0 },
        Normal: { title: 'Normal Priority', count: priorityColumns.Normal?.length || 0 }
    };

    return (
        <DndContext
            sensors={sensors}
            collisionDetection={closestCorners}
            onDragStart={handleDragStart}
            onDragEnd={handleDragEnd}
        >
            <div className="grid grid-cols-3 gap-4 p-4">
                {Object.entries(priorityColumns).map(([priority, priorityTasks]) => (
                    <div
                        key={priority}
                        id={priority}
                        className={`rounded-lg ${columnStyles[priority]}`}
                        style={{ minHeight: "calc(100vh - 150px)" }}
                    >
                        <div className="p-4 flex items-center justify-between border-b border-gray-200">
                            <div className="flex items-center gap-2">
                                <h3 className="font-medium text-gray-700">
                                    {columnHeaders[priority].title}
                                </h3>
                                <span className="text-sm text-gray-500">
                                    {columnHeaders[priority].count}
                                </span>
                            </div>
                        </div>
                        <div className="p-2">
                            <SortableContext
                                items={priorityTasks?.map(task => task.id) || []}
                                strategy={verticalListSortingStrategy}
                            >
                                {priorityTasks?.map((task) => (
                                    <SortableTask
                                        key={task.id}
                                        task={task}
                                        onClick={() => handleTaskClick(task)}
                                    />
                                ))}
                            </SortableContext>
                        </div>
                    </div>
                ))}
            </div>
            <DragOverlay>
                {activeId ? (
                    <TaskCard
                        task={allTasks.find(task => task.id === activeId)}
                        isDragging
                    />
                ) : null}
            </DragOverlay>

            {selectedTask && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
                    <div className="bg-white p-6 rounded-lg max-w-2xl w-full mx-4">
                        <h2 className="text-xl font-bold mb-4">{selectedTask.task_name}</h2>
                        <p className="text-gray-600 mb-4">{selectedTask.task_description}</p>

                        {/* Assignees Section */}
                        <div className="mb-4">
                            <h3 className="font-medium mb-2">Assignees</h3>
                            <div className="flex flex-wrap gap-2">
                                {userTasks[selectedTask.id]?.map(assignee => (
                                    <div
                                        key={assignee.id}
                                        className="flex items-center gap-2 bg-gray-100 rounded-full px-3 py-1"
                                    >
                                        <div
                                            className="w-6 h-6 rounded-full bg-blue-500 flex items-center justify-center text-white text-xs"
                                            title={assignee.user_name}
                                        >
                                            {assignee.user_name.charAt(0)}
                                        </div>
                                        <span className="text-sm">{assignee.user_name}</span>
                                        {isLoggedIn && (
                                            <button
                                                onClick={() => handleRemoveAssignee(assignee.id)}
                                                className="text-red-500 hover:text-red-700"
                                            >
                                                ×
                                            </button>
                                        )}
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Add Assignee Form (only shown for logged-in users) */}
                        {isLoggedIn && (
                            <div className="mb-4">
                                {/* Add your form for adding new assignees */}
                            </div>
                        )}

                        <button
                            onClick={() => setSelectedTask(null)}
                            className="text-gray-500 hover:text-gray-700"
                        >
                            Close
                        </button>
                    </div>
                </div>
            )}
        </DndContext>
    );
};

export default TaskList;