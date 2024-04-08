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
        const reciever = this.getAttribute("reciever") || "Unknown Reciever";

        this.shadowRoot.innerHTML = `
            <div class="wrapper">
                <h4> ${title} </h4>
                <p> ${message} </p>
            </div>
        `;

        const data = {
            title: title,
            message: message,
            sender: sender,
            reciever: reciever
        }

        this.shadowRoot.querySelector(".wrapper").addEventListener('click', () => this.pressed(data));

        this.shadowRoot.appendChild(css);
    }

    pressed(data) {
        document.body.querySelector(".screen").classList.toggle("blurry");
        this.clicked = !this.clicked;

        if (this.clicked) {
            const fullNotification = document.createElement("div");
            
            fullNotification.classList.add("message");
            fullNotification.innerHTML = `
                <h2> ${data.title} </h2>
                <h4> From: ${data.sender} </h4>
                <h4> To: ${data.reciever} </h4>
                <p> ${data.message} </p> 
            `;
    
            fullNotification.addEventListener('click', () => this.pressed(undefined))

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