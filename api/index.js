// import express from "express";
// import cookieParser from "cookie-parser";
// import cors from "cors";
// import authRoutes from "./routes/auth.route.js";
// import movieRoutes from "./routes/movie.route.js";
// import tvRoutes from "./routes/tv.route.js";
// import searchRoutes from "./routes/search.route.js";
// import { ENV_VARS } from "./config/envVars.js";
// import { connectDB } from "./config/db.js";
// import { protectRoute } from "./middleware/protectRoute.js";

// const app = express();
// const PORT = ENV_VARS.PORT || 3000;

// app.use(cors({
//   origin: '*', // Replace with your frontend URL
//   methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'HEAD'],
//   origin: ['http://localhost:5173', 'https://final-frontend-kohl.vercel.app'],
//   allowedHeaders: ['Content-Type', 'Authorization'],
//   credentials: true, // Include if your requests include credentials
// }));

// app.use(express.json());
// app.use(cookieParser());

// // API Routes
// app.use("/api/v1/auth", authRoutes);
// app.use("/api/v1/movies", protectRoute, movieRoutes);
// app.use("/api/v1/tv", protectRoute, tvRoutes);
// app.use("/api/v1/search", protectRoute, searchRoutes);

// // Health check route
// app.get("/", (req, res) => {
//   res.json({ message: "API is running" });
// });

// const startServer = async () => {
//   try {
//     await connectDB();
//     app.listen(PORT, () => {
//       console.log(`Server running on port ${PORT}`);
//     });
//   } catch (error) {
//     console.error('Failed to start server:', error);
//     process.exit(1);
//   }
// };

// startServer();

// export default app;


import express from "express";
import cookieParser from "cookie-parser";
import cors from "cors";
import authRoutes from "./routes/auth.route.js";
import movieRoutes from "./routes/movie.route.js";
import tvRoutes from "./routes/tv.route.js";
import searchRoutes from "./routes/search.route.js";
import { ENV_VARS } from "./config/envVars.js";
import { connectDB } from "./config/db.js";
import { protectRoute } from "./middleware/protectRoute.js";

const app = express();
const PORT = ENV_VARS.PORT || 3000;

// CORS Configuration
const corsOptions = {
  origin: [
    'http://localhost:5173',
    'http://localhost:3000',
    'http://localhost:3009',
    'https://final-wheat-three.vercel.app',
    'https://final-frontend-kohl.vercel.app'
  ],
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  exposedHeaders: ['set-cookie'],
  preflightContinue: true,
  optionsSuccessStatus: 204
};

// Apply CORS middleware before routes
app.use(cors(corsOptions));

// Handle preflight requests
app.options('*', cors(corsOptions));

// Additional headers for better CORS support
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Credentials', 'true');
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization');
  // Handle preflight requests
  if (req.method === 'OPTIONS') {
    return res.status(204).end();
  }
  next();
});

app.use(express.json());
app.use(cookieParser());

// Routes
app.use("/api/v1/auth", authRoutes);
app.use("/api/v1/movies", protectRoute, movieRoutes);
app.use("/api/v1/tv", protectRoute, tvRoutes);
app.use("/api/v1/search", protectRoute, searchRoutes);

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ 
    status: 'error',
    message: err.message || 'Internal Server Error'
  });
});

const startServer = async () => {
  try {
    await connectDB();
    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });
  } catch (error) {
    console.error('Failed to start server:', error);
    process.exit(1);
  }
};

startServer();

export default app;

// 