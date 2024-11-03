import { Hono } from 'hono'
import { zValidator } from '@hono/zod-validator'
import { z } from 'zod'
import { prisma } from '../index.js'
import { FEED_TYPE } from '../constant.js'

const RSSHUB_ACCESS_KEY = process.env.RSSHUB_ACCESS_KEY

export const feedsRoute = new Hono().get(':id', async ctx => {
  const id = ctx.req.param('id')
  const feed = await prisma.feed.findUnique({
    where: {
      id,
    },
  })

  if (!feed) {
    return ctx.json({
      message: `Feed not found ${id}`,
    }, 404)
  }

  const url = new URL(feed.url)

  switch (feed.type) {
    case FEED_TYPE.RSSHUB:
      url.searchParams.append('key', RSSHUB_ACCESS_KEY)
      break
    case FEED_TYPE.WEWE:
      break
    default:
  }

  const rss = await fetch(url.toString())
  const rssText = await rss.text()
  return ctx.newResponse(rssText, 200, {
    'Content-Type': 'application/xml',
  })
})

feedsRoute.post('/', zValidator(
  'json',
  z.object({
    url: z.string().url(),
    type: z.number().int().min(1).max(2).optional(),
  }),
  async (result, ctx) => {
    if (!result.success) {
      return ctx.newResponse(null, 400)
    }
    const { url, type } = result.data
    await prisma.feed.create({
      data: {
        url,
        type,
      },
    })
    return ctx.json({
      message: 'Feed created',
    })
  },
))
