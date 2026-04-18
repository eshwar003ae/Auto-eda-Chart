import { API_BASE_URL } from '../config';

// Then in your axios call:
const res = await axios.post(`${API_BASE_URL}/api/analyze`, formData);
export const API_BASE_URL = "https://auto-eda-chart.onrender.com";