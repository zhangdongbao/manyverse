const nodejs = require('nodejs-mobile-react-native');
const BluetoothSerial = require('@happy0/react-native-bluetooth-serial');

const serviceUUID = "b0b2e90d-0cda-4bb0-8e4b-fb165cd17d48";

// note: might need completely refactored
function makeManager () {

  // TODO: Do we want to expose an observable of the open connections, and populate the observable based on
  // the connection lifecycle events below?

  function onConnect(params: any): void {
    console.log("Connection success");
    console.log(params);
  }

  function onConnectionFailed(params: any): void {
    console.log("Connection failed");
    console.log(params);
  }

  function onConnectionLost(params: any): void {
    console.log("Connection lost");
    console.log(params);
  }

  function setupEventListeners(): void {

    BluetoothSerial.on("connectionSuccess", onConnect);
    BluetoothSerial.on("connectionLost", onConnectionLost);
    BluetoothSerial.on("connectionFailed", onConnectionFailed);

    nodejs.channel.addListener('message', (msg: any) => {
      var message = JSON.parse(msg);

      if (message.type === "listenIncoming") {
        listenForIncomingConnections(null)
      }

    });
  }

  function listenForIncomingConnections(cb: any): void {
    console.log("bluetooth-man: Listening for incoming connections");

    BluetoothSerial.listenForIncomingConnections(
      "scuttlebutt", serviceUUID
    );

  }

  function stopServer(): void {
    // todo
  }

  function makeDeviceDiscoverable(seconds: any): void {
    return BluetoothSerial.makeDeviceDiscoverable(seconds);
  }

  function discoverUnpairedDevices(): any {
     return BluetoothSerial.discoverUnpairedDevices();
  }

  function listPairedDevices(): any {
    return BluetoothSerial.list();
  }

  function connect(address: string, publicKey?: string) {
    const bridgeMsg: any = {
      type: "msClient",
      params: {
        remoteAddress: address,
        publicKey: publicKey
      }
    }

    console.log("Connecting...");
    console.log(bridgeMsg);

    nodejs.channel.send(JSON.stringify(bridgeMsg));
  }

  setupEventListeners();

  return {
    connect: connect,
    makeDeviceDiscoverable: makeDeviceDiscoverable,
    discoverUnpairedDevices: discoverUnpairedDevices,
    listenForIncomingConnections: listenForIncomingConnections,
    listPairedDevices: listPairedDevices,
    stopServer: stopServer
  }

}

export = makeManager;
