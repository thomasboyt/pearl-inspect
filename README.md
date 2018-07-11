# pearl-inspect

A Chrome DevTools extension for inspecting games made with the [Pearl](https://github.com/thomasboyt/pearl) framework.

## Features

* List entities currently in the game world
* Inspect the properties of components as they update
* Change the properties of components
* Play/pause the game loop
* Step through the game loop

## Installing

To install:

```
git clone git@github.com:thomasboyt/pearl-inspect.git
cd pearl-inspect/
npm install && npm run build
```

Then load the `chrome-extension` folder as an unpacked extension ([see this guide](https://developer.chrome.com/extensions/getstarted#unpacked)).

If it worked, you should see a "Pearl" tab in your developer tools when you next open them.

## Usage

There are two modifications you'll need to do to your Coquette apps to make them work.

### Exposing the Pearl instance

The most important one is that you expose the Pearl instance in your game as `window.__pearl__`, e.g.:

```typescript
window.__pearl__ = createPearl({/* ... */})
```

Without this, the inspector won't be able to find your Coquette instance.

### Entity display names

When creating GameObjects, create them with a `name` property to ensure a name is displayed:

```typescript
const playerObj = new GameObject({
  name: 'player',
  components: [new Player()],
  /*...*/
});
```