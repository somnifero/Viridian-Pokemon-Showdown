exports.commands = {
	radio: function () {
		if (!this.canBroadcast()) return;
		this.sendReplyBox("<a href=\"http://viridianradio.playtheradio.com/comments.cfm\">Viridian's Radio!</a>");
	}
};
