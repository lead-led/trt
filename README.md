# State Structure

There are two object types that are represented in the UI

-   Times
-   Instances

### Times

Times are the actual time objects that display the formated time of their reflective instance. Times are represented by the Time.svelte component, they are rendered in the +page.svelte.

### Instances

Instances are the objects that represent the connection to their respective playback device. Instances are represented by a respective instance component that renders in Settings.svelte component.

# Controllers

There are seperate controllers for both the main and the render process. The render controller is essentially a store for reactivity.

### Render

-   lib/controllers/instance_controller.ts

### Main

-   main/controllers/server_controller.ts

### IPC

Controller for IPC in the render thread is a component title IPC_Controller.svelte

Control in the main thread happens from the electron.cjs file with the ipc.Main listeners at the bottom of the file

## Creating Playback Instances

Servers / Services are created via the `init-background-object` function. This function takes a single argument, an object, with the following properties:

```js

get thisObj() {
  return {
    id: this.id,
    port: get(this.port),
    localIp: get(this.ip),
    isConnected: get(this.isConnected),
    layers: get(this.layers),
    index: this.\_index,
    type: 'playbackpro',
  };
}

```

The server types are:

-   `playbackpro`
-   `mitti`
-   `millumin`

## Libraries Referece

https://www.neodrag.dev/docs/svelte

https://carbon-components-svelte.onrender.com/components/Slider

## Icons

https://icones.js.org/collection/material-symbols?s=settings
https://github.com/antfu/unplugin-icons
