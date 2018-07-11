import { INJECT_FLAG_NAME } from '../common/constants';
(window as any)[INJECT_FLAG_NAME] = true;

import Agent from './Agent';
import sendMessage from './util/sendMessage';

const pearlInstance = (window as any).__pearl__;

if (pearlInstance) {
  sendMessage('locatedCoquette');
  new Agent(pearlInstance);
} else {
  sendMessage('noCoquetteFound');
}
