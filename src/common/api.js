import { store } from "../store/store.js";

// RoomService knows how to contact with the server to make HTTP
// room API calls.
export class RoomService {
  constructor(axiosClient) {
    this.axiosClient = axiosClient;
  }

  // Creates a new room and returns a room model:
  // {
  //   id   string
  //   name string
  // }
  async createRoom(roomName) {
    const resp = await this.axiosClient.post("api/v1/rooms", {
      name: roomName
    });

    return {
      id: resp.data.id,
      name: resp.data.name
    };
  }
}

// UserService knows how to contact with the server to make HTTP
// user API calls.
export class UserService {
  constructor(axiosClient) {
    this.axiosClient = axiosClient;
  }

  // Creates a new user and returns a user model:
  // {
  //   id   string
  //   name string
  // }
  async createUser(roomId, username) {
    const resp = await this.axiosClient.post("api/v1/users", {
      room_id: roomId,
      name: username
    });

    return {
      id: resp.data.id,
      name: resp.data.name
    };
  }

  // listRoomUsers lists room users into a model:
  // [
  //   {
  //     id   string
  //     name string
  //   }
  //  ]
  async listRoomUsers(roomId) {
    const resp = await this.axiosClient.get("api/v1/users", {
      params: {
        "room-id": roomId
      }
    });

    const users = [];
    resp.data.items.forEach(v => {
      users.push({
        id: v.id,
        name: v.name
      });
    });

    return users;
  }
}

// DiceRollService knows how to contact with the server to make HTTP
// dice roll API calls.
export class DiceRollService {
  constructor(axiosClient) {
    this.axiosClient = axiosClient;
  }

  async createDiceRoll(roomId, userId, diceTypes) {
    const resp = await this.axiosClient.post("api/v1/dice/rolls", {
      user_id: userId,
      room_id: roomId,
      dice_type_ids: diceTypes
    });

    // TODO(slok): To model, for now return as it is, so we don't break the frontend.
    return resp.data;
  }

  // private.
  diceRollToModel(diceRoll) {
    // Map dice roll dice values.
    const dice = [];
    diceRoll.dice.forEach(die => {
      dice.push({
        type: die.dice_type_id,
        value: die.side + 1,
        metadata: store.diceBag[die.type_id].metadata
      });
    });

    return {
      id: diceRoll.id,
      user: store.users[diceRoll.user_id].name,
      ts: diceRoll.created_at,
      dice: dice
    };
  }

  async listDiceRolls(roomId) {
    const resp = await this.axiosClient.get("api/v1/dice/rolls", {
      params: {
        "room-id": roomId
      }
    });

    // To model.
    const diceRolls = [];
    resp.data.items.forEach(diceRoll => {
      const modelDiceRoll = this.diceRollToModel(diceRoll);
      diceRolls.push(modelDiceRoll);
    });

    return diceRolls;
  }
}
