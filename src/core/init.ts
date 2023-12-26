import { IRouterModule, Application } from './../types/index'
import Router from 'koa-router'
import requireDirectory from 'require-directory'
import { catchError } from '../middleware/exception'
import { bearerToken } from 'koa-bearer-token'
import bodyParser from 'koa-bodyparser'
const cors = require('@koa/cors');
import path from 'path'

class InitManager {
  static app: Application
  static initCore(app: Application) {
    InitManager.app = app
    InitManager.app.use(bodyParser())
    InitManager.app.use(cors())
    InitManager.app.use(
      bearerToken({
        bodyKey: 'access_token',
        queryKey: 'access_token',
        headerKey: 'Bearer',
        reqKey: 'token'
      })
    )
    InitManager.initLoadGlobalException()
    InitManager.initLoadRouters()
  }
  static initLoadGlobalException() {
    const app = InitManager.app
    app.use(catchError)
  }
  static initLoadRouters() {
    const app = InitManager.app

    // const apiDirectory = `${process.cwd()}/src/api`
    const apiDirectory = path.join(process.cwd(), '/src/api')
    requireDirectory(module, apiDirectory, {
      extensions: ['js', 'ts'],
      visit(router: { default: Router | IRouterModule }) {
        console.log('router: ' + router)
        if (router.default instanceof Router) {
          app.use(router.default.routes()).use(router.default.allowedMethods())
        } else {
          const innerRouter = (router.default as IRouterModule).router
          if (innerRouter instanceof Router) {
            app.use(innerRouter.routes()).use(innerRouter.allowedMethods())
          }
        }
      }
    })
  }
}

export default InitManager
