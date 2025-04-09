# CambriLearn Video Speed Control

A TamperMonkey script that adds video playback speed control to the CambriLearn video player.

## Features

- Adds a speed control button to the video player interface
- Supports multiple playback speeds (0.75x, 1.00x, 1.25x, 1.50x, 2.00x)
- Clean and minimal UI integration
- Persists speed settings across video loads

## Installation

1. Install the TamperMonkey browser extension
2. Create a new script in TamperMonkey (Note: Remember to turn on Developer Mode for your Browser Plugin to allow TamperMoney to inject code. See https://www.tampermonkey.net/faq.php#Q209)
3. Copy the contents of `TamperMonkeyScript.js` into the new script
4. Save the script
5. Navigate to CambriLearn and enjoy variable speed control!

## Development

The script uses MediaElementPlayer's plugin architecture to add speed control functionality. It integrates seamlessly with the existing video player controls.

## MediaElementJS TamperMonkey Script for Change Speed to be injected into Cambrilearn Website players.

Based on MediaElementJS : Change Speed

Modified the embeded media player to include the speed plugin to handle speed changes on click.

![](https://github.com/d3xtr4/cambrilearn-speedcontrol/blob/main/controller.png?raw=true)

### Explanation
The script is injecting the SpeedChange script into the browser. It then proceed to override the MediaPlayer Initialisation Prototype and add the Spped Change Feature into the player so that whenever the Player is iniciated it will show the speed in the controller. 

## Speed Change Media Player Plugin

https://github.com/ivorpad/mediaelement-changespeed/blob/master/readme.md

