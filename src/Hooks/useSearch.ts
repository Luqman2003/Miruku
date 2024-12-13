import { useState } from "react";
import { fetchDataFromApi } from "../Api/api";

const useSearch = () => {
    const [response, setResponse] = useState(null);
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(false);

    const fetchAnimeData = async (endpoint: string) => {
        setLoading(true);
        setError(null); // Reset error before fetching

        try {
            const data = await fetchDataFromApi(endpoint);
            if (data) {
                setResponse(data);
            }
        } catch (err: any) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    return { response, error, loading, fetchAnimeData };
};

export default useSearch;
