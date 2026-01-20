import express from "express";
import dotenv from "dotenv";
import authRoutes from "./routes/authRoutes.js";
import questionRoutes from "./routes/questionRoutes.js";
import path from "path";
import projectRoutes from "./routes/projectRoutes.js";
import notificationRoutes from "./routes/notificationRoutes.js";
import investorRoutes from "./routes/investorRoutes.js";


dotenv.config();

const app = express();
app.use(express.json());

app.use("/api/questions", questionRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/projects", projectRoutes);
app.use("/api/investors", investorRoutes);




const __dirname = path.resolve();

// serve pngs (ABSOLUTE PATH)
app.use(
  "/diagrams",
  express.static(path.join(__dirname, "src/storage/diagrams"))
);


app.use("/uploads", express.static("src/storage"));

app.use("/api/notifications", notificationRoutes);



app.listen(8027, () => console.log("Server running on port 8027"));
