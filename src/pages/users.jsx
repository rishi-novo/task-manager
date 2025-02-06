import React, { useEffect, useState } from 'react';
import { getUsers } from '@/services/userService'; // Ensure this import is correct
import CreateUserModal from '@/components/CreateUserModal'; // Import the modal component
import Shimmer from '@/components/Shimmer'; // Import the shimmer component
import Layout from '@/components/Layout';

const UsersPage = () => {
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [isModalOpen, setIsModalOpen] = useState(false);

    useEffect(() => {
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

        fetchUsers();
    }, []);

    const handleOpenModal = () => {
        setIsModalOpen(true);
    };

    return (
        <Layout>
            <div className="container mx-auto p-4">
                <div className="flex items-center justify-between">
                    <h1 className="text-2xl font-bold mb-4">Users</h1>
                    <button
                        onClick={handleOpenModal}
                        className='button rounded bg-indigo-600 text-white font-medium py-2 px-4 text-sm mb-4'
                    >
                        Add New User
                    </button>
                </div>
                {loading ? (
                    <Shimmer />
                ) : (
                    <table className="min-w-full bg-white border border-gray-300">
                        <thead>
                            <tr>
                                <th className="border px-4 py-2 text-left">ID</th>
                                <th className="border px-4 py-2 text-left">Username</th>
                                <th className="border px-4 py-2 text-left">Name</th>
                                <th className="border px-4 py-2 text-left">Email</th>
                                <th className="border px-4 py-2 text-left">Created At</th>
                            </tr>
                        </thead>
                        <tbody>
                            {users.map(user => (
                                <tr key={user.id}>
                                    <td className="border px-4 py-2 text-sm">{user.id}</td>
                                    <td className="border px-4 py-2 text-sm">{user.username}</td>
                                    <td className="border px-4 py-2 text-sm">{user.name}</td>
                                    <td className="border px-4 py-2 text-sm">{user.email}</td>
                                    <td className="border px-4 py-2 text-sm">{new Date(user.created_at).toLocaleString()}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                )}
                <CreateUserModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
            </div>
        </Layout>
    );
};

export default UsersPage;