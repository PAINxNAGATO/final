// import express from "express";
// import cookieParser from "cookie-parser";
// import path from "path";

// import authRoutes from "./routes/auth.route.js";
// import movieRoutes from "./routes/movie.route.js";
// import tvRoutes from "./routes/tv.route.js";
// import searchRoutes from "./routes/search.route.js";

// import { ENV_VARS } from "./config/envVars.js";
// import { connectDB } from "./config/db.js";
// import { protectRoute } from "./middleware/protectRoute.js";

// const app = express();

// const PORT = ENV_VARS.PORT;
// // const __dirname = path.resolve();

// app.use(express.json()); // will allow us to parse req.body
// app.use(cookieParser());

// app.use("/api/v1/auth", authRoutes);
// app.use("/api/v1/tv", protectRoute, tvRoutes);
// app.use("/api/v1/search", protectRoute, searchRoutes);

// // if (ENV_VARS.NODE_ENV === "production") {
// // 	app.use(express.static(path.join(__dirname, "/frontend/dist")));

// // 	app.get("*", (req, res) => {
// // 		res.sendFile(path.resolve(__dirname, "frontend", "dist", "index.html"));
// // 	});
// // }

// app.listen(PORT, () => {
// 	console.log("Server started at Port: " + PORT);
// 	connectDB();
// });

// // const server = http.createServer(app);

// // server.listen(port, () => {
// //     console.log(`Server is listening on port ${port}`);
// //   });


// export default app;



// index.js
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

// // Initially allow all origins in development
// app.use(cors({
//   origin: "*",  // We'll update this after frontend deployment
//   credentials: true,
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

// CORS configuration
app.use(cors({
  origin: [
    'http://localhost:5173',
    'http://localhost:3000',
    'https://your-frontend-url.vercel.app'  // Add your frontend URL when deployed
  ],
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With'],
  exposedHeaders: ['set-cookie']
}));

// Middleware
app.use(express.json());
app.use(cookieParser());

// Logging middleware
app.use((req, res, next) => {
  console.log(`${new Date().toISOString()} - ${req.method} ${req.path}`);
  next();
});

// Health check route
app.get("/", (req, res) => {
  res.json({ 
    message: "API is running",
    environment: ENV_VARS.NODE_ENV
  });
});

// API Routes
app.use("/api/v1/auth", authRoutes);
app.use("/api/v1/movies", protectRoute, movieRoutes);
app.use("/api/v1/tv", protectRoute, tvRoutes);
app.use("/api/v1/search", protectRoute, searchRoutes);

// 404 handler
app.use((req, res) => {
  res.status(404).json({ message: "Route not found" });
});

// Global error handler
app.use((err, req, res, next) => {
  console.error('Error:', err);
  res.status(err.status || 500).json({
    message: err.message || 'Internal server error',
    error: ENV_VARS.NODE_ENV === 'development' ? err : {}
  });
});

// Server startup
const startServer = async () => {
  try {
    // Connect to database
    await connectDB();
    console.log('Connected to database successfully');

    // Start server
    app.listen(PORT, () => {
      console.log(`Server running in ${ENV_VARS.NODE_ENV} mode on port ${PORT}`);
      console.log(`CORS enabled for: ${app.get('cors').origin}`);
    });
  } catch (error) {
    console.error('Failed to start server:', error);
    process.exit(1);
  }
};

startServer();

export default app;