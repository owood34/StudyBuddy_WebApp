const isTesting = false;
const url = "https://studdybuddy-api-server.azurewebsites.net"
// "https://studdybuddy-api-server.azurewebsites.net";

const header = "studygroup";

/** 
 * Creates a Study Group inside the Database.
 * @param { Object } studygroup
 * @returns { Object } { status code, studygroup / undefined }
 * */ 

async function createStudyGroup(studygroup) {
    if (!localStorage.getItem("token") || 
        localStorage.getItem("token").length === 0) {
            return { status: 401, studygroup: undefined }
    }

    const token = localStorage.getItem("token");
    const options = {
        method: "POST",
        headers: {
            "Authorization": `Bearer ${token}`, 
            "Content-Type": "application/json" 
        },
        body: JSON.stringify(studygroup)
    };

    const response = await fetch(`${url}/${header}`, options);
    const body = await response.json();

    return body;
}

/** 
 * Gets all Study Groups inside the Database.
 * @returns { Array } { studygroups[] }
 * */ 

async function getAllStudyGroups() {
    const options = { method: "GET" };

    const response = await fetch(`${url}/${header}/all`, options);
    const body = await response.json();

    return body;
}

/**
 * Get All StudyGroup owned by the account logged in
 * @returns { Array } { studygroup[] }
 */
async function getAllOwnedStudyGroups() {
    if (!localStorage.getItem("token") || 
        localStorage.getItem("token").length === 0) {
            return { status: 401, studygroup: undefined }
    }

    const token = localStorage.getItem("token");
    const options = { 
        method: "GET",
        headers: {
            "Authorization": `Bearer ${token}`, 
            "Content-Type": "application/json" 
        }
    }

    const response = await fetch(`${url}/${header}s/owned`, options);
    const body = await response.json();

    return body;
}

/**
 * Gets all Groups that the filter tells it to get.
 * @param {Object} filter
 * @returns {Array} Study Group Array
 */

async function getStudyGroups(filter) {
    if (!localStorage.getItem("token") || 
        localStorage.getItem("token").length === 0) {
            return { status: 401, studygroup: undefined }
    }

    const token = localStorage.getItem("token");
    const options = {
        method: "GET",
        headers: {
            "Authorization": `Bearer ${token}`, 
            "Content-Type": "application/json" 
        }
    };

    const queryString = `?ongoing=${filter.ongoing}&school=${filter.school}&search=${filter.text}&limit=${filter.limit}&owned=${filter.owned}&skip=${filter.skip}&sortBy=${filter.sortBy}`;

    const response = await fetch(`${url}/${header}s${queryString}`, options);
    const body = await response.json();

    return body;
}

/**
 * Edits a Study Group by Id
 * @param { Any } id - StudyGroupId
 * @param { Object } mods - Modifications to StudyGroup
 * @return { Object } { StudyGroup }
 */
async function editStudyGroupById(id, mods) {
    if (!localStorage.getItem("token") || 
        localStorage.getItem("token").length === 0) {
            return { status: 401, studygroup: undefined }
    }

    const token = localStorage.getItem("token");
    const options = {
        method: "PATCH",
        body: JSON.stringify(mods),
        headers: {
            "Authorization": `Bearer ${token}`, 
            "Content-Type": "application/json" 
        }
    };

    const response = await fetch(`${url}/${header}/${id}`, options);
    const body = await response.json();

    return body;
}



export { createStudyGroup, getAllStudyGroups, getStudyGroups, getAllOwnedStudyGroups, editStudyGroupById }

