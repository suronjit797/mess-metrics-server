import express from "express";
import userRouter from "./modules/user/user.routes";
import messRouter from "./modules/mess/mess.routes";
import monthRouter from "./modules/month/month.routes";
import phoneBookRouter from "./modules/phoneBook/phoneBook.routes";
import personalAccountRouter from "./modules/personalAccount/personalAccount.routes";

const router = express.Router();

const moduleRoute = [
  { path: "/users", routes: userRouter },
  { path: "/mess", routes: messRouter },
  { path: "/month", routes: monthRouter },
  { path: "/phoneBook", routes: phoneBookRouter },
  { path: "/personalAccount", routes: personalAccountRouter },
];

moduleRoute.forEach((route) => router.use(route.path, route.routes));

export default router;
