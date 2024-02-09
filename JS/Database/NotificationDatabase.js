import { Notification } from "./Models";

const isTesting = false;
const url = isTesting ? "http://localhost:3000/" : 
    "studdybuddy-api-server.azurewebsites.net";

const header = "/user/notifications";

/** 
 * Creates a Notification inside the Database.
 * @param { Object } notification
 * @returns { Notification } { status code, notification / undefined }
 * */ 

async function createNotification(notification) {
    const options = {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(notification)
    }

    const response = await fetch(`${url}/${header}`, options);
    const body = await response.json();

    return body;
}

/** 
 * Updates an existing Notification inside the Database.
 * @param { Object } notification 
 * @returns { Notification } { status code, notification / undefined }
 * */

async function updateNotification(notification) {
    const options = {
            method: "PATCH",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(notification)
        }

        const response = await fetch(`${url}/${header}`, options);
        const body = await response.json();
        
        return body;
}

/** 
 * Deletes a Notification inside the Database.
 * @param { Object } notification
 * @returns { Number } { status code } 
 * */

async function deleteNotification(notification) {
    const options = {
        method: "DELETE"
    }

    const response = await fetch(`${url}/${header}/${notification.notificationId}`, options);
    const body = await response.json();
    
    return body;
}

/** 
 * Deletes all Notifications of this User inside the Database.
 * @returns { Number } { status code } 
 * */
 
async function deleteAllNotifications() {
    const options = {
        method: "DELETE"
    }

    const response = await fetch(`${url}/${header}/all`, options);
    const body = await response.json();
    
    return body;
}



export { createNotification, deleteAllNotifications, deleteNotification, updateNotification }