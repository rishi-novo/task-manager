import React, { useState } from 'react';
import { changeTaskVisibility, changeTaskPriority } from '@/services/taskService'; // Import the changeTaskVisibility and changeTaskPriority functions
import { Eye, EyeOff, FlagTriangleRight } from 'lucide-react'; // Import icons from lucide-react

const TaskCard = ({ task, onDrop }) => {
    const [visibility, setVisibility] = useState(task.visibility);
    const [isExpanded, setIsExpanded] = useState(false); // State to manage description expansion

    const handleVisibilityToggle = async () => {
        const newVisibility = visibility === 'Public' ? 'Private' : 'Public';
        setVisibility(newVisibility);
        await changeTaskVisibility({ task_id: task.id, visibility: newVisibility });
    };

    const handlePriorityChange = async (newPriority) => {
        await changeTaskPriority({ task_id: task.id, priority: newPriority });
        onDrop(task.id, newPriority); // Call the onDrop function to update the task in the parent component
    };

    const getPriorityColor = (priority) => {
        switch (priority) {
            case 'High':
                return 'bg-red-500';
            case 'Medium':
                return 'bg-yellow-500';
            case 'Low':
                return 'bg-blue-500';
            default:
                return '';
        }
    };

    return (
        <div className={`border p-2 mb-4 rounded shadow flex flex-col items-start gap-1 bg-stone-50`} key={task.id}>
            <div className="flex items-center justify-between w-full">
                <button className="text-xs uppercase text-gray-600 bg-gray-200 py-1 px-2 rounded text-uppercase font-medium">{task.task_id}</button>
                <button onClick={handleVisibilityToggle} className="mt-2 text-zinc-500 flex items-center">
                    {visibility === 'Public' ? (
                        <>
                            <Eye className="inline" size={16} />
                            {/* <span className="ml-1">Make Private</span> */}
                        </>
                    ) : (
                        <>
                            <EyeOff className="inline" size={16} />
                            {/* <span className="ml-1">Make Public</span> */}
                        </>
                    )}
                </button>
            </div>
            <h2 className="text-sm font-semibold">{task.task_name}</h2>
            {/* <p className="text-sm button ${getPriorityColor(task.priority)}">
                <FlagTriangleRight className="inline mr-1" /> {task.priority}
            </p> */}
            <p className="text-gray-700 text-xs text-ellipsis overflow-hidden whitespace-wrap" style={{ maxWidth: "calc('100%')" }}>
                {isExpanded ? task.ask_description : `${task.ask_description.substring(0, 50)}...`}
            </p>
            <button onClick={() => setIsExpanded(!isExpanded)} className="text-blue-500 text-xs">
                {isExpanded ? 'View Less' : 'View More'}
            </button>
        </div>
    );
};

export default TaskCard; 