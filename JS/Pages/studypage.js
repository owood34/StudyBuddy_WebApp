import * as StudyGroupDatabase from '../Database/StudyGroupDatabase.js';

const search = document.getElementById("search");
const parameters = document.querySelector(".parameters");
const urlParams = new URLSearchParams(window.location.search);
const didCommand = decodeURIComponent(urlParams.get("createGroup"));
const daysOfWeek = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

// Page can hold 4 Groups.

const searchData = {
    text: "",
    ongoing: "both",
    school: "Bridgewater_College",
    sortBy: "",
    sort: {
        prop: "name",
        order: "asc"
    },
    limit: 4,
    skip: 0
}

const formData = {
    name: "",
    description: "",
    is_public: false,
    maxParticipants: 6,
    school: "Bridgewater College",
    course_number: "",
    conversion_times: [],
    meeting_times: [],
    start_date: new Date(),
    end_date: new Date()
}

let currentPage = 0;

search.addEventListener('click', async () => await searchGroups());
parameters.querySelector("#keyword").addEventListener('change', (e) => searchData.text = e.target.value);
parameters.querySelector("#school").addEventListener('change', (e) => searchData.school = e.target.value);
parameters.querySelector("#ongoing").addEventListener('change', (e) => searchData.ongoing = e.target.value);
parameters.querySelector("#sortProperty").addEventListener('change', (e) => searchData.sort.prop = e.target.value);
parameters.querySelector("#sortPropertyOrder").addEventListener('change', (e) => searchData.sort.order = e.target.value);

document.getElementById("insert").addEventListener('click', () => createGroup());

if (didCommand === "true") {
    createGroup();
}

function createGroup() {
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
                    <input type="text" placeholder="Name" id="name">
                </div>
                <div class="group">
                    <label for="description"> What is the description for your Study Group? </label>
                    <input type="text" id="description">
                </div>
                <div class="group">
                    <label for="courseNum"> What is the course number for your Study Group? </label>
                    <input type="text" id="courseNum">
                </div>
                <div class="group">
                    <label for="maxParticipants"> How many people are allowed to be in the Study Group? </label>
                    <select name="maxParticipants" id="maxParticipants">
                        <option value="1"> 1 </option>
                        <option value="2"> 2 </option>
                        <option value="3"> 3 </option>
                        <option value="4"> 4 </option>
                        <option value="5"> 5 </option>
                        <option value="6" selected> 6 </option>
                        <option value="7"> 7 </option>
                        <option value="8"> 8 </option>
                    </select>
                </div>
                <div class="group">
                    <label for="isPublic"> Is this a public study group? </label>
                    <input type="checkbox" id="isPublic" name="isPublic" value="true">
                </div>
                <div class="group">
                    <label for="school"> Does this study group take place at your school? </label>
                    <input type="checkbox" id="school" name="school" value="true" checked>
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
                        <select id="startMonth"></select>
                        <p>,</p>
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
        <div class="controls">
            <button id="previous"> < </button>
            <button class="create"> Create </button>
            <button class="cancel"> Cancel </button>
            <button id="next"> > </button>
        </div>
    `;

    const today = new Date();
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);

    const start = {
        day: createGroupWrapper.querySelector("#startDay"),
        month: createGroupWrapper.querySelector("#startMonth"),
        date: createGroupWrapper.querySelector("#startDate")
    };

    const end = {
        day: createGroupWrapper.querySelector("#endDay"),
        month: createGroupWrapper.querySelector("#endMonth"),
        date: createGroupWrapper.querySelector("#endDate")
    };

    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

    start.day.innerText = daysOfWeek[today.getDay()];
    end.day.innerText = daysOfWeek[tomorrow.getDay()];

    for (let i = 0; i < months.length; i++) {
        const startMonth = start.month.appendChild(document.createElement('option'));
        startMonth.innerText = months[i];
        startMonth.selected = i === today.getMonth();
        startMonth.value = i;

        const endMonth = end.month.appendChild(document.createElement('option'));
        endMonth.innerText = months[i];
        endMonth.selected = i === tomorrow.getMonth();
        endMonth.value = i;
    }

    for (let i = 1; i < 31; i++) {
        const startDay = start.date.appendChild(document.createElement('option'));
        startDay.innerText = i;
        startDay.selected = i === today.getDate();
        startDay.value = i;

        const endDay = end.date.appendChild(document.createElement('option'));
        endDay.innerText = i;
        endDay.selected = i === tomorrow.getDate();
        endDay.value = i;
    }

    const pages = [...createGroupWrapper.getElementsByClassName("page")];
    const cardWrapper = createGroupWrapper.querySelector(".cards");
    createGroupWrapper.querySelector(".close").addEventListener('click', () => close("maintab"));
    createGroupWrapper.querySelector(".cancel").addEventListener('click', () => close("maintab"));
    createGroupWrapper.querySelector(".controls").querySelector("#next").addEventListener('click', () => page(pages, 1));
    createGroupWrapper.querySelector(".controls").querySelector("#previous").addEventListener('click', () => page(pages, -1));
    createGroupWrapper.querySelector(".times").querySelector("#insertMeeting").addEventListener('click', () => insertMeeting(cardWrapper, undefined));

    createGroupWrapper.querySelector("#name").addEventListener('input', (e) => formData.name = e.target.value);
    createGroupWrapper.querySelector("#description").addEventListener('input', (e) => formData.description = e.target.value);
    createGroupWrapper.querySelector("#isPublic").addEventListener('change', (e) => formData.is_public = e.target.checked);
    createGroupWrapper.querySelector("#maxParticipants").addEventListener('change', (e) => formData.maxParticipants = e.target.value);
    createGroupWrapper.querySelector("#courseNum").addEventListener('input', (e) => formData.course_number = e.target.value);
    createGroupWrapper.querySelector("#school").addEventListener('input', (e) => formData.school = e.target.value);

    start.month.addEventListener('change', (e) => { 
        formData.start_date.setMonth(e.target.value);
        start.day.innerText = daysOfWeek[formData.start_date.getDay()];
    });
    end.month.addEventListener('change', (e) => { 
        formData.end_date.setMonth(e.target.value);
        end.day.innerText = daysOfWeek[formData.end_date.getDay()];
    });

    start.date.addEventListener('change', (e) => { 
        formData.start_date.setDate(e.target.value);
        console.log(formData.start_date);
        start.day.innerText = daysOfWeek[formData.start_date.getDay()]; 
    });
    end.date.addEventListener('change', (e) => {
        formData.end_date.setDate(e.target.value);
        console.log(formData.end_date);
        end.day.innerText = daysOfWeek[formData.end_date.getDay()];
    });

    createGroupWrapper.querySelector(".create").addEventListener('click', async () => await create());
}

function page(pages, num) {
    pages.forEach(p => p.classList.remove("active"));
    currentPage = currentPage + num;
    currentPage = currentPage > pages.length ? currentPage - pages.length 
        : currentPage < 0 ? currentPage + pages.length 
            : currentPage;
    pages[currentPage % pages.length].classList.add("active");
}

function insertMeeting(cardWrapper, cardInfo) {
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
                <p id="timeIdentifier"> AM </p> 
            </div>
            <div class="group">
                <label for="location"> What location is your Study Group? </label>
                <input type="text" id="location" name="location">
            </div>
            <div class="controls">
                <button class="create"> Create </button>
                <button class="cancel"> ${cardInfo ? "Delete" : "Cancel"} </button>
            </div> 
        </div>
    `;
    const today = new Date();
    const minute = meetingTimesWrapper.querySelector("#minute");
    const hours = meetingTimesWrapper.querySelector("#hour");
    const weekDay = meetingTimesWrapper.querySelector("#weekDay");

    if (cardInfo) {
        today.setHours(cardInfo.hour);
        today.setMinutes(cardInfo.min);
        meetingTimesWrapper.querySelector("#location").value = cardInfo.location;
        const index = formData.conversion_times.findIndex((val) => val.day === cardInfo.day && 
            val.hour === cardInfo.hour && val.min === cardInfo.min && val.location === cardInfo.location);
        formData.conversion_times.splice(index, 1);
        [...cardWrapper.children][index].remove();
    }

    for (let i = 0; i < daysOfWeek.length; i++) {
        const day = weekDay.appendChild(document.createElement('option'));
        day.innerText = daysOfWeek[i];
        day.selected = cardInfo ? i === daysOfWeek.findIndex((val) => val === cardInfo.day) : i === today.getDay();
    }

    const defaultForm = {
        day: daysOfWeek[today.getDay()],
        hour: "",
        min: "",
        location: "",
    }
    const meetingForm = {
        day: "",
        hour: 0,
        min: 0,
        location: ""
    }
    
    meetingTimesWrapper.querySelector(".close").addEventListener('click', () => close("subtab"));
    meetingTimesWrapper.querySelector(".controls").querySelector(".cancel").addEventListener('click', () => close("subtab"));
    meetingTimesWrapper.querySelector("#minute").addEventListener('change', (e) => defaultForm.min = e.target.value < 10 ? `0${e.target.value}` : e.target.value);
    meetingTimesWrapper.querySelector("#weekDay").addEventListener('input', (e) => defaultForm.day = e.target.value);
    meetingTimesWrapper.querySelector("#location").addEventListener('input', (e) => defaultForm.location = e.target.value);
    meetingTimesWrapper.querySelector("#hour").addEventListener('change', (e) => { 
        defaultForm.hour = e.target.value < 10 ? `0${e.target.value}` : e.target.value;
        meetingTimesWrapper.querySelector("#timeIdentifier").innerText = e.target.value < 12 ? "AM" : "PM";
    });

    for (let i = 0; i < 24; i++) {
        const hour = hours.appendChild(document.createElement("option"));
        hour.innerText = i > 12 ? i - 12 : i;
        hour.value = i;
        if (i === today.getHours()) {
            hour.selected = true;
            defaultForm.hour = i < 10 ? `0${i}` : i;
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
                defaultForm.min = i < 10 ? `0${i}` : i;
            }
        }
    }

    if (closest.elm) {
        closest.elm.selected = true;
    }

    meetingTimesWrapper.querySelector(".create").addEventListener('click', () => {
        if (defaultForm.hour.length === 0 ||
            defaultForm.min.length === 0 ||
            defaultForm.location.length === 0) {
                console.log("Invalid Properties");
                return;
        }

        meetingForm.day = defaultForm.day;
        meetingForm.hour = +(defaultForm.hour);
        meetingForm.min = +(defaultForm.min);
        meetingForm.location = defaultForm.location;

        const card = cardWrapper.appendChild(document.createElement("div"));
        card.classList.add("card");

        const date = card.appendChild(document.createElement("h4"));
        date.innerText = defaultForm.day;

        const time = card.appendChild(document.createElement("p"));
        time.innerText = `${+(defaultForm.hour) > 12 ? +(defaultForm.hour) - 12 : +(defaultForm.hour)}:${defaultForm.min} ${+(defaultForm.hour) > 12 ? "PM" : "AM"}`; 

        const location = card.appendChild(document.createElement("p"));
        location.innerText = meetingForm.location;

        card.addEventListener('click', () => insertMeeting(cardWrapper, meetingForm));

        formData.conversion_times.push(meetingForm);

        close("subtab");
    }); 
}

async function create() {
    if (formData.name.length === 0 ||
        formData.description.length === 0 ||
        formData.conversion_times.length === 0) {
            console.log("Invalid Properties");
            return;
    }

    for (let i = 0; i < formData.conversion_times.length; i++) {
        let currentDate = getStartDate(i);
        const meetingTimes = { dates: [], location: formData.conversion_times[i].location };
        while (currentDate.getTime() < formData.end_date.getTime()) {
            meetingTimes.dates.push(new Date(currentDate.getTime()));
            currentDate.setDate(currentDate.getDate() + 7);
        }
        formData.meeting_times.push(meetingTimes);
    }

    delete formData.conversion_times;

    const response = await StudyGroupDatabase.createStudyGroup(formData);
    if (response.okay) {
        close("maintab");
        alert("Successfully Created Your Study Group!");
        return;
    }
    alert("There was an erorr making your Study Group!");
}

async function searchGroups() {
    searchData.sortBy = `${searchData.sort.prop}:${searchData.sort.order}`;
    delete searchData.sort;
    const response = await StudyGroupDatabase.getStudyGroups(searchData);
    searchData.sort = {};
    document.getElementById("studyGroups").innerHTML = '';
    for (let i = 0; i < response.length; i++) {
        const element = document.getElementById("studyGroups").appendChild(document.createElement("study-group"));
        console.log(response[i]);
        let jsonString = "";
        for (let j = 0; j < response[i].meeting_times.length; j++) {
            for (let k = 0; k < response[i].meeting_times[j].dates.length; k++) {
                jsonString += `${response[i].meeting_times[j].dates[k]}`;
                jsonString += ",";
            }
        }

        element.setAttribute("times", JSON.stringify(`[${jsonString}]`));
        element.setAttribute('title', response[i].name);
        element.setAttribute("maxMembers", response[i].max_participants);
        element.setAttribute('location', response[i].meeting_times[0].location);
        element.setAttribute("className", response[i].course_number);
        element.setAttribute("description", response[i].description);
    }
}

function getStartDate(i) {
    let date = new Date(formData.start_date.getTime());
    date.setHours(formData.conversion_times[i].hour, formData.conversion_times[i].min);
    let difference = daysOfWeek.findIndex((v) => v === formData.conversion_times[i].day) - date.getDay();
    if (difference < 0) {
        difference += 7;
    }
    date.setDate(date.getDate() + difference);
    return date;
}

function close(str) {
    switch (str.toLowerCase()) {
        case "maintab": {
            close("subtab");
            document.body.querySelector(".content").classList.toggle("blurry");
            document.body.removeChild(document.body.lastChild);
            return;
        }
        case "subtab": {
            document.body.removeChild(document.body.lastChild);
            return;
        }
        default: {
            console.log("Invalid Code");
            return;
        }
    }
}