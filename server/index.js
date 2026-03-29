const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const fileUpload = require("express-fileupload");
require("dotenv").config();

const app = express();

const allowedOrigins = (process.env.CLIENT_URL || "http://localhost:3000")
  .split(",")
  .map((origin) => origin.trim())
  .filter(Boolean);

app.use(
  cors({
    origin(origin, callback) {
      if (!origin) return callback(null, true);

      const isDirectAllow = allowedOrigins.includes(origin);
      let isVercelPreview = false;
      try {
        isVercelPreview = /\.vercel\.app$/i.test(new URL(origin).hostname);
      } catch {
        isVercelPreview = false;
      }

      if (isDirectAllow || isVercelPreview) {
        return callback(null, true);
      }

      return callback(new Error("CORS blocked for origin: " + origin));
    },
    credentials: true,
  }),
);
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(fileUpload({ useTempFiles: true, tempFileDir: "/tmp/" }));

app.use("/api/auth", require("./routes/authRoutes"));
app.use("/api/users", require("./routes/userRoutes"));
app.use("/api/sessions", require("./routes/sessionRoutes"));
app.use("/api/modules", require("./routes/moduleRoutes"));
app.use("/api/need-analysis", require("./routes/needAnalysisRoutes"));
app.use("/api/scholarship-applications", require("./routes/scholarshipRoutes"));
app.use("/api/admin", require("./routes/adminRoutes"));

app.get("/", (req, res) => res.json({ message: "MentorLink API running!" }));

mongoose
  .connect(process.env.MONGO_URI)
  .then(() => {
    console.log("Jk MongoDB Connected");
    app.listen(process.env.PORT || 5000, () =>
      console.log(`Jk Server running on port ${process.env.PORT || 5000}`),
    );
  })
  .catch((err) => console.log("❌ DB Error:", err));
