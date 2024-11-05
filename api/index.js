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

// Initially allow all origins in development
// app.use(cors({
// 	// origin: 'https://final-frontend-kohl.vercel.app',
//   origin: '*',
// 	methods: 'GET,HEAD,PUT,PATCH,POST,DELETE', // Allowed HTTP methods
// 	credentials: true, // Allow credentials if needed
//   }));

app.use(cors());

// app.use((req, res, next) => {
//   res.header("Access-Control-Allow-Origin", "*"); // Allow all origins
//   res.header("Access-Control-Allow-Methods", "GET,HEAD,PUT,PATCH,POST,DELETE"); // Allowed HTTP methods
//   res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept, Authorization"); // Allowed headers
//   next();
// });

app.use(express.json());
app.use(cookieParser());

// API Routes
app.use("/api/v1/auth", authRoutes);
app.use("/api/v1/movies", protectRoute, movieRoutes);
app.use("/api/v1/tv", protectRoute, tvRoutes);
app.use("/api/v1/search", protectRoute, searchRoutes);

// Health check route
app.get("/", (req, res) => {
  res.json({ message: "API is running" });
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
