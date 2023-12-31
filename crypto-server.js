
const express = require('express');
const app = express();
const PORT = process.env.PORT || 3001;
const path = require('path');
const { initRoutes }  = require('./routes/init-routes');

initRoutes(app);

app.use(express.static(path.join(__dirname, 'frontend/build')));

app.get('/*', function (req, res) {
  res.sendFile(path.join(__dirname, 'frontend/build', 'index.html'));
});

app.listen(PORT, () => {
  console.log(`Crypto Currency server is running on port ${PORT}`);
});


