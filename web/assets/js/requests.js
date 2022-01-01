let urlAPI = "http://localhost:3190/graphql";

function userExists(username) {
	let query = {
		query: `{ 
			userExists(username: "${username}") 
		}`
	};

	return request("POST", urlAPI, query);
}

function createAccount(username, password, key) {
	let query = {
		query: `mutation createUser($username: String!, $password: String!, $key: String!) {
			createUser(username: $username, password: $password, key: $key)
		}`,
		variables: {
			username: username,
			password: password,
			key: key
		}
	};

	return request("POST", urlAPI, query);
}

function login(username, password) {
	let body = {
		username: username,
		password: password
	};

	return request("POST", urlAPI.replace("graphql", "login"), body);
}

function logout(userID, token) {
	let body = {
		userID: userID,
		token: token
	};

	return request("POST", urlAPI.replace("graphql", "logout"), body);
}

function logoutEverywhere(userID, token) {
	let body = {
		userID: userID,
		token: token
	};

	return request("POST", urlAPI.replace("graphql", "logoutEverywhere"), body);
}

function verifyToken(userID, token) {
	let body = {
		userID: userID,
		token: token
	};

	return request("POST", urlAPI.replace("graphql", "verifyToken"), body);
}

function changePassword(userID, token, currentPassword, newPassword) {
	let body = {
		userID: userID,
		token: token,
		currentPassword: currentPassword,
		newPassword: newPassword
	};

	return request("POST", urlAPI.replace("graphql", "changePassword"), body);
}

function request(method, url, body) {
	return new Promise((resolve, reject) => {
		try {
			let xhr = new XMLHttpRequest();

			xhr.addEventListener("readystatechange", () => {
				if(xhr.readyState === xhr.DONE) {
					if(validJSON(xhr.responseText)) {
						let response = JSON.parse(xhr.responseText);
						resolve(response);
					} else {
						if(empty(xhr.responseText)) {
							reject("Server error.");
						} else {
							reject("Invalid JSON.");
						}
					}
				}
			});

			xhr.addEventListener("error", (error) => {
				reject(error);
			});

			xhr.open(method, url, true);
			xhr.setRequestHeader("Content-Type", "application/json");
			xhr.send(JSON.stringify(body));
		} catch(error) {
			console.log(error);
			reject(error);
		}
	});
}

function empty(value) {
	if(typeof value === "object" && value !== null && Object.keys(value).length === 0) {
		return true;
	}
		
	if(value === null || typeof value === "undefined" || value.toString().trim() === "") {
		return true;
	}

	return false;
}

function validJSON(json) {
	try {
		let object = JSON.parse(json);
		if(object && typeof object === "object") {
			return true;
		}
	}
	catch(e) { }
	return false;
}