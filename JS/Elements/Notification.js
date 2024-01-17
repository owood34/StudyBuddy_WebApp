class CustomNotification extends HTMLElement {
    
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
        css.href = "./CSS/Elements/Notification.css";

        const title = this.getAttribute("title") || "Unknown Title";
        const message = this.getAttribute("message") || "Unknown Message";
        const sender = this.getAttribute("sender") || "Unknown Sender";

        this.shadowRoot.innerHTML = `
            <div class="wrapper">
                <h4> ${title} </h4>
                <p> ${sender} </p>
            </div>
        `;

        this.shadowRoot.querySelector(".wrapper").addEventListener('click', () => this.pressed(title, message, sender));

        this.shadowRoot.appendChild(css);
    }

    pressed(title, message, sender) {
        document.body.querySelector(".screen").classList.toggle("blurry");
        this.clicked = !this.clicked;

        if (this.clicked) {
            const fullNotification = document.createElement("div");
            
            fullNotification.classList.add("message");
            fullNotification.innerHTML = `
                <h2> ${title} </h2>
                <h4> ${sender} </h4>
                <p> ${message} </p> 
            `;
    
            fullNotification.addEventListener('click', () => this.pressed(title, message, sender))

            document.body.appendChild(fullNotification)
        } else {
            document.body.removeChild(document.body.lastChild);
        }
        
    }

    static get observedAttributes() {
        return ["title", "message", "sender"];
    }

    attributeChangedCallback(name, oldValue, newValue) {
        if (oldValue !== newValue) {
            this.render();
        }
    }
}

customElements.define('custom-notification', CustomNotification);