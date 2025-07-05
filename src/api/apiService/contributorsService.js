import { fetchWrapper } from '../../utils/fetchWrapper'; 

export const fetchContributors = async (params = {}) => {
    try {
      
        const queryParams = new URLSearchParams({
            page: 1, 
            ...params, 
        });

        const response = await fetchWrapper.get(`/api/contributors/?${queryParams}`);

        return response; 

    } catch (error) {
        console.error('Fetching contributors failed:', error);
        throw error;
    }
};

