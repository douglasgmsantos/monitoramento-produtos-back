class AbstractProductAvailabilityService {
    constructor() {
        if (this.constructor === AbstractProductAvailabilityService) {
            throw new Error('Abstract classes cannot be instantiated.');
        }
        this.setupAxios();
    }

    setupAxios() {
        throw new Error('Method setupAxios() must be implemented.');
    }

    getNoAvailable($){
        throw new Error('Method getNoAvailable() must be implemented.');
    }

    getPrice($){
        throw new Error('Method getPrice() must be implemented.');
    }

    getSendBy($){
        throw new Error('Method getSendBy() must be implemented.');
    }

    getSoldBy($){
        throw new Error('Method getSoldBy() must be implemented.');
    }

    async verifyPrice($, { uid, name, url }){
        try {
            const noAvailablePrice = this.getNoAvailable($);
            if(noAvailablePrice === "NÃO DISPONÍVEL."){
                await firebaseClient.saveNoAvailableProduct(uid, name, url);
            return false;
        }

            return true;
        } catch (error) {
            logger.error(`Erro ao verificar o preço do produto:`, error);
            return false;
        }
    }

    async checkAvailability(uid, name, url) {
        try {
            const { data } = await axios.get(url);
            const $ = cheerio.load(data);
            const isAvailable = await this.verifyPrice($, { uid, name, url });

            if (!isAvailable) {
                return;
            }

            const soldBy = this.getSoldBy($);
            const sendBy = this.getSendBy($);
            const price = this.getPrice($);

            await firebaseClient.saveProductAvailability(uid, name, url, price, soldBy, sendBy);
        } catch (error) {
            logger.error(`Erro ao verificar disponibilidade do produto ${name}:`, error);
            await firebaseClient.saveLog(uid, name, url, "Erro");
            throw error;
        }
    }
}

module.exports = AbstractProductAvailabilityService;