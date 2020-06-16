<template>
  <div
    class="row q-pa-md items-start q-gutter-md flex-center"
    v-if="!this.diceRollResult.noResult"
  >
    <q-card class="col-2 my-card">
      <q-card-section>
        <div class="text-h6">Total</div>
      </q-card-section>

      <q-card-section class="q-pt-none">
        {{ diceRollResult.total }}
      </q-card-section>
    </q-card>

    <q-card class="col-6 my-card">
      <q-card-section>
        <div class="text-h6">All results</div>
      </q-card-section>

      <q-card-section>
        <div class="row q-pa-md q-gutter-xs">
          <div
            v-for="die in diceRollResult.allDice"
            :key="die.id"
            class="col-1 q-pa-md q-gutter-xs items-center"
          >
            <q-avatar size="md" :color="die.metadata.color" text-color="white">
              {{ die.value }}
            </q-avatar>
          </div>
        </div>
      </q-card-section>
    </q-card>

    <q-card class="col-3 my-card">
      <q-card-section>
        <div class="text-h6">Results by dice value</div>
      </q-card-section>

      <q-list>
        <q-item
          v-for="(quantity, value) in diceRollResult.resultsByValue"
          :key="value"
        >
          <q-item-section>
            <q-chip size="md">
              <q-avatar color="yellow" text-color="black">
                {{ quantity }}
              </q-avatar>
              dice of value {{ value }}
            </q-chip>
          </q-item-section>
        </q-item>
      </q-list>
    </q-card>
  </div>
</template>

<script>
import { store } from "../store/store.js";

export default {
  name: "DiceRollResultCards",
  props: {
    diceRollApiResult: Object
  },
  data() {
    return {};
  },
  computed: {
    diceRollResult() {
      const diceRollResult = {
        noResult: true,
        total: 0,
        allDice: [],
        resultsByValue: {}
      };

      // If no data then return empty.
      if (!this.diceRollApiResult.dice) {
        return diceRollResult;
      }

      // Map result to .
      diceRollResult.noResult = false;
      this.diceRollApiResult.dice.forEach(die => {
        die.value = die.side + 1;

        die.metadata = store.diceBag[die.dice_type_id].metadata;
        diceRollResult.total += die.value;
        diceRollResult.allDice.push(die);
        if (!diceRollResult.resultsByValue[die.value]) {
          diceRollResult.resultsByValue[die.value] = 1;
        } else {
          diceRollResult.resultsByValue[die.value] += 1;
        }
      });

      return diceRollResult;
    }
  }
};
</script>
