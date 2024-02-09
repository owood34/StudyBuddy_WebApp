import * as UserDatabase from '../Database/UserDatabase.js';
import { HTTPStatusCodes } from '../Database/HTTPStatusCodes.js';

const tabs = [...document.getElementsByClassName("tab")];
const content = [...document.getElementsByClassName("content")];

const signin = document.getElementById("signin");
const loginForm = {email: "", password: ""};

const signup = document.getElementById("signup");
const createForm = {fname: "", lname: "", email: "", school: "", password: "", rpassword: ""}

let activeTab = "login";

tabs.forEach((e) => e.addEventListener('click', () => switchTab(e.id)));

function switchTab(id) {
    if (id !== activeTab) {
        activeTab = id;
        tabs.forEach((e) => e.classList.toggle("active"));
        content.forEach((e) => e.classList.toggle("active"));
    }
}

signin.addEventListener('click', async () => login());
signup.addEventListener('click', async () => createAccount());

content[1].querySelector("#fname").addEventListener('input', (e) => createForm.fname = e.target.value);
content[1].querySelector("#lname").addEventListener('input', (e) => createForm.lname = e.target.value);  
content[1].querySelector("#email").addEventListener('input', (e) => createForm.email = e.target.value);
content[1].querySelector("#school").addEventListener('input', (e) => createForm.school = e.target.value);
content[1].querySelector("#password").addEventListener('input', (e) => createForm.password = e.target.value);
content[1].querySelector("#rpassword").addEventListener('input', (e) => createForm.rpassword = e.target.value);   

async function login() {
    if (loginForm.email.length === 0 || 
        loginForm.password.length === 0) {
            console.log("Invalid Properties");
    }

    // Userdatabase Find User.
}

async function createAccount() {
    if (createForm.email.length === 0 || 
        createForm.fname.length === 0 || 
        createForm.lname.length === 0 ||
        createForm.school.length === 0 || 
        createForm.password.length === 0) {
            console.log(createForm);
            console.log("Invalid Properties");
    }

    if (createForm.rpassword !== createForm.password) {
        console.log("Passwords do not match");
    }

    const user = {
        username: `${createForm.fname} ${createForm.lname}`,
        email: createForm.email,
        password: createForm.password,
        school: createForm.school
    }

    const response = await UserDatabase.createUser(user);

    console.log(response);
}
