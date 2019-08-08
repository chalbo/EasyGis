const fs = require('fs');
const router = require('koa-router')();
const koaBody = require('koa-body');
const logger = require("./common/logger");
const config = require('../config/config.local.js');
function addMapping(router, mapping) {
    var path = "";
    for (var url in mapping) {
        if (url.startsWith('GET ')) {
            path = url.substring(4);
            router.get(path, koaBody(), mapping[url]);
            console.log(`register URL mapping: GET ${path}`);
        } else if (url.startsWith('POST ')) {
            path = url.substring(5);
            router.post(path, koaBody({ multipart: true }), mapping[url]);
            console.log(`register URL mapping: POST ${path}`);
        } else if (url.startsWith('PUT ')) {
            path = url.substring(4);
            router.put(path, koaBody({ multipart: true }), mapping[url]);
            console.log(`register URL mapping: PUT ${path}`);
        } else if (url.startsWith('DELETE ')) {
            path = url.substring(7);
            router.del(path, koaBody(), mapping[url]);
            console.log(`register URL mapping: DELETE ${path}`);
        } else {
            console.log(`invalid URL: ${url}`);
        }
    }
}

function addControllers(router, dir) {
   try {
        fs.readdirSync(__dirname + '/' + dir).filter((f) => {
            return f.endsWith('.js');
        }).forEach((f) => {
            console.log(`process controller: ${f}...`);
            let mapping = require(__dirname + '/' + dir + '/' + f);
            addMapping(router, mapping);
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
    var controllersDir = dir || 'controller';
    addControllers(router, controllersDir);
    return router.routes();
};