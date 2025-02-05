import React from 'react';

const TaskModal = ({ task, onClose }) => {
    return (
        <div>
            <h2>{task.name}</h2>
            <p>{task.description}</p>
            <button onClick={onClose}>Close</button>
        </div>
    );
};

export default TaskModal; 