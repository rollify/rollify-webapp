import Vue from "vue";
import axios from "axios";

import { RoomService, UserService, DiceRollService } from "../common/api";

// This files initializes all the dependencies used by our service.

const axiosCli = axios.create({
  baseURL: process.env.ROLLIFY_API_ADDRESS,
  timeout: process.env.ROLLIFY_API_TIMEOUT
});

// Init important variables.
Vue.prototype.$rollifyApiAddress = process.env.ROLLIFY_API_ADDRESS;
Vue.prototype.$rollifyWsApiAddress = process.env.ROLLIFY_WEBSOCKET_API_ADDRESS;

// Initialize our api services.
Vue.prototype.$apiRoomService = new RoomService(axiosCli);
Vue.prototype.$apiUserService = new UserService(axiosCli);
Vue.prototype.$apiDiceRollService = new DiceRollService(axiosCli);
