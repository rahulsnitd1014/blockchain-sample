'use strict';
import express, {NextFunction, Application} from 'express';
import compression from 'compression'; // compresses requests
import bodyParser from 'body-parser';
import dotenv from 'dotenv';
// Load environment variables from .env file, where API keys and passwords are configured
dotenv.config({path: '.env'});
import path from 'path';
import helmet from 'helmet';
import cors from 'cors';
import morgan from 'morgan';
import errorHandler from 'errorhandler';

import ApiRouter from './router';
import {sendResponse} from './util/helper';
import {HttpResponse, HttpRequest} from './util/interfaces';

// Create Express server
const app: Application = express();

// Express configuration
app.use(helmet());
app.use(morgan('dev'));
app.use(compression());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));
app.use(errorHandler());
app.use(express.static(path.join(__dirname, 'fraud-user')));
app.use(function (req: HttpRequest, res: HttpResponse, next: NextFunction) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', '*');
  res.setHeader(
    'Access-Control-Allow-Headers',
    'X-Requested-With,content-type, Authorization'
  );
  next();
});
app.options('*', cors());
app.use(function (req: HttpRequest, res: HttpResponse, next: NextFunction) {
  res.sendResponse = sendResponse;
  next();
});

// Use API Router
ApiRouter(app);

// catch 404 and forward to error handler
app.use(function (req: HttpRequest, res: HttpResponse, next: NextFunction) {
  const err = new Error('Not Found');
  (<any>err).status = 404;
  next(err);
});

// error handler
app.use(function (
  err: Error,
  req: HttpRequest,
  res: HttpResponse,
  next: NextFunction
) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // send the error
  res.status((<any>err).status || 500);
  res.send('error');
});

export default app;
