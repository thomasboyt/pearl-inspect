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
