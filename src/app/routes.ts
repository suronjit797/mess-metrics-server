import express from 'express'
import userRouter from './modules/user/user.routes'
import messRouter from './modules/mess/mess.routes'
import monthRouter from './modules/month/month.routes'

const router = express.Router()

const moduleRoute = [
  { path: '/users', routes: userRouter },
  { path: '/mess', routes: messRouter },
  { path: '/month', routes: monthRouter },
]

moduleRoute.forEach((route) => router.use(route.path, route.routes))

export default router
