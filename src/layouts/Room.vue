<template>
  <div>
    <q-layout view="lHh Lpr lFf">
      <q-header elevated>
        <q-toolbar>
          <q-icon name="fas fa-door-closed" size="md" />
          <q-toolbar-title> {{ room.name }} </q-toolbar-title>
          {{ user.name }}
          <q-btn flat round dense icon="share" @click="copyURLToClipboard" />
        </q-toolbar>

        <q-tabs v-model="tab">
          <q-tab name="rollDice" icon="fas fa-dice-d20" label="Roll dice" />
          <q-tab name="all" icon="fas fa-book" label="All">
            <q-badge floating color="red" v-if="logs.notifications > 0">
              {{ logs.notifications }}
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
        </q-tab-panels>
      </q-page-container>
    </q-layout>
  </div>
</template>

<script>
import Vue from "vue";
import { copyToClipboard } from "quasar";
import { Mutex } from "async-mutex";

import { store } from "../store/store.js";
import { RoomEventService } from "../common/event";
import RoomIndex from "pages/RoomIndex";
import RoomLog from "pages/RoomLog";

export default {
  name: "Room",
  components: {
    RoomIndex,
    RoomLog
  },
  data() {
    return {
      tab: "rollDice",
      user: store.user,
      users: store.users,
      room: store.room,
      logs: store.logs,
      mutex: new Mutex()
    };
  },

  methods: {
    async getRoom() {
      try {
        const room = await this.$apiRoomService.getRoom(store.room.id);
        // We don't want to destroy the shared object.
        store.room.id = room.id;
        store.room.name = room.name;
      } catch (e) {
        console.log(`error getting room information: ${e}`);
        this.$q.notify({
          type: "negative",
          message: "Error getting room information"
        });
      }
    },

    async getDiceRolls() {
      // Use a mutex to log the gather of dice rolls, mainly this is needed because we can get dice
      // rolls in from different ways: regular internvals and websocket events. In case the regular
      // interval resync happens at the same time we received a websocket event so we get dice rolls
      // we will end with duplicated rolls because the same cursor value has been taken by both
      // gatherings. If we use a mutex, these two gathers will be sequantial.
      const releaseMutex = await this.mutex.acquire();
      try {
        // Get dice rolls.
        const diceRollsList = await this.$apiDiceRollService.listDiceRollsSince(
          store.room.id,
          store.logs.cursor
        );

        // Store next cursor if we have one.
        if (diceRollsList.cursor) {
          store.logs.cursor = diceRollsList.cursor;
        }

        // Set dice rolls.
        diceRollsList.diceRolls.forEach(diceRoll => {
          store.logs.diceRolls.unshift(diceRoll);
          store.logs.notifications++;
        });
      } catch (e) {
        console.log(`error getting first dice rolls: ${e}`);
        this.$q.notify({
          type: "negative",
          message: "Error getting dice rolls"
        });
      } finally {
        releaseMutex();
      }
    },

    getDiceRollsInterval(interval) {
      setInterval(this.getDiceRolls.bind(this), interval);
    },

    async fillFirstDiceRolls() {
      try {
        // Get dice rolls.
        const diceRollsList = await this.$apiDiceRollService.listDiceRolls(
          store.room.id
        );

        // Store next cursor if we have one.
        if (diceRollsList.cursor) {
          store.logs.cursor = diceRollsList.cursor;
        }

        // Set dice rolls.
        diceRollsList.diceRolls.forEach(diceRoll => {
          store.logs.diceRolls.unshift(diceRoll);
          store.logs.notifications++;
        });
      } catch (e) {
        console.log(`error getting first dice rolls: ${e}`);
        this.$q.notify({
          type: "negative",
          message: "Error getting dice rolls"
        });
      }
    },

    async fillUsers() {
      try {
        // Get users.
        const users = await this.$apiUserService.listRoomUsers(store.room.id);

        // Set user data on the global store.
        users.forEach(user => {
          // Use Vue.set because new objects that need to be reative need to be
          // set like this so Vue can track them.
          Vue.set(store.users, user.id, {
            id: user.id,
            name: user.name
          });
        });
      } catch (e) {
        console.log(`error getting users: ${e}`);
        this.$q.notify({
          type: "negative",
          message: "Error getting userss"
        });
      }
    },

    async getUsersInterval(interval) {
      setInterval(
        async function() {
          try {
            // Get users.
            const users = await this.$apiUserService.listRoomUsers(
              store.room.id
            );

            // Set user data on the global store.
            users.forEach(user => {
              // Use Vue.set because new objects that need to be reative need to be
              // set like this so Vue can track them.
              Vue.set(store.users, user.id, {
                id: user.id,
                name: user.name
              });
            });
          } catch (e) {
            console.log(`error getting users: ${e}`);
            this.$q.notify({
              type: "negative",
              message: "Error getting userss"
            });
          }
        }.bind(this),
        interval
      );
    },

    async copyURLToClipboard() {
      try {
        await copyToClipboard(window.location.href);
        this.$q.notify({
          type: "positive",
          message: "URL copied to clipboard"
        });
      } catch (e) {
        console.log(`error copying url to clipboard: ${e}`);
        this.$q.notify({
          type: "negative",
          message: "could not copy URL to clipboard"
        });
      }
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
    await this.fillUsers();
    await this.fillFirstDiceRolls();

    // Resync intervals.
    this.getUsersInterval(10000);
    this.getDiceRollsInterval(15000); // Fallback resync in case websocket missed.

    // Subscriptions to events.
    const evService = new RoomEventService(
      this.$rollifyWsApiAddress,
      store.room.id
    );
    evService.subscribeDiceRollCreated(this.getDiceRolls);
  }
};
</script>
