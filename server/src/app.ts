import express, { Request, Response } from 'express';

const app = express();

app.use((req: Request, res: Response, next) => {
  res.header('Access-Control-Allow-Origin', 'http://lcoalhost:3000');
  res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE');
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
  next();
});

app.listen(3000);

export default app;
