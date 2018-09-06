
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

var rn_bridge = require('rn-bridge');

function makeManager () {

  const connections = {

  };

  let onIncomingConnection: any = null;
  let onOutgoingConnection: any = null;

  function onConnect(params: any): void {
    console.log("puppet: incoming connection");
    console.log(params);

    const deviceAddress = params.remoteAddress;

    // Source: reading from the remote device
    // Sink: writing to the remote device
    const duplexStream = {
      source: Pushable(),
      sink: pull.drain( (msg: any) => {

        var bridgeMsg = {
          type: "write",
          params: {
            data: msg,
            remoteAddress: deviceAddress
          }
        }

        rn_bridge.channel.send(JSON.stringify(bridgeMsg));
      })  // Sink to bridge!
    }

    connections[deviceAddress] = duplexStream;

    if (onIncomingConnection && params.isIncoming) {
      onIncomingConnection(null, duplexStream);
    } else {
      onOutgoingConnection(null, "bt:" + deviceAddress)
    }
  }

  function onConnectionFailed(params: any): void {
    console.log("puppet: failed connection");

    const deviceAddress = params.remoteAddress;

    const duplexStream = connections[deviceAddress];

    if (duplexStream) {
      duplexStream.source.end();
      delete connections[deviceAddress];
    }

  }

  function onConnectionLost(params: any): void {
    console.log("puppet: connection lost");
    console.log(params);
    const deviceAddress = params.remoteAddress;

    const duplexStream = connections[deviceAddress];

    if (duplexStream) {
      duplexStream.source.end();
      delete connections[deviceAddress];
    }
  }

  function onDataRead(params: any): void {
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

    rn_bridge.channel.on('message', (msg: any) => {
      var message = JSON.parse(msg);

      if (message.type === "connectionSuccess") {
        onConnect(message.params);
      } else if (message.type === "connectionLost") {
        onConnectionLost(message.params);
      } else if (message.type === "connectionFailed") {
        onConnectionFailed(message.params);
      }
      else if (message.type === "read") {
        onDataRead(message.params);
      }

    });
  }

  function start(onOutgoing: any): void {
    onOutgoingConnection = onOutgoing;

    setupEventListeners();
  }

  function listenForIncomingConnections(cb: any): void {
    onIncomingConnection = cb;

    var bridgeMsg = {
      type: "listenIncoming",
      params: {}
    }

    rn_bridge.channel.send(JSON.stringify(bridgeMsg));
  }

  function stopServer(): void {
    // not required for puppet
  }

  function makeDeviceDiscoverable(): void {
    // not required for puppet
  }

  function discoverUnpairedDevices(): any {
    // not required for puppet
  }

  function listPairedDevices(): any {
    // not required for puppet
  }

  function connect(address: any): void {
    // not required for puppet
  }

  function disconnect(address: any): void {
    // not required for puppet
  }

  function getConnection(address: any): any {
    console.log("Handing over connecton " + address);

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

export = makeManager;
