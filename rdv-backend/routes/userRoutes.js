const express = require("express");
const router = express.Router();
const auth = require("../middlewares/authMiddleware");
const isAdmin = require("../middlewares/adminMiddleware");
const { getProfile, updateProfile, getAllUsers, updateUserRole, deleteUser } = require("../controllers/userController");

/**
 * @swagger
 * /api/users/profile:
 *   get:
 *     summary: Obtenir le profil utilisateur
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Profil utilisateur
 */
router.get("/profile", auth, getProfile);

/**
 * @swagger
 * /api/users/profile:
 *   put:
 *     summary: Modifier le profil utilisateur
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               nom: { type: string }
 *               prenom: { type: string }
 *               telephone: { type: string }
 *               photo: { type: string }
 *     responses:
 *       200:
 *         description: Profil mis à jour
 */
router.put("/profile", auth, updateProfile);

/**
 * @swagger
 * /api/users/admin/users:
 *   get:
 *     summary: Liste tous les utilisateurs (admin)
 *     tags: [Admin]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Liste des utilisateurs
 */
router.get("/admin/users", auth, isAdmin, getAllUsers);

/**
 * @swagger
 * /api/users/admin/users/{id}/role:
 *   put:
 *     summary: Modifier le rôle d'un utilisateur (admin)
 *     tags: [Admin]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     requestBody:
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               role: { type: string, enum: [client, admin] }
 *     responses:
 *       200:
 *         description: Rôle mis à jour
 */
router.put("/admin/users/:id/role", auth, isAdmin, updateUserRole);

/**
 * @swagger
 * /api/users/admin/users/{id}:
 *   delete:
 *     summary: Supprimer un utilisateur (admin)
 *     tags: [Admin]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Utilisateur supprimé
 */
router.delete("/admin/users/:id", auth, isAdmin, deleteUser);

module.exports = router;