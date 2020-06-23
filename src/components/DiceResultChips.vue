<template>
  <div class="row q-pa-md q-gutter-xs">
    <div
      v-for="die in orderedDice"
      :key="die.id"
      class="col-2 q-pa-md q-gutter-xl items-center"
    >
      <q-chip
        dense
        :color="die.metadata.color"
        text-color="white"
        size="xl"
        square
      >
        {{ die.value }}
      </q-chip>
    </div>
  </div>
</template>

<script>
import moment from "moment";

export default {
  name: "DiceResultChips",
  props: {
    dice: Array
  },
  computed: {
    orderedDice: function() {
      const dice = this.dice; // This way we    don't have side effects.
      return dice.sort((a, b) => a.value - b.value);
    }
  }
};
</script>
