import * as React from 'react';
import { inject, observer } from 'mobx-react';
import sendMessage from '../util/sendMessage';
import EntitiesStore from '../stores/EntitiesStore';
import { SerializedComponent } from '../../agent/types';
import ComponentView from './ComponentView';
import objectEntries from '../util/objectEntries';

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

    const components = objectEntries(entity.components).map(
      ([name, component]) => (
        <ComponentView key={name} component={component} entityId={entity.id} />
      )
    );

    return <div className="component-list">{components}</div>;
  }
}
