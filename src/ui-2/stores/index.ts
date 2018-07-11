import ConnectionStore from './ConnectionStore';
import EntitiesStore from './EntitiesStore';
import GameStore from './GameStore';

// TODO: hey this sucks to maintain lol

export interface Stores {
  connectionStore: ConnectionStore;
  entitiesStore: EntitiesStore;
  gameStore: GameStore;
}

const stores: Stores = {
  connectionStore: new ConnectionStore(),
  entitiesStore: new EntitiesStore(),
  gameStore: new GameStore(),
};

export default stores;
