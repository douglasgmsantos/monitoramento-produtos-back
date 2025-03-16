const express = require('express');
const productRoutes = require('./routes/productRoutes');

const app = express();

app.use(express.json());
app.use('/', productRoutes);

const PORT = process.env.PORT || 4444;

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});

module.exports = app; 