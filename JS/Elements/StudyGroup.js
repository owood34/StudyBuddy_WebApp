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
        const meetingTimes = JSON.parse(this.getAttribute("meetingTimes")) || [];
        const maxTime = 8640000000000000;
        
        let closestMeetingTime = new Date();
        closestMeetingTime.setTime(maxTime);
        const today = new Date(); 

        if (meetingTimes.length !== 0) {
            for (let i = 0; i < meetingTimes.length; i++) {
                for (let j = 0; j < meetingTimes[i].dates.length; j++) {
                    const meetingDay = new Date(Date.parse(meetingTimes[i].dates[j]));
                    const difference = meetingDay.getTime() - today.getTime();
                    if (difference > 0 && difference < (closestMeetingTime.getTime() - today.getTime())) {
                        closestMeetingTime = new Date(meetingDay.getTime());
                    }
                }
            }
        }

        const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
        closestMeetingTime = closestMeetingTime.toLocaleDateString('en-US', options);

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

        this.shadowRoot.querySelector(".wrapper").addEventListener('click', () => this.pressed(title, currentParticipants, maxParticipants, className, classNum, location, owner, description, closestMeetingTime));

        this.shadowRoot.appendChild(css);
    }

    pressed(title, currentParticipants, maxParticipants, className, classNum, location, owner, description, closestMeetingTime) {
        document.body.querySelector(".content").classList.toggle("blurry");
        this.clicked = !this.clicked;

        if (this.clicked) {
            const zoomedIn = document.createElement("div");
            zoomedIn.classList.add("studyGroupPopup");

            if (classNum === "") {
                zoomedIn.innerHTML = `
                    <h3> ${title} </h3> 
                    <p> ${closestMeetingTime} </p>
                    <p> Members: ${currentParticipants} / ${maxParticipants} </p>
                    <h4> Location: ${location} </h4> 
                    <p> Owner: ${owner} </p>
                    <h4> ${className}</h4>
                    <p> ${description} </p>
                    <div class="controls">
                        <button id="join"> Join </button> 
                        <button id="cancel"> Cancel </button>
                    </div>  
                `;
            } else {
                zoomedIn.innerHTML = `
                    <h3> ${title} </h3>
                    <p> ${closestMeetingTime} </p> 
                    <p> Members: ${currentParticipants} / ${maxParticipants} </p>
                    <h4> Location: ${location} </h4> 
                    <p> Owner: ${owner} </p>
                    <h4> ${className}, ${classNum}</h4>
                    <p> ${description} </p>
                    <div class="controls">
                        <button id="join"> Join </button> 
                        <button id="cancel"> Cancel </button>
                    </div>  
                `;
            }

            zoomedIn.addEventListener("click", () => this.pressed(title, currentParticipants, maxParticipants, className, classNum, location, owner, description));
            zoomedIn.querySelector("#join").addEventListener("click", () => console.log("joined"));

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