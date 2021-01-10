var collectibles = [10,11,12,20,21,40,41,42,90,91];
var endgame=0,dominate=-1,predominate=-1,logstats=1,end=0;
var vocabulary = [
      { text: "Hello", icon:"\u0045", key:"O" },
      { text: "Bye", icon:"\u0046", key:"B" },
      { text: "Yes", icon:"\u004c", key:"Y" },
      { text: "No", icon:"\u004d", key:"N" },
      { text: "Defend", icon:"\u0025", key:"D" },
      { text: "Kill", icon:"\u007f", key:"K" },
      { text: "Thanks", icon:"\u0041", key:"X" },
      { text: "Leader", icon:"\u002d", key:"L" },
      { text: "You", icon:"\u004e", key:"I" },
      { text: "Me", icon:"\u004f", key:"E" },
      { text: "No Problem", icon:"\u0047", key:"P" },
      { text: "Attack", icon:"\u0049", key:"A" },
      { text: "Help", icon:"\u004a", key:"H" },
      { text: "Follow Me", icon:"\u0050", key:"F" },
      { text: "Gems", icon:"\u0044", key:"J" },
      { text: "Mine", icon:"\u002f", key:"M" },
      { text: "Hmmm?", icon:"\u004b", key:"Q" },
      { text: "Love", icon:"\u0024", key:"V" },
      { text: "Sorry", icon:"\u00a1", key:"S" },
      { text: "GoodGame", icon:"\u00a3", key:"G" },
      { text: "Wait", icon:"\u0048", key:"T" },
];
var info = {
  id:"info",
  visible: true,
  clickable: false,
  position: [30,20,40,5],
  components: []
};
var scoreboard = {
  id:"scoreboard",
  visible: true,
  components: []
};
this.options = {
  map_name:"Starblast Tag Mode",
  max_level:6,
  lives:4,
  crystal_value:5,
  asteroid_strength:0.05,
  radar_zoom:1,
  starting_ship_maxed:false,
  weapon_drop:0.25,
  max_players:40,
  weapons_store:false,
  rcs_toggle:true,
  map_size:40,
  tag_mining_time: 10,
  tag_enter_time: 5,
  tag_trigger_time: 5,
  tag_level: 6,
  tag_names: [],
  hues: [],
  root_mode:"",
  friendly_colors:4,
  vocabulary:vocabulary,
  soundtrack:"argon.mp3"
};
/* Code for initial setup. Don't change anything between the code blocks!*/
var stats = {
  count: 0,
  sides:[],
  hue:[],
  names: []
}, __fail__, timer, dfl_tcl = "hsla(210, 50%, 87%, 1)", check = [
  ["tag_enter_time",0,10,5],
  ["tag_trigger_time",0,10,5],
  ["tag_mining_time",10,30,10]
], randPos = function(game) {
  return rand(game.options.map_size*20) - game.options.map_size*10;
}
// Stage 0: Initialization
this.options = this.options || {};
for (let i of check) {
  let t = Math.min(Math.max(Math.floor(this.options[i[0]]),i[1]),i[2]);
  this.options[i[0]] = isNaN(t)?i[3]:t;
}
this.options.hues = this.options.hues || [];
this.options.tag_names = this.options.tag_names || [];
this.tick = function(game) {
  if (game.options.friendly_colors > 1)
  {
    this.options.tag_level = Math.min(Math.max(this.options.tag_level,1),game.options.max_level) || Math.min(game.options.max_level,6);
    stats.count=game.options.friendly_colors;
    let huestats=0,dup=0;
    if (Array.isArray(this.options.hues) && this.options.hues.length > 0) {
      stats.hue = this.options.hues;
      while (stats.hue.length < stats.count) stats.hue.push(stats.hue[stats.hue.length-1]);
    }
    else {
      let hue=360/stats.count;
      for (let i=0;i<stats.count;i++)
      {
        stats.hue.push(huestats);
        huestats+=hue;
      }
    }
    stats.sides = new Array(stats.count).fill(0);
    let nam = this.options.tag_names, names=(Array.isArray(nam) && nam.length > 0)?nam:["Anarchist Concord Vega","Andromeda Union","Federation","Galactic Empire","Rebel Alliance","Solaris Dominion","Sovereign Trappist Colonies"],dnames=[...names];
    for (let i=0;i<stats.count;i++)
    {
      if (!dnames.length)
      {
        dup++;
        dnames=[...names];
      }
      let rnd=dnames[rand(dnames.length)];
      dnames.splice(dnames.indexOf(rnd),1);
      stats.names.push(`${rnd}${(!dup)?"":" "+(dup+1)}`);
    }
    echo("\nStarblast Tag Mode - by Bhpsngum");
    echo("type 'update_stats enable/disable' to enable/disable");
    echo("team stats update logs\n");
    echo("List of team name and their team ids (for players logging):\n")
    for (let i=0;i<stats.names.length;i++) echo(i+": "+stats.names[i]);
    this.tick = Mining;
  }
  else if (!__fail__)
  {
    game.modding.terminal.error("Error: Number of teams must be higher than 1");
    game.modding.commands.stop();
    __fail__ = true;
  }
}
var Mining = function(game) { // Stage 1: Mining
  if (game.step % 30 === 0) setStage(0);
  if (game.ships.filter(i => i.type/100 >= this.options.tag_level).length >= stats.count || game.step >= this.options.tag_mining_time*3600) {
    timer = this.options.tag_trigger_time*3600;
    this.tick = PreTag;
  }
  else for (let ship of game.ships) {
    if (!ship.custom.staged) {
      ship.custom.staged = true;
      ship.set({team: 0, hue: stats.hue[0]});
    }
  }
}, PreTag = function(game) { // Stage 2: Pre-Tag
  if (game.step % 30 === 0) {
    setStage(1);
    if (timer >= 0) {
      if (timer % 60 === 0) {
        let atime = [Math.floor(timer/(60**3)),Math.floor(timer/3600), Math.floor((timer%3600)/60)];
        while (atime[0] === 0) atime.splice(0,1);
        if (atime.length == 0) atime = [0];
        else if (atime.length > 1) atime = atime.map((i,j) => (i<10&&j>0)?"0"+i.toString():i);
        game.setUIComponent({
          id: "timer",
          position: [25,10,50,5],
          visible: true,
          components: [
            {type:"text",position:[0,0,100,100],value:"Tag Mode triggered in: "+atime.join(":"),color:dfl_tcl}
          ]
        });
      }
      timer-=30;
    }
    else {
      game.setUIComponent({id:"timer",visible:false});
      let list=new Array(game.ships.length).fill(0).map((i,j) => j);
      for (let i=0; list.length > 0; i++){
        let t=i%stats.count, id = rand(list.length);
        let ship = game.ships[list[id]];
        ship.set({team:t,hue:stats.hue[t],x: randPos(game),y: randPos(game)});
        ship.custom.team = t;
        list.splice(id, 1);
      }
      game.setUIComponent({
        id: "announce",
        position: [25,10,50,5],
        visible: true,
        components: [
          {type:"text",position:[0,0,100,100],value:"Game started!",color:dfl_tcl}
        ]
      });
      setTimeout(function(){game.setUIComponent({id:"announce",visible:false})},5000);
      game.tag_step = game.step + this.options.tag_enter_time*3600;
      this.tick = TagMode;
    }
  }
}, TagMode = function(game) { // Stage 3: Real Tag Mode game
  if (game.step % 30 === 0) {
    setStage(2);
    if (game.step % 1200 === 0) game.addCollectible({code:collectibles[rand(10)],x:randPos(game),y:randPos(game)});
    for (let ship of game.ships) {
      if (!ship.custom.init) {
        let pos=sort(stats.sides),index;
        if (game.step > game.tag_step && stats.sides[ship.custom.team] === 0) {
          for (index=pos.length-1;index>=0;index--) {
            if (stats.sides[pos[index]] > 0) {
              ship.set({team:pos[index]});
              break;
            }
          }
        }
        ship.custom.team = pos[index]==null?ship.team:pos[index];
        ship.custom.init = {team:ship.custom.team};
        ship.frag=0;
        ship.death=0;
        ship.highscore=ship.score;
        ship.set({hue:stats.hue[ship.custom.team],invulnerable:300});
      }
      if (ship.highscore<ship.score) ship.highscore=ship.score;
    }
    update();
    if (Math.max(...stats.sides) == game.ships.filter(i=>i.alive).length && game.step > game.tag_step && !endgame) {
      endgame=1;
      game.setOpen(false);
      for (let ship of game.ships) {
        updateinfo(ship,stats.names[stats.sides.indexOf(Math.max(...stats.sides))]+" team wins!",stats.hue[stats.sides.indexOf(Math.max(...stats.sides))]);
        setTimeout(function() {
          ship.gameover({
            "Score":ship.score,
            "Frags":ship.frag,
            "Deaths":ship.death,
            "High score":ship.highscore,
            "First team joined":stats.names[ship.custom.init.team],
            "Last team joined":stats.names[ship.custom.team]
          });
        },4000);
      }
      echo("Game completed!\nThanks for playing!");
    }
  }
}, setStage = function(n) {
  game.setUIComponent({
    id: "stats",
    position: [2.5,28,15,10],
    visible: true,
    components: [
      {type: "text",position:[0,0,100,50],value:`Stage ${n+1}: ${["Mining","Pre-Tag","Tag Mode"][n]||"Unknown"}`,color:dfl_tcl},
    ]
  });
}, rand = function(lol) {
  return Math.floor((Math.random() * lol));
}, sort = function(arr) {
  let array=[...arr];
  let index=new Array(array.length);
  for (let c=0;c<index.length;c++) index[c]=c;
  let i=0;
  while (i<array.length-1) {
    if (array[i]<array[i+1]) {
      array[i+1]=[array[i],array[i]=array[i+1]][0];
      index[i+1]=[index[i],index[i]=index[i+1]][0];
      if (i>0) i-=2;
    }
    i++;
  }
  return index;
}, updateinfo = function(ship,text,color) {
  info.components = [
    { type: "text",position: [0,0,100,100],color: `hsla(${color},100%,50%,1)`,value: text}
  ];
  ship.setUIComponent(info);
  info.components = [];
  setTimeout(function(){ship.setUIComponent(info)},3000);
}, updatescoreboard = function() {
  scoreboard.components = [
    { type:"box",position:[0,1,100,8],fill:"hsla(210, 20%, 33%, 1)",stroke:dfl_tcl,width:2},
    { type: "text",position: [0,1,100,8],color: "hsla(0, 0%, 100%, 1)",value: "Team stats ("+stats.sides.length+")"}
  ];
  let line=1,topp,list=(stats.sides.length>9)?9:stats.sides.length;
  let pos=sort(stats.sides).slice(0,list);
  for (let i=0;i<list;i++) {
    scoreboard.components.push(
      new Tag("text",stats.sides[pos[i]]+" 🚀",line*10+1,stats.hue[pos[i]],"right"),
      new Tag("text",stats.names[pos[i]],line*10+1,stats.hue[pos[i]],"left")
    );
    line++;
  }
  if (stats.sides.length<7)
  {
    scoreboard.components.push(
      { type:"box",position:[0,line*10+1,100,8],fill:"hsla(210, 20%, 33%, 1)",stroke:dfl_tcl,width:2},
      { type: "text",position: [0,line*10+1,100,8],color: "hsla(0, 0%, 100%, 1)",value: "Leaderboard"}
    );
    line++;
    let lead=new Array(game.ships.length);
    for (let i=0;i<lead.length;i++) lead[i]=0;
    let ind=0;
    for (let ship of game.ships) {
      lead[ind]=ship.score;
      ind++;
    }
    topp=sort(lead).slice(0,8-stats.sides.length);
    for (let i=0;i<topp.length;i++) {
      scoreboard.components.push(
        new Tag("text",game.ships[topp[i]].score,line*10+1,stats.hue[game.ships[topp[i]].team],"right",5),
        new Tag("player",game.ships[topp[i]].id,line*10+1,stats.hue[game.ships[topp[i]].team],"left")
      );
      line++;
    }
  }
  for (let ship of game.ships) deco(ship,pos,topp,stats);
}, deco = function(ship,stat,score,stats) {
  let line=stat.indexOf(ship.custom.team);
  let origin=[...scoreboard.components];
  if (line == -1) {
    scoreboard.components.splice(scoreboard.components.length-2,2,
      new PlayerBox(90),
      new Tag("text",stats.sides[ship.custom.team]+" 🚀",line*10+1,stats.hue[ship.custom.team],"right"),
      new Tag("text",stats.names[ship.custom.team],line*10+1,stats.hue[ship.custom.team],"left")
    );
  }
  else scoreboard.components.splice(line*2+2,0,new PlayerBox((line+1)*10));
  if (stats.sides.length<7)
  {
    line=score.indexOf(game.ships.indexOf(ship));
    if (line == -1) {
      scoreboard.components.splice(scoreboard.components.length-2,2,
        new PlayerBox(90),
        new Tag("text",ship.score,91,stats.hue[ship.custom.team],"right",5),
        new Tag("player",ship.id,91,stats.hue[ship.custom.team],"left")
      );
    }
    else scoreboard.components.splice((line+stats.sides.length+2)*2+1,0,new PlayerBox((line+stats.sides.length+2)*10));
  }
  ship.setUIComponent(scoreboard);
  scoreboard.components=[...origin];
}, updatesides = function() {
  let presides=[...stats.sides];
  stats.sides=[];
  for (let i=0;i<presides.length;i++) stats.sides.push(0);
  for (let ship of game.ships) {
    if (ship.alive === true) stats.sides[ship.custom.team]++;
  }
  for (let i=0;i<presides.length;i++) {
    if (stats.sides[i] != presides[i] && logstats == 1) {
      let ec="";
      for (let i=0;i<stats.names.length;i++) ec+=i+":"+stats.sides[i]+" ; ";
      echo(ec);
      break;
    }
  }
}, PlayerBox = function(pos) {
  return { type:"box",position:[0,pos,100,10],fill:"hsla(210, 24%, 29%, 0.5)",width:2};
}, Tag = function(indtext,param,pos,color,al,size) {
  let obj= {type: indtext,position: [0,pos,100-(size||0),8],color: `hsla(${color},100%,50%,1)`,align:al};
  switch(indtext) {
    case "text":
      obj.value=param;
      break;
    case "player":
      obj.id=param;
      break;
  }
  return obj;
}, update = function() {
  updatesides();
  let loop=0;
  for (let i=0;i<4;i++) {
    if (stats.sides[i] == Math.max(...stats.sides)) {
      loop++;
      predominate=dominate;
      dominate=i;
    }
  }
  if (loop>1) dominate=-1;
  if (dominate != predominate && dominate != -1 && game.ships.length > 1) {
    for (let ship of game.ships) {
      let str=((dominate === ship.custom.team)?("Your team"):(stats.names[dominate]))+" is dominating!";
      updateinfo(ship,str,stats.hue[dominate]);
    }
  }
  updatescoreboard();
}
game.modding.commands.update_stats = function(req) {
  switch ((req.replace(/\s+/g," ").split(' ')[1]||"").toUpperCase()) {
    case "ENABLE":
      logstats=1;
      echo("Enabled!");
      break;
    case "DISABLE":
      logstats=0;
      echo("Disabled!");
      break;
    case "":
      game.modding.terminal.error("TypeError: missing parameter");
      break;
    default:
      echo("I told you to type only 'disable' or 'enable'\nBAKA!!");
  }
}
game.modding.tick = function(t) {
  this.game.tick(t);
  if (this.context.tick != null) {
    this.context.tick(this.game);
  }
}
this.event = function(event,game) {
 switch(event.name)
 {
   case "ship_spawned":
     event.ship.set({hue:stats.hue[event.ship.custom.team],invulnerable:300});
     break;
   case "ship_destroyed":
     if (event.killer !== null) {
       event.ship.set({team:event.killer.custom.team});
       event.ship.custom.team = event.killer.custom.team;
       event.killer.frag++;
     }
     if (event.ship !== null) {
       event.ship.death++;
       event.ship.set({score:Math.ceil(event.ship.score/2)});
     }
     break;
 }
};
