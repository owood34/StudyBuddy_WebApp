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

        if (classNum === "") {
            this.shadowRoot.innerHTML = `
                <div class="wrapper">
                    <h3> ${title} </h3> 
                    <p> Members: ${currentParticipants} / ${maxParticipants} </p>
                    <h4 class="location"> Location:  ${location} </h4>
                    <h4> ${className} </h4>
                </div>
            `;
        } else {
            this.shadowRoot.innerHTML = `
                <div class="wrapper">
                    <h3> ${title} </h3> 
                    <p> Members: ${currentParticipants} / ${maxParticipants} </p>
                    <h4 class="location"> Location: ${location} </h4>
                    <h4> ${className}, ${classNum} </h4>
                </div>
            `;
        }

        this.shadowRoot.querySelector(".wrapper").addEventListener('click', () => this.pressed(title, currentParticipants, maxParticipants, className, classNum, location, owner));

        this.shadowRoot.appendChild(css);
    }

    pressed(title, currentParticipants, maxParticipants, className, classNum, location, owner) {
        document.body.querySelector(".content").classList.toggle("blurry");
        this.clicked = !this.clicked;

        if (this.clicked) {
            const zoomedIn = document.createElement("div");
            zoomedIn.classList.add("studyGroupPopup");

            if (classNum === "") {
                zoomedIn.innerHTML = `
                    <h3> ${title} </h3> 
                    <p> Members: ${currentParticipants} / ${maxParticipants} </p>
                    <h4> Location: ${location} </h4> 
                    <p> Owner: ${owner} </p>
                    <h4> ${className}</h4>
                    <div class="controls">
                        <button id="join"> Join </button> 
                        <button id="cancel"> Cancel </button>
                    </div>  
                `;
            } else {
                zoomedIn.innerHTML = `
                    <h3> ${title} </h3> 
                    <p> Members: ${currentParticipants} / ${maxParticipants} </p>
                    <h4> Location: ${location} </h4> 
                    <p> Owner: ${owner} </p>
                    <h4> ${className}, ${classNum}</h4>
                    <div class="controls">
                        <button id="join"> Join </button> 
                        <button id="cancel"> Cancel </button>
                    </div>  
                `;
            }

            zoomedIn.addEventListener("click", () => this.pressed(title, currentParticipants, maxParticipants, className, classNum, location, owner));
            zoomedIn.querySelector("#join").addEventListener("click", () => console.log("joined"));

            document.body.appendChild(zoomedIn);

        } else {
            document.body.removeChild(document.body.lastChild);
        }
        
    }

    static get observedAttributes() {
        return ["title", "members", "maxmembers", "classname", "classnum", "location", "owner"];
    }

    attributeChangedCallback(name, oldValue, newValue) {
        if (oldValue !== newValue) {
            this.render();
        }
    }
}

customElements.define('study-group', StudyGroup);