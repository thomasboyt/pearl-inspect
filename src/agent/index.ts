(window as any).__pearl_inspect_agent_injected__ = true;

import Agent from './Agent';
import sendMessage from './util/sendMessage';

const pearlInstance = (window as any).__pearl__;

if (pearlInstance) {
  sendMessage('locatedCoquette');
  new Agent(pearlInstance);
} else {
  sendMessage('noCoquetteFound');
}
