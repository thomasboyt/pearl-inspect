export interface SerializedEntity {
  name: string;
  id: string;
}

export interface SerializedComponent {
  name: string;
  properties: { [name: string]: any };
}

export interface SerializedEntityDetail {
  id: string;
  components: { [name: string]: SerializedComponent };
}

type PropertyType =
  | 'object'
  | 'primitive'
  | 'array'
  | 'entity'
  | 'component'
  | 'coordinates';

interface BaseProperty {
  type: PropertyType;
  name: string;
}

interface ObjectProperty extends BaseProperty {
  type: 'object';
  objectType: string;
}

interface ArrayProperty extends BaseProperty {
  type: 'array';
  // TODO: support single-nested lists?
}

interface CoordinatesProperty extends BaseProperty {
  type: 'coordinates';
  value: {
    x: number;
    y: number;
  };
}

interface PrimitiveProperty extends BaseProperty {
  type: 'primitive';
  value: string | number | boolean | undefined | null;
}

interface EntityProperty extends BaseProperty {
  type: 'entity';
  entityId: string;
}

export type SerializedProperty =
  | ObjectProperty
  | ArrayProperty
  | PrimitiveProperty
  | EntityProperty
  // | ComponentProperty
  | CoordinatesProperty;
