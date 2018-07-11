import ConnectionStore from './ConnectionStore';

// TODO: hey this sucks to maintain lol

export interface Stores {
  connectionStore: ConnectionStore;
}

const stores: Stores = {
  connectionStore: new ConnectionStore(),
};

export default stores;
