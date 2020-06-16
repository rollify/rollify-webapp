import Vue from "vue";

const d4 = {
  id: "d4",
  apiId: "d4",
  color: "green",
  buttonImage: "statics/img/dice/regular/d04.svg"
};
const d6 = {
  id: "d6",
  apiId: "d6",
  color: "blue",
  buttonImage: "statics/img/dice/regular/d06.svg"
};
const d8 = {
  id: "d8",
  apiId: "d8",
  color: "purple",
  buttonImage: "statics/img/dice/regular/d08.svg"
};
const d10 = {
  id: "d10",
  apiId: "d10",
  color: "pink",
  buttonImage: "statics/img/dice/regular/d10.svg"
};

const d12 = {
  id: "d12",
  apiId: "d12",
  color: "red",
  buttonImage: "statics/img/dice/regular/d12.svg"
};
const d20 = {
  id: "d20",
  apiId: "d20",
  color: "orange",
  buttonImage: "statics/img/dice/regular/d20.svg"
};

// store is a shared globla store so components can share data
// without loosing state. Instead of using vuex, we use a shared
// global object.
export const store = Vue.observable({
  // room stores the application connected room information.
  room: {
    id: "",
    name: ""
  },
  // logs stores the global dice roll logs information.
  logs: {
    notifications: 0,
    diceRolls: []
  },

  // users stores the information of the connected users in the room.
  users: {},

  // diceBag has the information of the users die bag, or in other words
  // the dice that will roll.
  diceBag: {
    d4: {
      metadata: d4,
      quantity: 0
    },
    d6: {
      metadata: d6,
      quantity: 0
    },
    d8: {
      metadata: d8,
      quantity: 0
    },
    d10: {
      metadata: d10,
      quantity: 0
    },
    d12: {
      metadata: d12,
      quantity: 0
    },
    d20: {
      metadata: d20,
      quantity: 0
    }
  }
});
