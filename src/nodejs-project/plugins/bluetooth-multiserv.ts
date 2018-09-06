
function makePlugin(opts: any) {

  let bluetoothManager: any = opts.bluetoothManager;

  const name: string = "bluetooth"

  function scope(): string {
    return opts.scope || 'private';
  }

  function parse (addr: string): any {
    console.log("bluetooth: parsing address :o");

    if (!addr.startsWith("bt:")) return null;
    return addr.replace("bt:", "");
  }

  function client (address: string, cb: any): (() => void) {
    console.log("multiserv-puppet: client connection " + address)

    let duplexConnection = bluetoothManager.getConnection(address);

    if (!duplexConnection) {
      cb("No existing bluetooth connection to " + duplexConnection, null);
    } else {
      cb(null, duplexConnection);
    }

    return function() {
      // Close connection
      bluetoothManager.disconnect(address);
    }

  }

  function server (onConnection: any): (() => void) {
    console.log("starting server :o");

    // The bluetooth manager calls back with a duplex stream on a new connection
    // which we can then call back onConnection with
    bluetoothManager.listenForIncomingConnections(
      (err: any, connection: any) => onConnection(connection)
    )

    return function() {
      console.log("Stopping server :o");
      bluetoothManager.stopServer();
    }
  }

  return {
    name: name,
    scope: scope,
    parse: parse,
    client: client,
    server: server
  }

}

export = makePlugin;
