
export default function makePlugin(opts: any) {

  let bluetoothManager: any = opts.bluetoothManager;

  const name: string = "bluetooth"

  function scope(): string {
    return opts.scope || 'private';
  }

  function parse (str: string): string {
    if (!str.startsWith("bt:")) return null;
    return addr.replace("bt:", "");
  }

  function client (address: string, cb: any): ((): void) {
    let duplexConnection = bluetoothManager.getConnection(addr);

    if (!duplexConnection) {
      cb("No existing bluetooth connection to " + duplexConnection, null);
    } else {
      cb(null, duplexConnection);
    }

    return function() {
      // Close connection
      bluetoothManager.disconnect(addr);
    }

  }

  function server (onConnection: any): (any: void) {
    // The bluetooth manager calls back with a duplex stream on a new connection
    // which we can then call back onConnection with
    bluetoothManager.listenForIncomingConnections(
      (err, connection) => onConnection(connection)
    )

    return function() {
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

export default makePlugin;
