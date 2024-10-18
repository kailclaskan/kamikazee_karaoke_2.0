"use strict";

const express = require("express");
const cors = require("cors");

//const { authenticateJWT } = require("./middleware/auth")

const songRoutes = require("./routes/songs");
//const userRoutes = require("./routes/users");
//const favoriteRoutes = require("./routes/favorites");

const morgan = require("morgan");

const app = express();

app.use(cors());
app.use(express.json());
app.use(morgan("tiny"));
//app.use(authenticateJWT);

app.use("/songs", songRoutes);
// app.use("/users", userRoutes);
// app.use("/favorites", favoriteRoutes);

app.use((err, req, res, next) => {
    if(process.env.NODE_ENV === "test") console.error(err.stack);
    const status = err.status || 500;
    const message = err.message;
    return res.status(status).json({
        error: {message, status}
    });
});

module.exports = app;