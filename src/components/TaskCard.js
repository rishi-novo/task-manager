import React, { useState } from 'react';
import { changeTaskVisibility } from '@/services/taskService';
import { Eye, EyeOff } from 'lucide-react';

const TaskCard = ({ task }) => {
    const [visibility, setVisibility] = useState(task.visibility);
    const [isExpanded, setIsExpanded] = useState(false);

    const handleVisibilityToggle = async () => {
        try {
            const newVisibility = visibility === 'Public' ? 'Private' : 'Public';
            await changeTaskVisibility({ task_id: task.id, visibility: newVisibility });
            setVisibility(newVisibility);
        } catch (error) {
            console.error('Error toggling visibility:', error);
        }
    };

    return (
        <div className="border p-2 rounded shadow bg-white">
            <div className="flex items-center justify-between w-full">
                <span className="text-xs uppercase text-gray-600 bg-gray-200 py-1 px-2 rounded font-medium">
                    {task.task_id}
                </span>
                <button
                    onClick={handleVisibilityToggle}
                    className="text-zinc-500 hover:text-zinc-700 transition-colors"
                >
                    {visibility === 'Public' ? (
                        <Eye size={16} />
                    ) : (
                        <EyeOff size={16} />
                    )}
                </button>
            </div>

            <h2 className="text-sm font-semibold mt-2">{task.task_name}</h2>

            <div className="mt-2">
                <p className="text-gray-700 text-xs">
                    {isExpanded
                        ? task.ask_description
                        : task.ask_description?.length > 50
                            ? `${task.ask_description.substring(0, 50)}...`
                            : task.ask_description
                    }
                </p>
                {task.ask_description?.length > 50 && (
                    <button
                        onClick={() => setIsExpanded(!isExpanded)}
                        className="text-blue-500 text-xs mt-1 hover:text-blue-700"
                    >
                        {isExpanded ? 'View Less' : 'View More'}
                    </button>
                )}
            </div>
        </div>
    );
};

export default TaskCard;