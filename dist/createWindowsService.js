"use strict";var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");Object.defineProperty(exports, "__esModule", { value: true });exports.srv = void 0;
var _path = _interopRequireDefault(require("path"));
var _nodeWindows = require("node-windows"); /* eslint-disable prettier/prettier */

const serviceLog = new _nodeWindows.EventLogger();
const options = {
  name: 'Sistema-Bebidas-Placebeer',
  description: 'Sistema de bebidas',
  script: _path.default.join(__dirname, '../src/server.ts'),
  nodeOptions: '--harmony' };

const srv = () => {
  const srv = new _nodeWindows.Service(options);

  srv.on('install', () => {
    srv.start();
    serviceLog.info('Service installed successfully');
    serviceLog.info('Windows Sistema-Bebidas-Placebeer service installed!');
  });

  srv.on('uninstall', () => {
    serviceLog.info('Service uninstalled successfully');
    serviceLog.info('Windows Sistema-Bebidas-Placebeer service uninstalled!');
  });

  srv.on('start', async () => {
    serviceLog.info('Service started successfully');
    serviceLog.info('Windows Sistema-Bebidas-Placebeer service running!');
  });

  srv.on('stop', async () => {
    serviceLog.info('Service stopped successfully');
    serviceLog.info('Windows Sistema-Bebidas-Placebeer service stopped!');
  });

  srv.on('invalidinstallation', () => {
    serviceLog.info('Service installation failed');
    serviceLog.error('Windows Sistema-Bebidas-Placebeer service invalid installation!');
  });

  srv.on('error', () => {
    serviceLog.info('Service error');
    serviceLog.error('Windows Sistema-Bebidas-Placebeer service error!');
  });

  return srv;
};exports.srv = srv;
//# sourceMappingURL=createWindowsService.js.map