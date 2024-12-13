import axios from 'axios';
import rateLimit from 'axios-rate-limit';

// Create a rate-limited axios instance
const apiWithRateLimit = rateLimit(axios.create(), {
    maxRequests: 1, // 1 request
    perMilliseconds: 1000, // per second
});

// Fetch data using the rate-limited axios instance
export const fetchDataFromApi = async (endpoint: string) => {
    try {
        const response = await apiWithRateLimit.get("https://api.jikan.moe/v4/" + endpoint);
        if (response.status !== 200) {
            throw new Error('Network response was not ok');
        }
        return response.data;
    } catch (error: any) {
        throw new Error(error.message || 'Failed to fetch data');
    }
};
