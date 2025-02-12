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
import TaskDetails from './TaskDetails';

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

    const PRIORITY_COLUMNS = {
        'High': { id: 'High', title: 'High Priority', bgColor: 'bg-red-50/30' },
        'Medium': { id: 'Medium', title: 'Medium Priority', bgColor: 'bg-yellow-50/30' },
        'Normal': { id: 'Normal', title: 'Normal Priority', bgColor: 'bg-blue-50/30' }
    };

    const handleDragEnd = async (event) => {
        const { active, over } = event;

        if (!over) return;

        const activeTask = filteredTasks.find(task => task.id === active.id);
        const overId = over.id;

        // Find which priority column we dropped into
        const newPriority = Object.keys(PRIORITY_COLUMNS).find(priority =>
            PRIORITY_COLUMNS[priority].id === overId
        );

        if (activeTask && newPriority && activeTask.priority !== newPriority) {
            try {
                await dispatch(changeTaskPriority({
                    task_id: activeTask.id,
                    priority: newPriority
                })).unwrap();
                dispatch(fetchAllTasks());
            } catch (error) {
                console.error('Error updating task priority:', error);
            }
        }

        setActiveId(null);
    };

    const handleTaskClick = (task) => {
        console.log("Task clicked:", task.id); // Debug log
        setSelectedTask(task.id);
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
                task_id: selectedTask,
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
        High: filteredTasks.filter(task => task.priority === 'High'),
        Medium: filteredTasks.filter(task => task.priority === 'Medium'),
        Normal: filteredTasks.filter(task => task.priority === 'Normal')
    };

    return (
        <DndContext
            sensors={sensors}
            collisionDetection={closestCorners}
            onDragStart={handleDragStart}
            onDragEnd={handleDragEnd}
        >
            <div className="grid grid-cols-3 gap-4 p-4">
                {Object.entries(PRIORITY_COLUMNS).map(([priority, column]) => (
                    <div
                        key={priority}
                        id={column.id}
                        className={`rounded-lg ${column.bgColor}`}
                        style={{ minHeight: "calc(100vh - 150px)" }}
                    >
                        <div className="p-4 flex items-center justify-between border-b border-gray-200">
                            <h3 className="font-medium text-gray-700">
                                {column.title} ({priorityColumns[priority]?.length || 0})
                            </h3>
                        </div>
                        <div className="p-2">
                            <SortableContext
                                items={priorityColumns[priority]?.map(task => task.id) || []}
                                strategy={verticalListSortingStrategy}
                            >
                                {priorityColumns[priority]?.map((task) => (
                                    <SortableTask
                                        key={task.id}
                                        task={task}
                                        onClick={handleTaskClick}
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
                        task={filteredTasks.find(task => task.id === activeId)}
                        isDragging
                    />
                ) : null}
            </DragOverlay>

            {selectedTask && (
                <TaskDetails
                    taskId={selectedTask}
                    onClose={() => setSelectedTask(null)}
                />
            )}
        </DndContext>
    );
};

export default TaskList;