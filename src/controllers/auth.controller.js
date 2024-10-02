import config from "../config/index.js"; // Adjust path as necessary
import * as authServices from "../services/auth.service.js"; // Adjust path as necessary

export const registerUser = async (req, res, next) => {
    try {
        const { username, password, firstName, lastName, email, phone } = req.body;

        // Call the auth service to register a new user
        const user = await authServices.registerUser(
            username,
            password,
            firstName,
            lastName,
            email,
            phone
        );

        res.status(201).json(user);
    } catch (error) {
        next(error);
    }
};

export const loginUser = async (req, res, next) => {
    try {
        const { email, password } = req.body;

        // Authenticate the user using the auth service
        const tokens = await authServices.loginUser(email, password);

        // Return the access token and refresh token
        res.json({
            access_token: tokens.token,
            refresh_token: tokens.refreshToken,
            expireIn: config.jwt.expiresIn,
        });
    } catch (error) {
        next(error);
    }
};

export const refreshToken = async (req, res, next) => {
    try {
        const { refreshToken } = req.body;

        const tokens = await authServices.refreshAccessToken(refreshToken);

        // Return the new access token and refresh token
        res.json({
            access_token: tokens.token,
            refresh_token: tokens.refreshToken,
            expireIn: config.jwt.expiresIn,
        });
    } catch (error) {
        next(error);
    }
};
