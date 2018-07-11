import * as React from 'react';
import { observer, inject } from 'mobx-react';
import ConnectionStore from '../stores/ConnectionStore';

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
      <div className="panel panel-default">
        <div className="panel-heading">
          {/* <GameControls /> */}
          <h3 className="panel-title">Entities</h3>
        </div>
        <div className="panel-body">{/* <EntityList /> */}</div>
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
