import { config } from "dotenv";
import { initServer } from "./configs/server.js";
import {createAdmin} from "./src/user/user.controller.js"

config();
initServer();
createAdmin();