import config from "../config/index.js"; // Adjust path as necessary
import * as authServices from "../services/auth.services.js"; // Adjust path as necessary

export const registerUser = async (req, res, next) => {
    try {
        const { username, password, firstName, lastName, email, phone } = req.body;
        const user = await authServices.registerUser(
            username,
            password,
            firstName,
            lastName,
            email,
            phone
        );

        const userWithoutPassword = user.toJSON();
        delete userWithoutPassword.password;
        delete userWithoutPassword.role;

        res.status(201).json({ ...userWithoutPassword });
    } catch (error) {
        next(error);
    }
};

export const loginUser = async (req, res, next) => {
    try {
        const { email, password } = req.body;
        const tokens = await authServices.loginUser(email, password);
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
        res.json({
            access_token: tokens.token,
            refresh_token: tokens.refreshToken,
            expireIn: config.jwt.expiresIn,
        });
    } catch (error) {
        next(error);
    }
};
