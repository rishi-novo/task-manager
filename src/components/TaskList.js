import React, { useEffect, useState } from 'react';
import { getTasks } from '@/services/taskService'; // Import the getTasks function
import TaskCard from './TaskCard'; // Import the TaskCard component
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';

const TaskList = () => {
    const [tasks, setTasks] = useState([]); // Local state to store tasks
    const [loading, setLoading] = useState(true); // Local state for loading status
    const [error, setError] = useState(null); // Local state for error handling

    useEffect(() => {
        const fetchTasks = async () => {
            try {
                const data = await getTasks(); // Fetch tasks from the API
                setTasks(data.tasks_all); // Update local state with fetched tasks
            } catch (err) {
                setError(err.message); // Handle any errors
            } finally {
                setLoading(false); // Set loading to false after fetching
            }
        };

        fetchTasks(); // Call the fetch function
    }, []);

    const handleDrop = (taskId, newPriority) => {
        setTasks((prevTasks) =>
            prevTasks.map((task) =>
                task.id === taskId ? { ...task, priority: newPriority } : task
            )
        );
    };

    const onDragEnd = (result) => {
        if (!result.destination) return;

        const taskId = result.draggableId;
        const newPriority = result.destination.droppableId;

        handleDrop(taskId, newPriority);
    };

    if (loading) {
        return <div>Loading tasks...</div>; // Loading state
    }

    if (error) {
        return <div>Error: {error}</div>; // Error state
    }

    // Sort tasks into priority columns
    const highPriorityTasks = tasks.filter(task => task.priority === 'High');
    const mediumPriorityTasks = tasks.filter(task => task.priority === 'Medium');
    const lowPriorityTasks = tasks.filter(task => task.priority === 'Low');

    return (
        <DragDropContext onDragEnd={onDragEnd}>
            <div className="grid grid-cols-3 gap-4">
                <Droppable droppableId="High" isDropDisabled={true}>
                    {(provided) => (
                        <div ref={provided.innerRef} {...provided.droppableProps} className="p-3 h-100 bg-red-50 rounded-lg">
                            <h3 className="font-bold text-lg mb-2">High Priority</h3>
                            {highPriorityTasks.map((task, index) => (
                                <Draggable key={task.id} draggableId={task.id.toString()} index={index}>
                                    {(provided) => (
                                        <div ref={provided.innerRef} {...provided.draggableProps} {...provided.dragHandleProps}>
                                            <TaskCard task={task} onDrop={handleDrop} />
                                        </div>
                                    )}
                                </Draggable>
                            ))}
                            {provided.placeholder}
                        </div>
                    )}
                </Droppable>
                <Droppable droppableId="Medium" isDropDisabled={false}>
                    {(provided) => (
                        <div ref={provided.innerRef} {...provided.droppableProps} className="p-3 bg-yellow-50 rounded-lg">
                            <h3 className="font-bold text-lg mb-2">Medium Priority</h3>
                            {mediumPriorityTasks.map((task, index) => (
                                <Draggable key={task.id} draggableId={task.id.toString()} index={index}>
                                    {(provided) => (
                                        <div ref={provided.innerRef} {...provided.draggableProps} {...provided.dragHandleProps}>
                                            <TaskCard task={task} onDrop={handleDrop} />
                                        </div>
                                    )}
                                </Draggable>
                            ))}
                            {provided.placeholder}
                        </div>
                    )}
                </Droppable>
                <Droppable droppableId="Low" isDropDisabled={false}>
                    {(provided) => (
                        <div ref={provided.innerRef} {...provided.droppableProps} className="p-3 bg-cyan-50 rounded-lg">
                            <h3 className="font-bold text-lg mb-2">Low Priority</h3>
                            {lowPriorityTasks.map((task, index) => (
                                <Draggable key={task.id} draggableId={task.id.toString()} index={index}>
                                    {(provided) => (
                                        <div ref={provided.innerRef} {...provided.draggableProps} {...provided.dragHandleProps}>
                                            <TaskCard task={task} onDrop={handleDrop} />
                                        </div>
                                    )}
                                </Draggable>
                            ))}
                            {provided.placeholder}
                        </div>
                    )}
                </Droppable>
            </div>
        </DragDropContext>
    );
};

export default TaskList; 