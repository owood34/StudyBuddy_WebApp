import * as UserDatabase from '../Database/UserDatabase.js';

let menuState = false;
let darkMode = false;
const tabs = [...document.getElementsByClassName("tab")];
const tabButtons = [...document.querySelector(".sidebar").children];
const logoutButton = tabButtons[tabButtons.length - 1];
const themeToggle = document.getElementById("theme");
 
tabs.forEach(x => x.style.display = "none");
tabs[0].style.display = "block";

tabButtons.forEach(x => x.addEventListener('click', () => changeTabs(x.id)));
themeToggle.addEventListener('click', () => changeTheme());
document.getElementById("hamburger").addEventListener('click', () => activateMenu());
logoutButton.addEventListener('click', async () => await logout())

function changeTabs(id) {
    if (id !== "logout_button") {
        tabButtons.forEach(x => x.id === id ? x.classList.add("active") : x.classList.remove("active"));
        tabs.forEach(x => x.style.display = "none");
        tabs[id === "friendList_button" ? 1 : 
                id === "shortcuts_button" ? 2 
                    : 0].style.display = "block";
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
    if (response.okay) {
        location.href = "index.html";
    }
}