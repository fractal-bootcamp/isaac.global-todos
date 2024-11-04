// src/components/layout/PageLayout.tsx
import { ReactNode } from 'react';
import { ThemeSelector } from '../ThemeSelector';

interface PageLayoutProps {
    title: string;
    children: ReactNode;
    showThemeSelector?: boolean;
}

export const PageLayout = ({
    title,
    children,
    showThemeSelector = true
}: PageLayoutProps) => {
    return (
        <div className="max-w-4xl mx-auto">
            <div className="flex justify-between items-center mb-8">
                <h2 className="text-3xl font-bold text-gray-900 dark:text-gray-100">
                    {title}
                </h2>
                {showThemeSelector && <ThemeSelector />}
            </div>
            {children}
        </div>
    );
};