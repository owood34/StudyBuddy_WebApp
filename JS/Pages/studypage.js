import * as StudyGroupDatabase from '../Database/StudyGroupDatabase.js';
import { HTTPStatusCodes } from '../Database/HTTPStatusCodes.js';

const commonResults = [...document.body.getElementsByClassName("common")];
const searchbar = document.getElementById("search");
const urlParams = new URLSearchParams(window.location.search);
const didCommand = decodeURIComponent(urlParams.get("createGroup"));
const formData = {
    name: "",
    description: "",
    isPublic: true,
    maxParticipants: 6,
    school: "",
    courseNum: "",
    meetings: []
}

let currentPage = 0;

document.getElementById("insert").addEventListener('click', () => createGroup());

commonResults.forEach(x => x.addEventListener('click', () => addCommonResult(x.innerText)));
searchbar.addEventListener('input', () => resize());

if (didCommand === "true") {
    createGroup();
}

function resize() {
    searchbar.style.width = `${searchbar.scrollWidth}px`;
}

function addCommonResult(text) {
    searchbar.value += `${text},`;
    searchbar.style.width = `${searchbar.scrollWidth}px`;
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
                    <label for="description"> Do you have a description for this Study Group? </label>
                    <input type="text" id="description">
                </div>
                <div class="group">
                    <label for="courseNum"> Does this relate to a course? </label>
                    <input type="text" id="courseNum">
                </div>
                <div class="group">
                    <label for="maxParticipants"> How many people are allowed to be in the Study Group? </label>
                    <select name="maxParticipants" id="maxParticipants">
                        <option value="6">  </option>
                        <option value="1"> 1 </option>
                        <option value="2"> 2 </option>
                        <option value="3"> 3 </option>
                        <option value="4"> 4 </option>
                        <option value="5"> 5 </option>
                        <option value="6"> 6 </option>
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

    const pages = [...createGroupWrapper.getElementsByClassName("page")];
    const cardWrapper = createGroupWrapper.querySelector(".cards");
    createGroupWrapper.querySelector(".close").addEventListener('click', () => close("maintab"));
    createGroupWrapper.querySelector(".cancel").addEventListener('click', () => close("maintab"));
    createGroupWrapper.querySelector(".controls").querySelector("#next").addEventListener('click', () => page(pages, 1));
    createGroupWrapper.querySelector(".controls").querySelector("#previous").addEventListener('click', () => page(pages, -1));
    createGroupWrapper.querySelector(".times").querySelector("#insertMeeting").addEventListener('click', () => insertMeeting(cardWrapper));

    createGroupWrapper.querySelector("#name").addEventListener('input', (e) => formData.name = e.target.value);
    createGroupWrapper.querySelector("#description").addEventListener('input', (e) => formData.description = e.target.value);
    createGroupWrapper.querySelector("#isPublic").addEventListener('change', (e) => formData.isPublic = e.target.checked);
    createGroupWrapper.querySelector("#maxParticipants").addEventListener('change', (e) => formData.maxParticipants = e.target.value);
    createGroupWrapper.querySelector("#courseNum").addEventListener('input', (e) => formData.courseNum = e.target.value);
    createGroupWrapper.querySelector("#school").addEventListener('input', (e) => formData.school = e.target.value);

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

function insertMeeting(cardWrapper) {
    const meetingTimesWrapper = document.body.appendChild(document.createElement("div"));
    meetingTimesWrapper.classList.add("smallPopup");
    
    meetingTimesWrapper.innerHTML = `
        <img src="./Images/close_button.png" class="close" />
        <div class="form">
            <div clas="group">
                <label for="date"> What day is your Study Group? </label>
                <select id="month"></select>,
                <select id="day"></select>
            </div>
            <div class="group"> What time is your Study Group? </label>
                <label for="time"> </label>
                <select id="hour"></select> :
                <select id="minute"></select> 
            </div>
            <div class="group">
                <label for="location"> What location is your Study Group? </label>
                <input type="text" id="location" name="location">
            </div>
            <div class="controls">
                <button class="create"> Create </button>
                <button class="cancel"> Cancel </button>
            </div> 
        </div>
    `;
    const today = new Date();
    const minute = meetingTimesWrapper.querySelector("#minute");
    const hours = meetingTimesWrapper.querySelector("#hour");
    const month = meetingTimesWrapper.querySelector("#month");
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
    const day = meetingTimesWrapper.querySelector("#day");

    const defaultForm = {
        month: "",
        day: "",
        hour: "",
        min: "",
        location: ""
    }
    const meetingForm = {
        day: "",
        time: "",
        location: ""
    }
    
    meetingTimesWrapper.querySelector(".close").addEventListener('click', () => close("subtab"));
    meetingTimesWrapper.querySelector(".controls").querySelector(".cancel").addEventListener('click', () => close("subtab"));
    meetingTimesWrapper.querySelector("#month").addEventListener('change', (e) => defaultForm.month = e.target.value < 10 ? `0${e.target.value}` : e.target.value);
    meetingTimesWrapper.querySelector("#day").addEventListener('change', (e) => defaultForm.day = e.target.value < 10 ? `0${e.target.value}` : e.target.value);
    meetingTimesWrapper.querySelector("#hour").addEventListener('change', (e) => defaultForm.hour = e.target.value < 10 ? `0${e.target.value}` : e.target.value);
    meetingTimesWrapper.querySelector("#minute").addEventListener('change', (e) => defaultForm.minute = e.target.value < 10 ? `0${e.target.value}` : e.target.value);
    meetingTimesWrapper.querySelector("#location").addEventListener('input', (e) => defaultForm.location = e.target.value);

    for (let i = 1; i < 13; i++) {
        const mon = month.appendChild(document.createElement("option"));
        mon.innerText = months[i - 1];
        mon.value = i;
        if (i === today.getMonth() + 1) {
            mon.selected = true;
            defaultForm.month = i < 10 ? `0${i}` : i;
        }
        
    }

    for (let i = 1; i <= 31; i++) {
        const d = day.appendChild(document.createElement("option"));
        d.innerText = i;
        d.value = i;
        if (i === today.getDate()) {
            d.selected = true;
            defaultForm.day = i < 10 ? `0${i}` : i;
        }

    }

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

    for (let i = 5; i < 65; i+=5) {
        const min = minute.appendChild(document.createElement("option"));
        min.innerText = i === 5 ? `0${i}` : i === 60 ? `00` : `${i}`;
        min.value = i;
        if (i - today.getMinutes() <= 5 && i - today.getMinutes() >= 0) {
            if (i - today.getMinutes() < closest.num) {
                closest.num = i - today.getMinutes();
                closest.elm = min;
                defaultForm.min = i < 10 ? `0${i}` : i;
            }
        }
    }

    closest.elm.selected = true;

    meetingTimesWrapper.querySelector(".create").addEventListener('click', () => {
        if (defaultForm.day.length === 0 ||
            defaultForm.hour.length === 0 ||
            defaultForm.min.length === 0 ||
            defaultForm.month.length === 0 ||
            defaultForm.location.length === 0) {
                console.log("Invalid Properties");
                return;
        }
        
        meetingForm.day = `${today.getFullYear()}-${defaultForm.month + 1}-${defaultForm.day}T${defaultForm.hour}:${defaultForm.min}:00+00:00`;
        meetingForm.time = `${defaultForm.hour}:${defaultForm.min}`;
        meetingForm.location = defaultForm.location;

        const card = cardWrapper.appendChild(document.createElement("div"));
        card.classList.add("card");

        const date = card.appendChild(document.createElement("h4"));
        date.innerText = `${months[+(defaultForm.month) - 1]}, ${defaultForm.day}`;

        const time = card.appendChild(document.createElement("p"));
        time.innerText = `${defaultForm.hour > 12 ? defaultForm.hour - 12 : defaultForm.hour}:${defaultForm.min} ${defaultForm.hour > 12 ? "PM" : "AM"}`; 

        const location = card.appendChild(document.createElement("p"));
        location.innerText = meetingForm.location;

        delete meetingForm.time;
        formData.meetings.push(meetingForm);

        close("subtab");
    }); 
}

async function create() {
    if (formData.name.length === 0 ||
        formData.description.length === 0 ||
        formData.meetings.length === 0) {
            console.log("Invalid Properties");
            return;
    }

    const response = await StudyGroupDatabase.createStudyGroup(formData);
    console.log(response);
    if (response.okay) {
        close("maintab");
        alert("Successfully Created Your Study Group!");
    }
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