import * as React from 'react';
import { observer, inject } from 'mobx-react';
import ConnectionStore from '../stores/ConnectionStore';
import GameControls from './GameControls';
import EntitiesList from './EntitiesList';
import EntityDetail from './EntityDetail';

interface Props {
  connectionStore?: ConnectionStore;
}

@inject(({ connectionStore }) => ({
  connectionStore: connectionStore as ConnectionStore,
}))
@observer
class Main extends React.Component<Props, {}> {
  renderLoaded() {
    return (
      <div>
        <div className="header">
          <span className="header-text">Pearl Inspector</span>
          <GameControls />
        </div>

        <div className="container">
          <div className="entity-list">
            <EntitiesList />
          </div>
          <div className="entity-detail">
            <EntityDetail />
          </div>
        </div>
      </div>
    );
  }

  renderNoConnection() {
    return (
      <div className="col-md-6 col-md-push-3">
        <div className="panel panel-default no-connection">
          <div className="panel panel-heading">
            <h3 className="panel-title">Pearl instance not found :(</h3>
          </div>
          <div className="panel-body">
            <p>This usually means the game errored out while being created.</p>
          </div>
        </div>
      </div>
    );
  }

  render() {
    return (
      <div className="main-container">
        {this.props.connectionStore!.isConnected
          ? this.renderLoaded()
          : this.renderNoConnection()}
      </div>
    );
  }
}

export default Main;
