<template>
  <div>
    <q-btn
      round
      unelevated
      size="50px"
      dense
      :icon="'img:' + die.metadata.buttonImage"
      v-model="die"
      @click="incDiceBag()"
    >
      <q-badge
        v-if="die.quantity > 0"
        :color="die.metadata.color"
        floating
        v-model="die"
      >
        {{ die.quantity }}
      </q-badge>
    </q-btn>
  </div>
</template>

<script>
export default {
  name: "DieRollBtn",
  props: {
    die: Object
  },
  data() {
    return {};
  },
  methods: {
    incDiceBag() {
      this.die.quantity++;
    }
  }
};
</script>
