<template>
  <q-page class="">
    <div class="row">
      <h1>User {{ user.name }}</h1>
    </div>

    <div class="row">
      <template>
        <div>
          <q-table
            title="dice rolls"
            :data="user.diceRolls"
            :columns="columns"
            row-key="name"
          />
        </div>
      </template>
    </div>
  </q-page>
</template>

<script>
import { store } from "../store/store.js";

export default {
  name: "RoomUser",
  props: {
    user: Object
  },
  data() {
    return {
      columns: [
        {
          name: "time",
          required: true,
          label: "Time",
          align: "left",
          field: row => row.ts,
          format: val => `${val}`,
          sortable: true
        },
        {
          name: "msg",
          align: "center",
          label: "Dice roll",
          field: row => row.msg,
          format: val => `${val}`
        }
      ]
    };
  },
  mounted() {
    // When mounted mark the user notifications as read.
    this.user.notifications = 0;
  }
};
</script>
