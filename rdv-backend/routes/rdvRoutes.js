const express = require("express");
const router = express.Router();
const auth = require("../middlewares/authMiddleware");
const isAdmin = require("../middlewares/adminMiddleware");
const ctrl = require("../controllers/rdvController");

router.use(auth);

/**
 * @swagger
 * /api/rendezvous:
 *   post:
 *     summary: Créer un rendez-vous
 *     tags: [Rendez-vous]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               service_id: { type: integer }
 *               date_rdv: { type: string, format: date }
 *               heure_rdv: { type: string }
 *               commentaire: { type: string }
 *     responses:
 *       201:
 *         description: RDV créé
 */
router.post("/", ctrl.create);

/**
 * @swagger
 * /api/rendezvous:
 *   get:
 *     summary: Liste des rendez-vous utilisateur
 *     tags: [Rendez-vous]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Liste des RDV
 */
router.get("/", ctrl.getAll);

/**
 * @swagger
 * /api/rendezvous/{id}:
 *   get:
 *     summary: Obtenir un rendez-vous
 *     tags: [Rendez-vous]
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
 *         description: RDV trouvé
 */
router.get("/:id", ctrl.getOne);

/**
 * @swagger
 * /api/rendezvous/{id}:
 *   put:
 *     summary: Modifier un rendez-vous
 *     tags: [Rendez-vous]
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
 *               service_id: { type: integer }
 *               date_rdv: { type: string }
 *               heure_rdv: { type: string }
 *               commentaire: { type: string }
 *               statut: { type: string }
 *     responses:
 *       200:
 *         description: RDV modifié
 */
router.put("/:id", ctrl.update);

/**
 * @swagger
 * /api/rendezvous/{id}:
 *   delete:
 *     summary: Supprimer un rendez-vous
 *     tags: [Rendez-vous]
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
 *         description: RDV supprimé
 */
router.delete("/:id", ctrl.remove);

/**
 * @swagger
 * /api/rendezvous/admin/all:
 *   get:
 *     summary: Liste tous les rendez-vous (admin)
 *     tags: [Admin]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Liste complète des RDV
 */
router.get("/admin/all", auth, isAdmin, ctrl.getAllAdmin);

/**
 * @swagger
 * /api/rendezvous/admin/{id}/statut:
 *   put:
 *     summary: Modifier le statut d'un RDV (admin)
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
 *               statut: { type: string }
 *     responses:
 *       200:
 *         description: Statut mis à jour
 */
router.put("/admin/:id/statut", auth, isAdmin, ctrl.updateStatut);

/**
 * @swagger
 * /api/rendezvous/admin/{id}:
 *   delete:
 *     summary: Supprimer un RDV (admin)
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
 *         description: RDV supprimé
 */
router.delete("/admin/:id", auth, isAdmin, ctrl.removeAdmin);

module.exports = router;