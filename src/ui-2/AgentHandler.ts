import port from './util/port';
import injectDebugger from './injectDebugger';
import { Stores } from './stores';

export default class AgentHandler {
  stores: Stores;

  constructor(stores: Stores) {
    this.stores = stores;
    port.onMessage.addListener((msg) => {
      this.handleMessage(msg);
    });
  }

  handleMessage(message: any) {
    var handler = this.handlers[message.name];
    if (!handler) {
      console.warn('No handler found for event ' + name);
      return;
    }

    handler.call(this, message.data);
  }

  handlers: { [_: string]: (data?: any) => void } = {
    connected: () => this.stores.connectionStore.onConnected(),
    reloaded: () => injectDebugger(),

    tick: (data) => {
      this.stores.entitiesStore.onReceivedEntities({
        entities: data.entities,
        subscribedEntity: data.subscribedEntity,
      });

      this.stores.gameStore.onTicked();
    },

    paused: () => {
      this.stores.gameStore.onPausedGame();
    },
    unpaused: () => {
      this.stores.gameStore.onUnpausedGame();
    },
    enabledSelectMode: () => {
      this.stores.gameStore.onEnabledSelectMode();
    },
    disabledSelectMode: () => {
      this.stores.gameStore.onDisabledSelectMode();
    },
  };
}
