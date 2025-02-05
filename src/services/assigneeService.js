import axiosInstance from '../lib/axiosInstance';

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