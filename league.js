//Viridian League

const leagueDataFile = './config/league.json';

var fs = require('fs');

function defaultData() {
	var data = {};
	data['main'] = {
		leader: '',
		desc: 'Liga Viridian',
		htmlDesc: 'placeholder',
		winners: {},
		medalImage: 'http://i1224.photobucket.com/albums/ee376/DarkythePro/Liga-Viridian_zpsafe6664d.png',
		defaultTier: 'ou',
		colorGym: 'green'
		
	};
	data['elite4steel'] = {
		leader: 'Dark Labyrinth',
		desc: 'Elite 4 de tipo Acero',
		htmlDesc: 'placeholder',
		winners: {},
		medalImage: 'http://i1224.photobucket.com/albums/ee376/DarkythePro/Gymacercopy_zps5f3379c6.png',
		defaultTier: 'ou',
		colorGym: 'grey'
		
	};
	data['elite4poison'] = {
		leader: 'Mr.Reptile',
		desc: 'Elite 4 de tipo Veneno',
		htmlDesc: 'placeholder',
		winners: {},
		medalImage: 'http://i1224.photobucket.com/albums/ee376/DarkythePro/Gympoiscopy_zps9d5f2293.png',
		defaultTier: 'ou',
		colorGym: 'purple'
		
	};
	data['elite4dark'] = {
		leader: 'Tohsaka Rin',
		desc: 'Elite 4 de tipo Siniestro',
		htmlDesc: 'placeholder',
		winners: {},
		medalImage: 'http://i1224.photobucket.com/albums/ee376/DarkythePro/Gymdark_zps321a00b7.png',
		defaultTier: 'ou',
		colorGym: 'black'
		
	};
	data['elite4fighting'] = {
		leader: 'Misicloud',
		desc: 'Elite 4 de tipo Lucha',
		htmlDesc: 'placeholder',
		winners: {},
		medalImage: 'http://i1224.photobucket.com/albums/ee376/DarkythePro/Gymfightcopy_zpseb4af77d.png',
		defaultTier: 'ou',
		colorGym: 'orange'
		
	};
	data['gymfire'] = {
		leader: 'Law Yuuichi',
		desc: 'Líder de Gimnasio de tipo Fuego',
		htmlDesc: 'placeholder',
		winners: {},
		medalImage: 'http://i1224.photobucket.com/albums/ee376/DarkythePro/Gymfirecopy_zps512fd6ad.png',
		defaultTier: 'ou',
		colorGym: 'red'
		
	};
	data['gymflying'] = {
		leader: 'Licor43',
		desc: 'Líder de Gimnasio de tipo Volador',
		htmlDesc: 'placeholder',
		winners: {},
		medalImage: 'http://i1224.photobucket.com/albums/ee376/DarkythePro/Gymflycopy_zps79f43ddb.png',
		defaultTier: 'ou',
		colorGym: 'cyan'
		
	};
	data['gymwater'] = {
		leader: 'Chan00b',
		desc: 'Líder de Gimnasio de tipo Agua',
		htmlDesc: 'placeholder',
		winners: {},
		medalImage: 'http://i1224.photobucket.com/albums/ee376/DarkythePro/Gymwatcopy_zps492773cd.png',
		defaultTier: 'ou',
		colorGym: 'blue'
		
	};
	data['gymelectric'] = {
		leader: 'OdinWinterWolf',
		desc: 'Líder de Gimnasio de tipo Eléctrico',
		htmlDesc: 'placeholder',
		winners: {},
		medalImage: 'http://i1224.photobucket.com/albums/ee376/DarkythePro/Gymeleccopy_zps8fc0fd06.png',
		defaultTier: 'ou',
		colorGym: 'yellow'
		
	};
	data['gymdragon'] = {
		leader: 'Senky',
		desc: 'Líder de Gimnasio de tipo Dragón',
		htmlDesc: 'placeholder',
		winners: {},
		medalImage: 'http://i1224.photobucket.com/albums/ee376/DarkythePro/Gymdrakecopy_zps72e5d6c3.png',
		defaultTier: 'ou',
		colorGym: 'garnet'
		
	};
	data['gymbug'] = {
		leader: 'Campizzo',
		desc: 'Líder de Gimnasio de tipo Bicho',
		htmlDesc: 'placeholder',
		winners: {},
		medalImage: 'http://i1224.photobucket.com/albums/ee376/DarkythePro/Gymbugcopy_zps8dabd34d.png',
		defaultTier: 'ou',
		colorGym: 'orange'
		
	};
	data['gymgrass'] = {
		leader: 'Lemmy',
		desc: 'Líder de Gimnasio de tipo Planta',
		htmlDesc: 'placeholder',
		winners: {},
		medalImage: 'http://i1224.photobucket.com/albums/ee376/DarkythePro/Gymgrass_zpsd4c561d6.png',
		defaultTier: 'ou',
		colorGym: 'green'
		
	};
	data['gymground'] = {
		leader: 'Zng',
		desc: 'Líder de Gimnasio de tipo Tierra',
		htmlDesc: 'placeholder',
		winners: {},
		medalImage: 'http://i1224.photobucket.com/albums/ee376/DarkythePro/Gymgroundcopy_zpse9d7bd8b.png',
		defaultTier: 'ou',
		colorGym: 'brown'
		
	};
	return data;
}

if (!fs.existsSync(leagueDataFile))
	fs.writeFileSync(leagueDataFile, JSON.stringify(defaultData()));

var league = JSON.parse(fs.readFileSync(leagueDataFile).toString());

exports.league = league;
exports.leagueRoom = 'ligaviridian';

function writeLeagueData() {
	exports.league = league;
	fs.writeFileSync(leagueDataFile, JSON.stringify(league));
}

exports.getData = function (medalId) {
	medalId = toId(medalId);
	if (!league[medalId]) return false;
	return {
		leader: league[medalId].leader,
		desc: league[medalId].desc,
		htmlDesc: league[medalId].htmlDesc,
		winners: league[medalId].winners,
		medalImage: league[medalId].medalImage,
		colorGym: league[medalId].colorGym
	};
};

exports.findMedalFromLeader = function (leader) {
	leaderId = toId(leader);
	for (var i in league) {
		if (toId(league[i].leader) === leaderId) return i;
	}
	return false;
};

exports.getGymTable = function () {
	var html = '<center><img width="200" src="http://i1224.photobucket.com/albums/ee376/DarkythePro/Liga-Viridian_zpsafe6664d.png" title="Liga Viridian" /><h2>Elite 4</h2>';
	html += '<table border="0"><tr><td><img width="180" src="' + encodeURI(league['elite4steel'].medalImage) + '" title="Élite 4 de tipo Acero: ' + league['elite4steel'].leader + '" /></td>';
	html += '<td><img width="180" src="' + encodeURI(league['elite4fighting'].medalImage) + '" title="Élite 4 de tipo Lucha: ' + league['elite4fighting'].leader + '" /></td></tr><tr>';
	html += '<td><img width="180" src="' + encodeURI(league['elite4dark'].medalImage) + '" title="Élite 4 de tipo Siniestro: ' + league['elite4dark'].leader + '" /></td>';
	html += '<td><img width="180" src="' + encodeURI(league['elite4poison'].medalImage) + '" title="Élite 4 de tipo Veneno: ' + league['elite4poison'].leader + '" /></td></tr></table><h2>Gimnasios</h2>';
	html += '<table border="0"><tr><td><img width="160" src="' + encodeURI(league['gymfire'].medalImage) + '" title="Gimnasio de tipo Fuego: ' + league['gymfire'].leader + '" /></td>';
	html += '<td><img width="160" src="' + encodeURI(league['gymwater'].medalImage) + '" title="Gimnasio de tipo Agua: ' + league['gymwater'].leader + '" /></td></tr><tr>';
	html += '<td><img width="160" src="' + encodeURI(league['gymgrass'].medalImage) + '" title="Gimnasio de tipo Planta: ' + league['gymgrass'].leader + '" /></td>';
	html += '<td><img width="160" src="' + encodeURI(league['gymground'].medalImage) + '" title="Gimnasio de tipo Tierra: ' + league['gymground'].leader + '" /></td></tr><tr>';
	html += '<td><img width="160" src="' + encodeURI(league['gymflying'].medalImage) + '" title="Gimnasio de tipo Volador: ' + league['gymflying'].leader + '" /></td>';
	html += '<td><img width="160" src="' + encodeURI(league['gymelectric'].medalImage) + '" title="Gimnasio de tipo Eléctrico: ' + league['gymelectric'].leader + '" /></td></tr><tr>';
	html += '<td><img width="160" src="' + encodeURI(league['gymbug'].medalImage) + '" title="Gimnasio de tipo Bicho: ' + league['gymbug'].leader + '" /></td>';
	html += '<td><img width="160" src="' + encodeURI(league['gymdragon'].medalImage) + '" title="Gimnasio de tipo Dragón: ' + league['gymdragon'].leader + '" /></td></tr></table>';
	html += '<br /><b>&iexcl;Desafía a los miembros de la liga Viridian y gana sus medallas! </b><br /> Recuerda leer las reglas de un Gimnasio o Élite antes de desafiar a un miembro de la liga. Para más información sobre los comandos escribe /liga ayuda</center>';
	return html;
};

exports.haveMedal = function (user, medalId) {
	medalId = toId(medalId);
	var userId = toId(user);
	if (!league[medalId]) return false;
	if (!league[medalId].winners[userId]) return false;
	return true;
};

exports.giveMedal = function (user, medalId) {
	medalId = toId(medalId);
	var userId = toId(user);
	if (!league[medalId]) return false;
	if (league[medalId].winners[userId]) return false;
	league[medalId].winners[userId] = 1;
	writeLeagueData();
	return true;
};

exports.removeMedal = function (user, medalId) {
	medalId = toId(medalId);
	var userId = toId(user);
	if (!league[medalId]) return false;
	if (!league[medalId].winners[userId]) return false;
	delete league[medalId].winners[userId];
	writeLeagueData();
	return true;
};

exports.setMedalImage = function (medalId, image) {
	medalId = toId(medalId);
	if (!league[medalId]) return false;
	league[medalId].medalImage = Tools.escapeHTML(image);
	writeLeagueData();
	return true;
};

exports.setGymColor = function (medalId, color) {
	medalId = toId(medalId);
	if (!league[medalId]) return false;
	league[medalId].colorGym = Tools.escapeHTML(color);
	writeLeagueData();
	return true;
};

exports.setGymTier = function (medalId, tier) {
	medalId = toId(medalId);
	if (!league[medalId]) return false;
	league[medalId].defaultTier = toId(tier);
	writeLeagueData();
	return true;
};

exports.setGymLeader = function (medalId, leader) {
	medalId = toId(medalId);
	if (!league[medalId]) return false;
	if (leader !== '' && exports.findMedalFromLeader(leader)) return false;
	league[medalId].leader = leader;
	writeLeagueData();
	return true;
};

exports.setGymDesc = function (medalId, desc) {
	medalId = toId(medalId);
	if (!league[medalId]) return false;
	league[medalId].desc = Tools.escapeHTML(desc);
	writeLeagueData();
	return true;
};

exports.setGymDescHTML = function (medalId, html) {
	medalId = toId(medalId);
	if (!league[medalId]) return false;
	league[medalId].htmlDesc = html;
	writeLeagueData();
	return true;
};
