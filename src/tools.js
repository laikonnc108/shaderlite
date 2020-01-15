
const sync_exec = require('util').promisify(require('child_process').exec)

const moment = require('moment')
moment.locale('ar')

const { spawn } = require('child_process');

export {sync_exec, moment, spawn}