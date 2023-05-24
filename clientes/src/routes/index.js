import express from 'express';
import fs from 'fs';
import swaggerUi from 'swagger-ui-express';
import YAML from 'yaml';

import accounts from './accountsRoutes.js';

const file = fs.readFileSync('src/swagger/clientes.yaml', 'utf8');
const swaggerDocument = YAML.parse(file);

const routes = (app) => {
  app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));

  app.route('/').get((_, res) => {
    res.status(200).send({ titulo: 'Clientes API' });
  });

  app.use(
    express.json(),
    accounts,
  );
};

export default routes;
