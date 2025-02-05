import React from 'react';
import Link from 'next/link';
import Layout from '@/components/Layout';
import TaskList from '@/components/TaskList';

const HomePage = () => {
  return (
    <Layout>
      <TaskList />
    </Layout>
  );
};

export default HomePage;
