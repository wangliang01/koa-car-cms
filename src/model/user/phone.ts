import { ParameterException } from './../../core/http-exception';
import { sequelize } from '../../core/db'
import { Model, DataTypes } from 'sequelize'

class Phone extends Model {
  static async findSMSCount(mobile: string, curDate: string, smsCode: string, smsSendMax: number) {
    let sendCount: number
    const res = await Phone.findOne({
      where: {
        mobile,
        curDate
      }
    })
    if (!res) {
      sendCount = 1
      await Phone.create({
        mobile,
        smsCode,
        curDate,
        sendCount
      })
    } else {
      sendCount = res.dataValues.sendCount 
      if (sendCount >= smsSendMax) {
        throw new ParameterException('短信发送次数超过限制')
      } 
      
    }
    return sendCount
  }
  static findClientIpCount(clientIp: string | string[], curDate: string, ipCountMax: number) {

  }
}


Phone.init({
  mobile: DataTypes.STRING,
  smsCode: DataTypes.STRING,
  sendCount: DataTypes.INTEGER,
  curDate: DataTypes.STRING
}, {sequelize, tableName: 'phone'})

export default Phone