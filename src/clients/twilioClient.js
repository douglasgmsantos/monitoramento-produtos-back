const config = require('../config/config');

class TwilioClient {
    constructor() {
        this.client = require("twilio")(config.twilio.accountSid, config.twilio.authToken);
        this.fromNumber = config.twilio.fromNumber;
    }

    async sendMessage(to, body) {
        return this.client.messages.create({
            from: this.fromNumber,
            to: `whatsapp:${to}`,
            body
        });
    }

    async sendBulkMessages(phones, body) {
        return Promise.all(phones.map(phone => this.sendMessage(phone, body)));
    }
}

module.exports = new TwilioClient(); 