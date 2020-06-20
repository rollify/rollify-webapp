// RoomService knows how to contact with the server to make HTTP
// Room API calls.
export function RoomService(axiosClient) {
  // Creates a new room and returns a room model:
  // {
  //   id   string
  //   name string
  // }
  async function createRoom(roomName) {
    const data = { name: roomName };
    const resp = await axiosClient.post("api/v1/rooms", data);

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
