import { Auth } from './../../middleware/auth'
import { LoginType } from './../../config/enum'
import { Success, ParameterException } from './../../core/http-exception'
import Router from 'koa-router'
import { MobileValidator, RegisterValidator, TokenValidator, EmailValidator } from './../../validator/index'
import User from '../../model/user/user'
import { generateToken } from '../../core/utils'
import { Values } from 'async-validator'
import dayjs from 'dayjs'
import UserService from '../../service/user'
import WXService from '../../service/wx'

const router = new Router({
  prefix: '/v1'
})

/**
 * 用户注册
 */
router.post('/user/register', async (ctx) => {
  const v = await new RegisterValidator(ctx).validate()

  const user = {
    name: v?.name,
    email: v?.email,
    password: v?.password,
    sex: v?.sex,
    birthday: v?.birthday,
    phone: v?.phone,
    domicile: v?.domicile,
    address: v?.address,
    storeId: v?.storeId,
    createName: v?.createName,
    role: v?.role
  }
  await User.create(user)

  throw new Success()
})

/**
 * 获取token
 */
router.post('/user/login', async (ctx) => {
  const v = (await new TokenValidator(ctx).validate()) as Values
  let token, user

  user = await User.verifyAccountPassword(v.username, v.password)
  token = generateToken(user.id, user.storeId, user.name, Auth.USER)

  throw new Success(token)
})

/**
 * 获取用户信息
 */
router.get('/user/info', new Auth().m, async (ctx) => {
  const { uid } = (ctx as any).auth
  const user = await User.getUserInfo(uid)

  throw new Success(user)

})


/**
 * 忘记密码
 */

router.post('/user/forget', async (ctx) => {
  const v = (await new EmailValidator(ctx).validate()) as Values

  await User.updatePassword(v.email, v.password, v.code)

  throw new Success()

})




export default router
