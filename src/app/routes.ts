import express from 'express'
import userRouter from './modules/user/user.routes'
import messRouter from './modules/mess/mess.routes'

const router = express.Router()

const moduleRoute = [
  { path: '/users', routes: userRouter },
  { path: '/mess', routes: messRouter },
]

moduleRoute.forEach((route) => router.use(route.path, route.routes))

export default router
