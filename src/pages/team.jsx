import Layout from '@/components/Layout';
import TeamForm from '@/components/TeamForm';
import React from 'react';

const TeamPage = () => {
    return (
        <Layout>
            <h1>Manage Teams</h1>
            <TeamForm />
        </Layout>
    );
};

export default TeamPage; 