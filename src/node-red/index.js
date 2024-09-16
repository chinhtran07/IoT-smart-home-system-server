const { default: axios } = require("axios");
const NodeCache = require('node-cache');
const CustomError = require("../utils/CustomError");
const generateFlow = require("./generateFlow");

const tokenCache = new NodeCache();

const login = async (ipAddress) => {
  const body = {
    client_id: "node-red-admin",
    grant_type: "password",
    scope: "*",
    username: "admin",
    password: "123456",
  };
    try {
        const response = await axios.post(`http://${ipAddress}:1880/auth/token`,
            body,
            {
                headers: {
                    "Content-Type": "application/json",
                },
            });
        
        tokenCache.set(ipAddress, response.data.access_token, response.data.expires_in);

        return response.data.access_token;
    } catch (error) {
        console.error("Error logging in:", error);
    throw error;
    }
};

const getToken = async (ipAddress) => {
    const token = tokenCache.get(ipAddress);
    if (token) {
        return token;
    }

    return await login(ipAddress);
}

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
}

const updateFlow = async (ipAddress, flow, scenorioId) => {
    try {
        const token = await getToken(ipAddress);
        const flowJson = await generateFlow(flow, ipAddress);
        const response = await axios.put(`http://${ipAddress}:1880/flow/${scenorioId}`, flowJson, {
            headers: {
                Authorization: `Bearer ${token}`,
                "Content-Type": "application/json"
            }
        });

        return response.status;
    } catch (error) {
        throw error;
    }
}

const deleteFlow = async (ipAddress, scenorioId) => {
    try {
        const token = await getToken(ipAddress);
        const response = await axios.delete(`http://${ipAddress}:1880/flow/${scenorioId}`, {
            headers: {
                Authorization: `Bearer ${token}`,
                "Content-Type": "application/json"
            }
        });

        return response.status;

    } catch (error) {
        throw error;
    }
}

module.exports = {
    createFlow,
    updateFlow,
    deleteFlow
}
