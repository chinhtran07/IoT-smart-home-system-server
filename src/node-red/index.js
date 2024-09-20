// flowControl.js
import axios from "axios";
import redisClient from "../config/redis.config.js"; // Ensure Redis client is properly configured
import CustomError from "../utils/CustomError.js";
import generateFlow from "./generateFlow.js";

const login = async (ipAddress) => {
    const body = {
        client_id: "node-red-admin",
        grant_type: "password",
        scope: "*",
        username: "admin",
        password: "123456",
    };
    try {
        const response = await axios.post(`http://${ipAddress}:1880/auth/token`, body, {
            headers: {
                "Content-Type": "application/json",
            },
        });

        // Cache the token in Redis
        await redisClient.setEx(`token:${ipAddress}`, response.data.expires_in, response.data.access_token);
        return response.data.access_token;
    } catch (error) {
        console.error("Error logging in:", error);
        throw error;
    }
};

const getToken = async (ipAddress) => {
    try {
        const cachedToken = await redisClient.get(`token:${ipAddress}`);
        
        if (cachedToken) {
            return cachedToken; 
        }

        const newToken = await login(ipAddress);
        await redisClient.setEx(`token:${ipAddress}`, 3600, newToken);
        return newToken;

    } catch (error) {
        throw new CustomError(`Failed to get token: ${error.message}`, 500);
    }
};

const createFlow = async (ipAddress, flow) => {
    try {
        const token = await getToken(ipAddress);
        const flowJson = await generateFlow(flow, ipAddress);
        const response = await axios.post(`http://${ipAddress}:1880/flow`, flowJson, {
            headers: {
                Authorization: `Bearer ${token}`,
                "Content-Type": "application/json"
            }
        });
        return response;
    } catch (error) {
        throw new CustomError(`Node-red ${error.message}`, 400);
    } 
};

const updateFlow = async (ipAddress, flow, scenarioId) => {
    try {
        const token = await getToken(ipAddress);
        const flowJson = await generateFlow(flow, ipAddress);
        const response = await axios.put(`http://${ipAddress}:1880/flow/${scenarioId}`, flowJson, {
            headers: {
                Authorization: `Bearer ${token}`,
                "Content-Type": "application/json"
            }
        });
        return response.status;
    } catch (error) {
        throw error;
    }
};

const deleteFlow = async (ipAddress, scenarioId) => {
    try {
        const token = await getToken(ipAddress);
        const response = await axios.delete(`http://${ipAddress}:1880/flow/${scenarioId}`, {
            headers: {
                Authorization: `Bearer ${token}`,
                "Content-Type": "application/json"
            }
        });
        return response.status;

    } catch (error) {
        throw error;
    }
};

export { createFlow, updateFlow, deleteFlow };
