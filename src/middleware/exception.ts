import { errorCode, errorMsg } from './../config/error-code';
import { HttpException } from './../core/http-exception';
import { Context, Next } from './../types/index';
export async function catchError(ctx: Context, next: Next) {
  try {
    await next()
  } catch (error) {
    if (error instanceof HttpException) {
      // 已知错误
      ctx.body = {
        errorCode: error.errorCode,
        msg: error.msg,
        success: error.success,
        data: error.data,
        request: `${ctx.method} ${ctx.path}` 
      }

      ctx.status = error.code

    } else {
      // 未知错误
      if (process.env.NODE_ENV === 'development') {
        // 如果是开发环境，则直接抛出错误栈信息
        throw error
      } else {
        ctx.body = {
          errorCode: errorCode.INTERNAL_SERVER_ERROR,
          msg: errorMsg.INTERNAL_SERVER_ERROR,
          success: false,
          data: null,
          request: `${ctx.method} ${ctx.path}` 
        }

        ctx.status = 500
      }
    }


  }
}