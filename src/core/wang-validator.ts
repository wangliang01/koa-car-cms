import { ParameterException } from './http-exception';
import { Context } from './../types/index';
import Schema from 'async-validator'

interface IDescriptor {
  [key: string]: any;
}

interface Rule {
  type?: string;
  required?: boolean;
  pattern?: RegExp;
  min?: number;
  max?: number;
  len?: number;
  enum?: Array<any>;
  whitespace?: boolean;
  fields?: {
    [fieldName: string]: Rule | Rule[]
  };
  defaultField?: Rule;
  transform?: (value: any) => any;
  message?: any;
  asyncValidator ?: (rule: Rule, value: any, callback: (error: Error | null) => any) => void;
  fieldValue?:  any;
  field?: any;

}

export class WangValidator {
  [propName: string]: any;
  constructor(ctx: Context) {
    this.ctx = ctx
  }
  private assembleAllParams(ctx: Context) {
    const header = {
      ...ctx.request.header
    }

    // 删除浏览器默认请求头参数 
    delete header.host 
    delete header.connection 
    delete header['content-length'] 
    delete header['sec-ch-ua'] 
    delete header['sec-ch-ua-mobile'] 
    delete header['user-agent'] 
    delete header['content-type'] 
    delete header['___internal-request-id'] 
    delete header['sec-ch-ua-platform'] 
    delete header['accept'] 
    delete header['origin'] 
    delete header['sec-fetch-site'] 
    delete header['sec-fetch-mode'] 
    delete header['sec-fetch-dest'] 
    delete header['accept-encoding'] 
    delete header['accept-language'] 
    return {
      ...header,
      ...ctx.params,
      ...ctx.request.query,
      ...(ctx.request.body as object)
    }
  }
  private handleError(errors: Rule []) {
    const errorMsgs: string [] =  errors.map(error => {
      return `${error.message}`
    })

    throw new ParameterException(errorMsgs)
  }

  async validate() {
    const ctx: Context = this.ctx
    const descriptor:IDescriptor = {}
    for (let [key, value] of Object.entries(this)) {
      descriptor[key] = value
    }
    const validator = new Schema(descriptor)
    let source = this.assembleAllParams(ctx)
    try {
      const res = await validator.validate(source)
      return res
    } catch (error: any) {
      if (error.errors) {
        this.handleError(error.errors)
      }
    }
  }
}



