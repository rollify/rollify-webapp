<template>
  <div class="row">
    <div class="col">
      <div class="row">
        <q-btn
          round
          unelevated
          size="50px"
          dense
          :icon="
            'img:data:image/svg+xml;charset=utf8,' +
              die.metadata.svgWithColor(die.metadata.color)
          "
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
          :rules="[val => val >= 0]"
          style="max-width: 80px"
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
