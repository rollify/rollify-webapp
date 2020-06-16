<template>
  <q-page class="q-pa-md">
    <div class="row justify-center">
      <div class="col-10">
        <h2>All dice rolls</h2>
      </div>
    </div>

    <div class="row justify-center">
      <div class="col-10">
        <q-table
          title="all dice rolls"
          :data="logs.diceRolls"
          :columns="columns"
          row-key="id"
        />
      </div>
    </div>
  </q-page>
</template>

<script>
import { store } from "../store/store.js";

export default {
  name: "RoomLog",
  data() {
    return {
      logs: store.logs,
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
          name: "user",
          required: true,
          label: "User",
          align: "left",
          field: row => row.user,
          format: val => `${val}`
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
  }
};
</script>
