import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { createTeam } from '../services/slices/teamSlice';

const TeamForm = () => {
    const dispatch = useDispatch();
    const [teamName, setTeamName] = useState('');
    const [limit, setLimit] = useState('');

    const handleCreateTeam = (e) => {
        e.preventDefault();
        dispatch(createTeam({ name: teamName, limit }));
    };

    return (
        <form onSubmit={handleCreateTeam}>
            <input
                type="text"
                value={teamName}
                onChange={(e) => setTeamName(e.target.value)}
                placeholder="Team Name"
                required
            />
            <input
                type="number"
                value={limit}
                onChange={(e) => setLimit(e.target.value)}
                placeholder="User Limit"
                required
            />
            <button type="submit">Create Team</button>
        </form>
    );
};

export default TeamForm; 