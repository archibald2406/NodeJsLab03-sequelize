const express = require('express');
const bodyParser = require('body-parser');
const createError = require('http-errors');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const db = require('./connection');

db.authenticate()
  .then(() => console.log('Database connected.'))
  .catch(err => console.log(`Err: ${err}`));

const app = express();
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());

let healthCheck;

app.listen(3000, () => {
  console.log('Server started at port: 3000');
  healthCheck = new Date();
});

// db.sync({force:true}).then(()=>{
//   console.log("Tables have been created");
// }).catch(err=>console.log(err));

app.use('/drivers', require('./routes/driver-CRUD'));
app.use('/routes', require('./routes/route-CRUD'));

app.all('/health-check',(req, res) => {
  res.setHeader('Server-start-time', `${healthCheck}`);
  res.setHeader('Time-of-last-request', `${new Date()}`);
  res.setHeader('Server-work-duration', `${new Date().getTime() - healthCheck.getTime()} ms`);
  res.send();
});
app.all('/**', (req, res) => {
  res.writeHead(404,'Route not found.');
  res.end();
});

app.use((req, res, next) => {
  next(createError(404));
});

app.use((err, req, res, next) => {
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};
  res.status(err.status || 500);
});