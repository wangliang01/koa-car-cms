// import { errorCode, errorMsg } from './../config/error-code';
export class HttpException extends Error {
  public success: boolean
  public data: any
  constructor(public msg: string | string[] = '业务异常', public errorCode: string = '00400',  public code: number = 400) {
    super()
    this.errorCode = errorCode
    this.msg = msg 
    this.code = code
    this.success = false
    this.data = null
  }
}

export class ParameterException extends HttpException {
  constructor(public msg: string | string[], public errorCode: string = '00400' ) {
    super()
    this.errorCode = errorCode 
    this.msg = msg 
    this.code = 400
    this.success = false
    this.data = null
  }
}

export class Success extends HttpException {
  constructor(public data: any = null, public msg: string = '操作成功',  public errorCode: string = '00200') {
    super()
    this.errorCode = errorCode 
    this.msg = msg 
    this.code = 200
    this.success = true
    this.data = data
  }
}

export class Forbidden extends HttpException {
  constructor(public msg: string = '禁止访问', public errorCode: string = '00403') {
    super()
    this.errorCode = errorCode 
    this.msg = msg 
    this.code = 403
    this.success = false
    this.data = null
  }
}