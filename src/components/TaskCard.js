import React, { useState } from 'react';
import { useSelector } from 'react-redux';
import { Eye, EyeOff } from 'lucide-react';
import TaskDetails from './TaskDetails';

const TaskCard = ({ task, isDragging }) => {
    const [showDetails, setShowDetails] = useState(false);
    const taskAssignees = useSelector(state => state.assignees.taskAssignees[task.id] || []);

    return (
        <>
            <div
                onClick={() => setShowDetails(true)}
                className={`bg-white rounded-lg shadow-sm p-3 transition-shadow ${isDragging ? 'shadow-lg' : 'hover:shadow-md'
                    } cursor-pointer`}
            >
                <div className="flex items-center justify-between mb-2">
                    <span className="text-xs font-medium text-gray-500">{task.task_id}</span>
                    <div className="flex gap-2">
                        <button
                            className="text-gray-400 hover:text-gray-600"
                        >
                            {task.visibility === 'Public' ? <Eye size={16} /> : <EyeOff size={16} />}
                        </button>
                    </div>
                </div>

                {/* Task Name */}
                <h4 className="font-medium text-gray-800 mb-2">{task.task_name}</h4>

                {/* Task Description - truncated with ellipsis */}
                <p className="text-sm text-gray-600 mb-3 line-clamp-2 hover:line-clamp-none">
                    {task.ask_description}
                </p>

                {/* Assignees */}
                <div className="flex -space-x-2 mb-2">
                    {taskAssignees.map(assignee => (
                        <div
                            key={assignee.id}
                            className="w-6 h-6 rounded-full bg-blue-500 flex items-center justify-center text-white text-xs border-2 border-white"
                            title={assignee.user_name}
                        >
                            {assignee.user_name.charAt(0)}
                        </div>
                    ))}
                </div>

                {/* Status and Priority */}
                <div className="mt-2 flex items-center justify-between">
                    <div className="flex items-center gap-2">
                        <span className="text-xs text-gray-500">{task.due_date}</span>
                        {task.status && (
                            <span className={`text-xs px-2 py-1 rounded-full ${task.status === 'COMPLETED' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
                                }`}>
                                {task.status}
                            </span>
                        )}
                    </div>
                    <span className={`text-xs px-2 py-1 rounded-full ${task.priority === 'High' ? 'bg-red-100 text-red-800' :
                        task.priority === 'Medium' ? 'bg-yellow-100 text-yellow-800' :
                            'bg-blue-100 text-blue-800'
                        }`}>
                        {task.priority}
                    </span>
                </div>
            </div>

            {showDetails && (
                <TaskDetails
                    task={task}
                    onClose={() => setShowDetails(false)}
                    assignees={taskAssignees}
                />
            )}
        </>
    );
};

export default TaskCard;