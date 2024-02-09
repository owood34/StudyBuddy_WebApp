class CustomExpandedFriend extends HTMLElement {
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
        css.href = "./CSS/Elements/CustomExpandedFriend.css";

        const name = this.getAttribute("name") || "Unknown";
        const profile = this.getAttribute("profile") || "./Images/default_user.png";
        const inSession = this.getAttribute("inSession") || "";

        this.shadowRoot.innerHTML = `
            <div class=${inSession}>
                <img src=${profile} />
                <p class="name"> ${name} </p>
                <div id=controls> 
                    <img id="send" src="./Images/send.png" />
                    <p class="sendBox"> Send Notification to ${name} </p>
                    <img id="delete" src="./Images/delete.png" />
                    <p class="deleteBox"> Remove ${name} from Friend List </p> 
                </div>
            </div>
        `;

        this.shadowRoot.getElementById("send").addEventListener('click', () => this.send(name));
        this.shadowRoot.getElementById("delete").addEventListener('click', () => this.delete(name));

        this.shadowRoot.appendChild(css);
    }

    static get observedAttributes() {
        return ["name", "profile", "inSession"];
    }

    attributeChangedCallback(name, oldValue, newValue) {
        if (oldValue !== newValue) {
            this.render();
        }
    }

    send(name) {
        // Look at list of Friends by ID and find with the same name.
        console.log(`Sent to ${name}`);

    }

    delete(name) {
        // Find name in list of ids and remove it from friends list array.
        console.log(`Deleted ${name}`);
    }
}

customElements.define('expanded-friend', CustomExpandedFriend);