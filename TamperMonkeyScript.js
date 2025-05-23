// ==UserScript==
// @name         Speed Button for MediaElementPlayer
// @version      1.3
// @description  Adds a speed control button and Jump to MediaElementPlayer with fallback if buildspeed is unavailable. Enjoy your 2x learning.
// @author       D3xtr4
// @match        https://www.cambrilearn.com/*
// @grant        Public
// ==/UserScript==

"use strict";

console.log('TamperMonkey Speed Control Script Loaded');

// Add custom CSS for speed control button and overlay
const style = document.createElement('style');
style.textContent = `
.mejs__speed-button {
    background: transparent;
    color: #fff;
    font-size: 12px;
    height: 40px;
    line-height: 10px;
    margin: 0;
    width: 32px;
}
.mejs__speed-button button {
    background: transparent;
    color: #fff;
    font-size: 12px;
    height: 40px;
    line-height: 10px;
    margin: 0;
    width: 32px;
    padding: 0;
    display: flex;
    align-items: center;
    justify-content: center;
}

.mejs__speed-overlay {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    display: flex;
    align-items: center;
    justify-content: center;
    background: rgba(0, 0, 0, 0.5);
    opacity: 0;
    transition: opacity 0.3s ease;
    pointer-events: none;
    z-index: 1000;
}

.mejs__speed-overlay.show {
    opacity: 1;
}

.mejs__speed-overlay-text {
    color: white;
    font-size: 45px;
    font-weight: bold;
    text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.5);
}

.mejs__jumpback-button,
.mejs__jumpforward-button {
    background: transparent;
    color: #fff;
    font-size: 16px;
    font-weight: bold;
    height: 40px;
    line-height: 10px;
    margin: 0;
    width: 32px;
}

.mejs__jumpback-button button,
.mejs__jumpforward-button button {
    background: transparent;
    color: #fff;
    font-size: 16px;
    font-weight: bold;
    height: 40px;
    line-height: 10px;
    margin: 0;
    width: 50px;
    padding: 0;
    display: flex;
    align-items: center;
    justify-content: center;
}
`;
document.head.appendChild(style);

// Translations (English required)
mejs.i18n.en["mejs.speed-rate"] = "Speed Rate";

/**
 * Change Speed
 *
 * Simplified the speed plugin to handle speed changes on click instead of a menu
 */

// Feature configuration
Object.assign(mejs.MepDefaults, {
  speeds: ["2.00", "1.50", "1.25", "1.00", "0.75"],
  defaultSpeed: "1.00",
  speedChar: "x",
  speedText: null
});

console.log('MediaElementPlayer defaults updated with speed control settings');

Object.assign(MediaElementPlayer.prototype, {
  // Public variables (also documented according to JSDoc specifications)

  /**
   * Feature constructor.
   *
   * Always has to be prefixed with `build` and the name that will be used in MepDefaults.features list
   * @param {MediaElementPlayer} player
   * @param {HTMLElement} controls
   * @param {HTMLElement} layers
   * @param {HTMLElement} media
   */
  

  buildjumpback(player, controls, layers, media) {
    console.log('Building jump back feature');
    const t = this;
    const jumpBackButton = document.createElement('div');
    jumpBackButton.className = `${t.options.classPrefix}button ${t.options.classPrefix}jumpback-button`;
    jumpBackButton.innerHTML = `<button type="button" aria-controls="${t.id}" title="Jump Back" aria-label="Jump Back" tabindex="0"><img src="https://raw.githubusercontent.com/d3xtr4/cambrilearn-speedcontrol/refs/heads/main/left%20arrow.png" alt="Jump Back"></button>`;
    
    t.addControlElement(jumpBackButton);

    // Create shared jump overlay if it doesn't exist
    if (!t.jumpOverlay) {
      console.log('Creating new jump overlay for jumpback');
      t.jumpOverlay = document.createElement('div');
      t.jumpOverlay.className = 'mejs__speed-overlay';
      t.jumpText = document.createElement('div');
      t.jumpText.className = 'mejs__speed-overlay-text';
      t.jumpOverlay.appendChild(t.jumpText);
      t.container.appendChild(t.jumpOverlay);
      console.log('Jump overlay created and added to container:', t.jumpOverlay);
    } else {
      console.log('Using existing jump overlay for jumpback:', t.jumpOverlay);
    }

    // Function to show jump overlay
    const showJumpOverlay = (text) => {
      console.log('Showing jump overlay with text:', text);
      console.log('Current overlay state:', {
        overlay: t.jumpOverlay,
        text: t.jumpText,
        container: t.container
      });
      t.jumpText.textContent = text;
      t.jumpOverlay.classList.add('show');
      console.log('Overlay classes after adding show:', t.jumpOverlay.classList);
      setTimeout(() => {
        t.jumpOverlay.classList.remove('show');
        console.log('Overlay hidden after timeout');
      }, 500);
    };

    jumpBackButton.addEventListener('click', function() {
      console.log('Jump back button clicked');
      const currentTime = media.currentTime;
      const newTime = Math.max(0, currentTime - t.options.jumpBackInterval);
      media.currentTime = newTime;
      showJumpOverlay('back 15 s');
      console.log('Jumped back to:', newTime);
    });
  },

  buildjumpforward(player, controls, layers, media) {
    console.log('Building jump forward feature');
    const t = this;
    const jumpForwardButton = document.createElement('div');
    jumpForwardButton.className = `${t.options.classPrefix}button ${t.options.classPrefix}jumpforward-button`;
    jumpForwardButton.innerHTML = `<button type="button" aria-controls="${t.id}" title="Jump Forward" aria-label="Jump Forward" tabindex="0"><img src="https://raw.githubusercontent.com/d3xtr4/cambrilearn-speedcontrol/refs/heads/main/right%20arrow.png" alt="Jump Forward"></button>`;
    
    t.addControlElement(jumpForwardButton);

    // Use existing jump overlay if it exists
    if (!t.jumpOverlay) {
      console.log('Creating new jump overlay for jumpforward');
      t.jumpOverlay = document.createElement('div');
      t.jumpOverlay.className = 'mejs__speed-overlay';
      t.jumpText = document.createElement('div');
      t.jumpText.className = 'mejs__speed-overlay-text';
      t.jumpOverlay.appendChild(t.jumpText);
      t.container.appendChild(t.jumpOverlay);
      console.log('Jump overlay created and added to container:', t.jumpOverlay);
    } else {
      console.log('Using existing jump overlay for jumpforward:', t.jumpOverlay);
    }

    // Function to show jump overlay
    const showJumpOverlay = (text) => {
      console.log('Showing jump overlay with text:', text);
      console.log('Current overlay state:', {
        overlay: t.jumpOverlay,
        text: t.jumpText,
        container: t.container
      });
      t.jumpText.textContent = text;
      t.jumpOverlay.classList.add('show');
      console.log('Overlay classes after adding show:', t.jumpOverlay.classList);
      setTimeout(() => {
        t.jumpOverlay.classList.remove('show');
        console.log('Overlay hidden after timeout');
      }, 500);
    };

    jumpForwardButton.addEventListener('click', function() {
      console.log('Jump forward button clicked');
      const currentTime = media.currentTime;
      const newTime = Math.min(media.duration, currentTime + t.options.jumpForwardInterval);
      media.currentTime = newTime;
      showJumpOverlay('forward 15 s');
      console.log('Jumped forward to:', newTime);
    });
  },

  buildchangespeed(player, controls, layers, media) {
    console.log('Building speed control feature');
    const t = this;

    let playbackSpeed,
      defaultInArray = false,
      speeds = [],
      speedTitle = mejs.Utils.isString(t.options.speedText)
        ? t.options.speedText
        : mejs.i18n.t("mejs.speed-rate");

    console.log('Speed control options:', {
      defaultSpeed: t.options.defaultSpeed,
      speeds: t.options.speeds,
      speedTitle: speedTitle
    });

    const getSpeedNameFromValue = value => {
      for (let i = 0, total = speeds.length; i < total; i++) {
        if (speeds[i].value === value) {
          return speeds[i].name;
        }
      }
    };

    for (let i = 0, total = t.options.speeds.length; i < total; i++) {
      const s = t.options.speeds[i];

      if (typeof s === "string") {
        speeds.push({
          name: `${s}${t.options.speedChar}`,
          value: s
        });

        if (s === t.options.defaultSpeed) {
          defaultInArray = true;
        }
      } else {
        speeds.push(s);
        if (s.value === t.options.defaultSpeed) {
          defaultInArray = true;
        }
      }
    }

    if (!defaultInArray) {
      speeds.push({
        name: t.options.defaultSpeed + t.options.speedChar,
        value: t.options.defaultSpeed
      });
    }

    playbackSpeed = t.options.defaultSpeed;

    let index;
    speeds = speeds.sort(function(a, b) {
      return parseFloat(a.value) - parseFloat(b.value);
    });

    index = speeds.findIndex(function(speed) {
      return speed.value === t.options.defaultSpeed;
    });

    console.log('Speed control configuration:', {
      speeds: speeds,
      defaultSpeed: playbackSpeed,
      currentIndex: index
    });

    t.cleanchangespeed(player);

    const buttonHTML = value => {
      return (
        `<button type="button" aria-controls="${t.id}" title="${speedTitle}" ` +
        `aria-label="${speedTitle}" tabindex="0">${value.replace(t.options.speedChar, '')}x</button>`
      );
    };

    player.speedButton = document.createElement("div");
    player.speedButton.className = `${t.options.classPrefix}speed-button`;
    player.speedButton.innerHTML = buttonHTML(
      getSpeedNameFromValue(t.options.defaultSpeed)
    );

    console.log('Speed button created:', player.speedButton);

    t.addControlElement(player.speedButton);

    // Create speed overlay
    const speedOverlay = document.createElement('div');
    speedOverlay.className = 'mejs__speed-overlay';
    const speedText = document.createElement('div');
    speedText.className = 'mejs__speed-overlay-text';
    speedOverlay.appendChild(speedText);
    t.container.appendChild(speedOverlay);

    // Function to show speed overlay
    const showSpeedOverlay = (speed) => {
      speedText.textContent = `${speed}x`;
      speedOverlay.classList.add('show');
      setTimeout(() => {
        speedOverlay.classList.remove('show');
      }, 500);
    };

    player.speedButton.addEventListener("click", function() {
      index++;
      index %= speeds.length;
      const newSpeed = speeds[index].value;
      media.playbackRate = parseFloat(newSpeed);
      this.firstElementChild.innerText = newSpeed + 'x';
      showSpeedOverlay(newSpeed);
      console.log('Speed changed to:', newSpeed);
    });

    media.addEventListener("loadedmetadata", () => {
      if (playbackSpeed) {
        media.playbackRate = parseFloat(playbackSpeed);
        console.log('Initial playback rate set to:', playbackSpeed);
      }
    });
  },

  // Optionally, each feature can be destroyed setting a `clean` method

  /**
   * Feature destructor.
   *
   * Always has to be prefixed with `clean` and the name that was used in MepDefaults.features list
   * @param {MediaElementPlayer} player
   * @param {HTMLElement} controls
   * @param {HTMLElement} layers
   * @param {HTMLElement} media
   */
  cleanchangespeed(player, controls, layers, media) {
    console.log('Cleaning up speed control');
    if (player) {
      if (player.speedButton) {
        player.speedButton.parentNode.removeChild(player.speedButton);
      }
      if (player.speedSelector) {
        player.speedSelector.parentNode.removeChild(player.speedSelector);
      }
    }
  },

  cleanjumpback(player, controls, layers, media) {
    console.log('Cleaning up jump back feature');
    if (player) {
      const jumpBackButton = player.container.querySelector(`.${player.options.classPrefix}jumpback-button`);
      if (jumpBackButton) {
        jumpBackButton.parentNode.removeChild(jumpBackButton);
      }
      // Don't remove the overlay here as it's shared with jumpforward
    }
  },

  cleanjumpforward(player, controls, layers, media) {
    console.log('Cleaning up jump forward feature');
    if (player) {
      const jumpForwardButton = player.container.querySelector(`.${player.options.classPrefix}jumpforward-button`);
      if (jumpForwardButton) {
        jumpForwardButton.parentNode.removeChild(jumpForwardButton);
      }
      // Remove the shared overlay only if both features are being cleaned up
      if (player.jumpOverlay && !player.container.querySelector(`.${player.options.classPrefix}jumpback-button`)) {
        player.jumpOverlay.parentNode.removeChild(player.jumpOverlay);
        player.jumpOverlay = null;
        player.jumpText = null;
      }
    }
  }

  // Other optional public methods (all documented according to JSDoc specifications)
});

console.log('MediaElementPlayer prototype updated with speed control methods');

// Override the VideoLessonPlayer initialization to add speed control
(function() {
    console.log('Overriding VideoLessonPlayer initialization');
    const originalVideoLessonPlayer = App.VideoLessonPlayer;
    App.VideoLessonPlayer = function() {
        function e(t, n, a, s, o, i) {
            _classCallCheck(this, e),
            this.path = t,
            this.progressPercentage = n,
            this.link_id = a,
            this.counter = s,
            this.pindex = o,
            this.category_id = i,
            this._call()
        }
        return _createClass(e, [{
            key: "_call",
            value: function t() {
                var e = this.path
                  , t = this.progressPercentage
                  , n = this.link_id
                  , a = this.counter
                  , s = this.pindex
                  , o = this.category_id;
                $(document).ready(function() {
                    console.log('Initializing video player with speed control');
                    function i(t) {
                        var i = $(this)[0]
                          , r = i.currentTime
                          , c = i.duration
                          , l = Math.round(100 * r / c);
                        $.ajax({
                            url: e,
                            method: "POST",
                            data: {
                                link_id: n,
                                progress: l,
                                counter: a,
                                pindex: s,
                                category_id: o
                            }
                        })
                    }
                    var r = $("#recorded-lessons-js")[0]
                      , c = ["playpause", "current", "progress", "duration", "volume", "contextmenu", "fullscreen", "quality", "jumpback", "jumpforward", "changespeed"]
                      , l = $(r).mediaelementplayer({
                        defaultSpeed: '1.00',
                        speeds: ['1.25','1.50', '2.00'],
                        jumpForwardInterval: 15,
                        jumpBackInterval: 15,
                        features: c,
                        success: function d(e, n) {
                            console.log('MediaElementPlayer initialized with speed control');
                            e.addEventListener("loadeddata", function(n) {
                                var a = e.duration
                                  , s = parseInt(t);
                                s >= 99 && (s = 0);
                                var o = s * a / 100;
                                e.currentTime = o;
                                console.log('Video loaded, initial playback rate:', e.playbackRate);
                            }),
                            $(e).children().on("pause", i),
                            $(e).children().on("pause", function() {
                                $(".player-title-info-js").removeClass("active")
                            }),
                            $(e).children().on("play", function() {
                                $(".player-title-info-js").addClass("active")
                            }),
                            $("#recordedLiveLessonContainer").on("closed.zf.reveal", function() {
                                e.pause()
                            })
                        }
                    })
                })
            }
        }]),
        e
    }();
    console.log('VideoLessonPlayer override complete');
})();
