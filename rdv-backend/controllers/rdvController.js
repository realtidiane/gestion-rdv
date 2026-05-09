const pool = require("../config/database");

exports.create = async (req, res) => {
  try {
    const { service_id, date_rdv, heure_rdv, commentaire } = req.body;
    const user_id = req.user.id;

    const result = await pool.query(
      `INSERT INTO rendezvous (user_id, service_id, date_rdv, heure_rdv, commentaire)
       VALUES ($1, $2, $3, $4, $5) RETURNING *`,
      [user_id, service_id, date_rdv, heure_rdv, commentaire],
    );

    res.status(201).json({ message: "RDV créé", rdv: result.rows[0] });
  } catch (err) {
    res.status(500).json({ message: "Erreur", error: err.message });
  }
};

exports.getAll = async (req, res) => {
  try {
    // Auto-annuler les RDV en_attente dépassés (plus de 1h après l'heure prévue)
    await pool.query(
      `UPDATE rendezvous SET statut = 'annule'
       WHERE user_id = $1 AND statut = 'en_attente'
       AND (date_rdv < CURRENT_DATE OR (date_rdv = CURRENT_DATE AND heure_rdv < CURRENT_TIME - INTERVAL '1 hour'))`,
      [req.user.id]
    );

    const result = await pool.query(
      `SELECT r.*, s.nom AS service_nom 
       FROM rendezvous r
       LEFT JOIN services s ON r.service_id = s.id
       WHERE r.user_id = $1
       ORDER BY r.date_rdv DESC, r.heure_rdv DESC`,
      [req.user.id],
    );
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ message: "Erreur", error: err.message });
  }
};

exports.getOne = async (req, res) => {
  try {
    const result = await pool.query(
      "SELECT * FROM rendezvous WHERE id = $1 AND user_id = $2",
      [req.params.id, req.user.id],
    );
    if (result.rows.length === 0)
      return res.status(404).json({ message: "Non trouvé" });
    res.json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ message: "Erreur", error: err.message });
  }
};

exports.update = async (req, res) => {
  try {
    const { service_id, date_rdv, heure_rdv, commentaire, statut } = req.body;
    const result = await pool.query(
      `UPDATE rendezvous SET service_id=$1, date_rdv=$2, heure_rdv=$3, commentaire=$4, statut=$5
       WHERE id=$6 AND user_id=$7 RETURNING *`,
      [
        service_id,
        date_rdv,
        heure_rdv,
        commentaire,
        statut,
        req.params.id,
        req.user.id,
      ],
    );
    if (result.rows.length === 0)
      return res.status(404).json({ message: "Non trouvé" });
    res.json({ message: "RDV modifié", rdv: result.rows[0] });
  } catch (err) {
    res.status(500).json({ message: "Erreur", error: err.message });
  }
};

exports.remove = async (req, res) => {
  try {
    await pool.query("DELETE FROM rendezvous WHERE id=$1 AND user_id=$2", [
      req.params.id,
      req.user.id,
    ]);
    res.json({ message: "RDV annulé" });
  } catch (err) {
    res.status(500).json({ message: "Erreur", error: err.message });
  }
};

exports.removeAdmin = async (req, res) => {
  try {
    const r = await pool.query("DELETE FROM rendezvous WHERE id=$1 RETURNING id", [req.params.id]);
    if (r.rows.length === 0) {
      return res.status(404).json({ message: "RDV non trouvé" });
    }
    res.json({ message: "RDV supprimé" });
  } catch (err) {
    res.status(500).json({ message: "Erreur", error: err.message });
  }
};

exports.getAllAdmin = async (req, res) => {
  try {
    // Auto-annuler les RDV en_attente dépassés (plus de 1h après l'heure prévue)
    await pool.query(
      `UPDATE rendezvous SET statut = 'annule'
       WHERE statut = 'en_attente'
       AND (date_rdv < CURRENT_DATE OR (date_rdv = CURRENT_DATE AND heure_rdv < CURRENT_TIME - INTERVAL '1 hour'))`
    );

    const result = await pool.query(
      `SELECT r.*, s.nom AS service_nom, u.nom AS user_nom, u.prenom AS user_prenom, u.email AS user_email
       FROM rendezvous r
       LEFT JOIN services s ON r.service_id = s.id
       LEFT JOIN users u ON r.user_id = u.id
       ORDER BY r.date_rdv DESC, r.heure_rdv DESC`
    );
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ message: "Erreur", error: err.message });
  }
};

exports.updateStatut = async (req, res) => {
  try {
    const { statut } = req.body;
    const result = await pool.query(
      `UPDATE rendezvous SET statut=$1 WHERE id=$2 RETURNING *`,
      [statut, req.params.id]
    );
    if (result.rows.length === 0) {
      return res.status(404).json({ message: "RDV non trouvé" });
    }
    res.json({ message: "Statut mis à jour", rdv: result.rows[0] });
  } catch (err) {
    res.status(500).json({ message: "Erreur", error: err.message });
  }
};
