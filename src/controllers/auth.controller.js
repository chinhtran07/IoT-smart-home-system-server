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

        // Remove sensitive data before sending the response
        const userWithoutSensitiveData = user.toJSON();
        delete userWithoutSensitiveData.password;
        delete userWithoutSensitiveData.role;

        // Respond with the created user object
        res.status(201).json({ ...userWithoutSensitiveData });
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

        // Refresh the access token using the auth service
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
