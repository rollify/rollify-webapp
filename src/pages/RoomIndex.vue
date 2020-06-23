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
        <q-btn flat color="primary" label="Clear" @click="clearDiceBag" />
        <q-btn
          color="primary"
          label="Roll"
          icon="fas fa-dice-d6"
          @click="rollDiceBag"
        />
      </div>
    </div>
    <div ref="results">
      <DiceRollResultCards :diceRollApiResult="diceRollApiResult" />
    </div>
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
    async makeCreateDiceRollRequest(diceToRoll) {
      try {
        const diceRollResult = await this.$apiDiceRollService.createDiceRoll(
          store.room.id,
          store.user.id,
          diceToRoll
        );

        return diceRollResult;
      } catch (e) {
        console.error(`Error creating dice roll: ${e}`);
        this.$q.notify({
          type: "negative",
          message: "Error creating dice roll"
        });
      }
    },

    scrollToResult() {
      const el = this.$refs.results;
      window.scrollTo(0, el.scrollHeight);
    },

    // rollDiceBag will get all the dice quantity form the dice bag
    // and create a dice roll, after this it will grab the result and
    // set the result on data so it can be used by components that
    // transform this result in something visual.
    async rollDiceBag() {
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

      try {
        let result = await this.makeCreateDiceRollRequest(diceToRoll);
        this.diceRollApiResult = result;

        // Now scroll to the result.
        this.scrollToResult();
      } catch (e) {
        console.error(`Error creating dice roll: ${e}`);
      }
    }
  }
};
</script>
