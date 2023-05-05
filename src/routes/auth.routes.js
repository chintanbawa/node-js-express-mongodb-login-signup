// controllers
const authController = require('../controllers/auth.controller');
const { authJwt } = require('../middlewares');

module.exports = function (app) {
  app.use(function (req, res, next) {
    res.header('Access-Control-Allow-Headers', 'Origin, Content-Type, Accept');
    next();
  });

  app.post('/api/v1/auth/signup', authController.signup);

  app.post('/api/v1/auth/signin', authController.signin);

  app.post('/api/v1/auth/signout', authJwt.verifyToken, authController.signout);

  app.post('/api/v1/auth/signout-all', authJwt.verifyToken, authController.signoutAll);
};
