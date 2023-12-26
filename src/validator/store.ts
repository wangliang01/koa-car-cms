import { Context } from '../types/index'
import { WangValidator } from '../core/wang-validator'
import Store from '../model/store/store'
export class RegisterValidator extends WangValidator {
  constructor(ctx: Context) {
    super(ctx)

    const validateStoreName = async (
      rule: any,
      value: string,
      callback: (msg: any) => any
    ) => {
      const store = await Store.findOne({
        where: {
          name: value
        }
      })

      if (store) {
        callback(new Error('门店已经存在'))
      }
    }

    this.name = [
      {
        type: 'string',
        message: '门店名称不能为空'
      },
      { asyncValidator: validateStoreName }
    ]
  }
}

export class EditValidator extends WangValidator {
  constructor(ctx: Context) {
    super(ctx)

    const validateStoreId = async (
      rule: any,
      value: string,
      callback: (msg: any) => any
    ) => {
      const store = await Store.findOne({
        where: {
          id: value
        }
      })

      if (!store) {
        callback(new Error('门店id不存在'))
      }
    }

    this.id = [
      {
        type: 'number',
        message: 'id不能为空'
      },
      {
        asyncValidator: validateStoreId
      }
    ]
  }
}

export class DetailVaLidator extends WangValidator {
  constructor(ctx: Context) {
    super(ctx)

    const validateStoreId = async (
      rule: any,
      value: string,
      callback: (msg: any) => any
    ) => {
      const store = await Store.findOne({
        where: {
          id: value
        }
      })

      if (!store) {
        callback(new Error('门店id不存在'))
      }
    }

    this.id = [
      {
        type: 'string',
        message: 'id不能为空'
      },
      {
        asyncValidator: validateStoreId
      }
    ]
  }
}
