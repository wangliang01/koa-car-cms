import { unset, clone, set } from 'lodash-es'
export function toJSON(data: object): object {
  data = clone(data)
  set(data, 'createTime', data.create_time)
  unset(data, 'create_time')
  unset(data, 'update_time')
  unset(data, 'delete_time')

  return data
}
