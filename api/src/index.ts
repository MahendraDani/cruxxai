import { Hono } from 'hono'
import { getPrisma } from '../lib/prisma'

const app = new Hono<{ Bindings: CloudflareBindings }>()

app.get('/', async (c) => {
  const prisma = getPrisma(c.env.DATABASE_URL)
  const users = await prisma.user.findMany();
  return c.json({message : "Hello World!",users});
})

export default app