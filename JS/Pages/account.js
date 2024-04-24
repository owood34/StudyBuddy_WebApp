import * as UserDatabase from '../Database/UserDatabase.js';
import {HTTPStatusCodes} from '../Database/HTTPStatusCodes.js'

let menuState = false;

const form = {
    username: "",
    email: "",
    password: "",
    school: "",
    ig: {
        username: "",
        password: ""
    }
};

const tabs = [...document.getElementsByClassName("tab")];
const tabButtons = [...document.querySelector(".sidebar").children];
const logoutButton = tabButtons[tabButtons.length - 1];
 
tabs.forEach(x => { 
    x.style.opacity = "0";
    x.style.zIndex = -1; 
});

tabs[0].style.opacity = "1";
tabs[0].style.zIndex = 4;

tabButtons.forEach(x => x.addEventListener('click', () => changeTabs(x.id)));
document.getElementById("hamburger").addEventListener('click', () => activateMenu());
logoutButton.addEventListener('click', async () => await logout());
document.getElementById("save").addEventListener('click', async () => await save());

function changeTabs(id) {
    if (id !== "logout_button") {
        tabButtons.forEach(x => x.id === id ? x.classList.add("active") : x.classList.remove("active"));
        tabs.forEach(x => { 
            x.style.opacity = "0";
            x.style.zIndex = -1; 
        });
        const newTab = tabs[id === "friendList_button" ? 1 : id === "shortcuts_button" ? 2 : 0];
        newTab.style.opacity = "1";
        newTab.style.zIndex = 4;
    }
}

function activateMenu() {
    menuState = !menuState;
    document.querySelector(".sidebar").style.width = menuState ? "150px" : "0px";
}

async function save() {
    const username = `${document.querySelector(".firstName").value} ${document.querySelector(".lastName").value}`;
    const school = document.querySelector(".school").value;
    const igUsername = new String(document.querySelector(".igusername").value);
    const igPassword = new String(document.querySelector(".igpassword").value);

    form.username = username.replace(" ", "").length === 0 ? JSON.parse(localStorage.getItem("user")).username : username;
    form.email = /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/.test(document.querySelector(".email").value) ? document.querySelector(".email").value : JSON.parse(localStorage.getItem("user")).email;
    form.school = school.replace(" ", "").length === 0 ? JSON.parse(localStorage.getItem("user")).school : document.querySelector(".school").value;
    form.ig.username = igUsername.replace(" ", "").length === 0 ? JSON.parse(localStorage.getItem("user"))?.ig?.username : document.querySelector(".igusername").value;
    form.ig.password = igPassword.replace(" ", "").length === 0 ? JSON.parse(localStorage.getItem("user"))?.ig?.password : document.querySelector(".igpassword").value;
    form.password = document.querySelector(".password").value;
    
    const response = await UserDatabase.updateUser(form);
    if (response) {
        localStorage.setItem("user", JSON.stringify(response));
        alert("Successfully Saved your Profile!");
        location.reload();
        return;
    }
    alert("Unable to Save your Profile!");
    return;
}

async function logout() {
    const response = await UserDatabase.logoutUser();
    if (response === HTTPStatusCodes.OKAY) {
        localStorage.clear();
        location.href = "index.html";
    }
}