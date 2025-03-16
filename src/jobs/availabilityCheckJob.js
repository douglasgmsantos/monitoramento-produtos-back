const logger = require('../logger/logger');
const amazonProductAvailabilityService = require('../services/store/amazon');
const firebaseClient = require('../clients/firebaseClient');

class AvailabilityCheckJob {
    async execute(uid) {
        try {
            logger.info('Iniciando tarefa agendada');
            const productAvailability = firebaseClient.getProductByUser(uid);
            let products = []

            await productAvailability.once('value').then((snapshot) => {
              const data = snapshot.val();
              if (data) {
                Object.keys(data).forEach((productId) => {
                  const product = data[productId];
                  products.push({ ...product, uid });
                });
              }
            });
      
            const promises = products.map((product) => {
              if(product.soldBy.toLowerCase().trim() === 'amazon'){
                return amazonProductAvailabilityService.checkAvailability(product.uid, product.name, product.url);
              }
              return Promise.resolve();
            });

            await Promise.all(promises);
            logger.info('Tarefa agendada concluída com sucesso');
        } catch (error) {
            logger.error('Erro na tarefa agendada:', error);
        }
    }
}

module.exports = new AvailabilityCheckJob(); 