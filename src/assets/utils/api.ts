import axios from "axios";

const API_URL = "http://localhost:5000/api";

export const registerPatient = async (data: {
  name: string;
  email: string;
  dateOfBirth: string;
  password: string;
}) => {
  return await axios.post(`${API_URL}/patients`, data);
};

export const registerDoctor = async (data: {
  name: string;
  email: string;
  specialty: string;
  password: string;
}) => {
  return await axios.post(`${API_URL}/doctors`, data);
};

export const registerClinician = async (data: {
  name: string;
  email: string;
  specialty: string;
  password: string;
  secretKey: string;
}) => {
  return await axios.post(`${API_URL}/clinician`, data);
};
