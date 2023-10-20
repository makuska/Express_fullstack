import express from 'express'
import { config as dotenvConfig } from 'dotenv';
import cookieParser from 'cookie-parser'

// Routes
import authRoute from "./routes/auth.router.js";
// Swagger
import swaggerUi from 'swagger-ui-express';
import swaggerSpec from './config/swagger-config.js';

// Utils
import cors from 'cors';

// Express application
const app = express();
// Use .env
dotenvConfig();

// Allow json, cookie parsing, and cors settings
app.use(express.urlencoded({extended: false}));
app.use(express.json());
app.use(cookieParser())
app.use(cors({
  origin: `http://localhost:${process.env.FRONTEND_PORT}`,
  credentials: true
}));
// swaggerAPI
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec)); //currently empty

// Routing
app.use(authRoute)

// listens on port {process.env.BACKEND_PORT} for connections
app.listen(process.env.BACKEND_PORT, () => {
  console.info('Server listening on port ' + process.env.BACKEND_PORT);
});

export default app