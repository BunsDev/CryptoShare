detectMobile() ? document.body.id = "mobile" : document.body.id = "desktop";

setTheme(applicationSettings.theme);

setSounds(applicationSettings.sounds);

setSettingsChoices(applicationChoices);

updatePasswordFields();

attemptLogin();

addNavbarEvents();

addSettingsNavbarEvents();

addSettingsChoiceEvents();

addPattern();

addTooltips();

setInterval(() => {
	let active = getActiveMarketPage();
	populateMarketList(active.cryptoPage, active.stocksPage, false);
	populateHoldingsList(false);
	populateActivityList(false);
}, 15000);