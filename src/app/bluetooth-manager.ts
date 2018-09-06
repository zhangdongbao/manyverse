var nodejs = require('nodejs-mobile-react-native');

var BluetoothSerial = require('react-native-bluetooth-serial');

const serviceUUID = "b0b2e90d-0cda-4bb0-8e4b-fb165cd17d48";

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
        BluetoothSerial.writeToDevice(message.params.remoteAddress, btoa(JSON.stringify(message.params.data)));
      }

    });
  }

  function start(onOutgoing: any): void {
    setupEventListeners();
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

  function disconnect(address: any): void {
    // todo
  }

  return {
    start: start,
    makeDeviceDiscoverable: makeDeviceDiscoverable,
    discoverUnpairedDevices: discoverUnpairedDevices,
    listenForIncomingConnections: listenForIncomingConnections,
    listPairedDevices: listPairedDevices,
    getConnection: getConnection,
    connect: connect,
    disconnect: disconnect,
    stopServer: stopServer
  }

}

export = makeManager;
