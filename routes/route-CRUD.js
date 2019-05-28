const {isRoute} = require('../validators/driver-and-route');
const express = require('express');
const Route = require('../models/route');
const Driver = require('../models/driver');
const DriverAndRoute = require('../models/driverAndRoute');
const moment = require('moment');
const Op = require('sequelize').Op;

const router = express.Router();

router.get('/', (req, res) => {
  Route.findAll({limit: parseInt(req.query.limit) || 10, offset: parseInt(req.query.offset) || 0})
    .then(result => {
      res.json(result);
    })
    .catch(err => console.log(err));
});

router.post('/', (req, res) => {
  if (isRoute(req.body)) {
    Route.create({
      title: req.body.title,
      time: req.body.time
    }).then(result => {
      res.json(result);
    })
      .catch(err => console.log(err));
  } else {
    res.writeHead(500,'Invalid data in request.');
    res.end();
  }
});

router.get('/:id', (req, res) => {
  Route.findByPk(req.params.id)
    .then(result => {
      if (result) res.json(result);
      else {
        res.writeHead(404,'Record not found.');
        res.end();
      }
    })
    .catch(err => console.log(err));
});

router.put('/:id', (req, res) => {
  if (isRoute(req.body)) {
    Route.update({
      title: req.body.title,
      time: req.body.time
    },
    {
      where: {
        id: req.params.id
      }
    }).then(() => {
      res.send('Table successfully updated.');
    })
      .catch(err => console.log(err));
  } else {
    res.writeHead(500,'Invalid data in request.');
    res.end();
  }
});

router.delete('/:id', (req, res) => {
  Route.destroy({
    where: {
      id: req.params.id
    }
  }).then(result => {
      if (result) {
        res.send('Deleted successfully.');
      } else {
        res.writeHead(404,'Record not found.');
        res.end();
      }
    })
    .catch(err => console.log(err));
});

router.get('/:id/drivers', (req, res) => {
  Driver.findAll({
    raw: true,
    include: [{
      model: DriverAndRoute,
      where: { routessId: req.params.id }
    }]
  }).then(result => {
    if (result) res.json(result);
    else {
      res.writeHead(404,'Record not found.');
      res.end();
    }
  })
    .catch(err => console.log(err));
});

router.get('/:id/drivers-last-month', (req, res) => {
  Driver.findAll({
    raw: true,
    include: [{
      model: DriverAndRoute,
      where: {
        routessId: req.params.id,
        dateOfRecording: {
          [Op.gte]: moment().subtract(1, 'month').toDate()
        }
      }
    }]
  }).then(result => {
    if (result) res.json(result);
    else {
      res.writeHead(404,'Record not found.');
      res.end();
    }
  })
    .catch(err => console.log(err));
});

module.exports = router;