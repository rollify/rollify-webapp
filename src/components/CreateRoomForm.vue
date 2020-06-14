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
export default {
  name: "CreateRoomForm",
  data() {
    return {
      roomName: ""
    };
  },
  methods: {
    onSubmit() {
      let data = { name: this.roomName };
      this.$axios.post("api/v1/rooms", data).then(response => {
        const id = response.data.id;
        console.log(`Room created ${id}`);
        this.$router.push(`/room/${id}`);
      });
    }
  }
};
</script>
