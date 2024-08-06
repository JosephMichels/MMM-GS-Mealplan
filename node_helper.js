// node_helper.js

const NodeHelper = require("node_helper");
const PublicGoogleSheetsParser = require('public-google-sheets-parser');
//var moment = require("moment");

module.exports = NodeHelper.create({
    socketNotificationReceived: function (notification, payload) {
        this.config = payload;

		if (notification === "GET_DATA") {
			this.getData(payload.sheetId,payload.sheetName);
		}
	},
    getData: function (sheetId,sheetName) {
      var self = this;
      const parser = new PublicGoogleSheetsParser(sheetId);
      parser.setOption({useFormat: true, sheetName:sheetName});
      parser.parse().then(data => {
        self.sendSocketNotification('DATA_RESULT', data);
      });
    }
});
