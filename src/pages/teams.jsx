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

const TeamsPage = () => {
    const [teamsData, setTeamsData] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [isModalOpen, setIsModalOpen] = useState(false);

    useEffect(() => {
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
                                }
                            };
                        })
                    );

                    return {
                        ...teamInfo.team_one,
                        users: usersWithDetails,
                        totalMembers: usersWithDetails.length
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
                                <span className="text-sm text-gray-500">
                                    Created: {new Date(team.created_at).toLocaleDateString()}
                                </span>
                            </div>

                            <div className="overflow-x-auto">
                                <table className="min-w-full divide-y divide-gray-200">
                                    <thead>
                                        <tr>
                                            <th className="px-4 py-2 text-left text-sm font-medium text-gray-500">Name</th>
                                            <th className="px-4 py-2 text-left text-sm font-medium text-gray-500">Email</th>
                                            <th className="px-4 py-2 text-left text-sm font-medium text-gray-500">View</th>
                                            <th className="px-4 py-2 text-left text-sm font-medium text-gray-500">Comment</th>
                                            <th className="px-4 py-2 text-left text-sm font-medium text-gray-500">Edit</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-gray-200">
                                        {team.users.map(user => (
                                            <tr key={user.uuid}>
                                                <td className="px-4 py-2 text-sm">{user.name}</td>
                                                <td className="px-4 py-2 text-sm">{user.email}</td>
                                                <td className="px-4 py-2 text-center">
                                                    <PermissionIcon isGranted={user.permissions.canView} />
                                                </td>
                                                <td className="px-4 py-2 text-center">
                                                    <PermissionIcon isGranted={user.permissions.canComment} />
                                                </td>
                                                <td className="px-4 py-2 text-center">
                                                    <PermissionIcon isGranted={user.permissions.canEdit} />
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