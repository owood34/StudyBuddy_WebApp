const url = "https://studdybuddy-api-server.azurewebsites.net";

const header = "notification";

let notifications = [];
notifications = await getAllNotifications();

/** 
 * Creates a Notification inside the Database.
 * @param { Object } notification
 * @returns { Object } { status code, notification / undefined }
 * */ 

async function createNotification(notifcation) {
    if (!localStorage.getItem("token") || 
        localStorage.getItem("token").length === 0) {
            return { status: 401, notification: undefined }
    }

    const token = localStorage.getItem("token");
    const options = {
        method: "POST",
        body: JSON.stringify(notifcation),
        headers: {
            "Authorization": `Bearer ${token}`, 
            "Content-Type": "application/json" 
        }
    };

    const response = await fetch(`${url}/${header}`, options);
    const body = await response.json();

    return body;
}

/** 
 * Gets All Notifications sent or recieved
 * @returns { Array } { notifications[] }
 * */ 

async function getAllNotifications() {
    if (!localStorage.getItem("token") || 
        localStorage.getItem("token").length === 0) {
            return { status: 401, notification: undefined }
    }

    const token = localStorage.getItem("token");
    const options = { 
        method: "GET",
        headers: {
            "Authorization": `Bearer ${token}`, 
            "Content-Type": "application/json" 
        } 
    };

    const response = await fetch(`${url}/${header}s`, options);
    const body = await response.json();

    return body;
}


export { notifications, createNotification, getAllNotifications }