import moment from 'moment';

const Koa = require('koa');
const staticContents = require('koa-static');
const path = require('path');
const router2controller = require('./app/router2controller.js');
const config = require('./config/config.local.js');
// const logger=require("./app/common/logger");

const app = new Koa();

// 配置静态资源
const staticPath = './static';
app.use(staticContents(path.join(__dirname, staticPath)));
app.use(router2controller());
app.listen(config.port);
console.log("Server started and listen on port " + config.port + "。时间：" + moment().format("YYYY-MM-DD HH:mm:SS"));