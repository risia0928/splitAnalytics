(function(window) {
	var SplitAnalytics = {
		initialize : function() {
			this.splytics 	= document.querySelectorAll("[data-splytics-id]");
			this.length 	= this.splytics.length;
			var it 			= this.iterator();
			while (it.hasNext()) {
				var splytics = it.next();
				splytics.addClass();
				splytics.sendPageView();
				splytics.addEvent();
			}
		},
		getAt : function(index) {
			return new Splytics(this.splytics[index]);
		},
		getLength : function() {
			return this.length;
		},
		iterator : function() {
			return new Iterator(this);
		}
	};
	var Splytics =  function (elm) {
		this.elm 			= elm;
		this.id 			= this.elm.getAttribute('data-splytics-id');
		this.classes 		= this.elm.getAttribute('data-splytics-class').split('|');
		this.type 			= this.elm.getAttribute("data-splytics-type") || "click";
		this.class 			= "";
	};
	var Iterator =  function (splytics) {
		this.splytics = splytics;
		this.index = 0;
	};
	Splytics.prototype = {
		getCookie : function(name) {
			return Cookie.get(name);
		},
		setCookie : function(name,value,days) {
			Cookie.set(name,value,days);
		},
		addClass : function() {
			var cookie = this.getCookie(this.id);
			if (cookie == null) {
				this.class = this.classes[Math.floor(Math.random()*this.classes.length)];
				this.setCookie(this.id, this.class, 30);
			}
			this.class = cookie;
			this.elm.className += " " + this.class;
		},
		addEvent : function() {
			var self = this;
			this.elm.addEventListener(self.type, function(){
				self.sendEventTrack(self.type,self.id,self.class);
			} , true);
		},
		sendPageView : function() {
			this.sendEventTrack('view',this.title,this.class);
		},
		sendEventTrack : function(type,title,value) {
			ga('send', {
				'hitType': 			'event',
				'eventCategory': 	title,
				'eventAction': 		type,
				'eventLabel': 		value
			});
		}
	};
	/*******************************
	 * イテレーター
	 ******************************/
	Iterator.prototype = {
		hasNext : function () {
			return this.index < this.splytics.getLength();
		},
		next : function() {
			return this.splytics.getAt(this.index++);
		}
	};
	/*******************************
	 * クッキー
	 ******************************/
	var Cookie = {
		get: function(name) {
			var nameEQ = name + "=";
			var ca = document.cookie.split(';');
			for(var i=0;i < ca.length;i++) {
				var c = ca[i];
				while (c.charAt(0)==' ') c = c.substring(1,c.length);
				if (c.indexOf(nameEQ) == 0) return c.substring(nameEQ.length,c.length);
			}
			return null;
		},
		set: function(name,value,days) {
			if (days) {
				var date = new Date();
				date.setTime(date.getTime()+(days*24*60*60*1000));
				var expires = "; expires="+date.toGMTString();
			}
			else var expires = "";
			document.cookie = name+"="+value+expires+"; path=/";
		},
		remove: function(name) {
			var dt = new Date(1900);
			var str = name + "=;expires=" + dt.toGMTString()+";path=/";
			document.cookie = str;
		}
	};
	window.addEventListener("load",function(){
		SplitAnalytics.initialize();
	});
})(window);

