const axios = require("axios");
const cheerio = require("cheerio");

const logger = require('../../logger/logger');
const firebaseClient = require('../../clients/firebaseClient');
const AbstractProductAvailabilityService = require("../interface/IProductAvailabilityService");

class AmazonProductAvailabilityService extends AbstractProductAvailabilityService {
    constructor() {
        super();
    }

    setupAxios(){
        axios.defaults.timeout = 10000;
        axios.defaults.retry = 3;
        axios.defaults.retryDelay = 1000;
    }

    getPageDefault($){
        const withoutOptionsInImportance = !$.html().includes('Nenhuma opção de compra em destaque');
        const showAllOptions = !$.html().includes('Ver todas as opções de compra');
        return (withoutOptionsInImportance && showAllOptions);
    }

    getNoAvailable($){
        try {
            const result = $("#outOfStock > div > div > span.a-color-price")
                ?.text()
                ?.trim()
                ?.toUpperCase();
            return result;
        } catch (error) {
            logger.error(`Erro ao obter o disponibilidade do produto:`, error);
            return "NÃO DISPONÍVEL.";
        }
    }

    getPrice($){
        try {
            const whole = $("#corePrice_feature_div span.a-price-whole")?.first()?.text() || "0";
            const fraction = $("#corePrice_feature_div span.a-price-fraction")?.first()?.text() || "0";
            return parseFloat(`${whole}${fraction}`.replace(".", "").replace(",", "."));
        } catch (error) {
            logger.error(`Erro ao obter o preço do produto:`, error);
            return 0.0;
        }
    }

    getSendBy($){
        try {
            const result = $('#fulfillerInfoFeature_feature_div div.offer-display-feature-text span.offer-display-feature-text-message')
                ?.first()
                ?.text()
                ?.trim();
            return result || " - ";
        } catch (error) {
            logger.error(`Erro ao obter o remetente do produto:`, error);
            return " - ";
        }
    }

    getSoldBy($){
        try {
            const result = $('#merchantInfoFeature_feature_div div.offer-display-feature-text span.offer-display-feature-text-message')
                ?.first()
                ?.text()
                ?.trim();
            return result || " - ";
        } catch (error) {
            logger.error(`Erro ao obter o vendedor do produto:`, error);
            return " - ";
        }
    }

    async verifyPrice($){
        try {
            const noAvailablePrice = this.getNoAvailable($);
            if(noAvailablePrice === "NÃO DISPONÍVEL."){
                return false;
            }

            return true;
        } catch (error) {
            logger.error(`Erro ao verificar o preço do produto:`, error);
            return false;
        }
    }

    async checkAvailability(product) {
        try {
            const { data } = await axios.get(product.url);
            const $ = cheerio.load(data);
            
            const isAvailable = await this.verifyPrice($);
            
            if (!isAvailable) {
                return;
            }

            const isPageDefault = this.getPageDefault($);
            if(isPageDefault){
                await this.sendNotificationDefault($, product);
                return;
            }

        } catch (error) {
            logger.error(`Erro ao verificar disponibilidade do produto ${product.name}:`, error);
            await firebaseClient.saveLog(product.uid, product.name, product.url, "Erro");
            throw error;
        }
    }

    async sendNotificationDefault($, product){
        const { uid, name, url, maxPrice } = product;
        const soldBy = this.getSoldBy($);
        const sendBy = this.getSendBy($);
        const price = this.getPrice($);

        if(price > maxPrice){
            return;
        }

        await firebaseClient.saveProductAvailability(uid, name, url, price, soldBy, sendBy);
    }
}

module.exports = new AmazonProductAvailabilityService();