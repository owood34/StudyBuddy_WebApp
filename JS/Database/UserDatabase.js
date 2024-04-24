const url = "https://studdybuddy-api-server.azurewebsites.net"
//"https://studdybuddy-api-server.azurewebsites.net";

const header = "user";

/** 
 * Gets the Current User Logged in
 * @returns { Object } { status code, user / undefined }
 * */
async function getActiveUser() {
    if (localStorage.getItem("token") !== undefined && 
        localStorage.getItem("token") !== null) {
        const token = localStorage.getItem("token");
        const options = {
            method: "GET",
            headers: {
                Authorization: `Bearer ${token}`
            }
        };
    
        const response = await fetch(`${url}/${header}/active`, options);
        const body = await response.json();
    
        return body;
    }
    return undefined;
}

/** 
 * Gets the Current User Logged in
 * @returns { String } username
 * */
async function getUsername(username) {
    const options = { method: "GET" };

    const response = await fetch(`${url}/${header}/${username}`, options);
    
    return response.json();
}

/** 
 * Creates a User inside the Database.
 * @param { Object } user
 * @returns { Object } { status code, user / undefined }
 * */ 

async function createUser(user) {
    const options = {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(user)
    }

    const response = await fetch(`${url}/${header}`, options);
    const body = await response.json();

    return body;
}

/** 
 * Verifies the User with a token
 * @param { String } token
 * @returns { Number } { status code }
 * */ 
async function userVerification(token) {
    const options = {
        method: "GET",
        headers: {
            Authorization: `Bearer ${token}`
        }
    };

    const response = await fetch(`${url}/${header}/verification`, options);

    return response.status;
}

/** 
 * Updates an existing User inside the Database.
 * @param { Object } user 
 * @returns { Object } Updated User
 * */

async function updateUser(user) {
    if (localStorage.getItem("token") === undefined || 
        localStorage.getItem("token") === null) {
            return 404;
    }

    const token = localStorage.getItem("token");

    const options = {
            method: "PATCH",
            body: JSON.stringify(user),
            headers: { 
                "Authorization": `Bearer ${token}`,
                "Content-Type": "application/json"
             }
        }

        const response = await fetch(`${url}/${header}`, options);
        const body = await response.json();
        
        return body;
}

/**
 * Tries to login the User with a valid email and password
 * @param { String } Email - The Users Email
 * @param { String } Password - The Users Password
 * @returns { Object } {user, token}
*/
async function loginUser(email, password) {
    const options = {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({"email": email, "password": password})
    }
    const response = await fetch(`${url}/${header}/login`, options);
    const body = await response.json();

    return body;
}

/**
 * Logs Current User Out
 * @returns { Number } Status Code
 */
async function logoutUser() {
    if (localStorage.getItem("token") === undefined || 
        localStorage.getItem("token") === null) {
            return 404;
    }

    console.log(localStorage.getItem("token"));

    const options = {
        method: "PATCH",
        headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`
        }
    };

    console.log(options);

    const response = await fetch(`${url}/${header}/logout`, options);
    return response.status;
}

/** 
 * Deletes a User inside the Database.
 * @param { Object } user
 * @returns { Number } { status code } 
 * */

async function deleteUser(user) {
    const options = {
        method: "DELETE"
    }

    const response = await fetch(`${url}/${header}/${user.userId}`, options);
    const body = await response.json();
    
    return body;
}

/** 
 * Deletes all Users of this User inside the Database.
 * @returns { Number } { status code } 
 * */
 
async function deleteAllUsers() {
    const options = {
        method: "DELETE"
    }

    const response = await fetch(`${url}/${header}/all`, options);
    const body = await response.json();
    
    return body;
}

/**
 * Tries to login the User with a valid email and password
 * @param { Boolean } isCreated - Determines when the user posts to instagram (Creation or Joining)
 * @param { String } name - Name of the StudyGroup
 * @returns { Object } {user, token}
*/
async function postInstagram(isCreated, name) {
    if (localStorage.getItem("token") === undefined || 
        localStorage.getItem("token") === null ||
        localStorage.getItem("user") === undefined || 
        localStorage.getItem("user") === null) {
            return 404;
    }

    const user = JSON.parse(localStorage.getItem("user"));
    

    const options = {
        method: "POST",
        headers: { 
            "Authorization": `Bearer ${localStorage.getItem("token")}` 
        }
    }
    const response = await fetch(`${url}/${header}/instagram?isCreated=${isCreated}&group=${name}`, options);

    return response;
}

export { 
    createUser, 
    deleteAllUsers, 
    deleteUser, 
    updateUser, 
    userVerification, 
    getActiveUser, 
    logoutUser, 
    loginUser, 
    getUsername,
    postInstagram 
}