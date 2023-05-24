import app from './src/app.js';

const port = process.env.PORT || 3002;

app.listen(port, () => {
  console.log(`Servidor TRANSAÇÕES escutando em http://localhost:${port}`);
});
