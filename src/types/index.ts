import Router from 'koa-router'
import Koa from 'koa'


export interface IRouterModule {
  router?: Router
}

export type Application = Koa<Koa.DefaultState, Koa.DefaultContext>

export type Context = Koa.Context

export type Next= Koa.Next


export interface ISMSCode {
  mobile: string,
  clientIp: string | string[],
  curDate: string
}