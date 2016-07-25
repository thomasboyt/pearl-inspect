var _ = require('lodash');
var sendMessage = require('./util/sendMessage');
var serializeEntity = require('./util/serializeEntity');
var deepUpdate = require('../common/deepUpdate');

/**
 * TODO: why is this even a Class? doesn't really do anything particularly ~object-oriented~
 * not sure what to refactor it into, tho
 */
var Agent = function(game) {
  this.game = game;
  this.canvas = game.renderer.getCtx().canvas;

  // Agent state
  this.subscribedEntityId = null;

  // Kick off debug loop and message handler
  this.initDebugLoop();
  this.initDevtoolsMessageListener();
};

Agent.prototype.initDebugLoop = function() {
  var debugLoop = () => {
    this.reportEntities();

    // Ensure that this isn't re-enqueued on the same frame, or the runner gets stuck in an endless
    // loop.
    // TODO: setTimeout() seems like a non-optimal way to do this, could end up missing frames
    // or hurting perf? :C
    setTimeout(() => {
      this.game.runner.add(debugLoop);
    });
  };

  this.game.runner.add(debugLoop);
};

Agent.prototype.initDevtoolsMessageListener = function() {
  window.addEventListener('message', function(event) {
    // Only accept messages from same frame
    if (event.source !== window) {
      return;
    }

    var message = event.data;

    // Only accept messages of correct format (our messages)
    if (typeof message !== 'object' || message === null ||
        message.source !== 'coquette-inspect-devtools') {
      return;
    }

    this.handleMessage(message);
  }.bind(this));
};

Agent.prototype.reportEntities = function() {
  var entities = [...this.game.entities.all()];

  var entitiesList = entities.map((entity) => {
    return {
      displayName: entity.name || entity.constructor.name,
      entityId: entity.__inspect_uuid__
    };
  });

  var id = this.subscribedEntityId;

  sendMessage('tick', {
    entities: entitiesList,
    subscribedEntity: this.serializeSubscribedEntity(id, entities)
  });
};

Agent.prototype.serializeSubscribedEntity = function(id, entities) {
  if (this.subscribedEntityId === null) {
    return;
  }

  var entity = entities.filter((entity) => id === entity.__inspect_uuid__)[0];

  if (!entity) {
    this.subscribedEntityId = null;
    return;
  }

  return serializeEntity(entity, entities);
};

Agent.prototype.handlers = {

  // Broadcast when the dev tools are opened
  connect: function() {
    sendMessage('connected');
  },

  pause: function() {
    this.game.ticker.stop();
    sendMessage('paused');
  },

  unpause: function() {
    this.game.ticker.start();
    sendMessage('unpaused');
  },

  step: function() {
    this.game.ticker.start();  // this sets a cb for the requestAnimationFrame() loop..
    this.game.ticker.stop();   // ...and this unsets it, so that only one frame is run
  },

  updateProperty: function(data) {
    /* jshint evil: true */

    // find entity by UUID
    var entity = [...this.game.entities.all()]
        .filter((entity) => entity.__inspect_uuid__ === data.entityId)[0];

    if (!entity) {
      throw new Error('No entity found with id ' + data.entityId);
    }

    var val;
    try {
      val = eval(data.value);
    } catch(e) {
      // Don't update anything if the passed expression is invalid
      return;
    }

    deepUpdate(entity, data.path, val);
  },

  subscribeToEntity: function(data) {
    this.subscribedEntityId = data.entityId;
  },

  unsubscribeFromEntity: function(/*data*/) {
    this.subscribedEntityId = null;
  },

  enableSelectMode: function() {
    this.attachSelectClickHandler();
  },

  disableSelectMode: function() {
    this.removeSelectClickHandler();
  }
};


Agent.prototype.attachSelectClickHandler = function() {
  if (this._findTargetCb) {
    // already enabled
    return;
  }

  this._findTargetCb = (e) => {
    e.stopPropagation();

    var x = e.pageX - e.target.offsetLeft;
    var y = e.pageY - e.target.offsetTop;

    var matching = _.find(this.game.entities.all(), (obj) => {
      if (!obj.center || !obj.size) {
        return false;
      }
      return this.Coquette.Collider.Maths.pointInsideObj({x, y}, obj);
    });

    if (matching) {
      this.subscribedEntityId = matching.__inspect_uuid__;
    }

    this.removeSelectClickHandler();
  };

  this.canvas.addEventListener('click', this._findTargetCb);
  this.canvas.style.cursor = 'pointer';

  sendMessage('enabledSelectMode');
};

Agent.prototype.removeSelectClickHandler = function() {
  this.canvas.removeEventListener('click', this._findTargetCb);
  delete this._findTargetCb;
  this.canvas.style.cursor = 'default';

  sendMessage('disabledSelectMode');
};

Agent.prototype.handleMessage = function(message) {
  var handler = this.handlers[message.name];
  if (!handler) {
    console.warn('No handler found for event ' + name);
    return;
  }

  handler.call(this, message.data);
};

module.exports = Agent;
