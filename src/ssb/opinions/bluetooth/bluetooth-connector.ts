export interface BluetoothConnector {

  discoverUnpairedDevices() : Promise<any>,
  listPairedDevices(): Promise<any>,
  connect(address: string): void,
  disconnect(address:string): void,
}
