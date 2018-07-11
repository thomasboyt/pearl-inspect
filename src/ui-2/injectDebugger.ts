// var sendMessage = require('./util/sendMessage');
import sendMessage from './util/sendMessage';
import { INJECT_FLAG_NAME } from '../common/constants';

// thx https://github.com/emberjs/ember-inspector/blob/master/app/adapters/chrome.js
export default function injectDebugger() {
  chrome.devtools.inspectedWindow.eval(INJECT_FLAG_NAME, function(result) {
    if (!result) {
      // script hasn't been injected yet

      const xhr = new XMLHttpRequest();
      xhr.open('GET', chrome.extension.getURL('/build/agent.bundle.js'), false);
      xhr.send();
      const script = xhr.responseText;

      chrome.devtools.inspectedWindow.eval(script, function(result, err) {
        if (err) {
          console.error(err.value);
        }

        sendMessage('connect');
      });
    } else {
      // we're already injected, so just connect
      sendMessage('connect');
    }
  });
}
