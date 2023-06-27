import dotenv from 'dotenv';
import app from './src/app.js';

dotenv.config();
const port = process.env.PORT || 3001;

app.listen(port, () => {
  console.log(`Servidor CLIENTES escutando em http://localhost:${port}`);
});
