<template>
  <q-page class="flex flex-center">
    <div class="fixed-center text-center">
      <div class="row">
        <div class="col-12">
          <h2>Log in as user</h2>
        </div>
      </div>
      <div class="row">
        <div class="col-12">
          <SelectUserInRoomForm />
        </div>
      </div>
    </div>
  </q-page>
</template>

<script>
import SelectUserInRoomForm from "components/SelectUserInRoomForm";

export default {
  name: "RoomSelectUser",
  components: {
    SelectUserInRoomForm
  }
};
</script>
