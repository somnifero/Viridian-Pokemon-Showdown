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

exports.getClans = function () {
	return Object.keys(clans).map(function (c) { return clans[c].name; });
};

exports.getClanName = function (clan) {
	var clanId = toId(clan);
	return clans[clanId] ? clans[clanId].name : "";
};

exports.getRating = function (clan) {
	var clanId = toId(clan);
	if (!clans[clanId])
		return false;
	if (clans[clanId].wins > 10) {
		var gxeClan = clans[clanId].wins * 100 / (clans[clanId].wins + clans[clanId].losses);
	} else {
		var gxeClan = 0;
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
	if (clans[clanId].wins > 10) {
		var gxeClan = clans[clanId].wins * 100 / (clans[clanId].wins + clans[clanId].losses);
	} else {
		var gxeClan = 0;
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

exports.authMember = function (clan, member) {
	var clanId = toId(clan);
	if (!clans[clanId])
		return false;
	var userid = toId(member);
	if (clans[clanId].leaders[userid]) return 2;
	if (clans[clanId].oficials[userid]) return 1;
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

exports.getAvailableMembers = function (clan) {
	var clanId = toId(clan);
	if (!clans[clanId])
		return false;

	var results = [];
	for (var m in clans[clanId].members) {
		var user = Users.getExact(m);
		if (user && user.connected && user.isClanWarAvailable > Date.now() - (5).minutes())
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
}

exports.findWarFromClan = function (clan) {
	var clanId = toId(clan);

	if (pendingWars[clanId])
		return [clanId, pendingWars[clanId].against];
	for (var w in pendingWars)
		if (pendingWars[w].against === clanId)
			return [w, clanId];

	return false;
};

exports.startWar = function (clanA, clanB, room) {
	var clanAId = toId(clanA);
	var clanBId = toId(clanB);
	if (!clans[clanAId] || !clans[clanBId] || exports.findWarFromClan(clanA) || exports.findWarFromClan(clanB))
		return false;

	var clanAMembers = exports.getAvailableMembers(clanA).randomize();
	var clanBMembers = exports.getAvailableMembers(clanB).randomize();
	var memberCount = Math.min(clanAMembers.length, clanBMembers.length);
	if (memberCount < 3)
		return false;

	var matchups = {};
	for (var m = 0; m < memberCount; ++m)
		matchups[toId(clanAMembers[m])] = {from: clanAMembers[m], to: clanBMembers[m]};

	pendingWars[clanAId] = {
		against: clanBId,
		matchups: matchups,
		score: 0,
		room: room
	};

	return JSON.parse(JSON.stringify(matchups));
};

exports.endWar = function (clan) {
	var warringClans = exports.findWarFromClan(clan);
	if (!warringClans)
		return false;

	delete pendingWars[warringClans[0]];
	return true;
};

exports.setWarResult = function (clanA, clanB, result) {
	var clanAId = toId(clanA);
	var clanBId = toId(clanB);
	if (!clans[clanAId] || !clans[clanBId] || result < 0 || result > 1)
		return false;

	if (result === 1) {
		clans[clanAId].rating += 3;
		++clans[clanAId].wins;
		++clans[clanBId].losses;
	} else if (result === 0) {
		clans[clanBId].rating += 3;
		++clans[clanAId].losses;
		++clans[clanBId].wins;
	} else {
		clans[clanAId].rating += 1;
		clans[clanBId].rating += 1;
		++clans[clanAId].draws;
		++clans[clanBId].draws;
	}

	writeClanData();

	return [clans[clanAId].rating, clans[clanBId].rating];
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
	var warringClans = exports.findWarFromClan(clan);
	if (!warringClans)
		return true;
	var clanId = warringClans[0];

	for (var m in pendingWars[clanId].matchups)
		if (!pendingWars[clanId].matchups[m].isEnded)
			return false;

	var result = 0.5;
	if (pendingWars[clanId].score > 0)
		result = 1;
	else if (pendingWars[clanId].score < 0)
		result = 0;

	var oldRatings = [clans[warringClans[0]].rating, clans[warringClans[1]].rating];
	var newRatings = exports.setWarResult(warringClans[0], warringClans[1], result);

	delete pendingWars[clanId];
	return {
		result: result,
		oldRatings: oldRatings,
		newRatings: newRatings
	};
};
