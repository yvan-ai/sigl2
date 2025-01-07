import axios from "axios";

const API_URL = "http://127.0.0.1:8000/events/";

export const getEvents = () => axios.get(API_URL);
export const createEvent = (eventData) => axios.post(API_URL, eventData);
export const deleteEvent = (eventId) => axios.delete(`${API_URL}${eventId}/`);
