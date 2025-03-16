const admin = require('firebase-admin');
const config = require('../config/config');

class FirebaseClient {
    constructor() {
        admin.initializeApp({
            credential: admin.credential.cert(config.firebase.serviceAccount),
            databaseURL: config.firebase.databaseURL
        });
        this.db = admin.database();
    }

    getProductByUser(uid) {
        return this.db.ref('products').child(uid);
    }

    async saveProductAvailability(uid, productName, productUrl, price, soldBy, sendBy) {
        const notificationsRef = this.db.ref('notifications');
        
        // Gerar um novo ID único
        const newNotificationRef = notificationsRef.push();
        const notificationId = newNotificationRef.key;
        
        await notificationsRef.child(uid).child("products").child(notificationId).set({
            id: notificationId,
            productName: productName,
            status: "Disponível",
            price: price,
            soldBy: soldBy,
            sendBy: sendBy,
            productLink: productUrl,
            createdAt: new Date().toISOString()
        });
    }

    async saveNoAvailableProduct(uid, productName, productUrl) {
        const notificationsRef = this.db.ref('notifications');
        
        // Gerar um novo ID único
        const newNotificationRef = notificationsRef.push();
        const notificationId = newNotificationRef.key;

        await notificationsRef.child(uid).child("products").child(notificationId).set({
            id: notificationId,
            productName: productName,
            status: "Não disponível",
            price: 0,
            soldBy: ' - ',
            sendBy: ' - ',
            productLink: productUrl,
            createdAt: new Date().toISOString()
        });
    }

    async saveLog(uid, productName, productUrl, status) {
        const notificationsRef = this.db.ref('notifications');
        
        // Gerar um novo ID único
        const newNotificationRef = notificationsRef.push();
        const notificationId = newNotificationRef.key;
        
        await notificationsRef.child(uid).child("products").child(notificationId).set({
            id: notificationId,
            productName: productName,
            status: status,
            price: 0,
            soldBy: ' - ',
            sendBy: ' - ',
            productLink: productUrl,
            createdAt: new Date().toISOString()
        });
    }
}

module.exports = new FirebaseClient(); 