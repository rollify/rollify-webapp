<template>
  <q-layout view="lHh Lpr lFf">
    <q-page-container>
      <SelectUser />
    </q-page-container>
  </q-layout>
</template>

<script>
import { store } from "../store/store.js";
import SelectUser from "pages/SelectUser";

export default {
  name: "Login",
  components: {
    SelectUser
  },
  beforeRouteEnter(to, from, next) {
    // If we don't come from a room redirect to index.
    if (store.room.id === "") {
      console.log("no room to log in, redirecting to index");
      next({ name: "index" });
      return;
    }
    next();
  }
};
</script>
