class CustomFooter extends HTMLElement {
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
        css.href = "./CSS/Elements/CustomFooter.css";

        this.shadowRoot.innerHTML = `
            <div>
                Hello World
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

customElements.define('custom-footer', CustomFooter);