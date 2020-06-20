<template>
  <div>
    <q-form @submit="onSubmit" class="q-gutter-sm">
      <q-input
        rounded
        outlined
        v-model="roomName"
        label="Room name"
        lazy-rules
        :rules="[val => (val && val.length > 0) || 'Room name is required']"
      >
        <template v-slot:prepend>
          <q-icon name="meeting_room" />
        </template>
      </q-input>

      <div>
        <q-btn label="create room" type="submit" color="primary" />
      </div>
    </q-form>
  </div>
</template>

<script>
import { store } from "../store/store.js";

export default {
  name: "CreateRoomForm",
  data() {
    return {
      roomName: ""
    };
  },
  methods: {
    async onSubmit() {
      try {
        // Create room in the API.
        const room = await this.$apiRoomService.createRoom(this.roomName);

        // Save our room data on the store.
        store.room.id = room.id;
        store.room.name = room.name;

        // Go to our room.
        this.$router.push({
          name: "room",
          params: { roomId: store.room.id }
        });
      } catch (e) {
        console.error(`Error creating room: ${e}`);
        this.$q.notify({
          type: "negative",
          message: "Error creating room"
        });
      }
    }
  }
};
</script>
