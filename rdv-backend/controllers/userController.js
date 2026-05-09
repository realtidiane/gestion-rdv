const pool = require("../config/database");

exports.getProfile = async (req, res) => {
  try {
    const r = await pool.query(
      "SELECT id, nom, prenom, email, telephone, photo FROM users WHERE id=$1",
      [req.user.id],
    );
    res.json(r.rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.updateProfile = async (req, res) => {
  try {
    const { nom, prenom, telephone, photo } = req.body;
    const r = await pool.query(
      `UPDATE users SET nom=$1, prenom=$2, telephone=$3, photo=$4 
       WHERE id=$5 RETURNING id, nom, prenom, email, telephone, photo`,
      [nom, prenom, telephone, photo, req.user.id],
    );
    res.json({ message: "Profil mis à jour", user: r.rows[0] });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.getAllUsers = async (req, res) => {
  try {
    const r = await pool.query(
      "SELECT id, nom, prenom, email, telephone, role, created_at FROM users ORDER BY created_at DESC"
    );
    res.json(r.rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.updateUserRole = async (req, res) => {
  try {
    const { role } = req.body;
    if (!["client", "admin"].includes(role)) {
      return res.status(400).json({ message: "Rôle invalide" });
    }
    const r = await pool.query(
      `UPDATE users SET role=$1 WHERE id=$2 RETURNING id, nom, prenom, email, role`,
      [role, req.params.id]
    );
    if (r.rows.length === 0) {
      return res.status(404).json({ message: "Utilisateur non trouvé" });
    }
    res.json({ message: "Rôle mis à jour", user: r.rows[0] });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.deleteUser = async (req, res) => {
  try {
    if (parseInt(req.params.id) === req.user.id) {
      return res.status(400).json({ message: "Vous ne pouvez pas vous supprimer" });
    }
    const r = await pool.query("DELETE FROM users WHERE id=$1 RETURNING id", [req.params.id]);
    if (r.rows.length === 0) {
      return res.status(404).json({ message: "Utilisateur non trouvé" });
    }
    res.json({ message: "Utilisateur supprimé" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
