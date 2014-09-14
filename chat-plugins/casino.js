
exports.commands = {
	beneficios: 'casinomoney',
	casinomoney: function (target, room, user) {
		if (room.id !== 'casinoteamrocket') return this.sendReply("Este comando solo puede ser usado en una sala de Casino");
		if (!this.can('ban', room)) return false;
		if (!this.canBroadcast()) return;
		var money = Shop.getUserMoney('casino');
		if (money < 1) return this.sendReply("No había beneficios en el casino.");
		return this.sendReply("Beneficios del Casino: " + money + ' Pds');
	},

	obtenerbeneficios: 'getcasinomoney',
	getcasinomoney: function (target, room, user) {
		if (room.id !== 'casinoteamrocket') return this.sendReply("Este comando solo puede ser usado en una sala de Casino");
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
		if (room.id !== 'casinoteamrocket') return this.sendReply("Este comando solo puede ser usado en una sala de Casino");
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
