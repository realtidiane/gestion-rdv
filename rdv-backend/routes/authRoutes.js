const express = require("express");
const router = express.Router();
const auth = require("../middlewares/authMiddleware");
const { register, login, logout } = require("../controllers/authController");

/**
 * @swagger
 * /api/auth/register:
 *   post:
 *     summary: Inscription utilisateur
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               nom: { type: string }
 *               prenom: { type: string }
 *               email: { type: string }
 *               password: { type: string }
 *               telephone: { type: string }
 *     responses:
 *       201:
 *         description: Inscription réussie
 *       400:
 *         description: Email déjà utilisé
 */
router.post("/register", register);

/**
 * @swagger
 * /api/auth/login:
 *   post:
 *     summary: Connexion utilisateur
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email: { type: string }
 *               password: { type: string }
 *     responses:
 *       200:
 *         description: Connexion réussie
 *       400:
 *         description: Identifiants invalides
 */
router.post("/login", login);

/**
 * @swagger
 * /api/auth/logout:
 *   post:
 *     summary: Déconnexion utilisateur
 *     tags: [Auth]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Déconnexion réussie
 */
router.post("/logout", auth, logout);

module.exports = router;
