import { observable, action } from 'mobx';

export default class ConnectionStore {
  @observable isConnected = false;

  @action
  onConnected() {
    this.isConnected = true;
  }
}
