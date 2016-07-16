window.__pearl_inspect_agent_injected__ = true;

var Agent = require('./Agent');
var patchEntities = require('./patchEntities');
var sendMessage = require('./util/sendMessage');

if (window.__pearl__) {
  sendMessage('locatedCoquette');
  patchEntities(window.__pearl__);
  new Agent(window.__pearl__);

} else {
  sendMessage('noCoquetteFound');
}
