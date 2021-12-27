let resizeTimeout;
window.addEventListener("resize", () => {
	clearTimeout(resizeTimeout);
	resizeTimeout = setTimeout(() => {
		particlesJS("animated-background", particlesConfig[applicationSettings.theme]);
	}, 250);
});

// TODO: Remove after development.
document.addEventListener("click", (event) => {
	let audible = audibleElement(event.target);
	if(applicationSettings.sounds === "enabled" && audioPlayable && audible.audible) {
		if(audible.type === "switch") {
			audioSwitch.currentTime = 0;
			audioSwitch.play();
		} else {
			audioPop.currentTime = 0;
			audioPop.play();
		}
	}
});

audioPop.addEventListener("canplay", () => {
	audioPlayable = true;
});

buttonNewAccount.addEventListener("click", () => {
	divPageLogin.classList.remove("login");
	divPageLogin.classList.add("create");
});

buttonLoginAccount.addEventListener("click", () => {
	login(inputLoginUsername.value, inputLoginPassword.value).then(result => {
		if("error" in result) {
			Notify.error({
				title: "Error",
				description: result.error.replaceAll("!", ""),
				duration: 5000,
				background: "var(--accent-second)",
				color: "var(--accent-contrast)"
			});
		} else {
			setAccountInfo(result);
			showApp();
		}
	}).catch(error => {
		Notify.error({
			title: "Error",
			description: error,
			duration: 5000,
			background: "var(--accent-second)",
			color: "var(--accent-contrast)"
		});
	});
});

buttonExistingAccount.addEventListener("click", () => {
	divPageLogin.classList.add("login");
	divPageLogin.classList.remove("create");
});

buttonCreateAccount.addEventListener("click", () => {
	accountSetup();
});

loginToggleTheme.addEventListener("click", () => {
	if(loginToggleTheme.classList.contains("active")) {
		setTheme("dark");
	} else {
		setTheme("light");
	}
});

settingsToggleTheme.addEventListener("click", () => {
	if(settingsToggleTheme.classList.contains("active")) {
		setTheme("dark");
	} else {
		setTheme("light");
	}
});

settingsToggleBackground.addEventListener("click", () => {
	if(settingsToggleBackground.classList.contains("active")) {
		setBackground("static", applicationSettings.theme);
	} else {
		setBackground("animated", applicationSettings.theme);
	}
});

settingsToggleSimpleBackground.addEventListener("click", () => {
	if(settingsToggleSimpleBackground.classList.contains("active")) {
		setBackground("static", applicationSettings.theme);
	} else {
		setBackground("simple", applicationSettings.theme);
	}
});

settingsToggleSounds.addEventListener("click", () => {
	if(settingsToggleSounds.classList.contains("active")) {
		setTimeout(() => {
			setSounds("disabled");
		}, 50);
	} else {
		setSounds("enabled");
	}
});

buttonSettingsLogout.addEventListener("click", () => {
	let userID = localStorage.getItem("userID");
	let token = localStorage.getItem("token");

	logout(userID, token).then(result => {
		if("error" in result) {
			Notify.error({
				title: "Error",
				description: result.error,
				duration: 5000,
				background: "var(--accent-second)",
				color: "var(--accent-contrast)"
			});
		} else {
			finishLogout();
		}
	}).catch(error => {
		Notify.error({
			title: "Error",
			description: error,
			duration: 5000,
			background: "var(--accent-second)",
			color: "var(--accent-contrast)"
		});
	});
});

buttonSettingsLogoutEverywhere.addEventListener("click", () => {
	let userID = localStorage.getItem("userID");
	let token = localStorage.getItem("token");

	let popup = new Popup(300, "auto", "Logout Everywhere", `<span>Are you sure you want to log out from every active session?</span>`);
	popup.show();

	popup.on("confirm", () => {
		popup.hide();
		
		logoutEverywhere(userID, token).then(result => {
			if("error" in result) {
				Notify.error({
					title: "Error",
					description: result.error,
					duration: 5000,
					background: "var(--accent-second)",
					color: "var(--accent-contrast)"
				});
			} else {
				finishLogout();
			}
		}).catch(error => {
			Notify.error({
				title: "Error",
				description: error,
				duration: 5000,
				background: "var(--accent-second)",
				color: "var(--accent-contrast)"
			});
		});
	});
});

buttonSettingsPassword.addEventListener("click", () => {
	let popup = new Popup(300, "auto", "Change Password", `<input type="password" id="popup-input-current-password" placeholder="Current Password..."><input type="password" id="popup-input-new-password" placeholder="New Password..."><input type="password" id="popup-input-repeat-password" placeholder="Repeat Password...">`);
	popup.show();

	popup.on("confirm", () => {
		let userID = localStorage.getItem("userID");
		let token = localStorage.getItem("token");

		let currentPassword = document.getElementById("popup-input-current-password").value;
		let newPassword = document.getElementById("popup-input-new-password").value;
		let repeatPassword = document.getElementById("popup-input-repeat-password").value;

		if(newPassword === repeatPassword) {
			changePassword(userID, token, currentPassword, newPassword).then(response => {
				if("error" in response) {
					Notify.error({
						title: "Error",
						description: response.error,
						duration: 5000,
						background: "var(--accent-second)",
						color: "var(--accent-contrast)"
					});
				} else {
					if("username" in response) {
						Notify.success({
							title: "Password Changed",
							description: "Your password has been changed.",
							duration: 5000,
							background: "var(--accent-second)",
							color: "var(--accent-contrast)"
						});

						popup.hide();
					}
				}
			}).catch(error => {
				Notify.error({
					title: "Error",
					description: error,
					duration: 5000,
					background: "var(--accent-second)",
					color: "var(--accent-contrast)"
				});
			});
		} else {
			Notify.error({
				title: "Error",
				description: "Passwords don't match.",
				duration: 5000,
				background: "var(--accent-second)",
				color: "var(--accent-contrast)"
			});
		}
	});
});

buttonSettingsReset.addEventListener("click", () => {
	let popup = new Popup(300, "auto", "Reset Settings", `<span>Are you sure you want to reset your settings?</span>`);
	popup.show();

	popup.on("confirm", () => {
		popup.hide();
		resetSettings();
	});
});