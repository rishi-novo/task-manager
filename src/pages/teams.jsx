import React, { useEffect, useState } from 'react';
import {
    getTeamUsersByUserId,
    getTeamById,
    getTeamUsersByTeamId,
    getUserById,
    deleteTeam
} from '@/services/teamService';
import CreateTeamModal from '@/components/CreateTeamModal';
import Shimmer from '@/components/Shimmer';
import Layout from '@/components/Layout';
import { Check, X, Eye, MessageSquare, Edit2, Trash2 } from 'lucide-react';
import axiosInstance from '@/lib/axiosInstance';
import UserAssignmentModal from '@/components/UserAssignmentModal';

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
    const [selectedTeam, setSelectedTeam] = useState(null);
    const [showAssignModal, setShowAssignModal] = useState(false);

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

    const assignUserToTeam = async (teamId, uuid, permissions) => {
        try {
            const team = teamsData.find(team => team.id === teamId);

            // Check team limit
            if (!team || team.totalMembers >= team.limit) {
                console.error('Cannot assign user: team limit reached or invalid team.');
                return;
            }

            await axiosInstance.post('/team_users/', {
                team_id: teamId,
                user_id: uuid,
                can_view: permissions.canView.toString(),
                can_comment: permissions.canComment.toString(),
                can_edit: permissions.canEdit.toString()
            });

            // Refresh teams data after successful assignment
            await fetchTeamsData();
            setShowAssignModal(false);
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

    const handleDeleteTeam = async (teamId) => {
        if (window.confirm('Are you sure you want to delete this team? This action cannot be undone.')) {
            try {
                await deleteTeam(teamId);
                // Remove team from local state
                setTeamsData(prevTeams => prevTeams.filter(team => team.id !== teamId));
            } catch (err) {
                console.error('Error deleting team:', err);
            }
        }
    };

    const PermissionIcon = ({ permission, Icon }) => (
        <span className={`inline-flex items-center justify-center ${permission ? 'text-green-500' : 'text-gray-300'
            }`}>
            <Icon size={14} />
        </span>
    );

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

                <div className="space-y-4">
                    {teamsData.map(team => (
                        <div key={team.id} className="bg-white rounded-lg shadow-sm border border-gray-100 p-4">
                            <div className="flex justify-between items-center mb-4">
                                <div>
                                    <h2 className="text-sm font-medium text-gray-900">{team.team_name}</h2>
                                    <p className="text-xs text-gray-500">
                                        {team.totalMembers}/{team.limit} members
                                    </p>
                                </div>
                                <div className="flex items-center gap-2">
                                    <button
                                        onClick={() => {
                                            setSelectedTeam(team);
                                            setShowAssignModal(true);
                                        }}
                                        disabled={team.totalMembers >= team.limit}
                                        className="text-xs px-3 py-1.5 rounded-full border border-gray-200 text-gray-600 hover:bg-gray-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                                    >
                                        Add Members
                                    </button>
                                    <button
                                        onClick={() => handleDeleteTeam(team.id)}
                                        className="text-xs px-3 py-1.5 rounded-full border border-red-200 text-red-600 hover:bg-red-50 transition-colors"
                                    >
                                        <Trash2 size={14} />
                                    </button>
                                </div>
                            </div>

                            <div className="overflow-x-auto">
                                <table className="min-w-full divide-y divide-gray-100">
                                    <thead>
                                        <tr className="text-xs text-gray-500">
                                            <th className="px-3 py-2 text-left font-medium">Name</th>
                                            <th className="px-3 py-2 text-left font-medium">Email</th>
                                            <th className="px-3 py-2 text-center font-medium">Permissions</th>
                                            <th className="px-3 py-2 text-right font-medium"></th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-gray-50">
                                        {team.users.map(user => (
                                            <tr key={user.uuid} className="text-sm hover:bg-gray-50">
                                                <td className="px-3 py-2 text-gray-900">{user.name}</td>
                                                <td className="px-3 py-2 text-gray-500">{user.email}</td>
                                                <td className="px-3 py-2">
                                                    <div className="flex items-center justify-center gap-3">
                                                        <PermissionIcon
                                                            permission={user.permissions.canView}
                                                            Icon={Eye}
                                                            title="Can View"
                                                        />
                                                        <PermissionIcon
                                                            permission={user.permissions.canComment}
                                                            Icon={MessageSquare}
                                                            title="Can Comment"
                                                        />
                                                        <PermissionIcon
                                                            permission={user.permissions.canEdit}
                                                            Icon={Edit2}
                                                            title="Can Edit"
                                                        />
                                                    </div>
                                                </td>
                                                <td className="px-3 py-2 text-right">
                                                    <button
                                                        onClick={() => removeUserFromTeam(user.uuid, team.id)}
                                                        className="text-xs px-2 py-1 rounded-full bg-red-50 text-red-600 hover:bg-red-100 transition-colors"
                                                    >
                                                        Remove
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
                <UserAssignmentModal
                    isOpen={showAssignModal}
                    onClose={() => {
                        setShowAssignModal(false);
                        setSelectedTeam(null);
                    }}
                    team={selectedTeam}
                    allUsers={allUsers}
                    onAssignUser={assignUserToTeam}
                />
            </div>
        </Layout>
    );
};

export default TeamsPage;