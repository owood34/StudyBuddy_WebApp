import * as StudyGroupDatabase from '../Database/StudyGroupDatabase.js';
import { HTTPStatusCodes } from '../Database/HTTPStatusCodes.js';

class StudyGroup extends HTMLElement {
    
    clicked = false;
    

    constructor() {
        super();

        this.attachShadow({ mode: "open"});

    }

    connectedCallback() {
        this.render();
    }

    render() {
        const css = document.createElement("link");
        css.rel = "stylesheet";
        css.href = "./CSS/Elements/StudyGroup.css";

        const title = this.getAttribute("title") || "Unknown Title";
        const currentParticipants = this.getAttribute("members") || 0;
        const maxParticipants = this.getAttribute("maxmembers") || 6;
        const className = this.getAttribute("classname") || "Unknown Name";
        const classNum = this.getAttribute("classNum") || "";
        const location = this.getAttribute("location") || "Unknown Location";
        const owner = this.getAttribute("owner") || "Unknown Owner";
        const description = this.getAttribute("description") || "";
        const maxTime = 8640000000000000;

        let meetingTimes = JSON.parse(this.getAttribute("times")) || "";
        meetingTimes = meetingTimes.replace("[", "").replace("]", "").split(",");

        let closestMeetingTime = new Date();
        closestMeetingTime.setTime(maxTime);
        const today = new Date(); 

        if (meetingTimes.length !== 0) {
            for (let i = 0; i < meetingTimes.length; i++) {
                const meetingDay = new Date(Date.parse(meetingTimes[i]));
                const difference = meetingDay.getTime() - today.getTime();
                if (!isNaN(difference)) {
                    if (difference > 0 && difference < (closestMeetingTime.getTime() - today.getTime())) {
                        closestMeetingTime = new Date(meetingDay.getTime());
                    }
                } 
            }
        }

        const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
        closestMeetingTime = closestMeetingTime.toLocaleDateString('en-US', options);

        let memberIds = this.getAttribute("memberIds") || "";
        memberIds = memberIds.replace("[", "").replace("]", "").split(",");

        if (classNum === "") {
            this.shadowRoot.innerHTML = `
                <div class="wrapper">
                    <h3> ${title} </h3> 
                    <p> ${closestMeetingTime} </p>
                    <h4 class="location"> Location:  ${location} </h4>
                    <h4> ${className} </h4>
                </div>
            `;
        } else {
            this.shadowRoot.innerHTML = `
                <div class="wrapper">
                    <h3> ${title} </h3> 
                    <p> ${closestMeetingTime} </p>
                    <h4 class="location"> Location: ${location} </h4>
                    <h4> ${className}, ${classNum} </h4>
                </div>
            `;
        }

        const data = {
            title: title,
            participants: currentParticipants,
            maxParticipants: maxParticipants,
            className: className,
            location: location,
            owner: owner,
            ownerId: this.getAttribute("ownerId"),
            description: description,
            meetingTimes: meetingTimes,
            closestMeetingTime: closestMeetingTime,
            groupId: this.getAttribute("groupId"),
            memberIds: memberIds
        }

        this.shadowRoot.querySelector(".wrapper").addEventListener('click', () => this.pressed(data));

        this.shadowRoot.appendChild(css);
    }

    pressed(data) {
        document.body.querySelector(".content").classList.toggle("blurry");
        this.clicked = !this.clicked;

        if (this.clicked) {
            const zoomedIn = document.createElement("div");
            zoomedIn.classList.add("studyGroupPopup");
            const user = JSON.parse(localStorage.getItem("user"));

            if (user.username === data.owner && user._id === data.ownerId) {
                zoomedIn.innerHTML = `
                    <h3> ${data.title} </h3> 
                    <div class="context">
                        <p> Location: <b>${data.location} </b></p>
                        <p> Members: ${data.participants} / ${data.maxParticipants} </p> 
                        <p> ${data.closestMeetingTime} </p>
                        <p> ${data.className} </p>
                        <p> ${data.description} </p>
                        <p> Owner: <b>${data.owner} </b></p>
                    </div>
                    <div class="controls">
                        <button id="edit"> Edit </button> 
                        <button id="cancel"> Cancel </button>
                    </div>  
                `;
            } else if (user.userame !== data.owner && !data.memberIds.includes(user._id)) {
                zoomedIn.innerHTML = `
                    <h3> ${data.title} </h3> 
                    <div class="context">
                        <p> Location: <b>${data.location} </b></p>
                        <p> Members: ${data.participants} / ${data.maxParticipants} </p> 
                        <p> ${data.closestMeetingTime} </p>
                        <p> ${data.className} </p>
                        <p> ${data.description} </p>
                        <p> Owner: <b>${data.owner} </b></p>
                    </div>
                    <div class="controls">
                        <button id="join"> Join </button> 
                        <button id="cancel"> Cancel </button>
                    </div>  
                `;
            } else if (user.userame !== data.owner && data.memberIds.includes(user._id)) {
                zoomedIn.innerHTML = `
                    <h3> ${data.title} </h3> 
                    <div class="context">
                        <p> Location: <b>${data.location} </b></p>
                        <p> Members: ${data.participants} / ${data.maxParticipants} </p> 
                        <p> ${data.closestMeetingTime} </p>
                        <p> ${data.className} </p>
                        <p> ${data.description} </p>
                        <p> Owner: <b>${data.owner} </b></p>
                    </div>
                    <div class="controls">
                        <button id="leave"> Leave </button> 
                        <button id="cancel"> Cancel </button>
                    </div>  
                `;
            }
            zoomedIn.querySelector("#cancel").addEventListener("click", () => this.pressed(undefined));
            zoomedIn.querySelector("#join")?.addEventListener("click", async () => {
                const response = await StudyGroupDatabase.joinStudyGroup(data.groupId);
                switch(response) {
                    case HTTPStatusCodes.OKAY: {
                        alert("You have joined the Study Group!");
                        location.reload();
                        return;
                    }
                    default: {
                        alert("Something went wrong");
                        location.reload();
                        return;
                    }
                }
            });
            zoomedIn.querySelector("#leave")?.addEventListener("click", async () => {
                const response = await StudyGroupDatabase.leaveStudyGroup(data.groupId);
                switch(response) {
                    case HTTPStatusCodes.OKAY: {
                        alert("You have left the Study Group!");
                        location.reload();
                        return;
                    }
                    default: {
                        alert("Something went wrong");
                        location.reload();
                        return;
                    }
                }
            });
            zoomedIn.querySelector("#edit")?.addEventListener("click", () => location.href = `studypage.html?createGroup=true&id=${data.groupId}`);

            document.body.appendChild(zoomedIn);

        } else {
            document.body.removeChild(document.body.lastChild);
        }
        
    }

    static get observedAttributes() {
        return ["title", "members", "maxmembers", "classname", "classnum", "location", "owner", "description", "meetingTimes"];
    }

    attributeChangedCallback(name, oldValue, newValue) {
        if (oldValue !== newValue) {
            this.render();
        }
    }
}

customElements.define('study-group', StudyGroup);