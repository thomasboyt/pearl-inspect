export interface SerializedEntity {
  name: string;
  id: string;
}

export type SerializedComponent = Object;

export interface SerializedEntityDetail {
  id: string;
  components: { [name: string]: SerializedComponent };
}
