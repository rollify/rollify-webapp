<template>
  <div>
    <q-layout view="lHh Lpr lFf">
      <q-header elevated>
        <q-toolbar>
          <q-icon name="fas fa-dungeon" size="md" />
          <q-toolbar-title> {{ room.name }} </q-toolbar-title>
          {{ user.name }}
          <q-btn flat round dense icon="share" />
        </q-toolbar>

        <q-tabs v-model="tab">
          <q-tab name="rollDice" icon="fas fa-dice-d20" label="Roll dice" />
          <q-tab name="all" icon="fas fa-book" label="All" />

          <q-tab
            v-for="user in users"
            :key="user.id"
            :name="user.name"
            icon="fas fa-user"
            :label="user.name"
          >
            <q-badge floating color="red" v-if="user.notifications > 0">
              {{ user.notifications }}
            </q-badge>
          </q-tab>
        </q-tabs>
      </q-header>

      <q-page-container>
        <q-tab-panels
          v-model="tab"
          animated
          swipeable
          transition-prev="jump-up"
          transition-next="jump-up"
        >
          <q-tab-panel name="rollDice">
            <RoomIndex />
          </q-tab-panel>

          <q-tab-panel name="all">
            <RoomLog />
          </q-tab-panel>

          <q-tab-panel
            v-for="user in users"
            :key="user.id"
            :name="user.name"
            icon="person"
            :label="user.name"
          >
            <RoomUser :user="user" />
          </q-tab-panel>
        </q-tab-panels>
      </q-page-container>
    </q-layout>
  </div>
</template>

<script>
import moment from "moment";
import Vue from "vue";

import { store } from "../store/store.js";
import RoomIndex from "pages/RoomIndex";
import RoomLog from "pages/RoomLog";
import RoomUser from "pages/RoomUser";

export default {
  name: "Room",
  components: {
    RoomIndex,
    RoomLog,
    RoomUser
  },
  data() {
    return {
      tab: "rollDice",
      user: store.user,
      users: store.users,
      room: store.room,
      logs: store.logs
    };
  },

  methods: {
    getRoom() {
      // We don't want to destroy the shared object.
      store.room.id = this.$route.params.roomId;
      store.room.name = "My awesome room";
    },

    getLogs() {
      // Fake receive dice rolls.
      setInterval(() => {
        store.logs.diceRolls.unshift({
          id: moment.now(),
          ts: moment(moment.now()),
          user: "user 1",
          msg: "[1,1,1,1,1]"
        });
        store.logs.notifications++;
      }, 1500);
    },

    // getRoomUsers gets room users using the server REST API and
    // returns a list of user instances with `id` and `name`.
    async getRoomUsers() {
      try {
        const params = { "room-id": store.room.id };
        const resp = await this.$axios.get("api/v1/users", { params: params });
        return resp.data.items;
      } catch (e) {
        console.log(`error getting users: ${e}`);
        this.$q.notify({
          type: "negative",
          message: "Error getting users"
        });
      }
    },

    async prepareUsers() {
      const users = await this.getRoomUsers();

      // Set user data on the global store.
      users.forEach(user => {
        // Don't add us.
        if (user.id == store.user.id) {
          return;
        }

        // Use Vue.set because new objects that need to be reative need to be
        // set like this so Vue can track them.
        Vue.set(store.users, user.id, {
          id: user.id,
          name: user.name,
          notifications: 5,
          diceRolls: [
            { ts: moment("1912-06-23T01:02:03Z"), msg: "[1,1,1,1,1]" },
            { ts: moment("1912-06-23T01:02:03Z"), msg: "[2,2,2,2]" },
            { ts: moment("1912-06-23T01:02:03Z"), msg: "[5,5,5,5,5]" }
          ]
        });
      });
    }
  },

  beforeRouteEnter(to, from, next) {
    // If we come directly to this url, maybe the room id is not set
    store.room.id = to.params.roomId;

    // Check if the user is logged, if not redirect to login.
    if (store.user.name === "") {
      console.log("user not logged to enter in room, redirect to login");
      next({ name: "login" });

      return;
    }

    next();
  },

  async mounted() {
    // Load initial data when mouting the base layout.
    await this.getRoom();
    await this.getLogs();
    await this.prepareUsers();
  }
};
</script>
