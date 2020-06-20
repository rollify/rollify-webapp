import Vue from "vue";
import axios from "axios";

import { RoomService, UserService, DiceRollService } from "../common/api";

// This files initializes all the dependencies used by our service.

// Initialize our api services.
Vue.prototype.$apiRoomService = RoomService(axios);
Vue.prototype.$apiUserService = UserService(axios);
Vue.prototype.$apiDiceRollService = DiceRollService(axios);
