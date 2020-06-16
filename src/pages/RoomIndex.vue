<template>
  <q-page class="q-pa-md">
    <div class="row">
      <div class="col">
        <h3>Roll your dice</h3>
      </div>
    </div>

    <div class="row justify-center">
      <div
        class="q-pa-md q-gutter-sm"
        v-for="die in diceBag"
        :index="die.img"
        :key="die.img"
      >
        <DieRollBtn :die="die" />
      </div>
    </div>

    <div class="row justify-center">
      <div class="q-pa-md q-gutter-sm">
        <q-btn color="primary" label="Roll" @click="rollDiceBag" />
        <q-btn color="red" label="Clear" @click="clearDiceBag" />
      </div>
    </div>

    <DiceRollResultCards :diceRollApiResult="diceRollApiResult" />
  </q-page>
</template>

<script>
import DieRollBtn from "components/DieRollBtn";
import DiceRollResultCards from "components/DiceRollResultCards";
import { store } from "../store/store.js";

export default {
  name: "RoomIndex",
  components: {
    DieRollBtn,
    DiceRollResultCards
  },
  data() {
    return {
      diceRollApiResult: {},
      // We make them global so we don't loose the state while navigating
      // between tabs.
      diceBag: store.diceBag
    };
  },
  methods: {
    // incDiceBag increments in one the a die quantity of the global dice
    // bag that is on the global store.
    incDiceBag(diceID) {
      this.diceBag[diceID].quantity++;
    },

    // Clears all the dice bag data
    // TODO(slok): clear by dice.
    clearDiceBag() {
      Object.keys(this.diceBag).forEach(key => {
        this.diceBag[key].quantity = 0;
      });
    },

    // makeCreateDiceRollRequest will craft a new request to create a dice roll
    // using the global store dice bag, and make an HTTP request to the API.
    makeCreateDiceRollRequest(diceToRoll) {
      // Craft api request for the roll and make request.
      let data = {
        user_id: "test",
        room_id: store.room.id,
        dice_type_ids: diceToRoll
      };

      return this.$axios
        .post("api/v1/dice/rolls", data)
        .then(response => {
          return response.data;
        })
        .catch(error => {
          console.error(`Error creating dice roll: ${error}`);
        });
    },

    // rollDiceBag will get all the dice quantity form the dice bag
    // and create a dice roll, after this it will grab the result and
    // set the result on data so it can be used by components that
    // transform this result in something visual.
    rollDiceBag() {
      let total = 0;
      const diceToRoll = [];

      // Add the dice that we want to roll.
      Object.keys(this.diceBag).forEach(key => {
        const die = this.diceBag[key];
        Array.from({ length: die.quantity }, (x, i) => {
          diceToRoll.push(die.metadata.apiId);
        });
        total += die.quantity;
      });

      if (total <= 0) {
        return;
      }

      this.makeCreateDiceRollRequest(diceToRoll)
        .then(result => {
          this.diceRollApiResult = result;
        })
        .catch(error => {
          console.error(`Error creating dice roll: ${error}`);
        });
    }
  }
};
</script>
