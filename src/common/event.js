// RoomEventService knows how to subscribe to room events and handle
// them when these events are received.
export class RoomEventService {
  constructor(host, room) {
    // Initialize variables.
    this.host = host;
    this.room = room;
    this.onDiceRollCreatedEvents = [];

    // Connect.
    this.connectWebSocket();
  }

  // private method thja connects to the websocket and reconnects if the connection fails
  // it will call to the callbacks subscribed to the different room events
  connectWebSocket() {
    var ws = new WebSocket(`${this.host}/api/v1/ws/rooms/${this.room}`);
    ws.onopen = () => {
      console.log(`connected to websocket in room ${this.room}`);
    };

    // Handle each of the different events we can receive from our server.
    ws.onmessage = async e => {
      const event = JSON.parse(e.data);

      if (event.metadata.type == "EventDiceRollCreated") {
        // Call all registered handlers.
        this.onDiceRollCreatedEvents.forEach(callback => {
          callback(event);
        });
      } else {
        console.log("unknown websocket event type, ignoring...:", e.data);
      }
    };

    // When websocket closed, reconnect after some time.
    ws.onclose = e => {
      console.log(
        "socket is closed. Reconnect will be attempted in 1 second.",
        e.reason
      );
      setTimeout(() => {
        this.connectWebSocket();
      }, 1000);
    };

    // If we have any error, close our websocket, closing it will make
    // our websocket reconnect.
    ws.onerror = err => {
      console.error(
        "socket encountered error: ",
        err.message,
        "closing socket"
      );
      ws.close();
    };
  }

  // subscribeDiceRollCreated subscribes with a callback when a dice roll
  // event is received.
  subscribeDiceRollCreated(callback) {
    this.onDiceRollCreatedEvents.push(callback);
  }
}
