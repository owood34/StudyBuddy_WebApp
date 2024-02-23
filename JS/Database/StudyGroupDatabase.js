const isTesting = false;
const url = "https://studdybuddy-api-server.azurewebsites.net";

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
    }

    const response = await fetch(`${url}/${header}`, options);
    const body = await response.json();

    return body;
}

/** 
 * Gets all Study Groups inside the Database.
 * @returns { Array } { studygroups[] }
 * */ 

async function getAllStudyGroups() {
    const options = { method: "GET" }

    const response = await fetch(`${url}/${header}/all`, options);
    const body = await response.json();

    return body;
}



export { createStudyGroup, getAllStudyGroups }

