const express = require("express");
const server = express();
const sqlite3 = require("sqlite3").verbose();
const cors = require("cors");
const sequelize = require("./config/database");

const logger = require("./logger");
const verifyAdmin = require("./middlewares/verifyAdmin");

const authRoutes = require("./routes/auth.routes");
const adminRoutes = require("./routes/admin.routes");
const userRoutes = require("./routes/user.routes");

server.use(express.json());
server.use(cors());

server.get("/", (req, res) => {
  res.send("Hello from your Express API!");
});

// Séparation de routes
server.use("/auth/", authRoutes);
server.use("/admin/", verifyAdmin.isAdmin, adminRoutes);
server.use("/user/", userRoutes);

// Le serveur écoute les requests
sequelize.sync().then(() => {
  server.listen(process.env.PORT || 4554, function () {
    logger.debug(`Server is running`);
  });
});
