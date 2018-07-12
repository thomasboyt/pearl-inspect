require('../../style/main.css');

import * as React from 'react';
import * as ReactDOM from 'react-dom';
import { Provider } from 'mobx-react';

import stores from './stores';

import injectDebugger from './injectDebugger';
injectDebugger();

import AgentHandler from './AgentHandler';
const handler = new AgentHandler(stores);

import Main from './components/Main';

window.addEventListener('load', function() {
  ReactDOM.render(
    <Provider {...stores}>
      <Main />
    </Provider>,
    document.getElementById('container')
  );
});
