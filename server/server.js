const express = require("express");
const app = express();
const cors = require("cors");
require("dotenv").config();
const bodyparser = require("body-parser");
require("./db/connection.js");
const router = require("./router/router");

const CLIENT_URL =
  process.env.NODE_ENV === "production"
    ? "https://plexify-chi.vercel.app"
    : "http://localhost:3000";

// Add ngrok URL to allowed origins
const allowedOrigins = [
  CLIENT_URL,
  "https://db86-223-177-191-179.ngrok-free.app"
];

app.use(
  cors({
    origin: (origin, callback) => {
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        callback(new Error("Not allowed by CORS"));
      }
    },
    credentials: true,
  })
);

app.use(express.json());
app.use(bodyparser.urlencoded({ extended: true }));
app.use("/uploads", express.static("uploads"));
app.use("/", router);

app.listen(process.env.PORT || 8787, () => {
  console.log(`Server running on port ${process.env.PORT || 8787}`);
});
