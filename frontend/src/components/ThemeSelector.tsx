// src/components/ThemeSelector.tsx
import { useTaskStore } from '../store/taskStore';

export const ThemeSelector = () => {
    const { themes, activeTheme, setActiveTheme } = useTaskStore();

    return (
        <select
            value={activeTheme}
            onChange={(e) => setActiveTheme(e.target.value)}
            className="block w-32 rounded-md border-gray-300 dark:border-slate-600 dark:bg-slate-700 dark:text-gray-100 shadow-sm focus:border-blue-500 focus:ring-blue-500"
        >
            {themes.map(theme => (
                <option key={theme.id} value={theme.id}>
                    {theme.name}
                </option>
            ))}
        </select>
    );
};