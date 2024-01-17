class CustomFriend extends HTMLElement {
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
        css.href = "./CSS/Elements/CustomFriend.css";

        const name = this.getAttribute("name") || "Unknown";
        const profile = this.getAttribute("profile") || "./Images/default_user.png";
        const inSession = this.getAttribute("inSession") || "";

        this.shadowRoot.innerHTML = `
            <div class=${inSession}>
                <img src=${profile} />
                <p> ${name} </p>
            </div>
        `;

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
}

customElements.define('friend-list', CustomFriend);