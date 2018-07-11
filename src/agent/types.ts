export interface SerializedEntity {
  name: string;
  id: string;
}

interface SerializedComponent {}

export interface SerializedEntityDetail {
  id: string;
  components: { [name: string]: SerializedComponent };
}
