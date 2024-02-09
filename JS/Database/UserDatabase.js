const isTesting = false;
const url = isTesting ? "http://localhost:3000" : 
    "http://studdybuddy-api-server.azurewebsites.net";

const header = "user";

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

    console.log(options.body);
    const response = await fetch(`${url}/${header}`, options);
    console.log(response);
    const body = await response.json();
    console.log(body);

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



export { createUser, deleteAllUsers, deleteUser, updateUser, userVerification }