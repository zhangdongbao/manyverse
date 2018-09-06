var rn_bridge = require('rn-bridge');

function make(bluetoothManager: any, stack: any) {

  rn_bridge.channel.on('message', (msg: any) => {
    var message = JSON.parse(msg);

    if (message.type === "connectionSuccess") {
      bluetoothManager.onConnect(message.params);

      const isOutgoingConnection = !message.params.isIncoming;
      if (isOutgoingConnection) {
        // This directs multiserv to look for the bluetooth handler, which
        // will then grab the duplex multistream from puppet-bluetooth-manager
        // that was initialised on the 'onConnect' function
        console.log("Handing outgoing connection to multiserv: " + message.params.remoteAddress);

        stack.connect("bt:" + message.params.remoteAddress, (err: any) => "error handing over to multiserv: " + err);
      }
    } else if (message.type === "connectionLost") {
      bluetoothManager.onConnectionLost(message.params);
    } else if (message.type === "connectionFailed") {
      bluetoothManager.onConnectionFailed(message.params);
    }
    else if (message.type === "read") {
      bluetoothManager.onDataRead(message.params);
    }

  });

}

export = make;
