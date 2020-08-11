import express, { request, response } from 'express';
import ClassesController from './controllers/ClassesController';
import ConnectionController from './controllers/ConnectionController';

const routes = express.Router();

const classControllers = new ClassesController();
const connectionController= new ConnectionController();

routes.post('/classes', classControllers.create);
routes.get('/classes', classControllers.index);

routes.post('/connections', connectionController.create);
routes.get('/connections', connectionController.index);

export default routes;