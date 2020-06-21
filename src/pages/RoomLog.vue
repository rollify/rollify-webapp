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
          :pagination="pagination"
          row-key="id"
        >
          <template v-slot:body="props">
            <q-tr :props="props">
              <q-td key="time" :props="props">
                <HumanDate :date="props.row.ts" />
              </q-td>
              <q-td key="user" :props="props">
                <h6>{{ props.row.user }}</h6>
              </q-td>
              <q-td key="diceRolls" :props="props">
                <div class="row q-pa-xs q-gutter-xs justify-right">
                  <div
                    v-for="die in props.row.dice"
                    :key="die.id"
                    class="col-1"
                  >
                    <q-avatar
                      size="md"
                      :color="die.metadata.color"
                      text-color="white"
                    >
                      {{ die.value }}
                    </q-avatar>
                  </div>
                </div>
              </q-td>
            </q-tr>
          </template>
        </q-table>
      </div>
    </div>
  </q-page>
</template>

<script>
import { store } from "../store/store.js";
import HumanDate from "components/HumanDate";

export default {
  name: "RoomLog",
  components: {
    HumanDate
  },
  data() {
    return {
      logs: store.logs,
      pagination: {
        page: 1,
        rowsPerPage: 10
      },
      columns: [
        {
          name: "time",
          required: true,
          label: "Time",
          align: "left"
        },
        {
          name: "user",
          required: true,
          label: "User",
          align: "left"
        },
        {
          required: true,
          name: "diceRolls",
          align: "center",
          label: "Dice roll"
        }
      ]
    };
  },
  mounted() {
    // Notifications have been read read.
    store.logs.notifications = 0;
  },
  updated() {
    // Notifications have been read read.
    store.logs.notifications = 0;
  }
};
</script>
