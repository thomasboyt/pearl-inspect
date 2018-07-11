import { observable, action } from 'mobx';

import { SerializedEntity, SerializedEntityDetail } from '../../agent/types';
// var deepUpdate = require('../../common/deepUpdate');

export default class EntitiesStore {
  @observable entities: SerializedEntity[] = [];
  @observable subscribedDetail?: SerializedEntityDetail;
  @observable subscribedId?: number;

  @action
  onReceivedEntities(data: any) {
    this.entities = data.entities;

    if (data.subscribedEntity) {
      this.subscribedId = data.subscribedEntity.id;
      this.subscribedDetail = data.subscribedEntity;
    } else {
      this.subscribedId = undefined;
      this.subscribedDetail = undefined;
    }
  }

  // @action
  // onDidUpdateProperty(data: any) {
  //   var entity = this.entities.filter(
  //     (entity) => entity.id === data.entityId
  //   )[0];

  //   if (!entity) {
  //     throw new Error('No entity found with id ' + data.entityId);
  //   }

  //   deepUpdate(entity, data.path, data.value);
  // }
}
