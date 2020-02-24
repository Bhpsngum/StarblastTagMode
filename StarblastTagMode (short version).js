var colorscode=[0,60,180,300];
var hexcolorcode=["#F00","#ffff00","#0FF","#ffc0cb"];
var colors=["Red","Yellow","Cyan","Pink"];
var collectibles = [10,11,12,20,21,40,41,42,90,91];
var sides=[0,0,0,0];
var endgame=0,dominate=-1,predominate=-1;
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
  crystal_value:5,
  asteroid_strength:0.05,
  radar_zoom:1,
  starting_ship_maxed:false,
  weapon_drop:0.25,
  max_players:40,
  weapons_store:false,
  rcs_toggle:true,
  map_size:40,
  friendly_colors:4,
  root_mode:"",
  vocabulary:vocabulary,
  soundtrack:"argon.mp3"
};
letsrand = function(lol) {
  return Math.floor((Math.random() * lol));
};
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
    { type: "text",position: [0,0,100,100],color: color,value: text}
  ];
  ship.setUIComponent(info);
  info.components = [
    { type: "text",position: [0,0,100,100],color: "#000",value:""}
  ];
  setTimeout(function(){ship.setUIComponent(info)},3000);
};
updatescoreboard = function(game) {
  scoreboard.components = [
    { type:"box",position:[0,1,100,8],fill:"#456",stroke:"#CDE",width:2},
    { type: "text",position: [0,1,100,8],color: "#FFF",value: "Team stats"}
  ];
  let line=1;
  let pos=sort(sides);
  for (let i=0;i<4;i++) {
    scoreboard.components.push(
      new Tag("text",sides[pos[i]]+" 🚀",line*10+1,hexcolorcode[pos[i]],"right"),
      new Tag("text",colors[pos[i]],line*10+1,hexcolorcode[pos[i]],"left")
    );
    line++;
  }
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
  let topp=sort(lead).slice(0,4);
  for (let i=0;i<topp.length;i++) {
    scoreboard.components.push(
      new Tag("text",game.ships[topp[i]].score,line*10+1,hexcolorcode[game.ships[topp[i]].team],"right",5),
      new Tag("player",game.ships[topp[i]].id,line*10+1,hexcolorcode[game.ships[topp[i]].team],"left")
    );
    line++;
  }
  for (let ship of game.ships) deco(ship,pos,topp);
};
deco = function(ship,stats,score) {
  let line=stats.indexOf(ship.team);
  let origin=[...scoreboard.components];
  scoreboard.components.splice(line*2+2,0,new PlayerBox((line+1)*10));
  line=score.indexOf(game.ships.indexOf(ship));
  if (line == -1) {
    scoreboard.components.splice(scoreboard.components.length-2,2,
      new PlayerBox(90),
      new Tag("text",ship.score,91,hexcolorcode[ship.team],"right",5),
      new Tag("player",ship.id,91,hexcolorcode[ship.team],"left")
    );
  }
  else {
    scoreboard.components.splice(line*2+13,0,new PlayerBox((line+6)*10));
  }
  ship.setUIComponent(scoreboard);
  scoreboard.components=[...origin];
};
updatesides = function(game) {
  sides=[0,0,0,0];
  for (let ship of game.ships) {
    if (ship.alive === true) sides[ship.team]++;
  }
};
PlayerBox = function(pos) {
  return { type:"box",position:[0,pos,100,10],fill:"#384A5C",width:2};
};
Tag = function(indtext,param,pos,hex,al,size) {
  let obj= {type: indtext,position: [0,pos,100-(size||0),8],color: hex,align:al};
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
update = function(game) {
  updatesides(game);
  let loop=0;
  for (let i=0;i<4;i++) {
    if (sides[i] == Math.max(...sides)) {
      loop++;
      predominate=dominate;
      dominate=i;
    }
  }
  if (loop>1) dominate=-1;
  if (dominate != predominate && dominate != -1 && game.ships.length > 1) {
    for (let ship of game.ships) {
      let str=((dominate === ship.team)?("Your"):(colors[dominate]))+" team is dominating!";
      updateinfo(ship,str,hexcolorcode[dominate]);
    }
  }
  updatescoreboard(game);
};
this.tick = function(game) {
  if (game.step % 30 === 0) {
    if (game.step % 1200 === 0)
    {
      let x=letsrand(this.options.map_size*20)-this.options.map_size*10;
      let y=letsrand(this.options.map_size*20)-this.options.map_size*10;
      game.addCollectible({code:collectibles[letsrand(10)],x:x,y:y});
    }
    for (let ship of game.ships) {
      if (!ship.custom.init) {
        let pos=sort(sides),index;
        if (game.step > 18000 && sides[ship.team] === 0) {
          for (index=pos.length-1;index>=0;index--) {
            if (sides[pos[index]] > 0) {
              ship.set({team:pos[index]});
              break;
            }
          }
        }
        ship.custom.init = {exist:true,team:pos[index]||ship.team};
        ship.frag=0;
        ship.death=0;
        ship.highscore=ship.score;
        ship.set({hue:colorscode[pos[index]||ship.team],invulnerable:300});
      }
      if (ship.highscore<ship.score) ship.highscore=ship.score;
    }
    update(game);
    if (Math.max(...sides) == game.ships.length && game.step > 18000 && endgame === 0) {
      endgame=1;
      for (let ship of game.ships) {
        updateinfo(ship,colors[sides.indexOf(Math.max(...sides))]+" team wins!",hexcolorcode[sides.indexOf(Math.max(...sides))]);
        setTimeout(function() {
          ship.gameover({
            "Score":ship.score,
            "Frags":ship.frag,
            "Deaths":ship.death,
            "High score":ship.highscore,
            "First team joined":colors[ship.custom.init.team],
            "Last team joined":colors[ship.team]
          });
        },4000);
      }
    }
  }
};
this.event = function(event,game) {
 switch(event.name)
 {
   case "ship_spawned":
     event.ship.set({hue:colorscode[event.ship.team],invulnerable:300});
     break;
   case "ship_destroyed":
     if (event.killer !== null) {
       event.ship.set({team:event.killer.team});
       event.killer.frag++;
     }
     if (event.ship !== null) {
       event.ship.death++;
       event.ship.set({score:Math.floor(event.ship.score/2)});
     }
     break;
 }
};
