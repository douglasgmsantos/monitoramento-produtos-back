const express = require('express');
const router = express.Router();
const availabilityCheckJob = require('../../jobs/availabilityCheckJob');

router.get('/:uid', async (req, res) => {
    try {
        await availabilityCheckJob.execute(req.params.uid);
        res.status(200).json({ message: 'Leitura de produtos executada com sucesso' });
    } catch (error) {
        res.status(500).json({ error: 'Erro ao executar leitura de produtos' });
    }
});

module.exports = router;