const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const pool = require("../config/database");

exports.register = async (req, res) => {
  try {
    const { nom, prenom, email, password, telephone } = req.body;

    const exist = await pool.query("SELECT * FROM users WHERE email = $1", [
      email,
    ]);
    if (exist.rows.length > 0) {
      return res.status(400).json({ message: "Email déjà utilisé" });
    }

    const hashed = await bcrypt.hash(password, 10);

    const result = await pool.query(
      `INSERT INTO users (nom, prenom, email, password, telephone)
       VALUES ($1, $2, $3, $4, $5) RETURNING id, nom, prenom, email, telephone`,
      [nom, prenom, email, hashed, telephone],
    );

    res
      .status(201)
      .json({ message: "Inscription réussie", user: result.rows[0] });
  } catch (err) {
    res.status(500).json({ message: "Erreur serveur", error: err.message });
  }
};

exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    const result = await pool.query("SELECT * FROM users WHERE email = $1", [
      email,
    ]);
    if (result.rows.length === 0) {
      return res.status(400).json({ message: "Identifiants invalides" });
    }

    const user = result.rows[0];
    const valid = await bcrypt.compare(password, user.password);
    if (!valid)
      return res.status(400).json({ message: "Identifiants invalides" });


    const token = jwt.sign(
      {
        id: user.id,
        email: user.email,
        role: user.role, 
      },
      process.env.JWT_SECRET,
      { expiresIn: process.env.JWT_EXPIRES },
    );
    delete user.password;
    res.json({ message: "Connexion réussie", token, user });
  } catch (err) {
    res.status(500).json({ message: "Erreur serveur", error: err.message });
  }
};

exports.logout = async (req, res) => {
  res.json({ message: "Déconnexion réussie" });
};