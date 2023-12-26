import { LoginType } from './../config/enum'
import { Context } from './../types/index'
import { WangValidator } from './../core/wang-validator'
import User from '../model/user/user'
import Store from '../model/store/store'
export class PositiveIntegerValidator extends WangValidator {
  constructor(ctx: Context) {
    super(ctx)
    this.id = [
      {
        type: 'boolean',
        message: '需要是正整数'
      }
    ]
  }
}

export class RegisterValidator extends WangValidator {
  constructor(ctx: Context) {
    super(ctx)

    // name
    this.name = [
      { required: true, type: 'string', message: '用户名不能为空' },
      { min: 2, max: 32, message: '用户名长度在2-32位' }
    ]
    // email
    const validateEmail = async (
      rule: any,
      value: string,
      callback: (msg: any) => any
    ) => {
      const user = await User.findOne({
        where: {
          email: value
        }
      })

      if (user) {
        callback(new Error('邮箱已经存在'))
      }
    }
    this.email = [
      { required: true, type: 'email', message: '不符合Email规范' },
      { asyncValidator: validateEmail }
    ]
    // phone
    const validatePhone = async (
      rule: any,
      value: string,
      callback: (msg: any) => any
    ) => {
      const user = await User.findOne({
        where: {
          phone: value
        }
      })

      if (user) {
        callback(new Error('手机号已经存在'))
      }
    }
    this.phone = [
      { required: true, type: 'string', message: '手机号不能为空' },
      { pattern: /^1[3-9]\d{9}$/, message: '手机号格式不正确' },
      { asyncValidator: validatePhone }
    ]
    // password
    this.password = [
      { required: true, type: 'string', message: '密码不能为空' },
      {
        type: 'string',
        message: '密码至少包含 数字和英文，长度6-20',
        pattern: /^(?![0-9]+$)(?![a-zA-Z]+$)[0-9A-Za-z]{6,20}$/,
        min: 6,
        max: 20
      }
    ]

    // storeId
    const validStore = async (
      rule: any,
      value: string,
      callback: (msg: any) => any
    ) => {
      const store = await Store.findOne({
        where: {
          storeId: value
        }
      })
      if (!store) {
        callback(new Error('门店不存在'))
      }
    }
    this.storeId = [{ required: true, type: 'number', message: '门店不能为空' }, { asyncValidator: validStore }]

    const validatePass = (rule: any, value: string, callback: () => any) => {
      return this.ctx.request.body.password === value
    }

    // confirmPassword
    this.confirmPassword = [
      ...this.password,
      { validator: validatePass, message: '两个密码不相同' }
    ]
  }
}

export class TokenValidator extends WangValidator {
  constructor(ctx: Context) {
    super(ctx)
    this.username = [
      { required: true, message: '账号不能为空', min: 4, max: 32 }
    ]


    // password
    this.password = [
      {
        required: true,
        message: 'password不能为空',
        type: 'string'
      },
      {
        type: 'string',
        message: '密码至少包含 数字和英文，长度6-20',
        pattern: /^(?![0-9]+$)(?![a-zA-Z]+$)[0-9A-Za-z]{6,20}$/,
        min: 6,
        max: 20
      }
    ]
  }
}

export class MobileValidator extends WangValidator {
  constructor(ctx: Context) {
    super(ctx)

    this.mobile = [
      { required: true, message: '手机号不能为空' },
      { pattern: /^1[3-9]\d{9}$/, message: '手机号格式不正确' }
    ]
  }
}


export class EmailValidator extends WangValidator {
  constructor(ctx: Context) {
    super(ctx)
    this.email = [
      { required: true, message: '邮箱不能为空' },
      { type: 'email', message: '不符合Email规范' }
    ]
    this.password = [
      { required: true, message: '密码不能为空' },
      { type: 'string', message: '密码至少包含 数字和英文，长度6-20', pattern: /^(?![0-9]+$)(?![a-zA-Z]+$)[0-9A-Za-z]{6,20}$/, min: 6, max: 20 }
    ]
    this.code = [
      { required: true, message: '验证码不能为空' },
      { type: 'string', message: '验证码格式不正确' },
      { len: 6, message: '验证码长度不正确' }
    ]
  }
}
