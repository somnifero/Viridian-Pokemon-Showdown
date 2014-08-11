const clanDataFile = './config/clans.json';

var fs = require('fs');
var elo = require('elo-rank')();

if (!fs.existsSync(clanDataFile))
	fs.writeFileSync(clanDataFile, '{}');
var clans = JSON.parse(fs.readFileSync(clanDataFile).toString());
var pendingWars = {};

exports.clans = clans;
exports.pendingWars = pendingWars;

function writeClanData() {
	fs.writeFileSync(clanDataFile, JSON.stringify(clans));
}

function getAvaliableFormats() {
	var formats = {};
	formats[0] = "ou";
	return formats;
}

exports.getWarFormatName = function (format) {
	switch (toId(format)) {
		case 'ou': return 'OU';
		case 'ubers': return 'Ubers';
		case 'uu': return 'UU';
		case 'ru': return 'RU';
		case 'nu': return 'NU';
		case 'lc': return 'LC';
		case 'vgc2014': return 'VGC 2014';
		case 'smogondoubles': return 'Smogon Doubles';
		case 'gen5ou': return '[Gen 5] OU';
		case 'gen4ou': return '[Gen 4] OU';
		case 'gen3ou': return '[Gen 3] OU';
		case 'gen2ou': return '[Gen 2] OU';
		case 'gen1ou': return '[Gen 1] OU';
	}
	return false;
};

exports.getClans = function () {
	return Object.keys(clans).map(function (c) { return clans[c].name; });
};

exports.getClansList = function (order) {
	var clanIds = {};
	var returnData = {};
	var clansList =  Object.keys(clans).sort().join(",");
	clanIds = clansList.split(',');
	if (toId(order) === 'puntos' || toId(order) === 'rank') {
		var actualRank = -1;
		var actualclanId = false;
		for (var j in clanIds) {
			for (var f in clanIds) {
				if (clans[clanIds[f]].rating > actualRank && !returnData[clanIds[f]]) {
					actualRank = clans[clanIds[f]].rating;
					actualclanId = clanIds[f];
				}
			}
			if (actualclanId) {
				returnData[actualclanId] = 1;
				actualclanId = false;
				actualRank = -1;
			}
		}
		return returnData;
	} else if (toId(order) === 'members' || toId(order) === 'miembros') {
		var actualMembers = -1;
		var actualclanId = false;
		for (var j in clanIds) {
			for (var f in clanIds) {
				if (exports.getMembers(clanIds[f]).length > actualMembers && !returnData[clanIds[f]]) {
					actualMembers = exports.getMembers(clanIds[f]).length;
					actualclanId = clanIds[f];
				}
			}
			if (actualclanId) {
				returnData[actualclanId] = 1;
				actualclanId = false;
				actualMembers = -1;
			}
		}
		return returnData;
	} else {
		for (var g in clanIds) {
			returnData[clanIds[g]] = 1;
		}
		return returnData;
	}
};

exports.getClanName = function (clan) {
	var clanId = toId(clan);
	return clans[clanId] ? clans[clanId].name : "";
};

exports.getRating = function (clan) {
	var clanId = toId(clan);
	if (!clans[clanId])
		return false;
	var gxeClan;
	if (clans[clanId].wins > 10) {
		gxeClan = clans[clanId].wins * 100 / (clans[clanId].wins + clans[clanId].losses);
	} else {
		gxeClan = 0;
	}
	return {
		wins: clans[clanId].wins,
		losses: clans[clanId].losses,
		draws: clans[clanId].draws,
		rating: clans[clanId].rating,
		gxe: gxeClan,
		gxeint: Math.floor(gxeClan),
		ratingName: exports.ratingToName(clans[clanId].rating),
	};
};

exports.getProfile = function (clan) {
	var clanId = toId(clan);
	if (!clans[clanId])
		return false;
	var gxeClan;
	if (clans[clanId].wins > 10) {
		gxeClan = clans[clanId].wins * 100 / (clans[clanId].wins + clans[clanId].losses);
	} else {
		gxeClan = 0;
	}
	return {
		wins: clans[clanId].wins,
		losses: clans[clanId].losses,
		draws: clans[clanId].draws,
		rating: clans[clanId].rating,
		gxe: gxeClan,
		gxeint: Math.floor(gxeClan),
		ratingName: exports.ratingToName(clans[clanId].rating),
		compname: clans[clanId].compname,
		logo: clans[clanId].logo,
		lema: clans[clanId].lema,
		sala: clans[clanId].sala,
		medals: clans[clanId].medals,
	};
};

exports.getElementalData = function (clan) {
	var clanId = toId(clan);
	if (!clans[clanId])
		return false;
	var gxeClan;
	if (clans[clanId].wins > 10) {
		gxeClan = clans[clanId].wins * 100 / (clans[clanId].wins + clans[clanId].losses);
	} else {
		gxeClan = 0;
	}
	return {
		wins: clans[clanId].wins,
		losses: clans[clanId].losses,
		draws: clans[clanId].draws,
		rating: clans[clanId].rating,
		gxe: gxeClan,
		gxeint: Math.floor(gxeClan),
		ratingName: exports.ratingToName(clans[clanId].rating),
		sala: clans[clanId].sala
	};
};

exports.ratingToName = function (rating) {
	if (rating > 1500)
		return "Gold";
	else if (rating > 1200)
		return "Silver";
	else
		return "Bronze";
};

exports.createClan = function (name) {
	var id = toId(name);
	if (clans[id])
		return false;

	clans[id] = {
		name: name,
		members: {},
		wins: 0,
		losses: 0,
		draws: 0,
		rating: 1000,
		//otros datos de clanes
		compname: name,
		leaders: {},
		oficials: {},
		invitations: {},
		logo: "http://www.51allout.co.uk/wp-content/uploads/2012/02/Image-not-found.gif",
		lema: "Lema del clan",
		sala: "none",
		medals: {},
	};
	writeClanData();

	return true;
};

exports.deleteClan = function (name) {
	var id = toId(name);
	if (!clans[id] || exports.findWarFromClan(id))
		return false;

	delete clans[id];
	writeClanData();

	return true;
};

exports.getMembers = function (clan) {
	var clanId = toId(clan);
	if (!clans[clanId])
		return false;

	return Object.keys(clans[clanId].members);
};

exports.getInvitations = function (clan) {
	var clanId = toId(clan);
	if (!clans[clanId])
		return false;

	return Object.keys(clans[clanId].invitations);
};

exports.getUserDiv = function (user) {
	var userId = toId(user);
	var userk = Users.getExact(userId);
	if (!userk) {
		return '<strong>' + userId + '</strong>';
	} else {
		return '<strong>' + userk.name + '</strong>';
	}
};

exports.getAuthMembers = function (clan, authLevel) {
	var clanId = toId(clan);
	if (!clans[clanId])
		return false;
	var returnMembers = {};
	var returnCode = "";
	var totalMembers = 0;
	var auxVar = 0;
    for (var c in clans[clanId].members) {
		if (Clans.authMember(clanId, c) === authLevel || authLevel === "all") {
			returnMembers[c] = 1;
			totalMembers += 1;
		}
	}
	for (var m in returnMembers) {
		auxVar += 1;
		returnCode += exports.getUserDiv(m);
		if (auxVar < totalMembers) {
			returnCode += ", ";
		}
	}
	return returnCode;
};

exports.authMember = function (clan, member) {
	var clanId = toId(clan);
	if (!clans[clanId])
		return false;
	var userid = toId(member);
	if (clans[clanId].leaders[userid]) return 2;
	if (clans[clanId].oficials[userid]) return 1;
	return false;
};

exports.getOficials = function (clan) {
	var clanId = toId(clan);
	if (!clans[clanId])
		return false;

	return Object.keys(clans[clanId].oficials);
};

exports.getLeaders = function (clan) {
	var clanId = toId(clan);
	if (!clans[clanId])
		return false;

	return Object.keys(clans[clanId].leaders);
};

exports.getAvailableMembers = function (clanA, isClanB) {
	var clanId = toId(clanA);
	if (!pendingWars[clanId])
		return false;
	var avaliableMembers = {};
	if (!isClanB) {
		avaliableMembers = pendingWars[clanId].clanAMembers;
	} else {
		avaliableMembers = pendingWars[clanId].clanBMembers;
	}
	var results = [];
	for (var m in avaliableMembers) {
		results.push(m);
	}

	return results;
};

exports.findClanFromMember = function (user) {
	var userId = toId(user);
	for (var c in clans)
		if (clans[c].members[userId])
			return clans[c].name;
	return false;
};

exports.setRanking = function (clan, dato) {
	var clanId = toId(clan);
	if (!clans[clanId])
		return false;
	if (dato > 0) {
		clans[clanId].rating = dato;
	} else {
		clans[clanId].rating = 0;
	}
	writeClanData();
	return true;
};

exports.setGxe = function (clan, wx, lx, tx) {
	var clanId = toId(clan);
	if (!clans[clanId])
		return false;
	if (wx > 0) {
		clans[clanId].wins = parseInt(wx);
	} else {
		clans[clanId].wins = 0;
	}
	if (lx > 0) {
		clans[clanId].losses = parseInt(lx);
	} else {
		clans[clanId].losses = 0;
	}
	if (tx > 0) {
		clans[clanId].draws = parseInt(tx);
	} else {
		clans[clanId].draws = 0;
	}
	writeClanData();
	return true;
};

exports.setCompname = function (clan, clanTitle) {
	var clanId = toId(clan);
	if (!clans[clanId])
		return false;
	if (clanTitle.length > 80) return false;
	clans[clanId].compname = clanTitle;
	writeClanData();
	return true;
};

exports.setLema = function (clan, text) {
	var clanId = toId(clan);
	if (!clans[clanId])
		return false;
	if (text.length > 80) return false;
	clans[clanId].lema = text;
	writeClanData();
	return true;
};

exports.setLogo = function (clan, text) {
	var clanId = toId(clan);
	if (!clans[clanId])
		return false;
	if (text.length > 80) return false;
	clans[clanId].logo = text;
	writeClanData();
	return true;
};

exports.setSala = function (clan, text) {
	var clanId = toId(clan);
	if (!clans[clanId])
		return false;
	if (text.length > 80) return false;
	clans[clanId].sala = text;
	writeClanData();
	return true;
};

exports.clearInvitations = function (clan) {
	var clanId = toId(clan);
	if (!clans[clanId])
		return false;
	clans[clanId].invitations = {};
	writeClanData();
	return true;
};

exports.addMedal = function (clan, medalName, medalImage, desc) {
	var clanId = toId(clan);
	var medalId = toId(medalName);
	if (medalName.length > 80) return false;
	if (medalImage.length > 80) return false;
	if (desc.length > 80) return false;
	if (!clans[clanId])
		return false;
	if (!clans[clanId].medals[medalId]) {
		clans[clanId].medals[medalId] = {
			name: medalName,
			logo: medalImage,
			desc: desc
		};
	} else {
		return false;
	}
	writeClanData();

	return true;
};

exports.deleteMedal = function (clan, medalName) {
	var clanId = toId(clan);
	var medalId = toId(medalName);
	if (!clans[clanId])
		return false;
	if (!clans[clanId].medals[medalId]) return false;
	delete clans[clanId].medals[medalId];
	writeClanData();

	return true;
};

exports.addMember = function (clan, user) {
	var clanId = toId(clan);
	var userId = toId(user);
	if (!clans[clanId] || exports.findClanFromMember(user))
		return false;

	clans[clanId].members[userId] = 1;
	writeClanData();

	return true;
};

exports.addLeader = function (user) {
	var userId = toId(user);
	var clanUser = exports.findClanFromMember(user);
	if (!clanUser)
		return false;
	var clanId = toId(clanUser);
	if (clans[clanId].leaders[userId]) return false;
	if (clans[clanId].oficials[userId]) {
		delete clans[clanId].oficials[userId];
	}
	clans[clanId].leaders[userId] = 1;
	writeClanData();

	return true;
};

exports.deleteLeader = function (user) {
	var userId = toId(user);
	var clanUser = exports.findClanFromMember(user);
	if (!clanUser)
		return false;
	var clanId = toId(clanUser);
	if (!clans[clanId].leaders[userId]) return false;
	delete clans[clanId].leaders[userId];
	writeClanData();

	return true;
};

exports.addOficial = function (user) {
	var userId = toId(user);
	var clanUser = exports.findClanFromMember(user);
	if (!clanUser)
		return false;
	var clanId = toId(clanUser);
	if (clans[clanId].oficials[userId]) return false;
	if (clans[clanId].leaders[userId]) {
		delete clans[clanId].leaders[userId];
	}
	clans[clanId].oficials[userId] = 1;
	writeClanData();

	return true;
};

exports.deleteOficial = function (user) {
	var userId = toId(user);
	var clanUser = exports.findClanFromMember(user);
	if (!clanUser)
		return false;
	var clanId = toId(clanUser);
	if (!clans[clanId].oficials[userId]) return false;
	delete clans[clanId].oficials[userId];
	writeClanData();

	return true;
};

exports.addInvite = function (clan, user) {
	var clanId = toId(clan);
	var userId = toId(user);
	if (!clans[clanId] || exports.findClanFromMember(user))
		return false;
	if (clans[clanId].invitations[userId]) return false;

	clans[clanId].invitations[userId] = 1;
	writeClanData();

	return true;
};

exports.aceptInvite = function (clan, user) {
	var clanId = toId(clan);
	var userId = toId(user);
	if (!clans[clanId] || exports.findClanFromMember(user))
		return false;
	if (!clans[clanId].invitations[userId]) return false;
	clans[clanId].members[userId] = 1;
	delete clans[clanId].invitations[userId];
	writeClanData();

	return true;
};

exports.removeMember = function (clan, user) {
	var clanId = toId(clan);
	var userId = toId(user);
	if (!clans[clanId] || !clans[clanId].members[userId])
		return false;
	if (clans[clanId].oficials[userId]) {
		delete clans[clanId].oficials[userId];
	}
	if (clans[clanId].leaders[userId]) {
		delete clans[clanId].leaders[userId];
	}
	delete clans[clanId].members[userId];
	writeClanData();

	return true;
};
//warsystem

exports.getWars = function () {
	return Object.keys(pendingWars).map(function (clan) { return [clan, pendingWars[clan.against]]; });
};

exports.getWarMatchups = function (clan) {
	var warringClans = exports.findWarFromClan(clan);
	if (!warringClans)
		return false;

	return JSON.parse(JSON.stringify(pendingWars[warringClans[0]].matchups));
};

exports.getWarRoom = function (clan) {
	var warringClans = exports.findWarFromClan(clan);
	if (!warringClans)
		return false;

	return pendingWars[warringClans[0]].room;
};

exports.findWarFromClan = function (clan) {
	var clanId = toId(clan);

	if (pendingWars[clanId])
		return clanId;
	for (var w in pendingWars)
		if (pendingWars[w].against === clanId)
			return w;

	return false;
};

exports.findWarFromRoom = function (room) {
	var roomId = toId(room);
	for (var w in pendingWars)
		if (pendingWars[w].room === roomId)
			return w;

	return false;
};

exports.getWarData = function (clanA) {
	var clanAId = toId(clanA);
	if (!pendingWars[clanAId])
		return false;

	return {
		against: pendingWars[clanAId].against,
		format: pendingWars[clanAId].format,
		warSize: pendingWars[clanAId].warSize,
		warStyle: pendingWars[clanAId].warStyle,
		warRound: pendingWars[clanAId].warRound,
		score: pendingWars[clanAId].score,
		room: pendingWars[clanAId].room
	};
};

exports.getPendingWars = function () {
	if (!pendingWars)
		return 'No hay ninguna war en curso.';
	var warsList = '';
	for (var w in pendingWars) {
		warsList += '<a class="ilink" href="/' + pendingWars[w].room + '"> War de formato ' + exports.getWarFormatName(pendingWars[w].format) + ' entre los clanes ' + exports.getClanName(w) + ' y ' + exports.getClanName(pendingWars[w].against) + ' en la sala ' + pendingWars[w].room + '</a> <br />';
	}
	return warsList;
};

exports.getWarParticipants = function (clanA) {
	var clanAId = toId(clanA);
	if (!pendingWars[clanAId])
		return false;

	return {
		matchups: pendingWars[clanAId].matchups,
		clanAMembers: pendingWars[clanAId].clanAMembers,
		clanBMembers: pendingWars[clanAId].clanBMembers,
	};
};

exports.getFreePlaces = function (clanA) {
	var clanAId = toId(clanA);
	if (!pendingWars[clanAId])
		return 0;
	var membersA = pendingWars[clanAId].warSize;
	var membersB = pendingWars[clanAId].warSize;
	var registeredA = Object.keys(pendingWars[clanAId].clanAMembers);
	var registeredB = Object.keys(pendingWars[clanAId].clanBMembers);
	if (registeredA) {
		membersA = pendingWars[clanAId].warSize - registeredA.length;
	}
	if (registeredB) {
		membersB = pendingWars[clanAId].warSize - registeredB.length;
	}
	return membersA + membersB;
};

exports.createWar = function (clanA, clanB, room, format, wSize, style) {
	var clanAId = toId(clanA);
	var clanBId = toId(clanB);
	var formatId = toId(format);
	if (!clans[clanAId] || !clans[clanBId] || exports.findWarFromClan(clanA) || exports.findWarFromClan(clanB) || wSize > 100)
		return false;
	pendingWars[clanAId] = {
		against: clanBId,
		matchups: {},
		clanAMembers: {},
		clanBMembers: {},
		format: format,
		warSize: parseInt(wSize),
		warStyle: parseInt(style),
		warRound: 0,
		score: 0,
		room: room
	};
	return clanAId;
};

exports.addWarParticipant = function (clanA, member, isClanB) {
	var clanAId = toId(clanA);
	var userId = toId(member);
	if (!clans[clanAId] || !pendingWars[clanAId])
		return false;
	if (!isClanB) {
		pendingWars[clanAId].clanAMembers[userId] = 1;
	} else {
		pendingWars[clanAId].clanBMembers[userId] = 1;
	}
	return true;
};

exports.removeWarParticipant = function (clanA, member, isClanB) {
	var clanAId = toId(clanA);
	var userId = toId(member);
	if (!clans[clanAId] || !pendingWars[clanAId])
		return false;
	if (!isClanB) {
		delete pendingWars[clanAId].clanAMembers[userId];
	} else {
		delete pendingWars[clanAId].clanBMembers[userId];
	}
	return true;
};

exports.dqWarParticipant = function (clanA, member, isClanB) {
	var clanAId = toId(clanA);
	var userId = toId(member);
	if (!clans[clanAId] || !pendingWars[clanAId])
		return false;
	if (!isClanB) {
		pendingWars[clanAId].matchups[userId].result = 3;
	} else {
		pendingWars[clanAId].matchups[userId].result = 2;
	}
	return true;
};

exports.warSetActiveMatchup = function (clanA, member, batLink) {
	var clanAId = toId(clanA);
	var userId = toId(member);
	if (!clans[clanAId] || !pendingWars[clanAId])
		return false;
	pendingWars[clanAId].matchups[userId].result = 1;
	pendingWars[clanAId].matchups[userId].battleLink = batLink;
	return true;
};

exports.warSetDrawn = function (clanA, member) {
	var clanAId = toId(clanA);
	var userId = toId(member);
	if (!clans[clanAId] || !pendingWars[clanAId])
		return false;
	pendingWars[clanAId].matchups[userId].result = 0;
	return true;
};

exports.invalidateWarMatchup = function (clanA, member) {
	var clanAId = toId(clanA);
	var userId = toId(member);
	if (!clans[clanAId] || !pendingWars[clanAId])
		return false;
	pendingWars[clanAId].matchups[userId].result = 0;
	return true;
};

exports.replaceWarParticipant = function (clanA, matchup, newMember, isClanB) {
	var clanAId = toId(clanA);
	var matchupId = toId(matchup);
	var userId = toId(newMember);
	if (!clans[clanAId] || !pendingWars[clanAId])
		return false;
	var userA = toId(pendingWars[clanAId].matchups[matchupId].from);
	var userB = toId(pendingWars[clanAId].matchups[matchupId].to);
	delete pendingWars[clanAId].matchups[matchupId];
	if (!isClanB) {
		pendingWars[clanAId].matchups[userId] = {from: userId, to: userB, battleLink: '', result: 0};
		delete pendingWars[clanAId].clanAMembers[userA];
		pendingWars[clanAId].clanAMembers[userId] = 1;
	} else {
		pendingWars[clanAId].matchups[userA] = {from: userA, to: userId, battleLink: '', result: 0};
		delete pendingWars[clanAId].clanBMembers[userB];
		pendingWars[clanAId].clanBMembers[userId] = 1;
	}
	return true;
};

exports.startWar = function (clanA) {
	var clanAId = toId(clanA);
	if (!clans[clanAId])
		return false;
	var clanBId = toId(pendingWars[clanAId].against);
	var clanAMembers = exports.getAvailableMembers(clanA, false).randomize();
	var clanBMembers = exports.getAvailableMembers(clanA, true).randomize();
	var memberCount = Math.min(clanAMembers.length, clanBMembers.length);
	var matchups = {};
	for (var m = 0; m < memberCount; ++m) {
		matchups[toId(clanAMembers[m])] = {from: clanAMembers[m], to: clanBMembers[m], battleLink: '', result: 0};

	}
	pendingWars[clanAId].matchups = matchups;
	pendingWars[clanAId].warRound = 1;
	return true;
};

exports.endWar = function (clan) {
	var warringClans = exports.findWarFromClan(clan);
	if (!pendingWars[clan])
		return false;

	delete pendingWars[clan];
	return true;
};

exports.setWarResult = function (clanA, clanB, scoreA, scoreB) {
	var clanAId = toId(clanA);
	var clanBId = toId(clanB);
	if (!clans[clanAId] || !clans[clanBId])
		return false;

	if (scoreA > scoreB) {
		clans[clanAId].rating += 30;
		++clans[clanAId].wins;
		++clans[clanBId].losses;
	} else if (scoreB > scoreA) {
		clans[clanBId].rating += 30;
		++clans[clanAId].losses;
		++clans[clanBId].wins;
	} else {
		clans[clanAId].rating += 10;
		clans[clanBId].rating += 10;
		++clans[clanAId].draws;
		++clans[clanBId].draws;
	}

	writeClanData();

	return true;
};

exports.autoEndWar = function (clanA) {
	var warId = toId(clanA);
	if (!pendingWars[warId])
		return false;
	var scoreA = 0;
	var scoreB = 0;
	for (var b in pendingWars[warId].matchups) {
		if (pendingWars[warId].matchups[b].result === 2) {
			++scoreA;
		} else if (pendingWars[warId].matchups[b].result === 3) {
			++scoreB;
		}
	}
	var htmlSource = '<hr /><h3><center><font color=green><big>War entre ' + exports.getClanName(warId) + " y " + exports.getClanName(pendingWars[warId].against) + '</big></font></center></h3><center><b>FORMATO:</b> ' + exports.getWarFormatName(pendingWars[warId].format) + "</center><hr /><center><small><font color=red>Red</font> = descalificado, <font color=green>Green</font> = paso a la siguiente ronda, <a class='ilink'><b>URL</b></a> = combatiendo</small><center><br />";
	var clanDataA = exports.getProfile(warId);
	var clanDataB = exports.getProfile(pendingWars[warId].against);
	var matchupsTable = '<table  align="center" border="0" cellpadding="0" cellspacing="0"><tr><td align="right"><img width="100" height="100" src="' + encodeURI(clanDataA.logo) + '" />&nbsp;&nbsp;&nbsp;&nbsp;</td><td align="center"><table  align="center" border="0" cellpadding="0" cellspacing="0">';
	for (var i in pendingWars[warId].matchups) {
		var userk = Users.getExact(pendingWars[warId].matchups[i].from);
		if (!userk) {userk = pendingWars[warId].matchups[i].from;} else {userk = userk.name;}
		var userf = Users.getExact(pendingWars[warId].matchups[i].to);
		if (!userf) {userf = pendingWars[warId].matchups[i].to;} else {userf = userf.name;}
		switch (pendingWars[warId].matchups[i].result) {
			case 0:
				matchupsTable += '<tr><td  align="right"><big>' + userk + '</big></td><td>&nbsp;vs&nbsp;</td><td><big align="left">' + userf + "</big></td></tr>";
				break;
			case 1:
				matchupsTable += '<tr><td  align="right"><a href="' + pendingWars[warId].matchups[i].battleLink + '" room ="' + pendingWars[warId].matchups[i].battleLink + '"class="ilink"><b><big>' + userk + '</big></b></a></td><td>&nbsp;<a href="' + pendingWars[warId].matchups[i].battleLink + '" room ="' + pendingWars[warId].matchups[i].battleLink + '"class="ilink">vs</a>&nbsp;</td><td><a href="' + pendingWars[warId].matchups[i].battleLink + '" room ="' + pendingWars[warId].matchups[i].battleLink + '"class="ilink"><b><big align="left">' + userf + "</big></b></a></td></tr>";
				break;
			case 2:
				matchupsTable += '<tr><td  align="right"><font color="green"><b><big>' + userk + '</big></b></font></td><td>&nbsp;vs&nbsp;</td><td><font color="red"><b><big align="left">' + userf + "</big></b></font></td></tr>";
				break;
			case 3:
				matchupsTable += '<tr><td  align="right"><font color="red"><b><big>' + userk + '</big></b></font></td><td>&nbsp;vs&nbsp;</td><td><font color="green"><b><big align="left">' + userf + "</big></b></font></td></tr>";
				break;
		}
	}
	matchupsTable += '</table></td><td>&nbsp;&nbsp;&nbsp;&nbsp;<img width="100" height="100" src="' + encodeURI(clanDataB.logo) + '" /></td></tr></table><hr /><br><hr /><h2><font color="green"><center>';
	if (scoreA > scoreB) {
		matchupsTable += '&iexcl;Felicidades <font color="black">' + exports.getClanName(warId) + '</font>!</center></font></h2><h2><font color="green"><center>&iexcl;Has ganado la war en formato ' + exports.getWarFormatName(pendingWars[warId].format) + ' contra <font color="black">' + exports.getClanName(pendingWars[warId].against) + "</font>!</center></font></h2><hr />";
	} else if (scoreA < scoreB) {
		matchupsTable += '&iexcl;Felicidades <font color="black">' + exports.getClanName(pendingWars[warId].against) + '</font>!</center></font></h2><h2><font color="green"><center>&iexcl;Has ganado la war en formato ' + exports.getWarFormatName(pendingWars[warId].format) + ' contra <font color="black">' + exports.getClanName(warId) + "</font>!</center></font></h2><hr />";
	} else if (scoreA === scoreB) {
		matchupsTable += '&iexcl;La War en formato ' + exports.getWarFormatName(pendingWars[warId].format) + ' entre <font color="black">' + exports.getClanName(warId) + '</font> y <font color="black">' + exports.getClanName(pendingWars[warId].against) + '</font> ha terminado en Empate!</center></font></h2><hr />';
	}
	htmlSource += matchupsTable;
	Rooms.rooms[toId(pendingWars[warId].room)].addRaw(htmlSource);
	exports.setWarResult(warId, pendingWars[warId].against, scoreA, scoreB);
	exports.endWar(warId);
	return true;
};

exports.setWarMatchResult = function (userA, userB, result) {
	var userAId = toId(userA);
	var userBId = toId(userB);

	if (typeof result !== 'number') {
		result = toId(result);
		if (result === userAId)
			result = 1;
		else if (result === userBId)
			result = 0;
		else
			result = 0.5;
	}

	var clanId = exports.findClanFromMember(userA);
	if (!clanId)
		return false;
	var warringClans = exports.findWarFromClan(clanId);
	if (!warringClans)
		return false;
	clanId = warringClans[0];

	var matchup = pendingWars[clanId].matchups[userAId];
	if (!matchup || matchup.to !== userBId) {
		matchup = pendingWars[clanId].matchups[userBId];
		if (!matchup || matchup.to !== userAId)
			return false;
	}
	if (matchup.isEnded)
		return false;

	matchup.isEnded = true;
	if (result !== 0 && result !== 1)
		return true;

	var winnerUserId = result === 1 ? userAId : userBId;
	if (matchup.to === winnerUserId)
		--pendingWars[clanId].score;
	else
		++pendingWars[clanId].score;

	return true;
};

exports.isWarEnded = function (clan) {
	var clanId = toId(clan);
	var warringClans = exports.findWarFromClan(clan);
	if (!warringClans)
		return true;

	for (var m in pendingWars[clanId].matchups)
		if (pendingWars[clanId].matchups[m].result < 2)
			return false;
	return true;
};
