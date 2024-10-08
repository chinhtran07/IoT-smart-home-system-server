import express from "express";
import cors from "cors";
import helmet from "helmet";
import morgan, { token } from "morgan";
import bodyParser from "body-parser";
import swaggerUi from "swagger-ui-express";
import { swaggerSpec } from "./config/swaggerConfig.js";
import * as authMiddleware from "./middlewares/auth.middleware.js";
import errorMiddleware from "./middlewares/error.middleware.js";
import authRoutes from "./routes/auth.routes.js";
import apiRoutes from "./routes/index.js";
import { adminJs, router, sessionMiddleware } from './admin/admin.js';
import passport from "passport";
import { Strategy as GoogleStrategy } from "passport-google-oauth20";
import session from "express-session";
import mysqlDb from "./models/mysql/index.js";
import multer from "multer";

const app = express();


// Middleware
app.use(sessionMiddleware);
app.use(adminJs.options.rootPath, router);

// Secure
app.use(cors());
app.use(helmet());
app.use(morgan("dev"));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: true
}));
app.use(passport.initialize());
app.use(passport.session());

// Passport Configuration
passport.use(new GoogleStrategy({
    clientID: process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    callbackURL: "/auth/google/callback"
}, async (accessToken, refreshToken, profile, done) => {
    try {

        let user = await mysqlDb.User.findOne({ where: { email: profile.emails[0].value } });

        if (!user) {
            const username = `${profile.name.givenName}.${profile.name.familyName}`.toLowerCase();

            let usernameExists = await mysqlDb.User.findOne({ where: { username } });
            if (usernameExists) {
                const uniqueId = uuidv4().slice(0, 5); 
                username = `${username}.${uniqueId}`; 
            }

            user = await mysqlDb.User.create({
                googleId: profile.id, 
                username, 
                firstName: profile.name.givenName,
                lastName: profile.name.familyName,
                email: profile.emails[0].value,
                phone: null, 
                role: 'user',
                password: null,
            });
        }

        const { token, refreshToken: newRefreshToken } = await user.generateAuthToken();

        return done(null, {user, token, refreshToken: newRefreshToken});
    } catch (error) {
        return done(error, null);
    }
}));

passport.serializeUser((user, done) => {
    done(null, user);
});

passport.deserializeUser((user, done) => {
    done(null, user);
});

// Google authentication routes
app.get('/auth/google', passport.authenticate('google', { scope: ['profile', 'email'] }));

app.get('/auth/google/callback', 
    passport.authenticate('google', { failureRedirect: '/' }), 
    (req, res) => {        
        res.json({token: req.user.token, refreshToken: req.user.refreshToken });
    }
);

// Swagger documentation
app.use(express.static('public'));
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));

// Auth routes
app.use("/api/auth", authRoutes);

// API routes
app.use("/api", authMiddleware.authenticate, apiRoutes);

app.use(errorMiddleware);

export { app };
