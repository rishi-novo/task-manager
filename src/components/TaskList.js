import React, { useEffect, useState } from 'react';
import { getTasks, changeTaskPriority } from '@/services/taskService';
import TaskCard from './TaskCard';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';

const TaskList = () => {
    const [tasks, setTasks] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchTasks = async () => {
            try {
                const data = await getTasks();
                setTasks(data.tasks_all);
            } catch (err) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };

        fetchTasks();
    }, []);

    const handleDrop = async (taskId, newPriority) => {
        try {
            // Update the local state
            setTasks((prevTasks) =>
                prevTasks.map((task) =>
                    task.id === taskId ? { ...task, priority: newPriority } : task
                )
            );

            // Call the API to change the task priority
            await changeTaskPriority({ task_id: taskId, priority: newPriority });
        } catch (error) {
            console.error('Error updating task priority:', error);
            // Revert the state if the API call fails
            const data = await getTasks();
            setTasks(data.tasks_all);
        }
    };

    const onDragEnd = (result) => {
        if (!result.destination) return;

        const taskId = parseInt(result.draggableId);
        const newPriority = result.destination.droppableId;

        handleDrop(taskId, newPriority);
    };

    if (loading) return <div>Loading tasks...</div>;
    if (error) return <div>Error: {error}</div>;

    const priorityColumns = {
        High: tasks.filter(task => task.priority === 'High'),
        Medium: tasks.filter(task => task.priority === 'Medium'),
        Normal: tasks.filter(task => task.priority === 'Normal')
    };

    const columnStyles = {
        High: 'bg-red-50',
        Medium: 'bg-yellow-50',
        Normal: 'bg-cyan-50'
    };

    return (
        <DragDropContext onDragEnd={onDragEnd}>
            <div className="grid grid-cols-3 gap-4">
                {Object.entries(priorityColumns).map(([priority, priorityTasks]) => (
                    <Droppable droppableId={priority} key={priority}>
                        {(provided, snapshot) => (
                            <div
                                ref={provided.innerRef}
                                {...provided.droppableProps}
                                className={`p-3 rounded-lg ${columnStyles[priority]} ${snapshot.isDraggingOver ? 'bg-opacity-70' : ''
                                    }`}
                                style={{ height: "calc(100vh - 150px)" }}
                            >
                                <h3 className="font-bold text-lg mb-2">{priority} Priority</h3>
                                {priorityTasks.map((task, index) => (
                                    <Draggable
                                        key={task.id}
                                        draggableId={task.id.toString()}
                                        index={index}
                                    >
                                        {(provided, snapshot) => (
                                            <div
                                                ref={provided.innerRef}
                                                {...provided.draggableProps}
                                                {...provided.dragHandleProps}
                                                className={`mb-2 ${snapshot.isDragging ? 'opacity-50' : ''
                                                    }`}
                                            >
                                                <TaskCard task={task} />
                                            </div>
                                        )}
                                    </Draggable>
                                ))}
                                {provided.placeholder}
                            </div>
                        )}
                    </Droppable>
                ))}
            </div>
        </DragDropContext>
    );
};

export default TaskList;