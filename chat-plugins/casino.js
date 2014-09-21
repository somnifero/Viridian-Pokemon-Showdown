var wheelStatus = false;
var wheelOptions = [];
var wheelBets = {};
var prize = 0;

function getUserName (user) {
	var targetUser = Users.get (user);
	if (!targetUser) return toId(user);
	return targetUser.name;
}

exports.commands = {
	nuevaruleta: 'newwheel',
	newwheel: function (target, room, user) {
		if (room.id !== 'casino' && room.id !== 'casinoteamrocket') return this.sendReply("Este comando solo puede ser usado en una sala de Casino");
		if (!this.can('ban', room)) return false;
		if (wheelStatus) return this.sendReply("Ya hay una ruleta en marcha.");
		var initPrize = parseInt(target);
		if (initPrize && initPrize >= 10 && initPrize <= Shop.getUserMoney('casino')) {
			prize = initPrize;
			Shop.removeMoney('casino', initPrize);
		} else {
			return this.sendReply("Debes establecer un premio inicial superior a 10 pd pero inferior al total de beneficios del casino.");
		}
		var keys = [];
		var pokemonLeft = 0;
		var pokemon = [];
		wheelOptions = [];
		wheelStatus = true;
		for (var i in Tools.data.FormatsData) {
			if (Tools.data.FormatsData[i].randomBattleMoves) {
				keys.push(i);
			}
		}
		keys = keys.randomize();
		for (var i = 0; i < keys.length && pokemonLeft < 18; i++) {
			var template = Tools.getTemplate(keys[i]);
			if (template.species.indexOf('-') > -1) continue;
			if (template.species === 'Pichu-Spiky-eared') continue;
			if (template.tier !== 'LC') continue;
			wheelOptions.push(template.species);
			++pokemonLeft;
		}
		var htmlDeclare = '';
		for (var j = 0; j < wheelOptions.length; j++) {
			htmlDeclare += '<img src="http://play.pokemonshowdown.com/sprites/xyani/' + toId(wheelOptions[j]) + '.gif" title="' + wheelOptions[j] +'" />&nbsp;';
		}
		htmlDeclare += '<br /><br /><b>Usa /apostar [pokemon] para jugar a la ruleta. Cuesta 10 pds.</b><br /><b>El ganador o ganadores se llevan un premio de ' + prize + ' pd + 20 pd por participante.</b></center></div>';
		this.logModCommand(user.name + ' ha iniciado un juego de ruleta.');
		room.addRaw('<div class="broadcast-blue"><center><h1>Juego de Ruleta</h1><b>' + htmlDeclare);
		room.update();
	},
	
	finruleta: 'endwheel',
	endwheel: function (target, room, user) {
		if (room.id !== 'casino' && room.id !== 'casinoteamrocket') return this.sendReply("Este comando solo puede ser usado en una sala de Casino");
		if (!this.can('ban', room)) return false;
		if (!wheelStatus) return this.sendReply("No hay ninguna ruleta en marcha.");
		var pkm = wheelOptions[Math.floor(Math.random() * wheelOptions.length)];
		var htmlDeclare = '<div class="broadcast-green"><center><h1>Juego de Ruleta Finalizado</h1><h3>La ruleta ha girado y el Pokemon elegido es ' + pkm + '</h3><img src="http://play.pokemonshowdown.com/sprites/xyani/' + toId(pkm) + '.gif" title="' + pkm + '" /> <br /><br /><b>';
		var winners = [];
		for (var i in wheelBets) {
			if (toId(wheelBets[i]) === toId(pkm)) winners.push(i);
		}
		if (!winners || winners.length < 1) {
			htmlDeclare += 'Lamentablemente nadie había apostado por este Pokemon.</b>';
			Shop.giveMoney('casino', prize);
		} else if (winners.length === 1) {
			htmlDeclare += '&iexcl;Felicidades a ' + getUserName(winners[0]) + ' por ganar en la ruleta!<b /> Premio entregado al ganador: ' + prize + ' pd.</b>';
			Shop.giveMoney(toId(winners[0]), prize);
		} else {
			htmlDeclare += '&iexcl;Felicidades a ';
			for (var n = 0; n < (winners.length - 1); ++n) {
				Shop.giveMoney(toId(winners[n]), prize);
				if (n === 0) {
					htmlDeclare += getUserName(winners[n]);
				} else {
					htmlDeclare += ', ' + getUserName(winners[n]);
				}
			}
			Shop.giveMoney(toId(winners[winners.length - 1]), prize);
			htmlDeclare += ' y ' + getUserName(winners[winners.length - 1]) + ' por ganar en la ruleta!<b /> Premio entregado a los ganadores: ' + prize + ' pd.</b>';
		}
		htmlDeclare += '</center></div>';
		wheelStatus = false;
		wheelOptions = [];
		wheelBets = {};
		prize = 0;
		this.logModCommand(user.name + ' ha finalizado un juego de ruleta.');
		room.addRaw(htmlDeclare);
		room.update();
	},
	
	ruleta: 'wheel',
	wheel: function (target, room, user) {
		if (room.id !== 'casino' && room.id !== 'casinoteamrocket') return this.sendReply("Este comando solo puede ser usado en una sala de Casino");
		if (!wheelStatus) return this.sendReply("No hay ninguna ruleta en marcha.");
		if (!this.canBroadcast()) return;
		var optionsList = '';
		for (var j = 0; j < wheelOptions.length; j++) {
			optionsList += wheelOptions[j] + ", ";
		}
		return this.sendReplyBox("<b>Opciones de la ruleta:</b> " + optionsList + '<br /><b>Premio: </b>' + (prize) + ' pd.');
	},
	
	apostar: 'betwheel',
	betwheel: function (target, room, user) {
		if (room.id !== 'casino' && room.id !== 'casinoteamrocket') return this.sendReply("Este comando solo puede ser usado en una sala de Casino");
		if (!wheelStatus) return this.sendReply("No hay ninguna ruleta en marcha.");
		var pokemonId = toId(target);
		var validPkm = false;
		for (var j = 0; j < wheelOptions.length; j++) {
			if (pokemonId === toId(wheelOptions[j])) validPkm = true;
		}
		if (!validPkm) return this.sendReply(pokemonId + " no es una opción de la ruleta. Para ver las opciones escribe /ruleta");
		if (wheelBets[user.userid]) {
			wheelBets[user.userid] = pokemonId;
			return this.sendReply("Has cambiado tu apuesta a " + pokemonId);
		} else {
			if (Shop.getUserMoney(user.name) < 10) return this.sendReply("No tienes suficiente dinero.");
			wheelBets[user.userid] = pokemonId;
			Shop.removeMoney(user.name, 10);
			prize += 20;
			return this.sendReply("Has apostado por " + pokemonId + ". Puedes cambiar tu apuesta tantas veces como quieras (sin coste) hasta que termine el juego de ruleta.");
		}
	},
	
	beneficios: 'casinomoney',
	casinomoney: function (target, room, user) {
		if (room.id !== 'casino' && room.id !== 'casinoteamrocket') return this.sendReply("Este comando solo puede ser usado en una sala de Casino");
		if (!this.can('ban', room)) return false;
		if (!this.canBroadcast()) return;
		var money = Shop.getUserMoney('casino');
		if (money < 1) return this.sendReply("No había beneficios en el casino.");
		return this.sendReply("Beneficios del Casino: " + money + ' Pds');
	},

	obtenerbeneficios: 'getcasinomoney',
	getcasinomoney: function (target, room, user) {
		if (room.id !== 'casino' && room.id !== 'casinoteamrocket') return this.sendReply("Este comando solo puede ser usado en una sala de Casino");
		if (!this.can('declare', room)) return false;
		var money = Shop.getUserMoney('casino');
		if (money < 1) return this.sendReply("No había beneficios en el casino.");
		Shop.transferMoney('casino', user.name, money);
		this.logModCommand(user.name + ' ha obtenido los beneficios del casino: ' + money + ' Pds.');
		return this.sendReply("Has recogido los beneficios del Casino: " + money + " Pds.");
	},

	slot: 'tragaperras',
	slotmachine: 'tragaperras',
	tragaperras: function (target, room, user) {
		if (!this.canBroadcast()) return;
		if (room.id !== 'casino' && room.id !== 'casinoteamrocket') return this.sendReply("Este comando solo puede ser usado en una sala de Casino");
		var money = parseInt(target);
		var now = Date.now();
		if (!money || money < 1 || money > 50) return this.sendReply("Solo se puede apostar de 1 a 50 pd");
		if (!user.lastSlotCmd) user.lastSlotCmd = 0;
		if ((now - user.lastSlotCmd) * 0.001 < 2) return this.sendReply("Por favor espera " + Math.floor(2 - (now - user.lastSlotCmd) * 0.001) + " segundos antes de volver a usar la tragaperras.");
		user.lastSlotCmd = now;
		if (Shop.getUserMoney(user.name) < money) return this.sendReply("No tienes suficiente dinero");
		Shop.removeMoney(user.name, money);
		var slotSymbols = ["\u2605", "\u2665", "@", "%", "$", "&", "#", "+", "~"];
		var symbolA = slotSymbols[Math.floor(Math.random() * slotSymbols.length)];
		var symbolB = slotSymbols[Math.floor(Math.random() * slotSymbols.length)];
		var symbolC = slotSymbols[Math.floor(Math.random() * slotSymbols.length)];
		if (symbolA === symbolB && symbolB === symbolC && symbolA === '\u2605') {
			Shop.giveMoney(user.name, money * 5);
			return this.sendReply("|html| <b>" + symbolA + symbolB + symbolC + "</b> - Felicidades! Tu apuesta se multiplica por 5!");
		} else if (symbolA === symbolB && symbolB === symbolC) {
			Shop.giveMoney(user.name, money * 4);
			return this.sendReply("|html| <b>" + symbolA + symbolB + symbolC + "</b> - Felicidades! Tu apuesta se multiplica por 4!");
		} else if ((symbolA === symbolB && symbolA === '\u2605') || (symbolA === symbolC && symbolA === '\u2605') || (symbolB === symbolC && symbolB === '\u2605')) {
			Shop.giveMoney(user.name, money * 3);
			return this.sendReply("|html| <b>" + symbolA + symbolB + symbolC + "</b> - Felicidades! Tu apuesta se multiplica por 3!");
		} else if ((symbolA === symbolB || symbolA === symbolC || symbolB === symbolC) && (symbolA === '\u2605' || symbolB === '\u2605' || symbolC === '\u2605')) {
			Shop.giveMoney(user.name, money * 3);
			return this.sendReply("|html| <b>" + symbolA + symbolB + symbolC + "</b> - Felicidades! Tu apuesta se multiplica por 3!");
		} else if (symbolA === symbolB || symbolB === symbolC || symbolA === symbolC) {
			Shop.giveMoney(user.name, money * 2);
			return this.sendReply("|html| <b>" + symbolA + symbolB + symbolC + "</b> - Felicidades! Tu apuesta se multiplica por 2!");
		} else if (symbolA === '\u2605' || symbolB === '\u2605' || symbolC === '\u2605') {
			Shop.giveMoney(user.name, money);
			return this.sendReply("|html| <b>" + symbolA + symbolB + symbolC + "</b> - Recuperas lo apostado!");
		} else {
			Shop.giveMoney('casino', money);
			return this.sendReply("|html| <b>" + symbolA + symbolB + symbolC + "</b> - Has perdido! Intentalo de nuevo.");
		}
	}
}
