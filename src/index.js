import express from "express";
import dotenv from "dotenv";
import authRoutes from "./routes/authRoutes.js";
import questionRoutes from "./routes/questionRoutes.js";
import projectRoutes from "./routes/projectRoutes.js";
import investorRoutes from "./routes/investorRoutes.js";


dotenv.config();

const app = express();
app.use(express.json());

app.use("/api/questions", questionRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/projects", projectRoutes);
app.use("/api/investors", investorRoutes);




// serve pngs
app.use("/diagrams", express.static("src/storage/diagrams"));

app.use("/uploads", express.static("src/storage"));

import notificationRoutes from "./routes/notificationRoutes.js";
app.use("/api/notifications", notificationRoutes);



app.listen(5000, () => console.log("Server running on port 5000"));
