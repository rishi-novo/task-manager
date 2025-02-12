import React, { useState } from 'react';
import { X } from 'lucide-react';

const UserAssignmentModal = ({ isOpen, onClose, team, allUsers, onAssignUser }) => {
    if (!isOpen) return null;

    const [permissions, setPermissions] = useState({});

    // Filter out users that are already in the team
    const availableUsers = allUsers?.users_all?.filter(user =>
        !team.users.some(teamUser => teamUser.uuid === user.id)
    );

    const handlePermissionChange = (userId, permission) => {
        setPermissions(prev => ({
            ...prev,
            [userId]: {
                ...prev[userId],
                [permission]: !prev[userId]?.[permission]
            }
        }));
    };

    const handleAssignUser = (userId) => {
        const userPermissions = permissions[userId] || {
            canView: true,    // Default permissions
            canComment: true,
            canEdit: true
        };
        onAssignUser(team.id, userId, userPermissions);
    };

    const isTeamFull = team.totalMembers >= team.limit;

    return (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg w-full max-w-3xl mx-4 overflow-hidden">
                {/* Header */}
                <div className="px-4 py-3 border-b border-gray-100 flex items-center justify-between">
                    <div>
                        <h3 className="text-sm font-medium text-gray-900">Add team members</h3>
                        <p className="text-xs text-gray-500 mt-0.5">
                            Team: {team.team_name} (Members: {team.totalMembers}/{team.limit})
                        </p>
                    </div>
                    <button
                        onClick={onClose}
                        className="text-gray-400 hover:text-gray-500"
                    >
                        <X size={16} />
                    </button>
                </div>

                {/* Content */}
                <div className="px-4 py-3">
                    {isTeamFull ? (
                        <div className="text-sm text-red-600 mb-3">
                            This team has reached its member limit.
                        </div>
                    ) : (
                        <div className="overflow-x-auto">
                            <table className="min-w-full divide-y divide-gray-100">
                                <thead>
                                    <tr className="text-xs text-gray-500">
                                        <th className="px-3 py-2 text-left font-medium">Name</th>
                                        <th className="px-3 py-2 text-left font-medium">Email</th>
                                        <th className="px-3 py-2 text-center font-medium">Can View</th>
                                        <th className="px-3 py-2 text-center font-medium">Can Comment</th>
                                        <th className="px-3 py-2 text-center font-medium">Can Edit</th>
                                        <th className="px-3 py-2 text-right font-medium"></th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-50">
                                    {availableUsers?.map(user => (
                                        <tr key={user.id} className="text-sm hover:bg-gray-50">
                                            <td className="px-3 py-2 text-gray-900">{user.name}</td>
                                            <td className="px-3 py-2 text-gray-500">{user.email}</td>
                                            <td className="px-3 py-2 text-center">
                                                <input
                                                    type="checkbox"
                                                    checked={permissions[user.id]?.canView ?? true}
                                                    onChange={() => handlePermissionChange(user.id, 'canView')}
                                                    className="rounded border-gray-300 text-blue-600"
                                                />
                                            </td>
                                            <td className="px-3 py-2 text-center">
                                                <input
                                                    type="checkbox"
                                                    checked={permissions[user.id]?.canComment ?? true}
                                                    onChange={() => handlePermissionChange(user.id, 'canComment')}
                                                    className="rounded border-gray-300 text-blue-600"
                                                />
                                            </td>
                                            <td className="px-3 py-2 text-center">
                                                <input
                                                    type="checkbox"
                                                    checked={permissions[user.id]?.canEdit ?? true}
                                                    onChange={() => handlePermissionChange(user.id, 'canEdit')}
                                                    className="rounded border-gray-300 text-blue-600"
                                                />
                                            </td>
                                            <td className="px-3 py-2 text-right">
                                                <button
                                                    onClick={() => handleAssignUser(user.id)}
                                                    className="text-xs px-2 py-1 rounded-full bg-blue-50 text-blue-600 hover:bg-blue-100 transition-colors"
                                                >
                                                    Add to team
                                                </button>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default UserAssignmentModal; 