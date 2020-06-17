<template>
  <div>
    <q-dialog v-model="alert">
      <q-card>
        <q-card-section>
          <div class="text-h6">Alert</div>
        </q-card-section>

        <q-card-section class="q-pt-none">
          {{ alertMessage }}
        </q-card-section>

        <q-card-actions align="right">
          <q-btn flat label="OK" color="primary" v-close-popup />
        </q-card-actions>
      </q-card>
    </q-dialog>

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
      roomName: "",
      alert: false,
      alertMessage: ""
    };
  },
  methods: {
    onSubmit() {
      const data = { name: this.roomName };
      this.$axios
        .post("api/v1/rooms", data)
        .then(response => {
          console.log(response);
          // Save our room data.
          store.room.id = response.data.id;
          store.room.name = response.data.name;

          // Go to our room.
          this.$router.push({
            name: "room",
            params: { roomId: store.room.id }
          });
        })
        .catch(error => {
          console.error(`Error creating room: ${error}`);
          this.alert = true;
          this.alertMessage = "Error creating room";
        });
    }
  }
};
</script>
