
const cryptoController = require('../controllers/crypto-controller');

const initRoutes = (app) => {
    app.get('/api/cryptocurrencies', cryptoController.getCurrencies)
    app.get('/api/convert',cryptoController.convertCurrency)
}


module.exports = {
    initRoutes
};