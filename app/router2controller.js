const fs = require('fs');
const router = require('koa-router')();
const koaBody = require('koa-body');
const logger = require('./common/logger');
const config = require('../config/config.local.js');

function addMapping(route, mapping) {
  let path = '';
  for (const url in mapping) {
    if (url.startsWith('GET ')) {
      path = url.substring(4);
      route.get(path, koaBody(), mapping[url]);
      // eslint-disable-next-line no-console
      console.log(`register URL mapping: GET ${path}`);
    } else if (url.startsWith('POST ')) {
      path = url.substring(5);
      route.post(path, koaBody({ multipart: true }), mapping[url]);
      // eslint-disable-next-line no-console
      console.log(`register URL mapping: POST ${path}`);
    } else if (url.startsWith('PUT ')) {
      path = url.substring(4);
      route.put(path, koaBody({ multipart: true }), mapping[url]);
      // eslint-disable-next-line no-console
      console.log(`register URL mapping: PUT ${path}`);
    } else if (url.startsWith('DELETE ')) {
      path = url.substring(7);
      route.del(path, koaBody(), mapping[url]);
      // eslint-disable-next-line no-console
      console.log(`register URL mapping: DELETE ${path}`);
    } else {
      // eslint-disable-next-line no-console
      console.log(`invalid URL: ${url}`);
    }
  }
}

function addControllers(route, dir) {
  try {
    fs.readdirSync(`${__dirname} /${dir}`).filter(f => f.endsWith('.js')).forEach((f) => {
      console.log(`process controller: ${f}...`);
      const mapingUrl = `${__dirname} /${dir}/${f}`;
      
      // eslint-disable-next-line import/no-dynamic-require
      const mapping = require(mapingUrl);
      addMapping(route, mapping);
    });
  } catch (e) {
    if (!config.isDebuger) {
      logger.error(e);
    } else {
      throw e;
    }
  }
}

module.exports = function (dir) {
  const controllersDir = dir || 'controller';
  addControllers(router, controllersDir);
  return router.routes();
};
