import * as UserDatabase from '../Database/UserDatabase.js';

const tabs = [...document.getElementsByClassName("tab")];
const content = [...document.getElementsByClassName("content")];
const errors = [...document.getElementsByClassName("error")];

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

content[1].querySelector("#fname").addEventListener('input', (e) => { 
    createForm.fname = e.target.value;
    content[1].querySelector("#fname").classList.remove("fieldError"); 
});
content[1].querySelector("#lname").addEventListener('input', (e) => { 
    createForm.lname = e.target.value;
    content[1].querySelector("#lname").classList.remove("fieldError");  
});  
content[1].querySelector("#email").addEventListener('input', (e) => { 
    createForm.email = e.target.value;
    content[1].querySelector("#email").classList.remove("fieldError"); 
});
content[1].querySelector("#school").addEventListener('input', (e) => { 
    createForm.school = e.target.value;
    content[1].querySelector("#school").classList.remove("fieldError"); 
});
content[1].querySelector("#password").addEventListener('input', (e) => { 
    createForm.password = e.target.value;
    content[1].querySelector("#password").classList.remove("fieldError"); 
});
content[1].querySelector("#rpassword").addEventListener('input', (e) => { 
    createForm.rpassword = e.target.value;
    content[1].querySelector("#password").classList.remove("fieldError"); 
    content[1].querySelector("#rpassword").classList.remove("fieldError"); 
});   

async function login() {
    if (loginForm.email.length === 0 || 
        loginForm.password.length === 0) {
            console.log("Invalid Properties");
    }

    // Userdatabase Find User.
}

async function createAccount() {
    errors.forEach(e => e.style.visibility = "hidden");
    if (createForm.fname.length === 0) {
        content[1].querySelector("#fname").classList.add("fieldError");
        errors[0].style.visibility = "visible";
        return;
    }

    if (createForm.lname.length === 0) {
        content[1].querySelector("#lname").classList.add("fieldError");
        errors[0].style.visibility = "visible";
        return;
    }
    
    if (createForm.email.length === 0) {
        content[1].querySelector("#email").classList.add("fieldError");
        errors[1].style.visibility = "visible";
        return;
    }

    if (createForm.school.length === 0) {
        content[1].querySelector("#school").classList.add("fieldError");
        errors[2].style.visibility = "visible";
        return;
    }

    if (createForm.password.length === 0) {
        content[1].querySelector("#password").classList.add("fieldError");
        errors[3].style.visibility = "visible";
        return;
    }


    if (createForm.rpassword !== createForm.password) {
        content[1].querySelector("#password").classList.add("fieldError");
        content[1].querySelector("#rpassword").classList.add("fieldError");
        errors[4].style.visibility = "visible";
        return;
    }

    const user = {
        username: `${createForm.fname} ${createForm.lname}`,
        email: createForm.email,
        password: createForm.password,
        school: createForm.school
    }
    
    const response = await UserDatabase.createUser(user);

    if (JSON.stringify(response) === "{}") {
        document.getElementById("ErrorMessage").style.visibility = "visible";
    } else {
        document.getElementById("ErrorMessage").style.visibility = "hidden";
    }
}
