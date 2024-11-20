import axios from 'axios';

const API_URL = 'http://localhost:8009/getinfo/';

export const analyzeMedicine = async (query: string) => {
  try {
    const response = await axios.get(`${API_URL}${encodeURIComponent(query)}`, {
      headers: {
        'Content-Type': 'application/json',
      }
    });

    // console.log('Response from API:', response.data);
    return response.data;
  } catch (error) {
    console.error('Failed to analyze medicine:', error);
    throw new Error('Failed to analyze medicine. Please try again.');
  }
};
