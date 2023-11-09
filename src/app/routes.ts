import express from 'express'
import userRouter from './modules/user/user.routes'

const router = express.Router()

const moduleRoute = [
  { path: '/users', routes: userRouter },
]

moduleRoute.forEach((route) => router.use(route.path, route.routes))

export default router
