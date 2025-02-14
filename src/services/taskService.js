import axiosInstance from '../lib/axiosInstance';

export const getTasks = async () => {
    const response = await axiosInstance.get('/get-all-tasks?id=0');
    return response.data;
};

export const createTask = async (taskData) => {
    const response = await axiosInstance.post('/tasks/', taskData);
    return response.data;
};

export const getTaskById = async (id) => {
    const response = await axiosInstance.get(`/tasks/id?id=${id}`);
    return response.data;
};

export const deleteTaskById = async (id) => {
    const response = await axiosInstance.delete(`/tasks/id?id=${id}`);
    return response.data;
};

export const updateTask = async (id, taskData) => {
    const response = await axiosInstance.put(`/tasks/id/${id}`, taskData);
    return response.data;
};

export const changeTaskVisibility = async (visibilityData) => {
    const response = await axiosInstance.post('/task/change-visibility', visibilityData);
    return response.data;
};

export const getTaskTags = async (taskId) => {
    const response = await axiosInstance.get(`/task/get-tags?task_id=${taskId}`);
    return response.data;
};

export const changeTaskPriority = async ({ task_id, priority }) => {
    try {
        const response = await axiosInstance.post('/task/change-priority', {
            task_id: parseInt(task_id),
            priority: String(priority)
        });
        return response.data;
    } catch (error) {
        console.error('Error in changeTaskPriority:', error);
        throw error;
    }
}; 