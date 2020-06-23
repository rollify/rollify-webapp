<template>
  <div class="row">
    <div class="col">
      <div class="row">
        <q-btn
          round
          unelevated
          size="50px"
          dense
          :icon="'img:' + die.metadata.buttonImage"
          v-model="die"
          @click="incDiceBag()"
        />
      </div>
      <div class="row justify-center">
        <q-input
          dense
          v-model="die"
          v-model.number="die.quantity"
          :color="die.metadata.color"
          :label-color="die.metadata.color"
          type="number"
          outlined=""
          standout
          style="max-width: 75px"
        />
      </div>
    </div>
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
