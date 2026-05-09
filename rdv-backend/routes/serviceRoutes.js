const express = require("express");
const router = express.Router();
const pool = require("../config/database");
const auth = require("../middlewares/authMiddleware");
const isAdmin = require("../middlewares/adminMiddleware");

/**
 * @swagger
 * /api/services:
 *   get:
 *     summary: Liste des services
 *     tags: [Services]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Liste des services
 */
router.get("/", auth, async (req, res) => {
  const r = await pool.query("SELECT * FROM services ORDER BY nom");
  res.json(r.rows);
});

/**
 * @swagger
 * /api/services:
 *   post:
 *     summary: Créer un service (admin)
 *     tags: [Services]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               nom: { type: string }
 *               description: { type: string }
 *               duree: { type: integer }
 *               prix: { type: number }
 *     responses:
 *       201:
 *         description: Service créé
 */
router.post("/", auth, isAdmin, async (req, res) => {
  try {
    const { nom, description, duree, prix } = req.body;
    const r = await pool.query(
      `INSERT INTO services (nom, description, duree, prix) VALUES ($1, $2, $3, $4) RETURNING *`,
      [nom, description, duree, prix]
    );
    res.status(201).json({ message: "Service créé", service: r.rows[0] });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

/**
 * @swagger
 * /api/services/{id}:
 *   put:
 *     summary: Modifier un service (admin)
 *     tags: [Services]
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
 *         description: Service modifié
 */
router.put("/:id", auth, isAdmin, async (req, res) => {
  try {
    const { nom, description, duree, prix } = req.body;
    const r = await pool.query(
      `UPDATE services SET nom=$1, description=$2, duree=$3, prix=$4 WHERE id=$5 RETURNING *`,
      [nom, description, duree, prix, req.params.id]
    );
    if (r.rows.length === 0) {
      return res.status(404).json({ message: "Service non trouvé" });
    }
    res.json({ message: "Service modifié", service: r.rows[0] });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

/**
 * @swagger
 * /api/services/{id}:
 *   delete:
 *     summary: Supprimer un service (admin)
 *     tags: [Services]
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
 *         description: Service supprimé
 */
router.delete("/:id", auth, isAdmin, async (req, res) => {
  try {
    const r = await pool.query("DELETE FROM services WHERE id=$1 RETURNING id", [req.params.id]);
    if (r.rows.length === 0) {
      return res.status(404).json({ message: "Service non trouvé" });
    }
    res.json({ message: "Service supprimé" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;