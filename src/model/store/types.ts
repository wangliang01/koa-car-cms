export interface IStore {
  id?: string;
  name: string;
  address?: string;
  remark?: string;
}

export type searchType = {
  name: object | string;
  createName?: object | string;
  createTime?: object | string;
}