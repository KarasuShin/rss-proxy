import { serve } from '@hono/node-server'
import { Hono } from 'hono'
import { PrismaClient } from '@prisma/client'
import { feedsRoute } from './route/feed.js'
import 'dotenv/config'

export const prisma = new PrismaClient()
await prisma.$connect()

const app = new Hono()

export const route = app.route('/feeds', feedsRoute)

const port = Number.parseInt(process.env.PORT)

console.info(`Server is running on http://localhost:${port}`)

serve({
  fetch: app.fetch,
  port,
})

