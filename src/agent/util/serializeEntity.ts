import { GameObject } from '../../../../pearl/dist';
import { SerializedEntityDetail, SerializedComponent } from '../types';

const hiddenTypes = [HTMLElement, AudioContext, CanvasRenderingContext2D];

type BlacklistMap = WeakMap<any, null>;
type SeenMap = WeakMap<any, boolean>;

function getRecursiveProps(obj: Object): string[] {
  const prototype = Object.getPrototypeOf(obj);

  // stop here!
  if (prototype === Object.prototype) {
    return [];
  }

  const propNames = Object.getOwnPropertyNames(obj).filter((name) => {
    const desc = Object.getOwnPropertyDescriptor(obj, name)!;

    // TODO: return something to indicate it's not editable if desc.set is
    // missing
    // use same behavior if desc.writable is false I guess
    if (desc.hasOwnProperty('get')) {
      return true;
    } else {
      if (desc.hasOwnProperty('value')) {
        return true;
      }
    }

    return false;
  });

  if (!prototype) {
    return propNames;
  } else {
    return propNames.concat(getRecursiveProps(prototype));
  }
}

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
    // don't serialize the Pearl object, which is often stored on entity
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

  const props = getRecursiveProps(obj);

  for (let key of getRecursiveProps(obj)) {
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

  const serializedComponents: { [key: string]: SerializedComponent } = {};

  for (let component of entity.components) {
    const name = component.constructor.name;

    const properties = cloneObject(component, seenMap, entitiesMap);

    // TODO: Figure out how to do of this better
    // Maybe prevent getRecursiveProps from returning Component prototype props?
    delete properties['gameObject'];
    delete properties['initialSettings'];

    serializedComponents[name] = {
      name,
      properties,
    };
  }

  return {
    id: entity.id,
    components: serializedComponents,
  };
}

export default serializeEntity;

// const serialized = {
//   Physical: {
//     name: 'Physical',
//     properties: [{
//       name: 'center',
//       type: 'object',
//       value: {
//         x: 0,
//         y: 0,
//       },
//     }, {
//       name: 'angle',
//       type: 'number',
//       value: 0,
//     }],
//   },
//   PolygonCollider: {
//     name: 'PolygonCollider',
//     properties: [{
//       name: 'points',
//       type: 'array',
//       value: [[1, 0], [1, 1], [0, 1], [0, 0]],
//     }]
//   },
// }
