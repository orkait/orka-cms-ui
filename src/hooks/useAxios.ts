// use-fetch-data.js
import { useEffect, useState } from 'react';
import { api } from '../service/api';

function useAxios<T>(path: string) {
    const [data, setData] = useState({});
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const { data: response } = await api.get(path);
                setData(response);
            } catch (_error: any) {
                setError(_error);
            }
            setLoading(false);
        };

        fetchData();
    }, [path]);

    return {
        data: data as T,
        isLoading: loading,
        error
    };
}

export default useAxios;