<template>
  <q-page class="flex flex-center">
    <div class="fixed-center text-center">
      <div class="row">
        <h1>Rollify</h1>
      </div>
      <div class="row">
        <CreateRoomForm />
      </div>
    </div>
  </q-page>
</template>

<script>
import CreateRoomForm from "components/CreateRoomForm";

export default {
  name: "PageIndex",
  components: {
    CreateRoomForm
  }
};
</script>
