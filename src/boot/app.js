import Vue from "vue";
import axios from "axios";

import { RoomService, UserService, DiceRollService } from "../common/api";

// This files initializes all the dependencies used by our service.

const axiosCli = axios.create({
  baseURL: process.env.ROLLIFY_API_ADDRESS,
  timeout: process.env.ROLLIFY_API_TIMEOUT
});

// Initialize our api services.
Vue.prototype.$apiRoomService = new RoomService(axiosCli);
Vue.prototype.$apiUserService = new UserService(axiosCli);
Vue.prototype.$apiDiceRollService = new DiceRollService(axiosCli);
