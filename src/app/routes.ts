import express from "express";
import userRouter from "./modules/user/user.routes";
import messRouter from "./modules/mess/mess.routes";
import monthRouter from "./modules/month/month.routes";
import phoneBookRouter from "./modules/phoneBook/phoneBook.routes";
import personalAccountRouter from "./modules/personalAccount/personalAccount.routes";
import actionsRouter from "./modules/actions/actions.routes";
import messAccountCoRouter from "./modules/messAccount/messAccount.routes";
import bazarRouter from "./modules/bazar/bazar.routes";
import sharedCostRouter from "./modules/sharedCost/sharedCost.routes";

const router = express.Router();

const moduleRoute = [
  { path: "/users", routes: userRouter },
  { path: "/mess", routes: messRouter },
  { path: "/month", routes: monthRouter },
  { path: "/phoneBook", routes: phoneBookRouter },
  { path: "/personalAccount", routes: personalAccountRouter },
  { path: "/actions", routes: actionsRouter },
  { path: "/messAccount", routes: messAccountCoRouter },
  { path: "/bazar", routes: bazarRouter },
  { path: "/sharedCost", routes: sharedCostRouter },
];

moduleRoute.forEach((route) => router.use(route.path, route.routes));

export default router;
