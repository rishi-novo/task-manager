import Layout from '@/components/Layout';
import LoginForm from '@/components/LoginForm';
import React from 'react';

const LoginPage = () => {
    return (
        <Layout>
            <div className="flex justify-center items-center h-full">
                <LoginForm />
            </div>
        </Layout>
    );
};

export default LoginPage; 