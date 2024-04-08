import * as NotificationDatabase from '../Database/NotificationDatabase.js';

class NavigationBar extends HTMLElement {
    constructor() {
        super();

        this.attachShadow({ mode: "open"});

    }

    connectedCallback() {
        this.render(false);
    }

    render() {
        const notificationAmount = NotificationDatabase.notifications.length || 0;
        
        const css = document.createElement("link");
        css.rel = "stylesheet";
        css.href = "./CSS/Elements/NavigationBar.css";
        const isVisible = notificationAmount === 0 ? "hidden" : "visible";
        const accountSetting = localStorage.getItem("token") !== null ? "./account.html" : "./login.html";
        //const accountSetting = "./login.html";
        
        this.shadowRoot.innerHTML = `
            <div class="wrapper">
                <a href="./index.html"><h3> Home </h3></a>
                <a href="./studypage.html"><h3> Find Study Group? </h3></a>
                <a href="${accountSetting}"> <img src=./Images/default_user.png /></a>
                <div class="bell">
                    <a href="./messages.html"> <img src=./Images/notification_bell.png /></a>
                    <span style="visibility: ${isVisible}"> ${notificationAmount} </span>
                <div>
            </div>
        `;

        this.shadowRoot.appendChild(css);

        setInterval(async () => {
            const notifications = await NotificationDatabase.getAllNotifications();
            const previousLength = NotificationDatabase.notifications.length;
            NotificationDatabase.notifications.length = 0;
            NotificationDatabase.notifications.push(...notifications);
            if (previousLength !== NotificationDatabase.notifications.length) {
                this.render();
            }
        }, 10000);
    }

    static get observedAttributes() {
        return ["notification-amount", "darkMode"];
    }

    attributeChangedCallback(name, oldValue, newValue) {
        this.render(false);
    }
}

customElements.define('navigation-bar', NavigationBar);