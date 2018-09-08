var nodejs = require('nodejs-mobile-react-native');

var BluetoothSerial = require('react-native-bluetooth-serial');

const serviceUUID = "b0b2e90d-0cda-4bb0-8e4b-fb165cd17d48";

// note: might need completely refactored
function makeManager () {

  function onConnect(params: any): void {

    var bridgeMsg = {
      type: "connectionSuccess",
      params: params
    }

    nodejs.channel.send(JSON.stringify(bridgeMsg));
  }

  function onConnectionFailed(params: any): void {
    var bridgeMsg = {
      type: "connectionFailed",
      params: params
    }

      nodejs.channel.send(JSON.stringify(bridgeMsg));

  }

  function onConnectionLost(params: any): void {
    var bridgeMsg = {
      type: "connectionLost",
      params: params
    }

    console.log("Sending connection lost to: " + params.remoteAddress + " over bridge.");
    nodejs.channel.send(JSON.stringify(bridgeMsg));
  }

  function onDataRead(params: any): void {
    var bridgeMsg = {
      type: "read",
      params: params
    }

    nodejs.channel.send(JSON.stringify(bridgeMsg));
  }

  function setupEventListeners(): void {

    BluetoothSerial.on("connectionSuccess", onConnect);
    BluetoothSerial.on("connectionLost", onConnectionLost);
    BluetoothSerial.on("connectionFailed", onConnectionFailed);
    BluetoothSerial.on("read", onDataRead);

    nodejs.channel.addListener('message', (msg: any) => {
      var message = JSON.parse(msg);

      if (message.type === "listenIncoming") {
        listenForIncomingConnections(null)
      }
      else if (message.type === "write") {
        console.log("Got write over react bridge");
        BluetoothSerial.writeToDevice(message.params.remoteAddress, btoa(message.params.data));
      } else if (message.type === "connectTo") {
        console.log("Asked to connect to: " + message.params.remoteAddress + " over bridge.");
        const remoteAddress: any = message.params.remoteAddress
        connect(remoteAddress);
      }

    });
  }

  function listenForIncomingConnections(cb: any): void {
    console.log("bluetooth-man: Listening for incoming connections");

    BluetoothSerial.listenForIncomingConnections(
      "scuttlebutt", serviceUUID
    );

  }

  function getConnection(address: any): any {
    // not needed here
  }

  function stopServer(): void {
    // todo
  }

  function makeDeviceDiscoverable(): void {
     BluetoothSerial.makeDeviceDiscoverable(120);
  }

  function discoverUnpairedDevices(): any {
     return BluetoothSerial.discoverUnpairedDevices();
  }

  function listPairedDevices(): any {
    return BluetoothSerial.list();
  }

  function connect(address: any): void {
    BluetoothSerial.connect(address, "b0b2e90d-0cda-4bb0-8e4b-fb165cd17d48");
  }

  setupEventListeners();

  return {
    makeDeviceDiscoverable: makeDeviceDiscoverable,
    discoverUnpairedDevices: discoverUnpairedDevices,
    listenForIncomingConnections: listenForIncomingConnections,
    listPairedDevices: listPairedDevices,
    getConnection: getConnection,
    stopServer: stopServer
  }

}

export = makeManager;
