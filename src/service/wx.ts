import { ParameterException } from './../core/http-exception';
import { Auth } from './../middleware/auth';
import { AppConfig } from './../config/enum';
import util from 'util'
import axios from 'axios';
import User from '../model/user/user'
import {generateToken} from '../core/utils'
class WXService {
  constructor() {

  }
  static async getTokenByCode(code: string) {
    const url = `https://api.weixin.qq.com/sns/jscode2session?appid=%s&secret=%s&js_code=%s&grant_type=authorization_code`
   
    // 字符串格式化
    const loginUrl =  util.format(url, AppConfig.APPID, AppConfig.APP_SECRET, code)

    const res = await axios.get(loginUrl)

    if (res.status !== 200) {
      throw new ParameterException('openid获取失败')
    }

    // 获取openid
    const openid = res.data.openid

    // 通过openid，去数据库查询
    let user = await User.findOne({
      where: {
        openid
      }
    })

    let token 

    if (!user) {

      user = await User.create({openid})
    }
    token = generateToken(user.dataValues.id, user.dataValues.storeId, user.dataValues.name, Auth.USER)
    return token

  }
}

export default WXService