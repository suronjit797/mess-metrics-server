import express from "express";
import userRouter from "./modules/user/user.routes";
import messRouter from "./modules/mess/mess.routes";
import monthRouter from "./modules/month/month.routes";
import phoneBookRouter from "./modules/phoneBook/phoneBook.routes";
import actionsRouter from "./modules/actions/actions.routes";
import bazarRouter from "./modules/bazar/bazar.routes";
import sharedCostRouter from "./modules/sharedCost/sharedCost.routes";
import mealRouter from "./modules/meal/meal.routes";
import depositRouter from "./modules/deposit/deposit.routes";
import individualCostRouter from "./modules/individualCost/individualCost.routes";
import notificationsRouter from "./modules/notifications/notifications.routes";

const router = express.Router();

const moduleRoute = [
  { path: "/users", routes: userRouter },
  { path: "/mess", routes: messRouter },
  { path: "/month", routes: monthRouter },
  { path: "/phone-book", routes: phoneBookRouter },
  { path: "/actions", routes: actionsRouter },
  { path: "/deposit", routes: depositRouter },
  { path: "/notification", routes: notificationsRouter },

  // cost
  { path: "/meal", routes: mealRouter },
  { path: "/bazar", routes: bazarRouter },
  { path: "/shared-cost", routes: sharedCostRouter },
  { path: "/individual-cost", routes: individualCostRouter },
];

moduleRoute.forEach((route) => router.use(route.path, route.routes));

export default router;
