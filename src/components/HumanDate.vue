<template>
  <div>{{ humanized }}</div>
</template>

<script>
import moment from "moment";

export default {
  name: "HumanDate",
  props: {
    date: String
  },
  computed: {
    humanized() {
      return moment(this.date).fromNow();
    }
  }
};
</script>
