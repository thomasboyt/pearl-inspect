import * as React from 'react';
import { inject, observer } from 'mobx-react';
import GameStore from '../stores/GameStore';
import sendMessage from '../util/sendMessage';

interface Props {
  gameStore?: GameStore;
}

@inject(({ gameStore }) => ({
  gameStore: gameStore as GameStore,
}))
@observer
export default class GameControls extends React.Component<Props> {
  handleTogglePause = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.stopPropagation();

    if (this.props.gameStore!.isPaused) {
      sendMessage('unpause');
    } else {
      sendMessage('pause');
    }
  };

  handleToggleSelectEntity = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.stopPropagation();

    if (this.props.gameStore!.isSelecting) {
      sendMessage('disableSelectMode');
    } else {
      sendMessage('enableSelectMode');
    }
  };

  handleStep = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.stopPropagation();
    sendMessage('step');
  };

  renderPaused() {
    return (
      <span>
        <button
          onClick={this.handleTogglePause}
          className="activated"
          title="Play"
        >
          <span className="glyphicon glyphicon-play" />
        </button>
        <button onClick={this.handleStep} title="Step forward">
          <span className="glyphicon glyphicon-step-forward" />
        </button>
      </span>
    );
  }

  renderPlaying() {
    const fps = this.props.gameStore!.fps;
    const fpsClass = fps < 59 ? 'fps fps-warning' : 'fps';

    return (
      <span>
        <span className={fpsClass}>{fps} FPS</span>&nbsp;
        <button onClick={this.handleTogglePause} title="Pause">
          <span className="glyphicon glyphicon-pause" />
        </button>
        <button disabled title="Step forward">
          <span className="glyphicon glyphicon-step-forward" />
        </button>
      </span>
    );
  }

  render() {
    const { isSelecting, isPaused } = this.props.gameStore!;
    const selectClass = isSelecting ? 'activated' : '';

    return (
      <div className="controls">
        {isPaused ? this.renderPaused() : this.renderPlaying()}

        <button
          onClick={this.handleToggleSelectEntity}
          className={selectClass}
          title="Click an entity to inspect it."
        >
          <span className="glyphicon glyphicon-zoom-in" />
        </button>
      </div>
    );
  }
}
