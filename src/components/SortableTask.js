import React from 'react';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { useDispatch } from 'react-redux';
import { changeTaskPriority } from '@/services/slices/taskSlice';
import TaskCard from './TaskCard';

export const SortableTask = ({ task, onClick, newPriority }) => {
    const dispatch = useDispatch();
    const {
        attributes,
        listeners,
        setNodeRef,
        transform,
        transition,
        isDragging,
    } = useSortable({
        id: task.id,
        data: {
            task,
            // Store the current priority to compare after drag
            originalPriority: task.priority
        }
    });

    const style = {
        transform: CSS.Transform.toString(transform),
        transition,
    };

    // Handle priority change when task is dropped in a new lane
    React.useEffect(() => {
        if (newPriority && newPriority !== task.priority) {
            dispatch(changeTaskPriority({
                task_id: task.id,
                priority: newPriority // This will be "High", "Medium", or "Normal"
            }));
        }
    }, [newPriority, task.priority]);

    const handleClick = (e) => {
        if (!isDragging) {
            e.stopPropagation();
            onClick && onClick(task);
        }
    };

    return (
        <div
            ref={setNodeRef}
            style={style}
            {...attributes}
            {...listeners}
        >
            <TaskCard
                task={task}
                isDragging={isDragging}
                onClick={handleClick}
            />
        </div>
    );
};

// You can also use default export if you prefer
// export default SortableTask; 