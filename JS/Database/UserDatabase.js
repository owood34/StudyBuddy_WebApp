const isTesting = false;
const url = "https://studdybuddy-api-server.azurewebsites.net";

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
 * @returns { Object } { status code, user / undefined }
 * */

async function updateUser(user) {
    const options = {
            method: "PATCH",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(user)
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



export { createUser, deleteAllUsers, deleteUser, updateUser, userVerification, getActiveUser, logoutUser, loginUser }