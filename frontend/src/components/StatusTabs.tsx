// src/components/StatusTabs.tsx
import { useState } from 'react';
import { TaskList } from './TaskList';
import { TaskStatus, TASK_STATUSES } from '../types/task';

export const StatusTabs = () => {
    const [activeTab, setActiveTab] = useState<TaskStatus>('pending');

    return (
        <div>
            {/* Tab Navigation */}
            <div className="border-b border-gray-200 dark:border-slate-700">
                <nav className="-mb-px flex space-x-8" aria-label="Tabs">
                    {TASK_STATUSES.map(({ value, label }) => (
                        <button
                            key={value}
                            onClick={() => setActiveTab(value)}
                            className={`
                                whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm
                                ${activeTab === value
                                    ? 'border-blue-500 text-blue-600 dark:text-blue-400'
                                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300 dark:text-gray-400 dark:hover:text-gray-300'
                                }
                            `}
                        >
                            {label}
                        </button>
                    ))}
                </nav>
            </div>

            {/* Tab Content */}
            <div className="mt-4">
                <TaskList status={activeTab} />
            </div>
        </div>
    );
};