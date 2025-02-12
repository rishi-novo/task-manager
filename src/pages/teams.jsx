import React, { useEffect, useState } from 'react';
import {
    getTeamUsersByUserId,
    getTeamById,
    getTeamUsersByTeamId,
    getUserById
} from '@/services/teamService';
import CreateTeamModal from '@/components/CreateTeamModal';
import Shimmer from '@/components/Shimmer';
import Layout from '@/components/Layout';
import { Check, X } from 'lucide-react';
import axiosInstance from '@/lib/axiosInstance';

const Accordion = ({ title, children }) => {
    const [isOpen, setIsOpen] = useState(false);

    const toggleAccordion = () => {
        setIsOpen(!isOpen);
    };

    return (
        <div className="border border-gray-300 rounded mb-4">
            <div
                className="p-2 cursor-pointer bg-gray-100 flex items-center justify-between"
                onClick={toggleAccordion}
            >
                <h4 className="text-md font-semibold">{title}</h4>
                <span className={`transform transition-transform ${isOpen ? 'rotate-180' : ''}`}>
                    <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 10l5 5 5-5H7z" />
                    </svg>
                </span>
            </div>
            {isOpen && (
                <div className="p-4">
                    {children}
                </div>
            )}
        </div>
    );
};

const TeamsPage = () => {
    const [teamsData, setTeamsData] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [allUsers, setAllUsers] = useState([]);
    const [teamLimits, setTeamLimits] = useState({});

    useEffect(() => {
        fetchAllUsers();
        fetchTeamsData();
    }, []);

    const fetchTeamsData = async () => {
        try {
            setLoading(true);

            // Get user ID from localStorage
            const userData = JSON.parse(localStorage.getItem('user_data'));
            if (!userData?.uuid) {
                throw new Error('User ID not found');
            }

            // Get all teams the user is part of
            const userTeamsResponse = await getTeamUsersByUserId(userData.uuid);
            const userTeams = userTeamsResponse.user_teams;

            // Get unique team IDs
            const uniqueTeamIds = [...new Set(userTeams.map(team => team.team_id))];

            // Fetch detailed information for each team
            const teamsWithDetails = await Promise.all(
                uniqueTeamIds.map(async (teamId) => {
                    // Get team info
                    const teamInfo = await getTeamById(teamId);

                    // Get all users in the team
                    const teamUsersResponse = await getTeamUsersByTeamId(teamId);
                    const teamUsers = teamUsersResponse.team_users;

                    // Get unique user IDs from team users
                    const uniqueUserIds = [...new Set(teamUsers.map(user => user.user_id))];

                    // Fetch user details for each user
                    const usersWithDetails = await Promise.all(
                        uniqueUserIds.map(async (userId) => {
                            const userResponse = await getUserById(userId);
                            const userTeamDetails = teamUsers.find(tu => tu.user_id === userId);
                            return {
                                ...userResponse.user,
                                permissions: {
                                    canView: userTeamDetails.can_view.toLowerCase() === 'true',
                                    canComment: userTeamDetails.can_comment.toLowerCase() === 'true',
                                    canEdit: userTeamDetails.can_edit.toLowerCase() === 'true',
                                },
                                team_id: teamId
                            };
                        })
                    );

                    return {
                        ...teamInfo.team_one,
                        users: usersWithDetails.filter(user => user.team_id === teamId),
                        totalMembers: usersWithDetails.filter(user => user.team_id === teamId).length
                    };
                })
            );

            setTeamsData(teamsWithDetails);
        } catch (err) {
            console.error('Error fetching teams data:', err);
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    console.log("allUsers", allUsers);


    const fetchAllUsers = async () => {
        console.log("allUsers : ", allUsers)
        try {
            const response = await axiosInstance.get('/users');
            setAllUsers(response?.data ? response.data : []);
        } catch (err) {
            console.error('Error fetching users:', err);
            setAllUsers([]);
        }
    };

    const assignUserToTeam = async (teamId, uuid) => {
        console.log(uuid);
        try {
            // Validate count before assigning
            const team = teamsData.find(team => team.id === teamId);
            if (team && team.totalMembers < teamLimits[teamId]) { // Assuming teamLimits holds the max members allowed
                await axiosInstance.post('/team_users/', {
                    team_id: teamId,
                    user_id: uuid,
                    can_view: "true",
                    can_comment: "true",
                    can_edit: "true"
                });
            } else {
                console.error('Cannot assign user: team limit reached or invalid team.');
            }
        } catch (err) {
            console.error('Error assigning user to team:', err);
        }
    };

    const removeUserFromTeam = async (userId, teamId) => {
        try {
            // Validate count before removing
            const team = teamsData.find(team => team.id === teamId);
            if (team && team.totalMembers > 1) { // Ensure at least one member remains
                const response = await axiosInstance.delete(`/team_users/id`, {
                    params: { user_id: userId }
                });

                // Check if the response contains the deleted user information
                if (response.data.team_users_deleted) {
                    setTeamsData(prevTeams =>
                        prevTeams.map(team =>
                            team.id === teamId
                                ? { ...team, users: team.users.filter(user => user.uuid !== userId) }
                                : team
                        )
                    );
                }
            } else {
                console.error('Cannot remove user: at least one member must remain in the team.');
            }
        } catch (err) {
            console.error('Error removing user from team:', err);
        }
    };

    if (loading) return (
        <Layout>
            <div className="container mx-auto p-4">
                <Shimmer />
            </div>
        </Layout>
    );

    if (error) return (
        <Layout>
            <div className="container mx-auto p-4">
                <div className="text-red-500">Error: {error}</div>
            </div>
        </Layout>
    );

    const PermissionIcon = ({ isGranted }) => (
        isGranted ? (
            <Check className="text-green-500 h-4 w-4" />
        ) : (
            <X className="text-red-500 h-4 w-4" />
        )
    );

    return (
        <Layout>
            <div className="container mx-auto p-4">
                <div className="flex justify-between items-center mb-6">
                    <h1 className="text-2xl font-bold">Teams</h1>
                    <button
                        onClick={() => setIsModalOpen(true)}
                        className="button rounded bg-indigo-600 text-white font-medium py-2 px-4 text-sm"
                    >
                        Add New Team
                    </button>
                </div>

                <div className="space-y-6">
                    {teamsData.map(team => (
                        <div key={team.id} className="bg-white rounded-lg shadow-md p-6">
                            <div className="flex justify-between items-center mb-4">
                                <div>
                                    <h2 className="text-xl font-semibold">{team.team_name}</h2>
                                    <p className="text-gray-500 text-sm">
                                        {team.totalMembers} member{team.totalMembers !== 1 ? 's' : ''}
                                    </p>
                                </div>
                                {/* <span className="text-sm text-gray-500">
                                    Created: {new Date(team.created_at).toLocaleDateString()}
                                </span> */}
                                <button
                                    onClick={() => {/* Logic to open user assignment modal */ }}
                                    disabled={team.totalMembers >= teamLimits[team.id]}
                                    className="button rounded border border-indigo-600 text-indigo-800 bg-indigo-50 hover:bg-indigo-100 font-medium py-1 px-2 text-sm"
                                >
                                    Add Members
                                </button>
                            </div>

                            <Accordion title="Available Users">
                                <div className="mt-4">
                                    <table className="min-w-full divide-y divide-gray-200">
                                        <tbody className="divide-y divide-gray-200">
                                            {allUsers?.users_all?.map(user => (
                                                <tr key={user.id}>
                                                    <td className="px-4 py-2 text-sm">{user.name}</td>
                                                    <td className="px-4 py-2 text-sm">{user.email}</td>
                                                    <td className="px-4 py-2 text-center">
                                                        <button
                                                            onClick={() => assignUserToTeam(team.id, user.id)}
                                                            className="button rounded bg-green-50 text-green-600 py-1 px-2 text-xs"
                                                        >
                                                            Assign to Team
                                                        </button>
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            </Accordion>

                            <div className="mt-4">
                                <h3 className="text-lg font-semibold">Team Members</h3>
                                <table className="min-w-full divide-y divide-gray-200">
                                    <tbody className="divide-y divide-gray-200">
                                        {team.users.map(user => (
                                            <tr key={user.uuid}>
                                                <td className="px-4 py-2 text-sm">{user.name}</td>
                                                <td className="px-4 py-2 text-sm">{user.email}</td>
                                                <td className="px-4 py-2 text-center">
                                                    <button
                                                        onClick={() => removeUserFromTeam(user.uuid, team.id)}
                                                        className="button rounded bg-red-50 py-1 px-2 text-red-500 text-xs"
                                                    >
                                                        Remove from Team
                                                    </button>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    ))}
                </div>

                <CreateTeamModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
            </div>
        </Layout>
    );
};

export default TeamsPage;