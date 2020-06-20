// RoomService knows how to contact with the server to make HTTP
// room API calls.
export function RoomService(axiosClient) {
  // Creates a new room and returns a room model:
  // {
  //   id   string
  //   name string
  // }
  async function createRoom(roomName) {
    const resp = await axiosClient.post("api/v1/rooms", {
      name: roomName
    });

    return {
      id: resp.data.id,
      name: resp.data.name
    };
  }

  // Return our service object with all the functions.
  return {
    createRoom
  };
}

// UserService knows how to contact with the server to make HTTP
// user API calls.
export function UserService(axiosClient) {
  // Creates a new user and returns a user model:
  // {
  //   id   string
  //   name string
  // }
  async function createUser(roomId, username) {
    const resp = await axiosClient.post("api/v1/users", {
      room_id: roomId,
      name: username
    });

    return {
      id: resp.data.id,
      name: resp.data.name
    };
  }

  // listRoomUsers lists room users into a model:
  // [
  //   {
  //     id   string
  //     name string
  //   }
  //  ]
  async function listRoomUsers(roomId) {
    const resp = await axiosClient.get("api/v1/users", {
      params: {
        "room-id": roomId
      }
    });

    const users = [];
    resp.data.items.forEach(v => {
      users.push({
        id: v.id,
        name: v.name
      });
    });

    return users;
  }

  // Return our service object with all the functions.
  return {
    createUser,
    listRoomUsers
  };
}
