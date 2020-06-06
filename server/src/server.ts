import express from 'express';
import path from 'path';
import routes from './routes';

const app = express();

//habilita a interpretação do formato json pelo 'app'
app.use(express.json());

//usa as rotas importadas de routes.ts
app.use(routes);

app.use('/uploads', express.static(path.resolve(__dirname,'..', 'uploads')));

app.listen(3333);