<template>
  <div>
    <q-form @submit="onSubmit" class="q-gutter-sm">
      <q-select
        rounded
        outlined
        new-value-mode="add-unique"
        v-model="selectedUser"
        use-input
        hide-selected
        fill-input
        add-unique
        input-debounce="0"
        options-dense
        :options="options"
        @filter="filterFn"
        @input-value="onInputValue"
        :rules="[requiredValidation, regexValidation]"
      >
        <template v-slot:prepend>
          <q-icon name="person" />
        </template>
      </q-select>

      <div>
        <q-btn :label="buttonText" type="submit" color="primary" />
      </div>
    </q-form>
  </div>
</template>

<script>
import { store } from "../store/store.js";

export default {
  name: "SelectUserInRoomForm",

  data() {
    return {
      connectedUsersByName: {},
      connectedUsers: [],
      options: [],
      selectedUser: ""
    };
  },
  methods: {
    filterFn(val, update, abort) {
      update(() => {
        const needle = val.toLowerCase();
        this.options = this.connectedUsers.filter(
          v => v.toLowerCase().indexOf(needle) > -1
        );
      });
    },
    getRoomUsers() {
      const users = [
        { id: "user1", name: "User1" },
        { id: "user2", name: "User2" },
        { id: "user3", name: "User3" },
        { id: "user4", name: "User4" },
        { id: "test1", name: "test1" },
        { id: "test2", name: "Test2" },
        { id: "test3", name: "test3" },
        { id: "test4", name: "Test4" },
        { id: "other user1", name: "Other User1" },
        { id: "other user2", name: "Other User2" },
        { id: "other user3", name: "Other User3" },
        { id: "other user4", name: "Other User4" }
      ];

      return users;
    },

    // onInputValue will set on every text input change the value
    // on our model. This is required because the user can use a
    // new value without pressing enter key on the select.
    onInputValue(val) {
      this.selectedUser = val;
    },
    onSubmit() {
      // If we are on the list create the user.
      let user = this.connectedUsersByName[this.selectedUser.toLowerCase()];
      if (!user) {
        user = { id: this.selectedUser, name: this.selectedUser };
        // TODO(slok): Create user.
        console.log(`user created: ${user.id} ${user.name}`);
      }

      // Save our user data.
      store.user.id = user.id;
      store.user.name = user.name;

      // Back to our room.
      this.$router.push({ name: "room", params: { roomId: store.room.id } });
    },

    // Username input validation methods.
    requiredValidation(val) {
      return (val && val.length > 0) || "Username is required";
    },
    regexValidation(val) {
      const letters = /^[0-9a-zA-Z _\-.']+$/;
      return (
        letters.test(val) ||
        "Only numbers, letters, space and '.-_ characters  allowed"
      );
    }
  },
  computed: {
    // buttonText will return the button text based on the selected user, if is on
    // our known user list or not.
    buttonText() {
      let user = this.connectedUsersByName[this.selectedUser.toLowerCase()];
      if (user) {
        return "Log as user";
      }

      return "Create user";
    }
  },
  mounted() {
    // Fetch data.
    const users = this.getRoomUsers();

    // Prepare data.
    let connectedUsersByName = {};
    let connectedUsers = [];
    users.forEach(v => {
      connectedUsers.push(v.name);
      connectedUsersByName[v.name.toLowerCase()] = v;
    });

    this.connectedUsersByName = connectedUsersByName;
    this.connectedUsers = connectedUsers;
  }
};
</script>
