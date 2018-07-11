import * as React from 'react';
import { inject, observer } from 'mobx-react';
import sendMessage from '../util/sendMessage';
import EntitiesStore from '../stores/EntitiesStore';
import { SerializedComponent } from '../../agent/types';

interface Props {
  entitiesStore?: EntitiesStore;
}

@inject(({ entitiesStore }) => ({
  entitiesStore: entitiesStore as EntitiesStore,
}))
@observer
export default class EntityDetail extends React.Component<Props> {
  handleSelectEntity(id: string) {
    sendMessage('subscribeToEntity', { entityId: id });
  }

  render() {
    const entity = this.props.entitiesStore!.subscribedDetail;

    if (!entity) {
      return <div />;
    }

    const componentNames = Object.keys(entity.components);

    const nameComponentEntries = componentNames.map((name) => {
      // XXX: explicit annotation needed here because otherwise it thinks it's
      // just Object[]. shouldn't be needed if SerializedComponent becomes a
      // more specific interface
      const pair: [string, SerializedComponent] = [
        name,
        entity.components[name],
      ];
      return pair;
    });

    const components = nameComponentEntries.map(([name, component]) => {
      return (
        <li key={name} onClick={() => this.handleSelectEntity(entity.id)}>
          {name}
        </li>
      );
    });

    return <ul>{components}</ul>;
  }
}
