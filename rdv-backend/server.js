const express = require("express");
const cors = require("cors");
require("dotenv").config();
const swaggerUi = require("swagger-ui-express");
const swaggerDocument = require("./config/swagger");

const authRoutes = require("./routes/authRoutes");
const userRoutes = require("./routes/userRoutes");
const rdvRoutes = require("./routes/rdvRoutes");
const serviceRoutes = require("./routes/serviceRoutes");

const app = express();

app.use(cors({
  origin: '*',
  methods: 'GET,POST,PUT,DELETE,OPTIONS',
  allowedHeaders: 'Content-Type,Authorization'
}));
app.use(express.json());

app.get("/", (req, res) => res.send("API Gestion RDV "));

app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes);
app.use("/api/rendezvous", rdvRoutes);
app.use("/api/services", serviceRoutes);

app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerDocument));

const PORT = process.env.PORT || 5000;
app.listen(PORT, '0.0.0.0', () => console.log(`Serveur démarré sur le port ${PORT}`));
