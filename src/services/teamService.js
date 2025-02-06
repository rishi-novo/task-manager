import axiosInstance from '../lib/axiosInstance';

export const getTeamUsersByUserId = async (userId) => {
    const response = await axiosInstance.get(`/team_user/user_id?user_id=${userId}`);
    return response.data;
};

export const getTeamById = async (teamId) => {
    const response = await axiosInstance.get(`/team/id?id=${teamId}`);
    return response.data;
};

export const getTeamUsersByTeamId = async (teamId) => {
    const response = await axiosInstance.get(`/team_users/team_id/?id=${teamId}`);
    return response.data;
};

export const getUserById = async (userId) => {
    const response = await axiosInstance.get(`/users/id?id=${userId}`);
    return response.data;
};

// Keep existing team creation functionality
export const createTeam = async (teamData) => {
    const response = await axiosInstance.post('/team/', teamData);
    return response.data;
};