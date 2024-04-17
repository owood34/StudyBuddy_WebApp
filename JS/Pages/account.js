import * as UserDatabase from '../Database/UserDatabase.js';
import {HTTPStatusCodes} from '../Database/HTTPStatusCodes.js'

let menuState = false;
let darkMode = false;
const tabs = [...document.getElementsByClassName("tab")];
const tabButtons = [...document.querySelector(".sidebar").children];
const logoutButton = tabButtons[tabButtons.length - 1];
const themeToggle = document.getElementById("theme");
 
tabs.forEach(x => x.style.opacity = "0");
tabs[0].style.opacity = "1";

tabButtons.forEach(x => x.addEventListener('click', () => changeTabs(x.id)));
themeToggle.addEventListener('click', () => changeTheme());
document.getElementById("hamburger").addEventListener('click', () => activateMenu());
logoutButton.addEventListener('click', async () => await logout())

function changeTabs(id) {
    if (id !== "logout_button") {
        tabButtons.forEach(x => x.id === id ? x.classList.add("active") : x.classList.remove("active"));
        tabs.forEach(x => x.style.opacity = "0");
        tabs[id === "friendList_button" ? 1 : 
                id === "shortcuts_button" ? 2 
                    : 0].style.opacity = "1";
    }
}

function activateMenu() {
    menuState = !menuState;
    document.querySelector(".sidebar").style.width = menuState ? "150px" : "0px";
}

function changeTheme() {
    document.body.classList.toggle("dark");
    darkMode = !darkMode;
    document.getElementById("themeName").innerText = darkMode 
        ? "Current Theme: Dark Theme" 
        : "Current Theme: Light Theme";
    document.getElementById("nav").isDarkMode = darkMode;
}

async function logout() {
    const response = await UserDatabase.logoutUser();
    if (response === HTTPStatusCodes.OKAY) {
        localStorage.clear();
        location.href = "index.html";
    }
}