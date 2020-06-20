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

    // getRoomUsers gets room users using the server REST API and
    // returns a list of user instances with `id` and `name`.
    async getRoomUsers() {
      try {
        const users = await this.$apiUserService.listRoomUsers(store.room.id);
        return users;
      } catch (e) {
        console.log(`error getting users: ${e}`);
        this.$q.notify({
          type: "negative",
          message: "Error getting users"
        });
      }
    },

    // onInputValue will set on every text input change the value
    // on our model. This is required because the user can use a
    // new value without pressing enter key on the select.
    onInputValue(val) {
      this.selectedUser = val;
    },

    // createUser creates an user in the server using the REST API and
    // returns an user instance with `id` and `name`.
    async createUser() {
      try {
        const user = await this.$apiUserService.createUser(
          store.room.id,
          this.selectedUser
        );
        return user;
      } catch (e) {
        console.log(`error creating user: ${e}`);
        this.$q.notify({
          type: "negative",
          message: "Error creating user"
        });
      }
    },

    async onSubmit() {
      // If we are on the list create the user.
      let user = this.connectedUsersByName[this.selectedUser.toLowerCase()];
      if (!user) {
        user = await this.createUser();
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
  async mounted() {
    // Fetch data.
    const users = await this.getRoomUsers();

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
