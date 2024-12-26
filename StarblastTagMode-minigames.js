const GAME_CONFIG = {
	teams: {
		amount: 3, // Amount of teams, 2-5
		names: ["Red", "Blue", "Yellow"], // Name of teams
		instructors: ["Zoltar", "Lucina", "Maria"], // instructors of teams
		anon_instructor: "Kan", // instructor for anyone not belong to a team
		hues: [0, 180, 60], // hues of the teams, 0-360
	},
	time: {
		waiting: 30, // Time before the game starts, in seconds
		elimination: 5 * 60, // Time after game starts that game starts checking for winning team, in seconds
		lockdown: 10 * 60, // Time counting from game starts before the game disallows joining and starts checking gameover, in seconds
		survival: 20 * 60, // Time before game sets to survival, in seconds
		survival_starts_warning: 5 * 60, // Time to warn players before survival starts, in seconds
	},
	misc: {
		min_players: 2, // minimum players required before game starts
		crystals: 720, // amount of crystals when ship spawns
	},
	options: {
		// this.options stuff
		map_size: 80,
		speed_mod: 1.2,
		max_players: 80,
		radar_zoom: 2,
		map_name: "Tag Mode Minigames Beta",
		max_level: 6,
		ships: [
			'{"name":"Spectator","level":1,"model":1,"size":0.025,"zoom":2.45063709469745,"specs":{"shield":{"capacity":[1e-30,1e-30],"reload":[1000,1000]},"generator":{"capacity":[1e-30,1e-30],"reload":[1,1]},"ship":{"mass":1,"speed":[150,150],"rotation":[1000,1000],"acceleration":[1000,1000]}},"bodies":{"face":{"section_segments":100,"angle":0,"offset":{"x":0,"y":0,"z":0},"position":{"x":[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],"y":[-2,-2,2,2],"z":[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0]},"width":[0,1,1,0],"height":[0,1,1,0],"vertical":true,"texture":[6]}},"typespec":{"name":"Spectator","level":1,"model":1,"code":101,"specs":{"shield":{"capacity":[1e-30,1e-30],"reload":[1000,1000]},"generator":{"capacity":[1e-30,1e-30],"reload":[1,1]},"ship":{"mass":1,"speed":[150,150],"rotation":[1000,1000],"acceleration":[1000,1000]}},"shape":[0,0,0,0,0,0,0,0,0,0],"lasers":[],"radius":200}}',
			'{"name":"Gameover","level":8,"model":1,"size":0.025,"zoom":2.45063709469745,"specs":{"shield":{"capacity":[1e-30,1e-30],"reload":[1000,1000]},"generator":{"capacity":[1e-30,1e-30],"reload":[1,1]},"ship":{"mass":1,"speed":[1e-300,1e-300],"rotation":[1000,1000],"acceleration":[1e-300,1e-300]}},"bodies":{"face":{"section_segments":100,"angle":0,"offset":{"x":0,"y":0,"z":0},"position":{"x":[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],"y":[-2,-2,2,2],"z":[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0]},"width":[0,1,1,0],"height":[0,1,1,0],"vertical":true,"texture":[6]}},"typespec":{"name":"Gameover","level":8,"model":1,"code":801,"specs":{"shield":{"capacity":[1e-30,1e-30],"reload":[1000,1000]},"generator":{"capacity":[1e-30,1e-30],"reload":[1,1]},"ship":{"mass":1,"speed":[1e-300,1e-300],"rotation":[1000,1000],"acceleration":[1e-300,1e-300]}},"shape":[0,0,0,0,0,0,0,0,0,0],"lasers":[],"radius":200}}'
		],
		choose_ship: [...Array(9)].map((v, i) => 601 + i),
		starting_ship: 800
	}
}

GAME_CONFIG.options.survival_time = GAME_CONFIG.time.survival / 60;
GAME_CONFIG.options.friendly_colors = GAME_CONFIG.teams.amount;

// functions

let timer = {
	id_pool: 0,
	jobs: new Map(),
	setTimeout: function (func, time, ...args) {
		this.jobs.set(++this.id_pool, {func, time: game.step + time, args});
	},
	tick: function (game) {
		for (let [job_id, job] of this.jobs.entries()) {
			if (game.step >= job.time) {
				try { job.func.call(game, ...job.args) } catch (e) {}
				this.jobs.delete(job_id);
			}
		}
	}
}

let toTimer = function (seconds) {
	let minutes = Math.trunc(seconds / 60);
	seconds -= minutes * 60;
	if (minutes < 60) return `${minutes}:${seconds.toString().padStart(2, "0")}`;
	let hours = Math.trunc(minutes / 60);
	minutes -= hours * 60;
	return `${hours}:${minutes.toString().padStart(2, "0")}:${seconds.toString().padStart(2, "0")}`;
}

let randInt = n => Math.trunc(Math.random() * n);
let randRange = (a, b) => a + Math.random() * (b - a);
let randItem = list => list[randInt(list.length)];
let randWeight = function (options = []) {
	var weights = [], newOptions = [];

	// build accumulative weights array
	for (let option of options) {
		if (option.weight <= 0) continue;
		newOptions.push(option);
		weights.push(option.weight + (weights.length > 0 ? weights[weights.length - 1] : 0));
	}

	options = newOptions;

	if (options.length < 1) return null;
	if (options.length < 2) return options[0].value;
	
	var random = Math.random() * weights[weights.length - 1];
	
	// we use binary search here since sample size can be very large
	let start = 0, end = options.length - 1;

	if (random < weights[start]) return options[start].value;

	while (start < end) {
		let mid = Math.trunc((start + end) / 2);
		
		if (weights[mid + 1] > random && random >= weights[mid]) {
			return options[mid + 1].value;
		}
		else if (random >= weights[mid]) start = mid;
		else end = mid;
	}
	
	return options[start].value;
}

let teamPlayers = {
	data: [],
	update: function () {
		this.data = Array(GAME_CONFIG.teams.amount).fill(0).map(e => []);

		for (let ship of game.ships) {
			if (ship.custom.team != null) this.data[ship.custom.team].push(ship);
		}

		return this.data;
	},
	get length () {
		return this.data.map(e => e.length);
	}
}

let instructorSays = function (ship, quote, timeout = 300) {
	let instructor = ship.custom.team != null ? GAME_CONFIG.teams.instructors[ship.custom.team] : GAME_CONFIG.teams.anon_instructor;
	
	ship.instructorSays(quote, instructor);

	timer.setTimeout(() => {
		ship.instructorSays("\n".repeat(6), instructor);
		ship.hideInstructor();
	}, timeout);
}

let setTeam = function (ship, team) {
	ship.set({ team });
	ship.custom.team = team;
	teamPlayers.update();

	instructorSays(ship, `You have joined ${GAME_CONFIG.teams.names[team]}.\nEliminate all other teams to achieve victory!`);
}

let spawnShip = function (ship) {
	let options = {
		shield: 1e5,
		generator: 1e5,
		crystals: GAME_CONFIG.misc.crystals,
		stats: 1e8 - 1,
		collider: true,
		idle: false,
		invulnerable: 10 * 60
	};

	if (ship.custom.taggedTeam != null) {
		setTeam(ship, ship.custom.taggedTeam);
		ship.custom.taggedTeam = null;
	}

	if (ship.custom.team != null) {
		options.hue = GAME_CONFIG.teams.hues[ship.custom.team];
	}

	// put player randomly near the swarm of teammates
	let players = teamPlayers.data[ship.custom.team];
	let minimal = true;

	if (players.length < 2) {
		players = teamPlayers.data.flat();
		minimal = false;
	}
	
	const MAP_SIZE = GAME_CONFIG.options.map_size * 10;

	const MAP_AXIS = MAP_SIZE / 2;

	const GRID_SIZE = 60; // size of each grid

	const GRIDS_PER_WIDTH = Math.trunc(MAP_SIZE / GRID_SIZE);

	const GRID_DIST = MAP_SIZE / GRIDS_PER_WIDTH;

	const SHIP_DENSITY_RANGE = 200; // radius around ship that will increase density

	const steps = Math.trunc(SHIP_DENSITY_RANGE / GRID_DIST);

	const MATCH_WEIGHTS = 32;

	// graph a density map

	let denseMap = Array(GRIDS_PER_WIDTH).fill(0).map((v1, y) => Array(GRIDS_PER_WIDTH).fill(0).map((v2, x) => ({
		weight: minimal ? 0 : 1,
		value: {
			x: x * GRID_DIST - MAP_AXIS,
			y: (GRIDS_PER_WIDTH - y) * GRID_DIST - MAP_AXIS
		}
	})));

	for (let player of players) {
		if (player.id === ship.id) continue;

		let grid_x = Math.trunc((player.x - MAP_AXIS) / GRID_DIST);
		let grid_y = Math.trunc((-player.y - MAP_AXIS) / GRID_DIST);

		for (let i = -steps + 1; i < steps; ++i) {
			for (let j = -steps + 1; j < steps; ++j) {
				let grid = denseMap.at((grid_y + i) % GRIDS_PER_WIDTH).at((grid_x + j) % GRIDS_PER_WIDTH);
				let weight = MATCH_WEIGHTS / steps * (steps - Math.max(Math.abs(i), Math.abs(j)));
				if (grid.weight === 0) grid.weight = 1;
				if (minimal) grid.weight *= weight;
				else grid.weight /= weight;
			}
		}
	}

	let selectedSpawn = randWeight(denseMap.flat());
	if (selectedSpawn) {
		options.x = randRange(selectedSpawn.x, selectedSpawn.x + GRID_DIST);
		options.y = randRange(selectedSpawn.y, selectedSpawn.y + GRID_DIST);
	}
	else {
		options.x = randRange(-MAP_AXIS, MAP_AXIS);
		options.y = randRange(-MAP_AXIS, MAP_AXIS);
	}

	ship.set(options);
}

let toHSLA = function (hue = 0, alpha = 1, saturation = 100, lightness = 50) {
	return `hsla(${hue}, ${saturation}%, ${lightness}%, ${alpha})`
}

let team_info_ui = {
	id: "team_info",
	position: [85, 40, 10, 10],
}

let updateTeamInfo = function () {
	let components = [
		{type: "text", position: [0, 0, 100, 25], value: "Players", color: "#cde"}
	];

	let amounts = teamPlayers.length;

	let chart_width = 100 / amounts.length;
	
	let largest_team_count = Math.max(...amounts);

	let colon_width = 0.25; // ratio to counter
		
	let single_equiv = 1 + colon_width; // 1: own width, colon_width: the ":" width

	let width_equiv = amounts.length * single_equiv;

	width_equiv -= colon_width;
		
	let width = 100 / width_equiv;

	for (let i = 0; i < amounts.length; ++i) {
		let offsetX = i * width * single_equiv, count = amounts[i];
		let teamHue = toHSLA(GAME_CONFIG.teams.hues[i], 1, 100, 65);
		components.push(
			{ type: "text", position: [offsetX, 25, width, 25], value: count, color: teamHue },
			{ type: "box", position: [i * chart_width, 50, chart_width, 50 * ((count / largest_team_count) || 0)], fill: teamHue }
		);

		if (i < amounts.length - 1) components.push({ type: "text", position: [offsetX + width, 25, width * colon_width, 25], value: ":", color: "#cde" });
	}

	team_info_ui.components = components;
	game.setUIComponent(team_info_ui);
}

// tick, events and options

this.options = GAME_CONFIG.options;

let waiting_ui = {
	id: "waiting_text",
	position: [40, 20, 20, 10],
	components: [
		{ type: "text", position: [0, 0, 100, 50], value: "Waiting for more players...", color: "#cde"},
		{ type: "text", position: [0, 50, 100, 50], value: "", color: "#cde"}
	]
};

this.tick = function (game) {
	if (game.custom.started) {
		this.tick = main_game;
		return this.tick(game);
	}

	let players_count = 0;
	for (let ship of game.ships) {
		if (!ship.custom.prejoined && ship.alive) {
			ship.custom.prejoined = true;
			ship.set({
				idle: true,
				x: 0, y: 0,
				vx: 0, vy: 0,
				collider: false,
				angle: 90,
				stats: 1e8 - 1,
				crystals: GAME_CONFIG.misc.crystals
			});
			ship.setUIComponent(waiting_ui);
		}

		if (ship.custom.prejoined) ++players_count;
	}

	let wait_text;

	if (players_count < GAME_CONFIG.misc.min_players) {
		game.custom.ready = false;
		wait_text = `${players_count}/${GAME_CONFIG.misc.min_players} players required`;
	}
	else {
		if (!game.custom.ready) {
			game.custom.ready = true;
			game.custom.wait_start = game.step + GAME_CONFIG.time.waiting * 60;
		}

		let remaining = game.custom.wait_start - game.step;

		if (remaining <= 0) {
			game.custom.started = true;
			game.setUIComponent({
				id: "waiting_text",
				position: [0, 0, 0, 0],
				visible: false
			});
			this.tick = main_game;
			return;
		}
		
		wait_text = Math.round(remaining / 60);
	}

	if (wait_text != game.custom.wait_text) {
		game.custom.wait_text = wait_text;
		waiting_ui.components[1].value = wait_text;
		game.setUIComponent(waiting_ui);
	}
}

let main_game = function (game) {
	if (game.custom.finished) {
		this.tick = end_game;
		return this.tick(game);
	}

	timer.tick(game);
	let isLockdown = game.step > GAME_CONFIG.time.lockdown * 60 + game.custom.wait_start;
	let oldPlayers = teamPlayers.length;
	teamPlayers.update();
	for (let ship of game.ships) {
		// check if ship hasn't been initialized yet
		if (!ship.custom.joined && ship.alive) {
			ship.custom.joined = true;
			ship.setUIComponent(team_info_ui);

			if (isLockdown) {
				// turn ship to spectator in lockdown phase
				ship.custom.spectator = true;
				ship.set({ type: 101, stats: 1e8 - 1, collider: false, hue: 350 });
				instructorSays(ship, "Game is already closed.\nYou are now spectating this match.");
			}
			else {
				// assign them to the team with lowest player count
				// if there are multiple teams with lowest player count,
				// randomly choose one of them
				let lowCount = Math.min(...teamPlayers.length);
				let lowTeams = [];
				for (let i = 0; i < GAME_CONFIG.teams.amount; ++i) {
					if (teamPlayers.data[i].length === lowCount) lowTeams.push(i);
				}

				let selectedTeam = randItem(lowTeams);

				setTeam(ship, selectedTeam);
				ship.custom.initialTeam = selectedTeam;
				spawnShip(ship);
			}
		}

		if (ship.custom.joined) {
			// custom "ship_spawned" handling
			let { lastAliveStatus } = ship.custom;

			if (lastAliveStatus != null && lastAliveStatus != ship.alive && ship.alive) {
				if (ship.custom.spectator) ship.set({ stats: 1e8 - 1 });
				else spawnShip(ship);
			}

			ship.custom.lastAliveStatus = ship.alive;
		}
	}

	let newLen = teamPlayers.length;

	if (oldPlayers.toString() != newLen.toString()) {
		updateTeamInfo();
	}

	if (game.step > GAME_CONFIG.time.elimination * 60 + game.custom.wait_start) {
		let teams = newLen;

		let aliveTeam = null;

		for (let i = 0; i < GAME_CONFIG.teams.amount; ++i) {
			if (teams[i] > 0) {
				if (aliveTeam == null) aliveTeam = i;
				else {
					aliveTeam = null;
					break;
				}
			}
		}

		if (aliveTeam != null) {
			let winnerName = GAME_CONFIG.teams.names[aliveTeam].toUpperCase();
			let trophy = '\ud83c\udfc6';
			game.setUIComponent({
				id: "endgame_notification",
				position: [25, 20, 50, 10],
				components: [
					{ type: "text", position: [0, 0, 100, 50], value: `${trophy} ${winnerName} ${trophy}`, color: toHSLA(GAME_CONFIG.teams.hues[aliveTeam], 1, 100, 65)},
					{ type: "text", position: [0, 50, 100, 50], value: "wins the match!", color: "#cde"},
				]
			});
			game.custom.gameover_status = {
				"Winner Team": winnerName
			}
			for (let ship of game.ships) {
				if (ship.custom.joined) timer.setTimeout(() => {
					if (ship.custom.spectator) ship.gameover(game.custom.gameover_status);
					else ship.gameover({
						...game.custom.gameover_status,
						" ": " ",
						"Initial Team": ship.custom.initialTeam != null ? GAME_CONFIG.teams.names[ship.custom.initialTeam].toUpperCase() : "None",
						"Frags": ship.custom.kills || 0,
						"Deaths": ship.custom.deaths || 0
					});
				}, 5 * 60);
			}
			
			game.custom.noTimer = true;
			game.setUIComponent({
				id: "survival_timer",
				position: [0, 0, 0, 0],
				visible: false
			});

			game.custom.finished = true;
			this.tick = end_game;
		}
	}

	if (!game.custom.noTimer) {
		let timeUntilSurvival = GAME_CONFIG.time.survival * 60 + game.custom.wait_start - game.step;
		let warn_time = GAME_CONFIG.time.survival_starts_warning * 60;
		if (timeUntilSurvival <= warn_time) {
			if (timeUntilSurvival > 0) {
				let timeLeft = toTimer(Math.round(timeUntilSurvival / 60));
				if (timeLeft != game.custom.timeLeft) {
					game.setUIComponent({
						id: "survival_timer",
						position: [2.5, 30, 15, 7],
						components: [
							{ type: "text", position: [0, 0, 100, 50], value: "Time until survival", color: "#cde"},
							{ type: "text", position: [0, 50, 100, 50], value: timeLeft, color: toHSLA(Math.trunc(timeUntilSurvival / warn_time * 120), 1, 100, 65)},
						]
					});
					game.custom.timeLeft = timeLeft;
				}
			}
			else if (!game.custom.noTimer) {
				let ship = game.ships.find(ship => !ship.alive) || game.ships[0];
				if (ship) {
					let { shield, generator, type } = ship;
					ship.set({ type: 801, collider: false, stats: 1e8 - 1 });
					timer.setTimeout(() => ship.set({ shield, generator, type, collider: true, stats: 1e8 - 1 }), 60);
				}
				game.custom.noTimer = true;
				game.setUIComponent({
					id: "survival_timer",
					position: [0, 0, 0, 0],
					visible: false
				});
			}
		}
	}
}

let end_game = function (game) {
	timer.tick(game);
	for (let ship of game.ships) {
		if (!ship.custom.joined) {
			ship.gameover(game.custom.gameover_status);
			ship.custom.joined = true;
		}
	}
}

this.event = function (event, game) {
	// checking for ship_spawned event is not necessary since survival doesn't fire such event
	switch (event.name) {
		case "ship_destroyed": {
			let { ship, killer } = event;
			if (!game.custom.started || !ship || !ship.custom.joined || ship.custom.spectator) break;
			if (killer) {
				let killerTeam = killer.custom.team;
				if (killerTeam != null && killerTeam !== ship.custom.team) {
					killer.custom.kills = (killer.custom.kills || 0) + 1;
					
					ship.custom.taggedTeam = killerTeam;
					ship.custom.team = null;
				}
			}
			ship.custom.deaths = (ship.custom.deaths || 0) + 1;
			break;
		}
	}
}