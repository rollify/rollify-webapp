<template>
  <div
    class="row q-pa-md items-start q-gutter-md flex-top"
    v-if="!this.diceRollResult.noResult"
  >
    <q-card class="col-2 my-card">
      <q-card-section>
        <div class="text-h6">Total</div>
      </q-card-section>

      <q-card-section class="q-pt-none">
        <h4>{{ diceRollResult.total }}</h4>
      </q-card-section>
    </q-card>

    <q-card class="col-9 my-card">
      <q-card-section>
        <div class="text-h6">All results</div>
      </q-card-section>

      <q-card-section>
        <DiceResultChips :dice="diceRollResult.allDice" />
      </q-card-section>
    </q-card>
  </div>
</template>

<script>
import { store } from "../store/store.js";
import DiceResultChips from "components/DiceResultChips";

export default {
  name: "DiceRollResultCards",
  props: {
    diceRollApiResult: Object
  },
  components: {
    DiceResultChips
  },
  data() {
    return {};
  },
  computed: {
    diceRollResult() {
      const diceRollResult = {
        noResult: true,
        total: 0,
        allDice: []
      };

      // If no data then return empty.
      if (!this.diceRollApiResult.dice) {
        return diceRollResult;
      }

      // Map result to .
      diceRollResult.noResult = false;
      this.diceRollApiResult.dice.forEach(die => {
        die.value = die.side + 1;

        // Set metadata.
        die.metadata = store.diceBag[die.dice_type_id].metadata;

        // Set total.
        diceRollResult.total += die.value;

        // Add all dice.
        diceRollResult.allDice.push(die);
      });

      return diceRollResult;
    }
  }
};
</script>
