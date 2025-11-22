<br/><br/>

## 📦 &nbsp; THIS DOCUMENTATION IS ONLY FOR MILLUMIN V5
OSC documentation for Millumin V4 is available [here](http://github.com/anome/millumin-dev-kit/wiki/OSC-documentation-%28V4%29).

OSC documentation for Millumin V3 is available [here](http://github.com/anome/millumin-dev-kit/wiki/OSC-documentation-%28V3%29).

OSC documentation for Millumin V2 is available [here](http://github.com/anome/millumin-dev-kit/wiki/OSC-documentation-%28V2%29).

OSC documentation for Millumin V1 is available [here](http://github.com/anome/millumin-dev-kit/wiki/OSC-documentation-%28V1%29).

<br/><br/>

OSC is a communication protocol that works over the network. It is easy-to-read and very versatile.  
Millumin uses OSC messages to receive orders : for TouchOSC layouts, or to create an application that collaborates with Millumin. It also sends messages (see [feedback](#feedback) section).

This protocol is supported by many applications on computers or mobile devices.  
For example, by TouchOSC or OpenStageControl. See [this tutorial](https://help.millumin.com/docs/tutorials/control-your-show-remotely/).

<br/><br/>

Creating an OSC message is simple, please refer to the [Developer-Kit](http://github.com/anome/millumin-dev-kit) to get examples in many technologies.

In brief, an OSC message has 2 parts : the `/address` and the `[arguments]`.  
Example to set the opacity to 75%, of the layer named "test" :
> `/test/opacity`  `[0.75]`

🔥 **Keep in mind that in most OSC softwares or libraries, address and arguments are defined separately.**

<br/><br/>

To control Millumin, it is up to you to use `/millumin` prefix :
> `/millumin/test/opacity`  `[0.75]` is the same as `/test/opacity`  `[0.75]`

🔥 **However, feedback messages will always have the `/millumin` prefix.**

<br/><br/>

Lastly, Millumin's OSC API is case insensitive : 
> `/Test/Opacity`  `[0.75]` is the same as `/test/opacity`  `[0.75]`


<br/><br/>

If you want to quickly test OSC, simply open a Terminal and type the following command to change the opacity of the selected layer to 50% 👍 
> `echo -n "/selectedLayer/opacity 0.5" | nc -4u -w1 127.0.0.1 5000`

Please note that such a command in the Terminal will not send OSC, but a "string" that Millumin will interpreat as OSC. 



<br/><hr/><br/>



## 📚 &nbsp; Content
* [Actions](#actions)
* [Managing Elements](#--managing-elements)
* [Managing Media](#--managing-media)
* [Importing Files](#--importing-files)
* [Feedback](#--feedback)
* [Summary](#--summary)



<br/><hr/><br/>



## <a id="actions">📘 &nbsp; Actions</a>

You can launch or stop a specific column :
* `/action/launchOrStopColumn` `[index or "name"]`
* `/action/launchColumn` `[index or "name"]`
* `/action/stopColumn`

For example :
- `/action/launchColumn` `[11]` to launch the 11th column
- `/action/launchColumn` `["test"]` to launch the column named "test"


To launch the previous or next column :
* `/action/launchPreviousColumn`
* `/action/launchNextColumn`

To play/pause all media in the dashboard :
* `/action/pause`
* `/action/play`
* `/action/playOrPause`
* `/action/goToTime` `[10]` to play all media at 10 seconds
* `/action/goToTime` `[-10]` to play all media at 10 seconds before the end

To play/pause the timeline that you are editing :
* `/action/play`
* `/action/pause`
* `/action/playOrPause`
* `/action/goToTime` `[10]` to play the timeline at 10 seconds
* `/action/goToTime` `[-10]` to play the timeline at 10 seconds before the end
* `/action/goToTimelineSegment` `["name"]`

To select a board :
* `/action/selectBoard` `[index or "name"]`

To select an element :
* `/action/selectLayer` `[index or "name"]`
* `/action/selectLight` `[index or "name"]`

To change the masters :
* `/masterVideo` `[0.5]`
* `/masterAudio` `[0.7]`
* `/masterDMX` `[0.9]`

To move the brush-tool (normalized coordinates) :
* `/action/brush` `[0.5,0.5]` to move the brush in the middle with a maximum pressure (1)
* `/action/brush` `[0.1,0.1,0.7]` to move the brush with a pressure of 0.7

To enter/exit fullscreen :
* `/action/enterFullscreen`
* `/action/exitFullscreen`

To display/hide test-card :
* `/action/displayTestCard`
* `/action/hideTestCard`

To disable/enable workspace :
* `/action/disableWorkspace`
* `/action/enableWorkspace`


<br/><hr/><br/>



## <a id="--managing-elements">📘 &nbsp; Managing Elements</a>

Each element in the workspace has a name : the layer is "layerName", the light is "lightName".  
If you don't know the name of the element (or the layer doesn't have any name), you can use the index.  
Indexes start at 1.

Whatever the order of the arguments, Millumin sets the correct component.

* `/myElementName/opacity` `[1]`
* `/myElementName/scale` `[1]`
* `/element:index/opacity` `[1]`
* `/element:index/scale` `[1]`
* `/myElementName/rotation` `[10]`
* `/myElementName/translation` `[100, 200]`
* `/myElementName/translation/x` `[100]`
* `/myElementName/translation/y` `[200]`
* `/myElementName/translation/z` `[0.5]`
* `/myElementName/rotation` `[10]`
* `/myElementName/rotation/x` `[10]`
* `/myElementName/rotation/y` `[10]`
* `/myElementName/rotation/z` `[10]`

* `/myElementName/mapping/topLeft` `[0.0, 0.0]`
* `/myElementName/mapping/topRight` `[1.0, 0.0]`
* `/myElementName/mapping/bottomRight` `[1.0, 1.0]`
* `/myElementName/mapping/bottomLeft` `[0.0, 1.0]`


💡 **If you use hex color 0xRRGGBBAA for color arguments, alpha can be omitted (equals 0xFF if not specified).**

<br/><br/>


## <a id="--managing-media">📘 &nbsp; Managing Media</a>

* `/myElementName/startMedia`
* `/myElementName/pauseMedia`
* `/myElementName/startOrPauseMedia`
* `/myElementName/stopMedia`

* `/myElementName/media/time` `[10]`
* `/myElementName/media/normalizedTime` `[0.5]`
* `/myElementName/media/toggleLoop`
* `/myElementName/media/isLoopEnabled` `[1]` or `[0]`
* `/myElementName/media/speed` `[1.2]`

* `/myElementName/media/text` `["myText"]`

* `/myElementName/media/audioVolume` `[0.5]`
* `/myElementName/media/audioVolumeLeft` `[0.5]`
* `/myElementName/media/audioVolumeRight` `[0.5]`

* `/myElementName/media/myQuartzComposerInput` `[1]`
* `/myElementName/media/myQuartzComposerInput` `[1, 2]`

* `/myElementName/media/mySyphonInput` `[1]`
* `/myElementName/media/mySyphonInput` `[1, 2]`

* `/myElementName/media/keystone/bottomLeft` `[0.0, 0.0]`
* `/myElementName/media/keystone/bottomRight` `[1.0, 0.0]`

* `/myElementName/media/edgeBlend/smoothness` `[1.0]`
* `/myElementName/media/edgeBlend/gamma` `[1.0]`

* `/myElementName/media/color` `[255, 255, 255, 128]`
* `/myElementName/media/color` `[0xFFFFFF00]`

* `/myElementName/media/selected` `[1]` or `[0]`


<br/><br/>


## <a id="--importing-files">📘 &nbsp; Importing Files</a>

* `/myElementName/import` `["/Users/xxx/Desktop/myMovie.mov"]`
* `/myElementName/importAndStart` `["/Users/xxx/Desktop/myMovie.mov"]`

If the layer already contains a media, it is replaced.

- `/selectedLayer/import` is the same as `/selectedLayer/importAndStop`
- `/selectedLayer/startOrPauseMedia` to start
- `/selectedLayer/importAndStart` to import and start


<br/><br/>


## <a id="--feedback">📘 &nbsp; Feedback</a>

Enable OSC feedback in Millumin preferences if you want to receive data via OSC.  
Feedback messages are associated to an action in Millumin.  
When an action takes place, Millumin sends corresponding feedback messages.  
If the action doesn't exist yet, a feedback is not sent (for example : start playback, pauses or stops).  
Suffixed adresses `/address/?` are used to request the current value of a parameter.  
The feedback value is a return of an OSC request (`/address/?`) or an action/event that takes place in Millumin.

Feedback addresses reflect the actions that you can do in Millumin.  
This means that stopping/launching a column has its own feedback.  
Only values that make sense are sent back.

Please note that feedback addresses always starts with `/millumin`. Feedback is enabled in Millumin's preferences : `/millumin`, `/selectedLayer`, `/selectedLayer/media`, `/selectedLight`.

### Dashboard

* `/millumin/board/columnLaunched` `[index or "name"]`
* `/millumin/board/columnStopped` `[index or "name"]`
* `/millumin/selectedLayer/mediaStarted`
* `/millumin/selectedLayer/mediaPaused`
* `/millumin/selectedLayer/mediaStopped`

### Layers

* `/selectedLayer/opacity` `[0.5]`
* `/selectedLayer/translation` `[100, 200]`
* `/selectedLayer/translation/x` `[100]`
* `/selectedLayer/translation/y` `[200]`
* `/selectedLayer/rotation` `[10]`
* `/selectedLayer/rotation/x` `[10]`
* `/selectedLayer/rotation/y` `[10]`
* `/selectedLayer/rotation/z` `[10]`
* `/selectedLayer/scale` `[1.0]`
* `/selectedLayer/mapping/topLeft` `[0.0, 0.0]`
* `/selectedLayer/mapping/topRight` `[1.0, 0.0]`
* `/selectedLayer/mapping/bottomRight` `[1.0, 1.0]`
* `/selectedLayer/mapping/bottomLeft` `[0.0, 1.0]`

### Lights

* `/selectedLight/intensity` `[0.5]`


<br/><br/>


## <a id="--summary">📘 &nbsp; Summary</a>

Addresses :
* `/action/launchOrStopColumn`
* `/action/launchColumn`
* `/action/stopColumn`
* `/action/launchPreviousColumn`
* `/action/launchNextColumn`
* `/action/pause`
* `/action/play`
* `/action/playOrPause`
* `/action/goToTime`
* `/action/goToTimelineSegment`
* `/action/selectBoard`
* `/action/selectLayer`
* `/action/selectLight`
* `/masterVideo`
* `/masterAudio`
* `/masterDMX`
* `/action/brush`
* `/action/enterFullscreen`
* `/action/exitFullscreen`
* `/action/displayTestCard`
* `/action/hideTestCard`
* `/action/disableWorkspace`
* `/action/enableWorkspace`
* `/action/openProject`
* `/action/saveProject`
* `/action/quit`
* `/ping`
* `/myElementName/opacity`
* `/layer:myLayerName/position`
* `/light:myLightName/intensity`
* `/index:99/rotation`
* `/selectedLayer/scale`
* `/selectedLight/intensity`
* `/selectedLayer/mapping/topLeft`
* `/selectedLayer/mapping/topRight`
* `/selectedLayer/mapping/bottomRight`
* `/selectedLayer/mapping/bottomLeft`
* `/selectedLayer/effect1/myParameterName`
* `/layer:myLayerName/selected`
* `/MyMedia.mov/time`
* `/selectedLayer/media/time`
* `/selectedLayer/media/normalizedTime`
* `/selectedLayer/media/speed`
* `/selectedLayer/media/text`
* `/selectedLayer/media/myQuartzInput`
* `/selectedLayer/startMedia`
* `/selectedLayer/pauseMedia`
* `/selectedLayer/startOrPauseMedia`
* `/selectedLayer/stopMedia`
* `/selectedLayer/import`
* `/selectedLayer/importAndStart`
* `/millumin/board/columnLaunched`
* `/millumin/board/columnStopped`
* `/millumin/selectedLayer/mediaStarted`
* `/millumin/selectedLayer/mediaPaused`
* `/millumin/selectedLayer/mediaStopped`
  
<br/>

Suffixes :
* `/+`
* `/?`








<!--<br/><hr/><br/>




Discontinued addresses ([available in Millumin V1](http://github.com/anome/millumin-dev-kit/wiki/OSC-documentation-%28V1%29)) :
* `/millumin/layer/...`
* `/millumin/layer/addX`
* `/millumin/layer/addY`
* `/millumin/layer/mapPoint`
* `/millumin/layer/mapPointAddX`
* `/millumin/layer/mapPointAddY`
* `/millumin/layer/media`
* `/millumin/layer/media/text/prevLine`
* `/millumin/layer/media/text/nextLine`
* `/millumin/layer/media/quartz/param1`
* `/millumin/layer/select`
* `/millumin/layer/currentMediaDuration`
* `/millumin/action/launchOrStopColumnWithName`
* `/millumin/action/composition/start`
* `/millumin/action/composition/stop`
* `/millumin/action/composition/startOrStop`
* `/millumin/action/fullscreen`
* `/millumin/action/stopAll`
* `/millumin/action/selectLayerWithName`
* `/millumin/action/fadeToBlack`
* `/millumin/composition/cue`


-->




<br/><br/><br/><br/>
