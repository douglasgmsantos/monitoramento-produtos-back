require('dotenv').config();

module.exports = {
    twilio: {
        accountSid: process.env.TWILIO_ACCOUNT_SID,
        authToken: process.env.TWILIO_AUTH_TOKEN,
        fromNumber: process.env.TWILIO_FROM_NUMBER
    },
    firebase: {
        databaseURL: process.env.FIREBASE_DATABASE_URL,
        serviceAccount: require('../../money-app-f9957-firebase-adminsdk-m4qtp-58214a8931.json'),
        // outras configurações do Firebase se necessário
    }
}; 