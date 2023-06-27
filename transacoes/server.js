import dotenv from 'dotenv';
import app from './src/app.js';

dotenv.config();
const port = process.env.PORT || 3002;

app.listen(port, () => {
  console.log(`Servidor TRANSAÇÕES escutando em http://localhost:${port}`);
});
