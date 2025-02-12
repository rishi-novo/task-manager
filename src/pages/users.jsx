import React, { useEffect, useState } from 'react';
import { getUsers } from '@/services/userService'; // Ensure this import is correct
import CreateUserModal from '@/components/CreateUserModal'; // Import the modal component
import EditUserModal from '@/components/EditUserModal';
import Shimmer from '@/components/Shimmer'; // Import the shimmer component
import Layout from '@/components/Layout';
import { Edit2, Trash2 } from 'lucide-react';
import axiosInstance from '@/lib/axiosInstance';

const UsersPage = () => {
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [selectedUser, setSelectedUser] = useState(null);

    useEffect(() => {
        fetchUsers();
    }, []);

    const fetchUsers = async () => {
        try {
            const data = await getUsers();
            setUsers(data.users_all);
        } catch (error) {
            console.error('Error fetching users:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleDeleteUser = async (userId) => {
        if (window.confirm('Are you sure you want to delete this user?')) {
            try {
                await axiosInstance.delete(`/users/id`, {
                    params: { id: userId }
                });
                setUsers(users.filter(user => user.id !== userId));
            } catch (error) {
                console.error('Error deleting user:', error);
            }
        }
    };

    const handleEditUser = (user) => {
        setSelectedUser(user);
        setIsEditModalOpen(true);
    };

    const handleUserUpdated = (updatedUser) => {
        setUsers(users.map(user =>
            user.id === updatedUser.id ? updatedUser : user
        ));
    };

    return (
        <Layout>
            <div className="container mx-auto p-4">
                <div className="flex items-center justify-between mb-6">
                    <h1 className="text-xl font-semibold text-gray-900">Users</h1>
                    <button
                        onClick={() => setIsCreateModalOpen(true)}
                        className="px-4 py-2 text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 rounded-md"
                    >
                        Add New User
                    </button>
                </div>

                {loading ? (
                    <Shimmer />
                ) : (
                    <div className="overflow-x-auto">
                        <table className="min-w-full divide-y divide-gray-200">
                            <thead className="bg-gray-50">
                                <tr>
                                    <th className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
                                    <th className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Username</th>
                                    <th className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Email</th>
                                    <th className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Created</th>
                                    <th className="px-3 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="bg-white divide-y divide-gray-100">
                                {users.map(user => (
                                    <tr key={user.id} className="hover:bg-gray-50">
                                        <td className="px-3 py-2 text-sm text-gray-900">{user.name}</td>
                                        <td className="px-3 py-2 text-sm text-gray-500">{user.username}</td>
                                        <td className="px-3 py-2 text-sm text-gray-500">{user.email}</td>
                                        <td className="px-3 py-2 text-sm text-gray-500">
                                            {new Date(user.created_at).toLocaleDateString()}
                                        </td>
                                        <td className="px-3 py-2 text-sm text-right">
                                            <div className="flex items-center justify-end gap-2">
                                                <button
                                                    onClick={() => handleEditUser(user)}
                                                    className="p-1 text-blue-600 hover:bg-blue-50 rounded"
                                                >
                                                    <Edit2 size={16} />
                                                </button>
                                                <button
                                                    onClick={() => handleDeleteUser(user.id)}
                                                    className="p-1 text-red-600 hover:bg-red-50 rounded"
                                                >
                                                    <Trash2 size={16} />
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}

                <CreateUserModal
                    isOpen={isCreateModalOpen}
                    onClose={() => setIsCreateModalOpen(false)}
                    onUserCreated={(newUser) => setUsers(prev => [...prev, newUser])}
                />

                {selectedUser && (
                    <EditUserModal
                        isOpen={isEditModalOpen}
                        onClose={() => {
                            setIsEditModalOpen(false);
                            setSelectedUser(null);
                        }}
                        user={selectedUser}
                        onUserUpdated={handleUserUpdated}
                    />
                )}
            </div>
        </Layout>
    );
};

export default UsersPage;