import { PearlInstance, GameObject } from 'pearl';
import sendMessage from './util/sendMessage';
import serializeEntity from './util/serializeEntity';
import deepUpdate from './util/deepUpdate';
import { SerializedEntity } from './types';

export default class Agent {
  pearl: PearlInstance;
  canvas: HTMLCanvasElement;

  subscribedEntityId?: string;

  constructor(pearl: PearlInstance) {
    this.pearl = pearl;
    this.canvas = pearl.renderer.getCtx().canvas;

    this.initDebugLoop();
    this.initDevtoolsMessageListener();
  }

  initDebugLoop() {
    const debugLoop = () => {
      this.reportEntities();

      // Ensure that this isn't re-enqueued on the same frame, or the runner gets stuck in an endless
      // loop.
      // TODO: setTimeout() seems like a non-optimal way to do this, could end up missing frames
      // or hurting perf? :C
      setTimeout(() => {
        this.pearl.runner.add(debugLoop);
      });
    };

    this.pearl.runner.add(debugLoop);
  }

  initDevtoolsMessageListener() {
    window.addEventListener('message', (event) => {
      // Only accept messages from same frame
      if (event.source !== window) {
        return;
      }

      const message = event.data;

      // Only accept messages of correct format (our messages)
      if (
        typeof message !== 'object' ||
        message === null ||
        message.source !== 'coquette-inspect-devtools'
      ) {
        return;
      }

      this.handleMessage(message);
    });
  }

  reportEntities() {
    const entities = [...this.pearl.entities.all()];

    const entitiesList: SerializedEntity[] = entities.map((entity) => {
      return {
        name: entity.name,
        id: entity.id,
      };
    });

    var id = this.subscribedEntityId;

    sendMessage('tick', {
      entities: entitiesList,
      subscribedEntity: this.serializeSubscribedEntity(id, entities),
    });
  }

  serializeSubscribedEntity(id: string | undefined, entities: GameObject[]) {
    if (id === undefined) {
      return;
    }

    var entity = entities.filter((entity) => id === entity.id)[0];

    if (!entity) {
      this.subscribedEntityId = undefined;
      return;
    }

    return serializeEntity(entity, entities);
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
    // Broadcast when the dev tools are opened
    connect: () => {
      sendMessage('connected');
    },

    pause: () => {
      this.pearl.ticker.stop();
      sendMessage('paused');
    },

    unpause: () => {
      this.pearl.ticker.start();
      sendMessage('unpaused');
    },

    step: () => {
      this.pearl.ticker.start(); // this sets a cb for the requestAnimationFrame() loop..
      this.pearl.ticker.stop(); // ...and this unsets it, so that only one frame is run
    },

    updateProperty: (data) => {
      var entity = [...this.pearl.entities.all()].filter(
        (entity) => entity.id === data.entityId
      )[0];

      if (!entity) {
        throw new Error('No entity found with id ' + data.entityId);
      }

      var val;
      try {
        val = eval(data.value);
      } catch (e) {
        // Don't update anything if the passed expression is invalid
        return;
      }

      deepUpdate(entity, data.path, val);
    },

    subscribeToEntity: (data) => {
      this.subscribedEntityId = data.entityId;
    },

    unsubscribeFromEntity: () => {
      this.subscribedEntityId = undefined;
    },

    // enableSelectMode: () => {
    //   this.attachSelectClickHandler();
    // },

    // disableSelectMode: () => {
    //   this.removeSelectClickHandler();
    // },
  };
}
