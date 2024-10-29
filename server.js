require('dotenv').config();
const express = require('express');
const server = express();
const admin = require('firebase-admin')
const cors = require('cors');
const bodyParser  = require('body-parser');
const serviceAccount = {
    type: process.env.TYPE, // Ajouté
    projectId: process.env.PROJECT_ID,
    privateKeyId: process.env.PRIVATE_KEY_ID, // Ajouté
    privateKey: process.env.PRIVATE_KEY.replace(/\\n/g, '\n'),
    clientEmail: process.env.CLIENT_EMAIL,
    clientId: process.env.CLIENT_ID, // Ajouté
    authUri: process.env.AUTH_URI, // Ajouté
    tokenUri: process.env.TOKEN_URI, // Ajouté
    authProviderX509CertUrl: process.env.AUTH_PROVIDER_X509_CERT_URL, // Ajouté
    clientX509CertUrl: process.env.CLIENT_X509_CERT_URL, // Ajouté
    universeDomain: process.env.UNIVERSE_DOMAIN // Ajouté
};
// ... existing code ...
server.use(bodyParser.json()); // Utiliser JSON pour les requêtes POST
server.use(cors({
    origin: 'http://localhost:3000',
    methods: 'GET, PUT, POST, DELETE, PATCH',
    credentials: true
  }));




admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
    databaseURL: "https://blog-86cd4.firebaseio.com"
  });
  const db = admin.firestore();
server.post('/api/add-article',async (req, res) => {
    const {title, content, author} = req.body;
    console.log(`Données reçu avec succès `);
   const sendData = await db.collection('article').add({
    title,
    content,
    author,
    createdAt: admin.firestore.FieldValue.serverTimestamp()  // Ajout d'une date de création automatique avec Firestore
   })
    res.status(200).json(sendData);
    console.log('Enregistré avec succès')
})
server.get('/api/get-article', async (req, res) => {
try {
    const snapshot = await db.collection('article').get();
    const articles = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
    }));
    res.status(200).json(articles);
} catch (error) {
    console.error('Erreur lors de la récupération des articles:', error);
    res.status(500).json({ error: 'Une erreur est survenue lors de la récupération des articles.' });
}
})



server.listen('6000',() => {
    console.log('Serveur web lancé sur http://localhost:6000');
} )