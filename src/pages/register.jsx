import Layout from '@/components/Layout';
import RegisterForm from '@/components/RegisterForm';
import React from 'react';

const RegisterPage = () => {
    return (
        <Layout>
            <div className="flex justify-center items-center h-full">
                <RegisterForm />
            </div>
        </Layout>
    );
};

export default RegisterPage; 