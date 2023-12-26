import { Sequelize, Model } from 'sequelize';
import {clone, unset} from 'lodash-es'

export const sequelize = new Sequelize(process.env.DATABASE as string, process.env.USER as string, process.env.PASSWORD as string, {
  dialect: 'mysql',
  host: process.env.HOST,
  port: Number(process.env.PORT),
  logging: true,
  timezone: '+08:00',
  define: {
    timestamps: true, // create_time, update_time
    paranoid: true, // delete_time
    createdAt: 'create_time',
    updatedAt: 'update_time',
    deletedAt: 'delete_time',
    underscored: true,
  },
})

// Model.prototype.toJSON = function () {
//   let data = clone(this.dataValues) as any
//   unset(data, 'create_time')
//   unset(data, 'update_time')
//   unset(data, 'delete_time')

//   return data
// }

sequelize.sync({
  force: false
})