import { GameObject, Component } from 'pearl';
import {
  SerializedEntityDetail,
  SerializedComponent,
  SerializedProperty,
} from '../types';

function getRecursivePropNames(obj: Object): string[] {
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
        // remove functions
        if (typeof desc.value === 'function') {
          return false;
        }

        return true;
      }
    }

    return false;
  });

  if (!prototype) {
    return propNames;
  } else {
    return propNames.concat(getRecursivePropNames(prototype));
  }
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

    const properties = serializeComponentProperties(component);

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

// this is split up for awkward type checking reasons
const unserializedComponentPropNamesArray: (keyof Component<any>)[] = [
  'gameObject',
  'pearl',
  'initialSettings',
];

const unserializedComponentPropNames: Set<string> = new Set(
  unserializedComponentPropNamesArray
);

function serializeComponentProperties(component: Component<any>) {
  const propNames = getRecursivePropNames(component).filter(
    (name) => !unserializedComponentPropNames.has(name)
  );

  const clone: { [key: string]: SerializedProperty } = {};

  for (let propName of propNames) {
    clone[propName] = serializeProperty(component, propName);
  }

  return clone;
}

// TODO: AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA
//
// We can't use the imported Pearl GameObject because that is a _completely
// separate object_, bundled by Webpack! I'm not sure what the hell the long
// term plan is here, lord only knows how I'm gonna identify components. Might
// be as stupid as attaching them to the __pearl__ namespace inside Pearl
// instantiation??
const gameObjectConstructor = (window as any)['__pearl__'].obj.constructor;

function serializeProperty(
  component: Component<any>,
  propName: string
): SerializedProperty {
  const val = (component as any)[propName];

  if (Array.isArray(val)) {
    // TODO: more here maybe
    return {
      name: propName,
      type: 'array',
    };
  }

  /* Objects */
  if (typeof val === 'object' && val !== null) {
    // if (propName === 'worldObj') {
    //   debugger;
    // }
    if (val instanceof gameObjectConstructor) {
      return {
        name: propName,
        type: 'entity',
        entityId: val.id,
      };
    }

    if (isCoordinates(val)) {
      return {
        name: propName,
        type: 'coordinates',
        value: {
          x: val.x,
          y: val.y,
        },
      };
    }

    // TODO: lmfao
    // yes, this parses out `[object Foo]` to `Foo`
    const objectType = Object.prototype.toString.call(val).slice(8, -1);

    return {
      name: propName,
      type: 'object',
      objectType,
    };
  }

  /* Primitives */
  return {
    name: propName,
    type: 'primitive',
    value: val,
  };
}

/**
 * TODO: lmfao this is brittle as hell
 */
function isCoordinates(obj: Object): boolean {
  return (
    obj.constructor === Object &&
    Object.keys(obj).length === 2 &&
    obj.hasOwnProperty('x') &&
    obj.hasOwnProperty('y')
  );
}
