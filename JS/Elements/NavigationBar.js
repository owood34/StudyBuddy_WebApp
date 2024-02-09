class NavigationBar extends HTMLElement {
    constructor() {
        super();

        this.attachShadow({ mode: "open"});

    }

    connectedCallback() {
        this.render(false);
    }

    render(darkMode) {
        const css = document.createElement("link");
        css.rel = "stylesheet";
        css.href = "./CSS/Elements/NavigationBar.css";
        
        const notificationAmount = +(this.getAttribute("notification-amount")) || 0;
        const isDarkMode = darkMode ? "dark" : "";
        const isVisible = notificationAmount === 0 ? "hidden" : "visible";

        this.shadowRoot.innerHTML = `
            <div class="wrapper" id=${isDarkMode}>
                <a href="./index.html"><h3> Home </h3></a>
                <a href="./studypage.html"><h3> Find Study Group? </h3></a>
                <a href="./login.html"> <img src=./Images/default_user.png /></a>
                <div class="bell">
                    <a href="./messages.html"> <img src=./Images/notification_bell.png /></a>
                    <span style="visibility: ${isVisible}"> ${notificationAmount} </span>
                <div>
            </div>
        `;

        this.shadowRoot.appendChild(css);
    }

    static get observedAttributes() {
        return ["notification-amount", "darkMode"];
    }

    /**
     * @param {boolean} val
     * Renders Dark Mode
     */
    set isDarkMode(val) {
        this.render(val);
    }

    attributeChangedCallback(name, oldValue, newValue) {
        this.render(false);
    }
}

customElements.define('navigation-bar', NavigationBar);