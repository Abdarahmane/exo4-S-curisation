// index.js

import express from 'express';
import jwt from 'jsonwebtoken';

const app = express();
const PORT = 3000;


app.use(express.json());


const user = {
  email: 'test@example.com',
  password: 'password123', 
};


const JWT_SECRET = 'votre_secret_jwt';

// Route de connexion
app.post('/api/login', (req, res) => {
  const { email, password } = req.body;

  // Vérifiez les informations d'identification
  if (email === user.email && password === user.password) {
    // Générer le token JWT
    const token = jwt.sign({ email }, JWT_SECRET, { expiresIn: '1h' });
    return res.json({ token });
  } else {
    return res.status(401).json({ message: 'Identifiants invalides' });
  }
});

// Middleware pour vérifier le JWT
const authenticateToken = (req, res, next) => {
  const token = req.headers['authorization']?.split(' ')[1];

  if (!token) {
    return res.sendStatus(401); // Accès non autorisé
  }

  jwt.verify(token, JWT_SECRET, (err, user) => {
    if (err) {
      return res.sendStatus(403); // Accès interdit
    }
    req.user = user; 
    next(); 
  });
};

// Route protégée
app.get('/api/new-private-data', authenticateToken, (req, res) => {
  res.json({ message: 'Voici des données privées accessibles uniquement aux utilisateurs authentifiés.' });
});

// Démarrer le serveur
app.listen(PORT, () => {
  console.log(`Serveur démarré sur http://localhost:${PORT}`);
});
