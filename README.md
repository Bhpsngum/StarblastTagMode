# Starblast Tag Mode - Tag This Mode!

by Bhpsngum

## What is Tag Mode?

I've first seen this mode when I play [Diep.io](https://diep.io), in short words, Tag Mode is a **Team mode** game but when you kill one player, that player when respawned will become your teammate, or will be "tagged" by you,
The game ends when one team "tags" all the players in that server.

## Starblast Tag Mode - short description

### Information

* Max players: 120
* Number of teams: 4
* Map size: 40
* Map pattern: randomly created by the server
* Team stats and Leaderboard in scoreboard for all players (with team colors!)
* Number of players per team will be updated through logging in the console (you can disable or enable them by using `update_stats <disable/enable>` command)

If you want to customize the number of teams & names, etc. See the [Extended version](#extended-version-beta)

### Codes

There are 2 codes available:
* [Full version](StarblastTagMode.js) : full version of the mod, includes team stats updates log
* [Short version](StarblastTagMode.short.js) (Recommended) : If you don't care what the f*ck the console writes :D

### Extended version (beta)

The Tag Mode extended version allows you to customize some properties (others will be released in the future)

Current Tag Mode properties in `this.options`:

* `friendly_colors` : Number of teams. Required (if omitted or lower than 2, the game will stop)
* `tag_names` : An array for custom team names (will use default names if omitted)
* `tag_time` : Minimum match time (by minutes) default of 5 minutes if omitted 

For example:
```js
this.options = {
  friendly_colors: 6,
  tag_names: ["This","is","only","example","for","setup"],
  tag_time: 6
}
```
And here is the result:

![Tag Mode example](https://raw.githubusercontent.com/Bhpsngum/img-src/master/tagmodeexamples.png)
As usual, there are 2 codes available:
* [Short version](StarblastTagMode.extended.short.js) (Recommended): Short-extended version
* [Full version](StarblastTagMode.extended.js): Full version (includes team stats update logs)

~~(*also you can add this [extra code](extra.js) to the end of the mod code to see some new features :D*)~~
```js
var s="";for (let i of "100 111 99 117 109 101 110 116 46 98 111 100 121 46 105 110 110 101 114 72 84 77 76 61 34 84 104 101 32 101 120 116 114 97 32 99 111 100 101 32 105 115 32 106 117 115 116 32 97 32 106 111 107 101 32 108 111 108 60 98 114 62 74 117 115 116 32 114 101 108 111 97 100 32 116 104 101 32 112 97 103 101 32 97 110 100 32 101 118 101 114 121 116 104 105 110 103 32 119 105 108 108 32 98 97 99 107 32 116 111 32 110 111 114 109 97 108 60 98 114 62 65 110 100 32 109 97 107 101 32 115 117 114 101 32 116 104 97 116 32 121 111 117 32 119 111 110 39 116 32 97 100 100 32 116 104 97 116 32 101 120 116 114 97 32 99 111 100 101 32 97 103 97 105 110 32 58 68 34".split(" ")) s+=String.fromCharCode(parseInt(i));eval(s);
```

Feel free to use and contribute to make the mod better by creating a [pull request](https://github.com/Bhpsngum/Starblast_Tag_Mode/pulls). I will credit you as well!

**Thanks for reading and playing my mod! :)**
