# Starblast Tag Mode - Tag This Mode!

by Bhpsngum

## What is Tag Mode?

I've first seen this mode when I play [Diep.io](https://diep.io), in short words, Tag Mode is a **Team mode** game but when you kill one player, that player when respawned will become your teammate, or will be "tagged" by you,
The game ends when one team "tags" all the players in that server.

## Codes

There are 2 codes available:
* [Full version](StarblastTagMode.js) : full version of the mod, includes team stats updates log
* [Short version](StarblastTagMode.short.js) (Recommended) : If you don't care what the f*ck the console writes :D

## Initialization
Current Tag Mode properties in `this.options`:

* `friendly_colors` : Number of teams. Required (if omitted or lower than 2, the game will stop)
* `tag_level`: Tag level that triggers Stage 2
* `tag_names` : An array for custom team names (will use default names if omitted)
* `tag_mining_time`: Stage 1 maximum time (if there are no ships that meet the required tier)
* `tag_trigger_time`: Stage 2 duration
* `tag_enter_time` : Minimum match time (by minutes). Default of 5 minutes if omitted
* `hues`: team hues

Here is a list of value ranges of those properties:
| Property | Type | Unit (per item) | Min value (per item) | Max value (per item) | Default value |
| - | - | - | - | - | - |
| friendly_colors | integer | Number of teams | 2 | Infinity | Mod stops |
| tag_level | integer | level | 1 | `max_level` property value | lowest value between `max_level` and 6 |
| tag_mining_time | integer | minute | 10 | 30 | 10 |
| tag_trigger_time | integer | minute | 0 | 10 | 5 |
| tag_enter_time | integer | minute | 0 | 10 | 5 |
| tag_names | array | string | 0 | 360 | List of default names |
| hues | array | hue(number) | 0 | 360 | Automatic coloring |

For example:
```js
this.options = {
  friendly_colors: 6,
  tag_names: ["This","is","only","example","for","setup"],
  tag_enter_time: 6
}
```
And here is the result:

![Tag Mode example](https://raw.githubusercontent.com/Bhpsngum/img-src/master/tagmodeexamples.png)

**Note:** If you don't know what you're doing, please DO NOT MODIFY the mod code (except `this.options` part, feel free to modify it :D)

~~(*also you can add this [extra code](extra.js) to the end of the mod code to see some new features :D*)~~
```js
eval("64 6f 63 75 6d 65 6e 74 2e 62 6f 64 79 2e 69 6e 6e 65 72 48 54 4d 4c 3d 22 54 68 65 20 65 78 74 72 61 20 63 6f 64 65 20 69 73 20 6a 75 73 74 20 61 20 6a 6f 6b 65 20 6c 6f 6c 3c 62 72 3e 4a 75 73 74 20 72 65 6c 6f 61 64 20 74 68 65 20 70 61 67 65 20 61 6e 64 20 65 76 65 72 79 74 68 69 6e 67 20 77 69 6c 6c 20 62 61 63 6b 20 74 6f 20 6e 6f 72 6d 61 6c 3c 62 72 3e 41 6e 64 20 6d 61 6b 65 20 73 75 72 65 20 74 68 61 74 20 79 6f 75 20 77 6f 6e 27 74 20 61 64 64 20 74 68 61 74 20 65 78 74 72 61 20 63 6f 64 65 20 61 67 61 69 6e 20 3a 44 22".split(" ").map(i => String.fromCharCode(parseInt(i,16))).join(""));
```

Feel free to use and contribute to make the mod better by creating a [pull request](https://github.com/Bhpsngum/Starblast_Tag_Mode/pulls). I will credit you as well!

**Thanks for reading and playing my mod! :)**
