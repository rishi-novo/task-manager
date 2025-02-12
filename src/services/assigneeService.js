import axiosInstance from '@/lib/axiosInstance';

export const getAssignees = async () => {
    const response = await axiosInstance.get('/assignees/');
    return response.data;
};

export const createAssignee = async (assigneeData) => {
    const response = await axiosInstance.post('/assignees/', assigneeData);
    return response.data;
};

export const deleteAssigneeById = async (id) => {
    const response = await axiosInstance.delete(`/assignees/id?id=${id}`);
    return response.data;
};

export const addAssignee = async ({ task_id, team_id, user_id, user_name }) => {
    const response = await axiosInstance.post('/assignees/', {
        task_id,
        team_id,
        user_id,
        user_name
    });
    return response.data;
};

export const removeAssignee = async (assigneeId) => {
    const response = await axiosInstance.delete(`/assignees/id?id=${assigneeId}`);
    return response.data;
}; 