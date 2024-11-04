import { useTaskStore } from '../store/taskStore.ts';

export const ThemeSelector = () => {
    const { themes, activeTheme, setActiveTheme } = useTaskStore();

    return (
        <select
            value={activeTheme}
            onChange={(e) => setActiveTheme(e.target.value)}
        >
            {themes.map(theme => (
                <option key={theme.id} value={theme.id}>
                    {theme.name}
                </option>
            ))}
        </select>
    );
};
