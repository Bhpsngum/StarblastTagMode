var collectibles = [10,11,12,20,21,40,41,42,90,91];
var endgame=0,dominate=-1,predominate=-1,loginfo=1,logstats=1,end=0;
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
  max_level:7,
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
  root_mode:"",
  friendly_colors:4,
  vocabulary:vocabulary,
  soundtrack:"argon.mp3"
};
var rand = function(lol) {
  return Math.floor((Math.random() * lol));
};
var sort = function(arr) {
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
};
/* Code for initial setup. Don't change anything between the code blocks!*/
let start=(this.options.friendly_colors && this.options.friendly_colors>1);
if (!start)
{
  var stats = {
    sides:[],
    hue:[],
    names: []
  }
  let teams=this.options.friendly_colors,huestats=0,hue=360/teams,dup=0;
  let names=this.options.tag_names||["Anarchist Concord Vega","Andromeda Union","Federation","Galactic Empire","Rebel Alliance","Solaris Dominion","Sovereign Trappist Colonies"],dnames=[...names];
  for (let i=0;i<teams;i++)
  {
    stats.sides.push(0);
    stats.hue.push(huestats);
    huestats+=hue;
    if (!dnames.length)
    {
      dup++;
      dnames=[...names];
    }
    let rnd=dnames[rand(dnames.length)];
    dnames.splice(dnames.indexOf(rnd),1);
    stats.names.push(`${rnd}${(!dup)?"":" "+(dup+1)}`);
  }
}
/* End of initial setup */
sort = function(arr) {
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
};
updateinfo = function(ship,text,color) {
  info.components = [
    { type: "text",position: [0,0,100,100],color: `hsla(${color},100%,50%,1)`,value: text}
  ];
  ship.setUIComponent(info);
  info.components = [];
  setTimeout(function(){ship.setUIComponent(info)},3000);
};
updatescoreboard = function() {
  scoreboard.components = [
    { type:"box",position:[0,1,100,8],fill:"#456",stroke:"#CDE",width:2},
    { type: "text",position: [0,1,100,8],color: "#FFF",value: "Team stats ("+stats.sides.length+")"}
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
      { type:"box",position:[0,line*10+1,100,8],fill:"#456",stroke:"#CDE",width:2},
      { type: "text",position: [0,line*10+1,100,8],color: "#FFF",value: "Leaderboard"}
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
};
deco = function(ship,stat,score,stats) {
  let line=stat.indexOf(ship.team);
  let origin=[...scoreboard.components];
  if (line == -1) {
    scoreboard.components.splice(scoreboard.components.length-2,2,
      new PlayerBox(90),
      new Tag("text",stats.sides[ship.team]+" 🚀",line*10+1,stats.hue[ship.team],"right"),
      new Tag("text",stats.names[ship.team],line*10+1,stats.hue[ship.team],"left")
    );
  }
  else scoreboard.components.splice(line*2+2,0,new PlayerBox((line+1)*10));
  if (stats.sides.length<7)
  {
    line=score.indexOf(game.ships.indexOf(ship));
    if (line == -1) {
      scoreboard.components.splice(scoreboard.components.length-2,2,
        new PlayerBox(90),
        new Tag("text",ship.score,91,stats.hue[ship.team],"right",5),
        new Tag("player",ship.id,91,stats.hue[ship.team],"left")
      );
    }
    else scoreboard.components.splice((line+stats.sides.length+2)*2+1,0,new PlayerBox((line+stats.sides.length+2)*10));
  }
  ship.setUIComponent(scoreboard);
  scoreboard.components=[...origin];
};
updatesides = function() {
  let presides=[...stats.sides];
  stats.sides=[];
  for (let i=0;i<presides.length;i++) stats.sides.push(0);
  for (let ship of game.ships) {
    if (ship.alive === true) stats.sides[ship.team]++;
  }
  for (let i=0;i<presides.length;i++) {
    if (stats.sides[i] != presides[i] && logstats == 1) {
      let ec="";
      for (let i=0;i<stats.names.length;i++) ec+=i+":"+stats.sides[i]+" ; ";
      echo(ec);
      break;
    }
  }
};
PlayerBox = function(pos) {
  return { type:"box",position:[0,pos,100,10],fill:"#384A5C",width:2};
};
Tag = function(indtext,param,pos,color,al,size) {
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
};
update = function() {
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
      let str=((dominate === ship.team)?("Your team"):(stats.names[dominate]))+" is dominating!";
      updateinfo(ship,str,stats.hue[dominate]);
    }
  }
  updatescoreboard();
};
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
};
this.tick = function(game) {
  if (loginfo == 1) {
    loginfo=0;
    if (!start) 
    {
      game.modding.terminal.error("Error: Number of teams must be higher than 1");
      game.modding.commands.stop();
    }
    else
    {
      echo("\nStarblast Tag Mode - by Bhpsngum");
      echo("type 'update_stats enable/disable' to enable/disable");
      echo("team stats update logs\n");
      echo("List of team name and their team ids (for players logging):\n")
      for (let i=0;i<stats.names.length;i++) echo(i+": "+stats.names[i]);
      echo("\n");
      let ec="";
      for (let i=0;i<stats.names.length;i++) ec+=i+":0 ; ";
      echo(ec);
    }
  }
  if (game.step % 30 === 0) {
    if (game.step % 1200 === 0)
    {
      let x=rand(this.options.map_size*20)-this.options.map_size*10;
      let y=rand(this.options.map_size*20)-this.options.map_size*10;
      game.addCollectible({code:collectibles[rand(10)],x:x,y:y});
    }
    for (let ship of game.ships) {
      if (!ship.custom.init) {
        let pos=sort(stats.sides),index;
        if (game.step > (this.options.tag_time||5)*3600 && stats.sides[ship.team] === 0) {
          for (index=pos.length-1;index>=0;index--) {
            if (stats.sides[pos[index]] > 0) {
              ship.set({team:pos[index]});
              break;
            }
          }
        }
        ship.custom.init = {exist:true,team:pos[index]||ship.team};
        ship.frag=0;
        ship.death=0;
        ship.highscore=ship.score;
        ship.set({hue:stats.hue[pos[index]||ship.team],invulnerable:300});
      }
      if (ship.highscore<ship.score) ship.highscore=ship.score;
    }
    update();
    if (Math.max(...stats.sides) == game.ships.length && game.step > (this.options.tag_time||5)*3600 && endgame === 0) {
      endgame=1;
      for (let ship of game.ships) {
        updateinfo(ship,stats.names[stats.sides.indexOf(Math.max(...stats.sides))]+" team wins!",stats.hue[stats.sides.indexOf(Math.max(...stats.sides))]);
        setTimeout(function() {
          ship.gameover({
            "Score":ship.score,
            "Frags":ship.frag,
            "Deaths":ship.death,
            "High score":ship.highscore,
            "First team joined":stats.names[ship.custom.init.team],
            "Last team joined":stats.names[ship.team]
          });
        },4000);
      }
    }
    if (game.ships.length === 0 && endgame == 1 && end === 0) {
      echo("Game completed!\nThanks for playing!");
      end=1;
    }
  }
};
this.event = function(event,game) {
 switch(event.name)
 {
   case "ship_spawned":
     event.ship.set({hue:stats.hue[event.ship.team],invulnerable:300});
     break;
   case "ship_destroyed":
     if (event.killer !== null) {
       event.ship.set({team:event.killer.team});
       event.killer.frag++;
     }
     if (event.ship !== null) {
       event.ship.death++;
       event.ship.set({score:Math.ceil(event.ship.score/2)});
     }
     break;
 }
};
