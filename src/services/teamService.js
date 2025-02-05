import axiosInstance from '../lib/axiosInstance';

export const createTeam = async (teamData) => {
    const response = await axiosInstance.post('/team/', teamData);
    return response.data;
};

export const getTeamById = async (id) => {
    const response = await axiosInstance.get(`/team/id?id=${id}`);
    return response.data;
};

export const deleteTeamById = async (id) => {
    const response = await axiosInstance.delete(`/team/id?id=${id}`);
    return response.data;
};

export const getTeamUsers = async (teamId) => {
    const response = await axiosInstance.get(`/team_users/?team_id=${teamId}`);
    return response.data;
};

export const addTeamUser = async (teamUserData) => {
    const response = await axiosInstance.post('/team_users/', teamUserData);
    return response.data;
};

export const deleteTeamUserById = async (userId) => {
    const response = await axiosInstance.delete(`/team_users/id?user_id=${userId}`);
    return response.data;
}; 