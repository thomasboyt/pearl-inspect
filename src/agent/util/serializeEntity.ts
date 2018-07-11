import { GameObject } from 'pearl';
import { SerializedEntityDetail } from '../types';

const hiddenTypes = [HTMLElement, AudioContext, CanvasRenderingContext2D];

type BlacklistMap = WeakMap<any, null>;
type SeenMap = WeakMap<any, boolean>;

function cloneValue(val: any, seen: SeenMap, blacklist: BlacklistMap) {
  /* Functions */
  if (typeof val === 'function') {
    return undefined; // TODO: there's a use case for serializing these into [object Function],
    // maybe just do this filtering UI-side
  }

  /* Arrays */
  if (Array.isArray(val)) {
    if (seen.has(val)) {
      return '[[Circular reference]]';
    }

    seen.set(val, true);
    return cloneArray(val, seen, blacklist);
  }

  /* Objects */
  if (typeof val === 'object' && val !== null) {
    // don't serialize the Coquette object, which is often stored on entities
    if (val === (window as any).__pearl__) {
      return '[[Pearl namespace]]';
    }
    if (seen.has(val)) {
      return '[[Circular reference]]';
    }
    if (blacklist.has(val)) {
      return '[[Entity ' + val.name + ']]';
    }

    if (hiddenTypes.some((type) => val instanceof type)) {
      return '[' + val.toString() + ']'; // looks like [[object HTMLElement]]
    }

    seen.set(val, true);
    return cloneObject(val, seen, blacklist);
  }

  /* Primitives */
  return val;
}

function cloneArray(arr: any[], seen: SeenMap, blacklist: BlacklistMap): any[] {
  const clone = arr.map(function(val) {
    return cloneValue(val, seen, blacklist);
  });

  return clone;
}

function cloneObject(
  obj: { [key: string]: any },
  seen: SeenMap,
  blacklist: BlacklistMap
) {
  const clone: { [key: string]: any } = {};

  for (let key of Object.keys(obj)) {
    clone[key] = cloneValue(obj[key], seen, blacklist);
  }

  return clone;
}

function serializeEntity(
  entity: GameObject,
  entities: GameObject[]
): SerializedEntityDetail {
  const entitiesMap = new WeakMap();
  // Chrome doesn't support WeakMap(iterable) yet :(
  entities.forEach((entity) => {
    entitiesMap.set(entity, null);
  });

  const seenMap = new WeakMap();

  const serializedComponents: { [key: string]: any } = {};

  for (let component of entity.components) {
    const name = component.constructor.name;
    serializedComponents[name] = cloneObject(component, seenMap, entitiesMap);
  }

  return {
    id: entity.id,
    components: serializedComponents,
  };
}

export default serializeEntity;
