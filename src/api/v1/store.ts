import Router from 'koa-router'
import { Auth } from './../../middleware/auth'
import { DetailVaLidator, EditValidator, RegisterValidator } from '../../validator/store'
import Store from '../../model/store/store'
import { Success } from '../../core/http-exception'

const router = new Router({
  prefix: '/v1'
})

/**
 * 创建门店
 */
router.post('/system/store/add', new Auth().m,  async ctx => {
  const v = await new RegisterValidator(ctx).validate()

  await Store.add({
    name: v?.name,
    address: v?.address,
    remark: v?.remark,
    createName: (ctx as any).auth.name
  })

  throw new Success()
})

/**
 * 分页查询门店列表
 */

router.post('/system/store/list', new Auth().m, async ctx => {
  const v = ctx.request.body as any
  const data = await Store.list(v)
  throw new Success(data)
})


/**
 * 门店编辑
 */
router.post('/system/store/edit', new Auth().m,  async ctx => {
  const v = (await new EditValidator(ctx).validate()) as any
  await Store.edit(v)

  throw new Success()

})


/**
 * 查看门店信息
 */

router.get('/system/store/info/:id', new Auth().m, async ctx => {
  const v = (await new DetailVaLidator(ctx).validate()) as any
  const data = await Store.info(v.id)

  throw new Success(data)
})

/**
 * 删除门店
 */

router.post('/system/store/delete', new Auth().m, async ctx => {
  const v = (await new EditValidator(ctx).validate()) as any
  await Store.delete(v.id)
  throw new Success()
})


/**
 * 下载导出
 */

router.post('/system/store/exportExcel', new Auth().m, async ctx => {
  const v = ctx.request.body as any
  // 设置响应头
  ctx.attachment('output.xlsx');
  ctx.set('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
  const res = await Store.exportExcel(v)
  // throw new Success(res)
  ctx.body = res
})

export default router