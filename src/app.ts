import Koa = require('koa')
import InitManager from './core/init'

import './config/env'
const app = new Koa()

InitManager.initCore(app)

app.listen(3000, () => {
  console.log('the server is running at http://localhost:3000')
})