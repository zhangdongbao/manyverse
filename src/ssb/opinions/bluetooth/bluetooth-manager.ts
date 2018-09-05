
// interface BluetoothManager {
//
//   start() : void;
//   makeDeviceDiscoverable (duration: number): void,
//   discoverUnpairedDevices() : Promise<any>,
//   listenForIncomingConnections( (string, any): void): any,
//   listPairedDevices(): Promise<any>,
//   getConnection(address: string): any,
//   connect(address: string): void,
//   disconnect(address:string): void,
//   stopServer(): void
//
// }

const pull = require('pull-stream');
const Pushable = require('pull-pushable');
import BluetoothSerial from 'react-native-bluetooth-serial'

export default () => {

  const serviceUUID = "b0b2e90d-0cda-4bb0-8e4b-fb165cd17d48";

  const connections = {

  };

  let onIncomingConnection: any = null;
  let onOutgoingConnection: any = null;

  function onConnect(params: any): void {
    const deviceAddress = params.remoteAddress;

    // Source: reading from the remote device
    // Sink: writing to the remote device
    const duplexStream = {
      source: Pushable(),
      sink: pull.drain((data) => BluetoothSerial.writeToDevice(deviceAddress, btoa(data)))
    }

    connections[deviceAddress] = duplexStream;

    if (onIncomingConnection && params.isIncoming) {
      onIncomingConnection(null, duplexStream);
    } else {
      onOutgoingConnection(null, "bt:" + deviceAddress)
    }
  }

  function onConnectionFailed(params: any): void {
    const deviceAddress = params.remoteAddress;

    const duplexStream = connections[deviceAddress];

    if (duplexStream) {
      duplexStream.source.end();
      delete connections[deviceAddress];
    }

  }

  function onConnectionLost(params: any): void {
    const deviceAddress = params.remoteAddress;

    const duplexStream = connections[deviceAddress];

    if (duplexStream) {
      duplexStream.source.end();
      delete connections[deviceAddress];
    }
  }

  function onDataRead(params): void {
    const deviceAddress = params.remoteAddress;
    const data = params.data;

    const duplexStream = connections[deviceAddress];

    if (duplexStream) {
      duplexStream.source.push(data);
    } else {
      console.log("Unexpectedly didn't find address in device map.")
    }

  }

  function setupEventListeners(): void {
    BluetoothSerial.on("connectionSuccess", onConnect);
    BluetoothSerial.on("connectionLost", onConnectionLost);
    BluetoothSerial.on("connectionFailed", onConnectionFailed);
    BluetoothSerial.on("read", onDataRead);
  }

  function start(onOutgoing: any): void {
    onOutgoingConnection = onOutgoing;

    setupEventListeners();
  }

  function listenForIncomingConnections(cb): void {
    onIncomingConnection = cb;

    BluetoothSerial.listenForIncomingConnections(
      "scuttlebutt", serviceUUID
    );
  }

  function stopServer(): void {
    // ...
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

  function connect(address): void {
    BluetoothSerial.connect(address, "b0b2e90d-0cda-4bb0-8e4b-fb165cd17d48");
  }

  function disconnect(address): void {
    // ...
  }

  function getConnection(address): any {
    return connections[address];
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
