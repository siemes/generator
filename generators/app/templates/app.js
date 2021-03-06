const r2base = require('r2base');
const r2middleware = require('r2middleware');
const r2mongoose = require('r2mongoose');
const r2acl = require('r2acl');
const r2query = require('r2query');
const r2plugin = require('r2plugin');
const r2system = require('r2system');
const r2user = require('r2user');
const r2nunjucks = require('r2nunjucks');
const r2s3sign = require('r2s3sign');
const r2i18n = require('r2i18n');
const r2admin = require('r2admin');
const r2resize = require('r2resize');
const cmsService = require('@siemes/core');
const bootService = require('./service/boot');

const app = r2base();
app.start()
  .serve(r2middleware)
  .serve(r2mongoose)
  .serve(r2acl)
  .serve(r2query)
  .serve(r2plugin)
  .serve(r2system)
  .serve(r2user)
  .serve(r2nunjucks)
  .serve(r2s3sign)
  .serve(r2i18n)
  .serve(bootService)
  .load('config/locales/model.js')
  .serve(cmsService)
  .serve(r2admin)
  .load('model')
  .load('discriminator')
  .load('middleware')
  .load('controller')
  .serve(r2resize)
  .load('routes.js')
  .load('service/sync.js')
  .listen();

module.exports = app;
