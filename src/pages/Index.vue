<template>
  <q-page class="flex flex-center">
    <div class="fixed-center text-center">
      <div class="row">
        <div class="col-12">
          <h1>Rollify</h1>
        </div>
      </div>
      <div class="row">
        <div class="col-12">
          <CreateRoomForm />
        </div>
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
