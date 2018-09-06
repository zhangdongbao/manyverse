const pull = require('pull-stream');
const Pushable = require('pull-pushable');

var rn_bridge = require('rn-bridge');

function makeManager () {

  // A map of remote device mac address to the duplex stream for reading data data
  // from (the source) and sending data to (the sink)
  const connections = {

  };

  let onIncomingConnection: any = null;

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
            // the data is a byte array so marshall it to base64
            data: msg,
            remoteAddress: deviceAddress
          }
        }

        rn_bridge.channel.send(JSON.stringify(bridgeMsg));
      })
    }

    connections[deviceAddress] = duplexStream;

    if (onIncomingConnection && params.isIncoming) {
      // Pass the duplex stream to multiserv via the callback that was given
      // to us in our 'server' function implementation
      onIncomingConnection(null, duplexStream);
    }
  }

  function onConnectionFailed(params: any): void {
    console.log("puppet: failed connection");

    const deviceAddress = params.remoteAddress;

    const duplexStream = connections[deviceAddress];

    if (duplexStream) {
      // todo: is this enough to signal to multiserv to break the connection?
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
      // todo: is this enough to signal to multiserv to break the connection?
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

  function listenForIncomingConnections(cb: any): void {

    // We use this callback to handle back any duplex streams for incoming
    // connections.
    onIncomingConnection = cb;

    var bridgeMsg = {
      type: "listenIncoming",
      params: {}
    }

    rn_bridge.channel.send(JSON.stringify(bridgeMsg));
  }

  function getConnection(address: any): any {
    console.log("Handing over connecton " + address);

    return connections[address];
  }

  return {
    onConnect,
    onConnectionFailed,
    onConnectionLost,
    onDataRead,
    listenForIncomingConnections,
    getConnection: getConnection
  }

}

export = makeManager;
