const {isDriver} = require('../validators/driver-and-route');
const express = require('express');
const Route = require('../models/route');
const Driver = require('../models/driver');
const DriverAndRoute = require('../models/driverAndRoute');
const moment = require('moment');

const router = express.Router();

router.get('/', (req, res) => {
  Driver.findAll({limit: parseInt(req.query.limit) || 10, offset: parseInt(req.query.offset) || 0})
    .then(result => {
      res.json(result);
    }).catch(err => console.log(err));
});

router.post('/', (req, res) => {
  if (isDriver(req.body)) {
    Driver.create({
      name: req.body.name,
      surname: req.body.surname
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
  Driver.findByPk(req.params.id)
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
  if (isDriver(req.body)) {
    Driver.update({
        name: req.body.name,
        surname: req.body.surname
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
  Driver.destroy({
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

router.get('/:id/routes', (req, res) => {
  Route.findAll({
    raw: true,
    include: [{
      model: DriverAndRoute,
      where: { driverssId: req.params.id }
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

router.put('/:driverId/routes/:routeId', (req, res) => {
  DriverAndRoute.findAll({
    where: {
      driverssId: req.params.driverId,
      routessId: req.params.routeId
    }
  }).then((record) => {
    if (!record.length) {
      Driver.findByPk(req.params.driverId)
        .then(driver => {
          if (driver && driver.dataValues.totalHours < 20) {
            Route.findByPk(req.params.routeId)
              .then(route => {
                if (route && (route.dataValues.time + driver.dataValues.totalHours <= 20)) {
                  DriverAndRoute.create({
                    driverssId: req.params.driverId,
                    routessId: req.params.routeId,
                    dateOfRecording: moment(new Date()).format('YYYY-MM-DD')
                  }).then(() => {
                    Driver.update({
                        totalHours: route.dataValues.time + driver.dataValues.totalHours
                      },
                      {
                        where: {
                          id: req.params.driverId
                        }
                      }).then(() => {
                      res.send('1 record successfully inserted.');
                    }).catch(err => console.log(err));
                  }).catch(err => console.log(err));
                } else {
                  res.writeHead(404,'Route not found or Driver does not have enough time to write on this route.');
                  res.end();
                }
              }).catch(err => console.log(err));
          } else {
            res.writeHead(404,'Driver not found or Driver has reached the maximum number of hours.');
            res.end();
          }
        }).catch(err => console.log(err));
    } else {
      res.writeHead(500, {'Message': 'Driver is already on this route.'});
      res.end();
    }
  }).catch(err => console.log(err));
});

router.delete('/:driverId/routes/:routeId', (req, res) => {
  DriverAndRoute.findAll({
    where: {
      driverssId: req.params.driverId,
      routessId: req.params.routeId
    }
  }).then((record) => {
    if (record.length) {
      Driver.findByPk(req.params.driverId)
        .then(driver => {
          Route.findByPk(req.params.routeId)
            .then(route => {
              DriverAndRoute.destroy({
                where: {
                  driverssId: req.params.driverId,
                  routessId: req.params.routeId
                }
              }).then(() => {
                Driver.update({
                    totalHours: driver.dataValues.totalHours - route.dataValues.time
                  },
                  {
                    where: {
                      id: req.params.driverId
                    }
                  }).then(() => {
                  res.send('Deleted successfully.');
                }).catch(err => console.log(err));
              }).catch(err => console.log(err));
            }).catch(err => console.log(err));
        }).catch(err => console.log(err));
    } else {
      res.writeHead(404, {'Message': 'Driver is not recorded for this route.'});
      res.end();
    }
  }).catch(err => console.log(err));
});

module.exports = router;