import React, { useState, useEffect } from 'react';
import axios from 'axios';

const CryptoConverter = () => {

  const [cryptos, setCryptos] = useState([]);
  const [sourceCrypto, setSourceCrypto] = useState('');
  const [amount, setAmount] = useState('');
  const [targetCurrency, setTargetCurrency] = useState('USD');
  const [convertedAmount, setConvertedAmount] = useState(null);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({
    sourceCrypto: '',
    amount: '',
    fetchError : ''
  });
  const [showSuccess, setShowSuccess] = useState(false);

  useEffect(() => {
    const fetchCryptos = async () => {
      try {
        const response = await axios.get('/api/cryptocurrencies');
        if(response.data && response.data.data) {
            setCryptos(response.data.data);
            setSourceCrypto(response.data.data[0]?.id || '');
        }
      } catch (error) {

        console.error(error);
        setErrors({
            ...errors,
            fetchError : 'Failed to fetch data...'
        })
      }
    };

    fetchCryptos();
  }, []);

  const handleConvert = () => {
    setErrors({
      sourceCrypto: '',
      amount: '',
    });
    setShowSuccess(false);
    setLoading(true);

    let isValid = true;

    if (!sourceCrypto) {
      setErrors((prevErrors) => ({
        ...prevErrors,
        sourceCrypto: 'Please select a source cryptocurrency.',
      }));
      isValid = false;
    }

    if (!amount || isNaN(amount) || parseFloat(amount) <= 0) {
      setErrors((prevErrors) => ({
        ...prevErrors,
        amount: 'Please enter a valid positive amount.',
      }));
      isValid = false;
    }

    if (!isValid) {
      setLoading(false);
      return;
    }

    axios
      .get(
        `/api/convert?sourceCrypto=${sourceCrypto}&amount=${amount}&targetCurrency=${targetCurrency}`
      )
      .then((response) => {
        setConvertedAmount(response.data.convertedAmount);
        setLoading(false);
        setShowSuccess(true);
        setTimeout(() => setShowSuccess(false), 1000);
      })
      .catch((error) => {
        console.error(error);
        setErrors({
            ...errors,
            fetchError : 'Failed to convert due to server error'
        });
        setTimeout(()=>{
            setErrors({
                ...errors,
                fetchError : ''
            },3000);
        });
        setLoading(false);
      });
  };

  const handleCryptoChange = (e) => {
    setErrors((prevErrors) => ({
      ...prevErrors,
      sourceCrypto: '',
    }));
    setSourceCrypto(e.target.value);
  };

  const handleAmountChange = (e) => {
    setErrors((prevErrors) => ({
      ...prevErrors,
      amount: '',
    }));
    setAmount(e.target.value);
  };

  return (
    <div className="App">
      <h1>Currency Converter</h1>
      <form>
        <div>{errors.fetchError}</div><br/>
        <div className="form-row">
          <div className="label-container">
            <label>Source Crypto</label>
            <select
              value={sourceCrypto}
              onChange={handleCryptoChange}
              className={errors.sourceCrypto && 'error'}
              disabled={loading}
            >
              <option value="" disabled>Select Source Crypto</option>
              {cryptos && cryptos.length && cryptos.map((crypto) => (
                <option key={crypto.id} value={crypto.id}>
                  {crypto.name}
                </option>
              ))}
            </select>
            {errors.sourceCrypto && (
              <div className="error-message">{errors.sourceCrypto}</div>
            )}
          </div>

          <div className="label-container">
            <label>Target Currency</label>
            <select
              value={targetCurrency}
              onChange={(e) => setTargetCurrency(e.target.value)}
              disabled={loading}
            >
              <option value="USD">USD</option>
              <option value="EUR">EUR</option>
              {/* Add more currencies as needed */}
            </select>
          </div>
        </div>

        <div className="label-container">
          <label>Amount</label>
          <div className="input-container">
            <input
              type="number"
              value={amount}
              onChange={handleAmountChange}
              className={errors.amount && 'error'}
              disabled={loading}
              min="0"
            />
            {errors.amount && <div className="error-message">{errors.amount}</div>}
          </div>
        </div>

        <div className="button-container">
          <button type="button" onClick={handleConvert} disabled={loading}>
            {loading ? 'Converting...' : 'Convert'}
          </button>
        </div>
      </form>

      {convertedAmount !== null && !showSuccess && (
        <div>
          <p>Converted Amount: {convertedAmount.toFixed(6)}</p>
        </div>
      )}
    </div>
  );
};

export default CryptoConverter;
