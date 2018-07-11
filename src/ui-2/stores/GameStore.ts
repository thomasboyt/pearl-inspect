import { observable, action } from 'mobx';
import { range } from 'lodash-es';

// Calculate average delta time over last maxSamples frames
// via http://stackoverflow.com/a/87732
function mkAvgTick(maxSamples: number) {
  let tickIdx = 0;
  let tickSum = 0;
  const tickList = range(0, maxSamples).map(() => 0);

  return function(dt: number) {
    tickSum -= tickList[tickIdx];
    tickSum += dt;
    tickList[tickIdx] = dt;

    tickIdx += 1;
    if (tickIdx === maxSamples) {
      tickIdx = 0;
    }

    return tickSum / maxSamples;
  };
}

export default class GameStore {
  @observable isPaused = false;
  @observable isSelecting = false;

  @observable fps = 0;
  private _lastTick?: number;
  private _avgTick = mkAvgTick(100);

  @action
  onPausedGame() {
    this.isPaused = true;
  }

  @action
  onUnpausedGame() {
    this.isPaused = false;
  }

  @action
  onTicked() {
    const cur = Date.now();

    if (this._lastTick !== undefined) {
      var dt = cur - this._lastTick;
      this.fps = Math.round(1000 / this._avgTick(dt));
    }

    this._lastTick = cur;
  }

  @action
  onEnabledSelectMode() {
    this.isSelecting = true;
  }

  @action
  onDisabledSelectMode() {
    this.isSelecting = false;
  }
}
