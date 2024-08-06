/* global Module */

/* Magic Mirror
 * Module: MMM-GameCountdown
 *
 * By
 * MIT Licensed.
 */

Module.register("MMM-GS-Mealplan", {
	defaults: {
		updateInterval: 1000*60*60, //Hourly
		dayCount: 7,
		listCount: 7,
		sheetId:null,
		sheetName:null
	},

	requiresVersion: "2.1.0", // Required version of MagicMirror
	
	start: function() { //Setting up interval for refresh
		var self = this;
		self.getData();
		setInterval(function() {
				self.getData();
		}, this.config.updateInterval);
	},
	
	socketNotificationReceived: function(notification, payload, payload2) {
		if (notification === "DATA_RESULT") {
			this.result = payload;
			for(meal of this.result){
				meal.DaysTill = moment(meal.Date).diff(moment(),'days');
			}

			//Remove older elements.
			this.result = this.result.filter((meal)=>meal.DaysTill >= 0);
			this.result.sort((a,b) => a.DaysTill - b.DaysTill);
			if(this.result.length > this.config.dayCount)
				this.result = this.result.slice(0,this.config.listCount);
			this.updateDom();
		}
	},
	getDom: function() { //Creating initial div
	
	
		var wrapper = document.createElement("div");
		wrapper.classList.add("wrapper");

		if (this.result !== null) {
            wrapper.innerHTML = `
                <header class="module-header">${this.config.title}</header>
            `
        }    

		for(meal of this.result){
			var d = moment(meal.Date);
			var div = document.createElement("div");
			div.innerText = d.format('M/D - ddd') + ' - ' + meal.Meal;
			wrapper.appendChild(div);
		}

		return wrapper;
	},
	getStyles: function() {
		return [this.file('MMM-Mealplan.css')]
	},
	
	getData: function(){
		this.sendSocketNotification('GET_DATA',this.config);
	}
});
