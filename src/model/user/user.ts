import { ParameterException } from '../../core/http-exception';
import { Model, DataTypes, Op } from 'sequelize'
import { sequelize } from '../../core/db'
import bcrypt from 'bcryptjs'

class User extends Model {
  // 校验 手机号和密码
  static async verifyAccountPassword(account: string, password: string) {
    const user = await User.findOne({
      where: {
        [Op.or]: [
          { phone: account },
          { email: account }
        ]
      }
    })
    if (!user) {
      throw new ParameterException('用户不存在')
    }

    const correct = bcrypt.compareSync(password, user.getDataValue('password'))

    if (!correct) {
      throw new ParameterException('密码不正确')
    }
    
    return user.dataValues
  }
  // 获取用户信息
  static async getUserInfo(id: number) {
    const user = await User.findOne({
      where: {
        id
      }
    })
    if (!user) {
      throw new ParameterException('用户不存在')
    }
    return user.dataValues
  }

  // 发送验证码
  static async sendCode(email: string) {
    
  }

  // 更新密码
  static async updatePassword(email: string, password: string, code: string) {
    const user = await User.findOne({
      where: {
        email
      }
    })
    if (!user) {
      throw new ParameterException('用户不存在')
    }
    user.setDataValue('password', password)
    await user.save()
  }
}


User.init({
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  name: DataTypes.STRING,
  avatar: DataTypes.STRING,
  email: {
    type: DataTypes.STRING(128),
    unique: true
  },
  password: {
    type: DataTypes.STRING,
    set(val: string) {
      const salt = bcrypt.genSaltSync(10)

      const pwd = bcrypt.hashSync(val, salt)

      this.setDataValue('password', pwd)
    }
  },
  sex: DataTypes.INTEGER,
  birthday: DataTypes.STRING,
  phone: {
    type: DataTypes.STRING(11),
    unique: true
  },
  domicile: DataTypes.STRING,
  address: DataTypes.STRING,
  storeId: DataTypes.INTEGER,
  storeName: DataTypes.STRING,
  createName: DataTypes.STRING,
  openid: {
    type: DataTypes.STRING(64),
    unique: true
  },
  role: DataTypes.STRING,
}, {sequelize, tableName: 'user'})

export default User