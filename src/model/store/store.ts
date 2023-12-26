import { set } from 'lodash-es';
import { Model, DataTypes, Op } from 'sequelize'
import { sequelize } from '../../core/db'

import { toJSON } from '../../utils'
import { IStore, searchType } from './types'
import { ParameterException, Success } from '../../core/http-exception'
import {exportExcel} from "../../utils/excel";
class Store extends Model {
  static async add(store: any) {
    // 同步模型和数据库
    await sequelize.sync()

    return await Store.create(store)
  }
  static async list({
    name = '',
    current = 1,
    pageSize = 10,
    createName = null,
    startTime = null,
    endTime = null
  }) {
    const whereClause: searchType = {
      name: {
        [Op.like]: `%${name}%`
      }
    }
    if (createName !== null) {
      whereClause.createName = {
        [Op.eq]: createName
      }
    }
    if (startTime !== null && endTime !== null) {
      whereClause.createTime = {
        [Op.between]: [new Date(startTime), new Date(endTime)]
      }
    }
    const { rows: list, count } = await Store.findAndCountAll({
      where: whereClause,
      limit: pageSize,
      offset: (current - 1) * pageSize,
      attributes: {
        include: ['createTime']
      }
    })

    console.log('list', list)

    const records = list.map((item) => toJSON(item.dataValues))
    console.log(records)
    return {
      records,
      total: count
    }
  }
  static async edit({id, ...newData}: {id: number, [key: string]: any}) {
    // 使用 Sequelize 模型来查找并更新数据库中的记录
    const updatedRecord = await Store.update(newData, { where: { id } });
  }
  static async info(id: number | string) {
    const record = await Store.findOne({
      where: {id}
    })

    return record
  }
  static async delete(id: number | string) {
    const record = await Store.destroy({
      where: { id }
    })
    return record
  }
  static async exportExcel({
    name = '',
    createName = null,
    startTime = null,
    endTime = null
  }) {
    const whereClause: searchType = {
      name: {
        [Op.like]: `%${name}%`
      }
    }
    if (createName !== null) {
      whereClause.createName = {
        [Op.eq]: createName
      }
    }
    if (startTime !== null && endTime !== null) {
      whereClause.createTime = {
        [Op.between]: [new Date(startTime), new Date(endTime)]
      }
    }
    const list = await Store.findAll({
      where: whereClause,
      attributes: {
        include: ['createTime']
      }
    })

    if (!list) {
      throw new ParameterException('没有数据可以导出')
    }

    // ['名称', '地址', '备注', '创建人', '创建时间'] 生成label, prop的结构
    const columns = [
      {
        label: '名称',
        prop: 'name'
      },
      {
        label: '地址',
        prop: 'address'
      },
      {
        label: '备注',
        prop: 'remark'
      },
      {
        label: '创建人',
        prop: 'createName'
      },
      {
        label: '创建时间',
        prop: 'createTime'
      }
    ]
    const buffer =  await exportExcel(list, columns)

    return buffer


  }
}

Store.init(
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    name: DataTypes.STRING,
    address: DataTypes.STRING,
    remark: DataTypes.STRING,
    createName: DataTypes.STRING,
    createTime: {
      type: DataTypes.VIRTUAL,
      get() {
        return this.getDataValue('create_time')
      },
      set(value) {
        throw new Error('不要尝试设置 `createTime` 的值!');
      }
    }
  },
  {
    sequelize,
    tableName: 'store'
  }
)

export default Store
