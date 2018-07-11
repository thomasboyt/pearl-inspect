import * as React from 'react';
import { inject, observer } from 'mobx-react';
import sendMessage from '../util/sendMessage';
import EntitiesStore from '../stores/EntitiesStore';

interface Props {
  entitiesStore?: EntitiesStore;
}

@inject(({ entitiesStore }) => ({
  entitiesStore: entitiesStore as EntitiesStore,
}))
@observer
export default class EntitiesList extends React.Component<Props> {
  handleSelectEntity(id: string) {
    sendMessage('subscribeToEntity', { entityId: id });
  }

  render() {
    const entities = this.props.entitiesStore!.entities;

    const items = entities.map((entity) => {
      return (
        <li key={entity.id} onClick={() => this.handleSelectEntity(entity.id)}>
          {entity.name}
        </li>
      );
    });

    return <ul>{items}</ul>;
  }
}
