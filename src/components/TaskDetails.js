import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
    updateTask,
    changeTaskPriority,
    fetchTaskById
} from '@/services/slices/taskSlice';
import { fetchAssigneesByTaskId } from '@/services/slices/assigneeSlice';
import { Eye, EyeOff, X, Edit2, Save, ChevronDown } from 'lucide-react';

const TaskDetails = ({ taskId, onClose }) => {
    const dispatch = useDispatch();
    const [task, setTask] = useState(null);
    const [isEditing, setIsEditing] = useState(false);
    const [editedTask, setEditedTask] = useState(null);
    const [showPriorityDropdown, setShowPriorityDropdown] = useState(false);
    const assignees = useSelector(state => state.assignees.taskAssignees[taskId] || []);

    // Fetch task details and assignees when modal opens
    useEffect(() => {
        const fetchDetails = async () => {
            try {
                const result = await dispatch(fetchTaskById(taskId)).unwrap();
                setTask(result.task);
                setEditedTask(result.task);
                dispatch(fetchAssigneesByTaskId(taskId));
            } catch (error) {
                console.error('Error fetching task details:', error);
            }
        };
        fetchDetails();
    }, [dispatch, taskId]);

    const handlePriorityChange = async (newPriority) => {
        try {
            const result = await dispatch(changeTaskPriority({
                task_id: taskId,
                priority: newPriority // This will be "High", "Medium", or "Normal"
            })).unwrap();
            setTask(result.task);
            setShowPriorityDropdown(false);
        } catch (error) {
            console.error('Error changing priority:', error);
        }
    };

    const handleVisibilityToggle = async () => {
        try {
            const result = await dispatch(updateTask({
                ...task,
                visibility: task.visibility === 'Public' ? 'Private' : 'Public'
            })).unwrap();
            setTask(result.task);
        } catch (error) {
            console.error('Error toggling visibility:', error);
        }
    };

    const handleTaskUpdate = async () => {
        try {
            const result = await dispatch(updateTask(editedTask)).unwrap();
            setTask(result.task);
            setIsEditing(false);
        } catch (error) {
            console.error('Error updating task:', error);
        }
    };

    if (!task) return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg p-4">
                Loading task details...
            </div>
        </div>
    );

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg max-w-3xl w-full mx-4 max-h-[90vh] overflow-y-auto">
                <div className="p-6">
                    {/* Header */}
                    <div className="flex justify-between items-start mb-6">
                        <div>
                            <div className="flex items-center gap-2 mb-2">
                                <span className="text-sm text-gray-500">{task.task_id}</span>
                                <span className={`text-xs px-2 py-1 rounded-full ${task.visibility === 'Public' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                                    }`}>
                                    {task.visibility}
                                </span>
                            </div>
                            {isEditing ? (
                                <input
                                    type="text"
                                    value={editedTask.task_name}
                                    onChange={(e) => setEditedTask(prev => ({ ...prev, task_name: e.target.value }))}
                                    className="text-xl font-bold w-full border-b border-gray-300 focus:outline-none focus:border-blue-500"
                                />
                            ) : (
                                <h2 className="text-xl font-bold">{task.task_name}</h2>
                            )}
                        </div>
                        <div className="flex items-center gap-4">
                            {/* Priority Dropdown */}
                            <div className="relative">
                                <button
                                    onClick={() => setShowPriorityDropdown(!showPriorityDropdown)}
                                    className={`flex items-center gap-2 px-3 py-1 rounded-full text-sm ${task.priority === 'High' ? 'bg-red-100 text-red-800' :
                                        task.priority === 'Medium' ? 'bg-yellow-100 text-yellow-800' :
                                            'bg-blue-100 text-blue-800'
                                        }`}
                                >
                                    {task.priority}
                                    <ChevronDown size={16} />
                                </button>
                                {showPriorityDropdown && (
                                    <div className="absolute right-0 mt-2 w-32 bg-white rounded-md shadow-lg z-10">
                                        {['High', 'Medium', 'Normal'].map((priority) => (
                                            <button
                                                key={priority}
                                                onClick={() => handlePriorityChange(priority)}
                                                className="block w-full text-left px-4 py-2 text-sm hover:bg-gray-100"
                                            >
                                                {priority}
                                            </button>
                                        ))}
                                    </div>
                                )}
                            </div>
                            {/* Edit/Save Button */}
                            <button
                                onClick={() => isEditing ? handleTaskUpdate() : setIsEditing(true)}
                                className="text-gray-600 hover:text-gray-800"
                            >
                                {isEditing ? <Save size={20} /> : <Edit2 size={20} />}
                            </button>
                            {/* Close Button */}
                            <button
                                onClick={onClose}
                                className="text-gray-600 hover:text-gray-800"
                            >
                                <X size={20} />
                            </button>
                        </div>
                    </div>

                    {/* Description */}
                    <div className="mb-6">
                        <h3 className="text-sm font-medium text-gray-700 mb-2">Description</h3>
                        {isEditing ? (
                            <textarea
                                value={editedTask.ask_description}
                                onChange={(e) => setEditedTask(prev => ({ ...prev, ask_description: e.target.value }))}
                                className="w-full h-32 p-2 border rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500"
                            />
                        ) : (
                            <p className="text-gray-600">{task.ask_description}</p>
                        )}
                    </div>

                    {/* Assignees */}
                    <div className="mb-6">
                        <h3 className="text-sm font-medium text-gray-700 mb-2">Assignees</h3>
                        <div className="flex flex-wrap gap-2">
                            {assignees.map(assignee => (
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
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Tags */}
                    {isEditing && (
                        <div className="mb-6">
                            <h3 className="text-sm font-medium text-gray-700 mb-2">Tags</h3>
                            <input
                                type="text"
                                value={editedTask.tags?.join(', ') || ''}
                                onChange={(e) => setEditedTask(prev => ({
                                    ...prev,
                                    tags: e.target.value.split(',').map(tag => tag.trim()).filter(Boolean)
                                }))}
                                placeholder="Enter tags separated by commas"
                                className="w-full p-2 border rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500"
                            />
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default TaskDetails; 