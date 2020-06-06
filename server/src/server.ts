import express from 'express';
import routes from './routes';

const app = express();

//habilita a interpretação do formato json pelo 'app'
app.use(express.json());

//usa as rotas importadas de routes.ts
app.use(routes);

app.listen(3333);