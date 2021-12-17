/*
* Website: https://www.xtrendence.com
* Portfolio: https://www.xtrendence.dev
* GitHub: https://www.github.com/Xtrendence
*/
class Popup {
	constructor(width, height, html, options) {
		this.width = width;
		this.height = height;
		this.html = html;
		this.options = options;
		this.events = {};
	}

	generateID() {
		let id = this.generateHex(8);
		while(document.getElementById(id)) {
			id = this.generateHex(8);
		}

		return id;
	}

	generateHex(size) {
		return [...Array(size)].map(() => Math.floor(Math.random() * 16).toString(16)).join("");
	}

	hasEvent(event) {
		return Object.keys(this.events).includes(event);
	}

	on(event, callback) {
		this.events[event] = callback;
	}

	off(event) {
		delete this.events[event];
	}

	show() {
		this.id = this.generateID();

		this.element = document.createElement("div");
		this.element.setAttribute("class", "popup-wrapper");
		this.element.style.width = this.width + "px";
		this.element.style.height = this.height + "px";
		this.element.style.left = `calc(50% - ${this.width / 2}px)`;
		this.element.style.top = `calc(50% - ${this.height / 2}px)`;
		
		this.top = document.createElement("div");
		this.top.setAttribute("class", "bottom");
		
		let buttonClose = document.createElement("button");
		buttonClose.id = "popup-button-close";
		buttonClose.setAttribute("class", "icon-close");
		buttonClose.innerHTML = '<svg width="1792" height="1792" viewBox="0 0 1792 1792" xmlns="http://www.w3.org/2000/svg"><path d="M1490 1322q0 40-28 68l-136 136q-28 28-68 28t-68-28l-294-294-294 294q-28 28-68 28t-68-28l-136-136q-28-28-28-68t28-68l294-294-294-294q-28-28-28-68t28-68l136-136q28-28 68-28t68 28l294 294 294-294q28-28 68-28t68 28l136 136q28 28 28 68t-28 68l-294 294 294 294q28 28 28 68z"/></svg>';
		buttonClose.addEventListener("click", () => {
			if(this.hasEvent("close")) {
				this.events["close"]();
			}

			this.hide();
		});

		this.top.appendChild(buttonClose);
		this.element.appendChild(this.top);

		this.bottom = document.createElement("div");
		this.bottom.id = this.id;
		this.bottom.setAttribute("class", "bottom");
		this.bottom.innerHTML = this.html;
		this.bottom = this.addButtons(this.bottom);

		document.body.appendChild(this.bottom);
	}

	hide() {
		document.getElementById(this.id).remove();
	}

	addButtons(bottom) {
		let buttonCancel = document.createElement("button");
		buttonCancel.id = "popup-button-cancel";
		buttonCancel.setAttribute("class", "button-cancel");
		buttonCancel.textContent = ("cancelText" in this.options) ? this.options.cancelText : "Cancel";
		buttonCancel.addEventListener("click", () => {
			if(this.hasEvent("cancel")) {
				this.events["cancel"]();
			}
		});

		let buttonConfirm = document.createElement("button");
		buttonConfirm.id = "popup-button-confirm";
		buttonConfirm.setAttribute("class", "button-confirm");
		buttonConfirm.textContent = ("confirmText" in this.options) ? this.options.confirmText : "Confirm";
		buttonConfirm.addEventListener("click", () => {
			if(this.hasEvent("confirm")) {
				this.events["confirm"]();
			}
		});

		bottom.appendChild(buttonCancel);
		bottom.appendChild(buttonConfirm);

		return bottom;
	}

	setOptions(options) {
		this.options = options;
	}

	setHTML(html) {
		this.html = html;
		
		try {
			if(!this.empty(this.bottom)) {
				this.bottom.innerHTML = html;
				this.bottom = this.addButtons(this.bottom);
			}
		} catch(error) {
			console.log(error);
		}
	}

	empty(value) {
		if(typeof value === "object" && value !== null && Object.keys(value).length === 0) {
			return true;
		}
		
		if(value === null || typeof value === "undefined" || value.toString().trim() === "") {
			return true;
		}

		return false;
	}
}