const API_KEY = 'f0aa80f7-3235-4501-898e-caf4b921019e';
const axios = require('axios');

module.exports = {
    getCurrencies : async (req,res) => {
        try {
          const response = await axios.get('https://pro-api.coinmarketcap.com/v1/cryptocurrency/listings/latest?start=1&limit=100&convert=USD', {
            headers: {
              'X-CMC_PRO_API_KEY': API_KEY,
            },
          });
          const topCryptos = response.data; 
          return res.json(topCryptos);
        } catch (error) {
          console.error(error);
          res.status(500).json({ error: 'Internal Server Error' });
        }
    },
    convertCurrency : async (req, res)=> {
        const { sourceCrypto, amount, targetCurrency } = req.query;
        try {
          const response = await axios.get(`https://pro-api.coinmarketcap.com/v1/cryptocurrency/quotes/latest?id=${sourceCrypto}&convert=${targetCurrency}`, {
              headers: {
                'X-CMC_PRO_API_KEY': API_KEY,
              },
            });
          const exchangeRates = response.data;
          if(response 
            && response.data 
            && exchangeRates.data[sourceCrypto] 
            && exchangeRates.data[sourceCrypto]['quote'] 
            && exchangeRates.data[sourceCrypto]['quote'][targetCurrency]){
      
              const exchangeRate = exchangeRates.data[sourceCrypto]['quote'][targetCurrency].price;
              const convertedAmount = amount * exchangeRate; 
              res.json({ convertedAmount });
          }else{
            res.status(500).json({ error: 'Unable to fetch exchange rate in api.' });
          }
        } catch (error) {
          console.error(error);
          res.status(500).json({ error: 'Internal Server Error' });
        }
    }
}