import { useState } from 'react';

function useObjectState<T extends object>(initialState: T) {
    const [state, setState] = useState<T>(initialState);

    const setKeyValue = <K extends keyof T>(key: K, value: T[K]) => {
        setState((prevState) => ({
            ...prevState,
            [key]: value,
        }));
    };

    const setMultipleValues = (newValues: Partial<T>) => {
        setState((prevState) => ({
            ...prevState,
            ...newValues,
        }));
    };

    const resetState = () => {
        setState(initialState);
    };

    const handleObjectChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value, type } = e.target as HTMLInputElement;
        const checked = (e.target as HTMLInputElement).checked;
        let newValue: T[keyof T];

        if (type === 'checkbox') {
            newValue = checked as unknown as T[keyof T];
        } else if (type === 'number') {
            newValue = parseFloat(value) as unknown as T[keyof T];
        } else {
            newValue = value as unknown as T[keyof T];
        }

        setKeyValue(name as keyof T, newValue);
    };

    return [state, setKeyValue, setMultipleValues, resetState, handleObjectChange] as const;
}

export default useObjectState;