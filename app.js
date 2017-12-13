const express = require('express');
const path = require('path');
const favicon = require('serve-favicon');
const logger = require('morgan');
const bodyParser = require('body-parser');
const cors = require('cors');
const router = express.Router();

// Changer a config.prod quand déployer en production
const config = require('./app/config/config.dev');
process.env.NODE_ENV = config.environment;

// Set app
const app = express();

// set routes
/* const client = require('./app/routes/client')(router);
const devis = require('./app/routes/devis')(router);
const factureGlobal = require('./app/routes/factureGlobal')(router);
const factureAccompte = require('./app/routes/factureAccompte')(router);
const detailsDevis = require('./app/routes/detailsDevis')(router);
const reglement = require('./app/routes/reglement')(router);
const bug = require('./app/routes/bug')(router);
const mailHandler = require('./app/routes/mailHandler')(router);
const auth = require('./app/routes/authentication')(router, passport); */

// MIDDLEWARE
// log into console (dev)
app.use(logger('dev'));
// Log into file
// create a write stream (in append mode) 
//var accessLogStream = fs.createWriteStream(path.join(__dirname, 'server.log'), { flags: 'a' })
//app.use(logger('common', { stream: accessLogStream }))
// Favicon
app.use(favicon(path.join(__dirname, config.favicon_path, config.favicon)));
// Allows cross origin in development only
// config.cors_origin = '' in production mode
if (config.cors_origin !== '') {
    app.use(cors(config.cors_origin));
}
// body-parser
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
// Passport authenticate
app.use(passport.initialize());
// Set Static Folder
app.use(express.static(path.join(__dirname, config.static_path)));

// use routes
app.use('/api', client);
app.use('/api', devis);
app.use('/api', factureGlobal);
app.use('/api', factureAccompte);
app.use('/api', detailsDevis);
app.use('/api', reglement);
app.use('/api', bug);
app.use('/api/auth', auth);
app.use('/api/mail', mailHandler);

// allow to refresh page
// send back to dist/index.html
app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, config.static_path, config.static_file));
});

module.exports = app;