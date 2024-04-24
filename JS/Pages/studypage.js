import * as StudyGroupDatabase from '../Database/StudyGroupDatabase.js';
import * as UserDatabase from '../Database/UserDatabase.js';

const search = document.getElementById("search");
const parameters = document.querySelector(".parameters");
const urlParams = new URLSearchParams(window.location.search);
const didCommand = decodeURIComponent(urlParams.get("createGroup")) === "true";
const groupId = decodeURIComponent(urlParams.get("id"));
const daysOfWeek = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
const loggedInUser = JSON.parse(localStorage.getItem("user"));

const searchData = {
    text: "",
    ongoing: "",
    school: "",
    sortBy: "name:asc",
    owned: false,
    member: false,
    limit: 4,
    skip: 0
}

const formData = {
    name: "",
    description: "",
    is_public: false,
    max_participants: 6,
    school: "Bridgewater College",
    course_number: "",
    meeting_times: [],
    start_date: new Date(),
    end_date: new Date()
}

let createPages = 0;

search.addEventListener('click', async () => await searchGroups());
parameters.querySelector("#keyword").addEventListener('change', (e) => searchData.text = e.target.value);
parameters.querySelector("#school").addEventListener('change', (e) => searchData.school = e.target.value);
parameters.querySelector("#ongoing").addEventListener('change', (e) => searchData.ongoing = e.target.value);
parameters.querySelector("#sortProperty").addEventListener('change', (e) => searchData.sortBy = `${e.target.value}:${searchData.sortBy.substring(searchData.sortBy.indexOf(":") + 1, searchData.sortBy.length)}`);
parameters.querySelector("#sortPropertyOrder").addEventListener('change', (e) => searchData.sortBy = `${searchData.sortBy.substring(0, searchData.sortBy.indexOf(":") + 1)}${e.target.value}`);
parameters.querySelector("#owned").addEventListener('change', (e) => searchData.owned = e.target.checked);
parameters.querySelector("#member").addEventListener('change', (e) => searchData.member = e.target.checked);
document.getElementById("insert").addEventListener('click', () => createGroup());

document.querySelector("#controls").querySelector(".next").addEventListener('click', async () => {
    searchData.skip += 4;
    await searchGroups();
});

document.querySelector("#controls").querySelector(".previous").addEventListener('click', async () => {
    if (searchData.skip > 0) {
        searchData.skip -= 4;
        await searchGroups();
    } 
});

if (didCommand) {
    let group = undefined;
    if (groupId && groupId !== 'null') {
        group = await StudyGroupDatabase.getStudyGroupById(groupId);
        formData.course_number = group.group.course_number;
        formData.description = group.group.description;
        formData.end_date = new Date(Date.parse(group.group.end_date));
        formData.is_public = group.group.is_public;
        formData.max_participants = group.group.max_participants;
        
        group.group.meeting_times.forEach((mt) => formData.meeting_times.push({ dates: [new Date(Date.parse(mt.dates[0]))], location: mt.location }));

        formData.name = group.group.name;
        formData.school = group.group.school;
        formData.start_date = new Date(Date.parse(group.group.start_date));
        group = group.group;
    }
    createGroup(group);
}

await searchGroups();

function createGroup(cardInfo) {
    document.body.querySelector(".content").classList.toggle("blurry");
    const createGroupWrapper = document.body.appendChild(document.createElement("div"));
    createGroupWrapper.classList.add("createStudyGroupPopup");

    createGroupWrapper.innerHTML = `
        <img src="./Images/close_button.png" class="close" />
        <h2> Create a Study Group </h2>
        <div class="page active">
            <h1> Study Group General Settings </h1>
            <div class="form">
                <div class="group">
                    <label for="name"> What is the name of the study group? </label>
                    <input type="text" placeholder="${cardInfo ? cardInfo.name : "Name"}" id="name">
                </div>
                <div class="group">
                    <label for="description"> What is the description for your Study Group? </label>
                    <input type="text" id="description" placeholder="${cardInfo ? cardInfo.description : ""}">
                </div>
                <div class="group">
                    <label for="courseNum"> What is the course number for your Study Group? </label>
                    <input type="text" id="courseNum" placeholder="${cardInfo ? cardInfo.course_number : ""}">
                </div>
                <div class="group">
                    <label for="maxParticipants"> How many people are allowed to be in the Study Group? </label>
                    <select name="maxParticipants" id="maxParticipants">
                        <option value="1" ${cardInfo?.max_participants && cardInfo.max_participants === 1 ? "selected" : "" }> 1 </option>
                        <option value="2" ${cardInfo?.max_participants && cardInfo.max_participants === 2 ? "selected" : "" }> 2 </option>
                        <option value="3" ${cardInfo?.max_participants && cardInfo.max_participants === 3 ? "selected" : "" }> 3 </option>
                        <option value="4" ${cardInfo?.max_participants && cardInfo.max_participants === 4 ? "selected" : "" }> 4 </option>
                        <option value="5" ${cardInfo?.max_participants && cardInfo.max_participants === 5 ? "selected" : "" }> 5 </option>
                        <option value="6" ${cardInfo?.max_participants && cardInfo.max_participants === 6 ? "selected" : "" }> 6 </option>
                        <option value="7" ${cardInfo?.max_participants && cardInfo.max_participants === 7 ? "selected" : "" }> 7 </option>
                        <option value="8" ${cardInfo?.max_participants && cardInfo.max_participants === 8 ? "selected" : "" }> 8 </option>
                    </select>
                </div>
                <div class="group">
                    <label for="isPublic"> Is this a public study group? </label>
                    <input type="checkbox" id="isPublic" name="isPublic" value="true" ${cardInfo?.is_public ? "checked" : ""}>
                </div>
                <div class="group">
                    <label for="school"> Does this study group take place at your school? </label>
                    <input type="checkbox" id="school" name="school" value="true" ${cardInfo?.school && cardInfo.school === loggedInUser.school ? "checked" : ""}>
                    <div class="checkBoxRequired">
                        <label for="school"> What school does this take place at? </label>
                        <input type="input" id="changeSchool" name="changeSchool">
                    </div>
                </div>
            </div>
        </div>
        <div class="page">
            <h1> Time and Location </h1>
            <div class="times">
                <p id="title"> Insert Meeting Time </p> 
                <img src="./Images/add_button.png" id="insertMeeting"/>
                <div class="dates">
                    <div class="startDate"> Start Date:
                        <p id="startDay"> </p>
                        <select id="startMonth"></select>,
                        <select id="startDate"></select>
                    </div>
                    <div class="endDate"> End Date:
                        <p id="endDay"> </p>
                        <select id="endMonth"></select>,
                        <select id="endDate"></select>
                    </div>
                </div>
                <div class="cards"></div> 
            </div>
        </div>
        <div class="controls" style="${cardInfo ? "width: 275px;" : "width: 208px;"}">
            <button id="previous"> < </button>
            <button class="${cardInfo ? "save" : "create"}"> ${cardInfo ? "Save" : "Create"} </button>
            <button class="${cardInfo ? "delete" : "cancel"}"> ${cardInfo ? "Delete" : "Cancel"} </button>
            ${cardInfo ? "<button class=cancel> Cancel </button>" : ""}
            <button id="next"> > </button>
        </div>
    `;

    const cardWrapper = createGroupWrapper.querySelector(".cards");
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

    for (let i = 0; i < months.length; i++) {
        const startMonth = createGroupWrapper.querySelector("#startMonth").appendChild(document.createElement("option"));
        startMonth.innerText = months[i];
        startMonth.selected = i === formData.start_date.getMonth();
        startMonth.value = i;

        const endMonth = createGroupWrapper.querySelector("#endMonth").appendChild(document.createElement("option"));
        endMonth.innerText = months[i];
        endMonth.selected = i === formData.end_date.getMonth();
        endMonth.value = i; 
    }

    for (let i = 1; i < 32; i++) {
        const startDay = createGroupWrapper.querySelector("#startDate").appendChild(document.createElement("option"));
        startDay.innerText = i;
        startDay.selected = i === formData.start_date.getDate();
        startDay.value = i;

        const endDay = createGroupWrapper.querySelector("#endDate").appendChild(document.createElement("option"));
        endDay.innerText = i;
        endDay.selected = i === formData.end_date.getDate();
        endDay.value = i;
    }

    const controlPages = (num) => {
        const pages = [...createGroupWrapper.getElementsByClassName("page")];
        pages.forEach((p) => p.classList.remove("active"));
        createPages = (((createPages + num) % pages.length) + pages.length) % pages.length;
        pages[createPages].classList.add("active");
    }

    const insertMeeting = (cardInfo) => {
        const meetingForm = {
            dates: cardInfo ? [new Date(Date.parse(cardInfo.dates[0]))] : [new Date(formData.start_date.getTime())],
            location: cardInfo ? cardInfo.location : ""
        }

        const meetingTimesWrapper = document.body.appendChild(document.createElement("div"));
        meetingTimesWrapper.classList.add("smallPopup");
        meetingTimesWrapper.innerHTML = `
            <img src="./Images/close_button.png" class="close" />
            <div class="form">
                <div class="day_group">
                    <label for="date"> What day is your Study Group? </label>
                    <select id="weekDay"></select>
                </div>
                <div class="group"> What time is your Study Group? </label>
                    <label for="time"> </label>
                    <select id="hour"></select> :
                    <select id="minute"></select>
                    <p id="timeIdentifier"> ${meetingForm.dates[0].getHours() < 12 ? "AM" : "PM"} </p> 
                </div>
                <div class="group">
                    <label for="location"> What location is your Study Group? </label>
                    <input type="text" id="location" name="location">
                </div>
                <div class="controls">
                    <button class="${cardInfo ? "delete" : "create"}"> ${cardInfo ? "Delete" : "Create"} </button>
                    <button class="cancel"> Cancel </button>
                </div> 
            </div>
        `;

        const today = meetingForm.dates[0];
        const minute = meetingTimesWrapper.querySelector("#minute");
        const hours = meetingTimesWrapper.querySelector("#hour");
        const weekDay = meetingTimesWrapper.querySelector("#weekDay");

        for (let i = 0; i < daysOfWeek.length; i++) {
            const day = weekDay.appendChild(document.createElement('option'));
            day.value = i;
            day.innerText = daysOfWeek[i];
            day.selected = i === today.getDay();
        }

        for (let i = 0; i < 24; i++) {
            const hour = hours.appendChild(document.createElement("option"));
            hour.innerText = i > 12 ? i - 12 : i;
            hour.value = i;
            if (i === today.getHours()) {
                hour.selected = true;
                meetingForm.dates[0].setHours(i);
            }
        }
    
        const closest = {
            num: Infinity,
            elm: undefined
        };
    
        for (let i = 0; i < 60; i+=5) {
            const min = minute.appendChild(document.createElement("option"));
            min.innerText = i <= 5 ? `0${i}` : `${i}`;
            min.value = i;
            if (i - today.getMinutes() <= 5 && i - today.getMinutes() >= 0) {
                if (i - today.getMinutes() < closest.num) {
                    closest.num = i - today.getMinutes();
                    closest.elm = min;
                    meetingForm.dates[0].setMinutes(i);
                }
            }
        }
    
        if (closest.elm) {
            closest.elm.selected = true;
        }

        meetingTimesWrapper.querySelector(".close").addEventListener('click', () => close("sub"));
        meetingTimesWrapper.querySelector(".controls").querySelector(".cancel").addEventListener('click', () => close("sub"));
        meetingTimesWrapper.querySelector("#minute").addEventListener('change', (e) => meetingForm.dates[0].setMinutes(+(e.target.value)));
        meetingTimesWrapper.querySelector("#weekDay").addEventListener('input', (e) => {
            meetingForm.dates[0].setDate(formData.start_date.getDate());
            const difference = (+(e.target.value) - meetingForm.dates[0].getDay()) <= 0 
                ? (+(e.target.value) - meetingForm.dates[0].getDay()) + daysOfWeek.length
                : (+(e.target.value) - meetingForm.dates[0].getDay());
            meetingForm.dates[0].setDate(meetingForm.dates[0].getDate() + difference);
        });
        meetingTimesWrapper.querySelector("#location").addEventListener('input', (e) => meetingForm.location = e.target.value);
        meetingTimesWrapper.querySelector("#hour").addEventListener('change', (e) => { 
            meetingForm.dates[0].setHours(+(e.target.value));
            meetingTimesWrapper.querySelector("#timeIdentifier").innerText = e.target.value < 12 ? "AM" : "PM";
        });

        meetingTimesWrapper.querySelector(".create")?.addEventListener('click', () => {
            if (meetingForm.location.length === 0) {
                alert("Unknown Location");
                return;
            }

            const card = cardWrapper.appendChild(document.createElement("div"));
            card.classList.add("card");

            const date = card.appendChild(document.createElement("h4"));
            date.innerText = daysOfWeek[meetingForm.dates[0].getDay() % daysOfWeek.length];

            const time = card.appendChild(document.createElement("p"));
            time.innerText = meetingForm.dates[0].toLocaleTimeString(navigator.language, {hour: 'numeric', minute:'2-digit'});;

            const location = card.appendChild(document.createElement("p"));
            location.innerText = meetingForm.location;

            card.addEventListener('click', () => insertMeeting(meetingForm));
            formData.meeting_times.push(meetingForm);
            close("sub");
        });

        meetingTimesWrapper.querySelector(".delete")?.addEventListener('click', () => {
            const index = formData.meeting_times.findIndex(
                (val) => val.dates[0].getHours() === meetingForm.dates[0].getHours() && 
                    val.dates[0].getMinutes() === meetingForm.dates[0].getMinutes() && 
                    val.location === meetingForm.location
            );

            if (index !== -1) {
                formData.meeting_times.splice(index, 1);
                [...cardWrapper.children][index].remove();
                close("sub");
                return;
            }
            alert("Unable to Delete Meeting Time");
        });
    }

    if (cardInfo) {
        cardInfo.meeting_times.forEach((mt) => {
            const day = new Date(Date.parse(mt.dates[0]));

            const card = cardWrapper.appendChild(document.createElement("div"));
            card.classList.add("card");

            const date = card.appendChild(document.createElement("h4"));
            date.innerText = daysOfWeek[day.getDay() % daysOfWeek.length];

            const time = card.appendChild(document.createElement("p"));
            time.innerText = day.toLocaleTimeString(navigator.language, {hour: 'numeric', minute:'2-digit'});;

            const location = card.appendChild(document.createElement("p"));
            location.innerText = mt.location;

            card.addEventListener('click', () => insertMeeting(mt));
        });
    }

    createGroupWrapper.querySelector(".close").addEventListener('click', () => close());
    createGroupWrapper.querySelector(".cancel").addEventListener('click', () => close());
    createGroupWrapper.querySelector(".controls").querySelector("#next").addEventListener('click', () => controlPages(1));
    createGroupWrapper.querySelector(".controls").querySelector("#previous").addEventListener('click', () => controlPages(-1));
    createGroupWrapper.querySelector(".times").querySelector("#insertMeeting").addEventListener('click', () => insertMeeting(undefined));

    createGroupWrapper.querySelector("#name").addEventListener('input', (e) => formData.name = e.target.value);
    createGroupWrapper.querySelector("#description").addEventListener('input', (e) => formData.description = e.target.value);
    createGroupWrapper.querySelector("#isPublic").addEventListener('change', (e) => formData.is_public = e.target.checked);
    createGroupWrapper.querySelector("#maxParticipants").addEventListener('change', (e) => formData.max_participants = e.target.value);
    createGroupWrapper.querySelector("#courseNum").addEventListener('input', (e) => formData.course_number = e.target.value);
    createGroupWrapper.querySelector("#school").addEventListener('input', (e) => formData.school = e.target.value);

    createGroupWrapper.querySelector("#startMonth").addEventListener('change', (e) => formData.start_date.setMonth(+(e.target.value)));
    createGroupWrapper.querySelector("#startDate").addEventListener('change', (e) => formData.start_date.setDate(+(e.target.value)));
    createGroupWrapper.querySelector("#endMonth").addEventListener('change', (e) => formData.end_date.setMonth(+(e.target.value)));
    createGroupWrapper.querySelector("#endDate").addEventListener('change', (e) => formData.end_date.setDate(+(e.target.value)));

    createGroupWrapper.querySelector(".create")?.addEventListener('click', async () => await create());
    createGroupWrapper.querySelector(".save")?.addEventListener('click', async () => await save());
    createGroupWrapper.querySelector(".delete")?.addEventListener('click', async () => await remove());
}

async function create() {
    if (formData.name.length === 0 ||
        formData.description.length === 0) {
            alert("Cannot find Name or Description");
            return;
    }

    if (formData.start_date.getTime() > formData.end_date.getTime()) {
        alert("Start Date Cannot be after End Date");
        return;
    }

    if (formData.meeting_times.length === 0) {
        alert("Cannot Find Meeting Times");
        return;
    }

    formData.meeting_times.forEach((mt) => {
        let currentMeetingTime = new Date(mt.dates[0].getTime());
        currentMeetingTime.setDate(currentMeetingTime.getDate() + 7);
        while (currentMeetingTime.getTime() < formData.end_date.getTime()) {
            mt.dates.push(new Date(currentMeetingTime.getTime()));
            currentMeetingTime.setDate(currentMeetingTime.getDate() + 7);
        }
    });

    const response = await StudyGroupDatabase.createStudyGroup(formData);
    if (response.okay) {
        alert("Successfully Created Your Study Group!");
        close();
        createInstagramPopUp(true, formData.name);
        return;
    }

    alert("Couldn't Save your Study Group? Try Again");
}

async function save() {
    if (formData.name.length === 0 ||
        formData.description.length === 0) {
            alert("Cannot find Name or Description");
            return;
    }

    if (formData.start_date.getTime() > formData.end_date.getTime()) {
        alert("Start Date Cannot be after End Date");
        return;
    }

    if (formData.meeting_times.length === 0) {
        alert("Cannot Find Meeting Times");
        return;
    }

    formData.meeting_times.forEach((mt) => {
        let currentMeetingTime = new Date(mt.dates[0].getTime());
        currentMeetingTime.setDate(currentMeetingTime.getDate() + 7);
        while (currentMeetingTime.getTime() < formData.end_date.getTime()) {
            mt.dates.push(new Date(currentMeetingTime.getTime()));
            currentMeetingTime.setDate(currentMeetingTime.getDate() + 7);
        }
    });

    const response = await StudyGroupDatabase.editStudyGroupById(groupId, formData);
    if (response) {
        alert("Successfully Saved Your Study Group!");
        close();
        return;
    }

    alert("Unable to Save Your Study Group");
}

async function remove() {
    const reply = prompt("To delete please type the name of the group: ");
    if (reply === formData.name) {
        const response = await StudyGroupDatabase.deleteStudyGroup(groupId);
        if (response) {
            alert("Successfully Deleted Group!");
            location.href = "studypage.html";
            return;
        }
        alert("Unable to delete Group");
        return;   
    }

    alert("Unauthorized to delete this group");
}

function close(tab = "main") {
    switch (tab.toLowerCase()) {
        case "sub":
            document.body.removeChild(document.body.lastChild);
            return;
        case "main":
            close("sub");
            document.body.querySelector(".content").classList.toggle("blurry");
            document.body.removeChild(document.body.lastChild);
            return;
        default:
            return;
    }
}

async function searchGroups() {
    const response = await StudyGroupDatabase.getStudyGroups(searchData);
    document.getElementById("studyGroups").innerHTML = '';
    for (let i = 0; i < response.length; i++) {
        const element = document.getElementById("studyGroups").appendChild(document.createElement("study-group"));
        let jsonString = "";
        for (let j = 0; j < response[i].meeting_times.length; j++) {
            for (let k = 0; k < response[i].meeting_times[j].dates.length; k++) {
                jsonString += `${response[i].meeting_times[j].dates[k]}`;
                jsonString += ",";
            }
        }
        const people = [];
        const owner = await UserDatabase.getUsername(response[i].owner);

        for (let j = 0; j < response[i].participants.length; j++) {
            const name = (await UserDatabase.getUsername(response[i].participants[j])).name;
            people.push(name);
        }

        element.setAttribute("times", JSON.stringify(`[${jsonString}]`));
        element.setAttribute("participants", JSON.stringify(people));
        element.setAttribute('title', response[i].name);
        element.setAttribute('memberIds', response[i].participants);
        element.setAttribute('members', response[i].participants.length);
        element.setAttribute("maxMembers", response[i].max_participants);
        element.setAttribute('location', response[i].meeting_times[0].location);
        element.setAttribute("className", response[i].course_number);
        element.setAttribute("description", response[i].description);
        element.setAttribute("groupId", response[i]._id);
        element.setAttribute("ownerId", response[i].owner);
        element.setAttribute("owner", owner.name);
    }
}

function createInstagramPopUp(isCreated, name) {
    const ig = {
        username: JSON.parse(localStorage.getItem("user"))?.ig?.username,
        password: JSON.parse(localStorage.getItem("user"))?.ig?.password
    }
    const wrapper = document.body.appendChild(document.createElement("div"));
    wrapper.classList.add("instagram_popup");
    wrapper.innerHTML = `
        <label for="username"> Instagram Username </label>
        <input type="text" class="username" value=${ig.username}>


        <label for="password"> Instagram Password </label>
        <input type="password" class="password" value=${ig.password}>

        <div>
            <button class="post"> Post </button>
            <button class="cancel"> Cancel </button>
        </div>
    `;

    wrapper.querySelector(".cancel").addEventListener("click", () => location.reload());
    wrapper.querySelector(".post").addEventListener("click", async () => {
        const igUsername = new String(document.querySelector(".username").value);
        const igPassword = new String(document.querySelector(".password").value);

        ig.username = igUsername.replace(" ", "").length === 0 ? ig.username : document.querySelector(".username").value;
        ig.password = igPassword.replace(" ", "").length === 0 ? ig.password : document.querySelector(".password").value;

        if (ig.username === undefined || ig.password === undefined) {
            alert("Cannot find Instagram Username or Password!")
            return;
        }

        const response = await UserDatabase.updateUser({ ig: ig });
        if (response) {
            const postResponse = await UserDatabase.postInstagram(isCreated, name);
            if (postResponse.ok) { 
                alert("Instagram Post Created!");
                location.reload();
                return;
            }
            alert("Something went Wrong!");
            return;
        }
    });
}