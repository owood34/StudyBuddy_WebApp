import * as StudyGroupDatabase from '../Database/StudyGroupDatabase.js';
import * as NotificationDatabase from '../Database/NotificationDatabase.js';
import * as UserDatabase from '../Database/UserDatabase.js';

const groups = document.body.querySelector(".studyGroups").querySelector(".groups");
const participatingGroups = await StudyGroupDatabase.getAllParticipatingStudyGroups();
const ownedGroups = await StudyGroupDatabase.getAllOwnedStudyGroups();
const notifications = NotificationDatabase.notifications;
const possibleRecievers = [];

const notificationForm = {
    subject: "",
    body: "",
    notification_type: "MessageNotificationType",
    reciever: "",
    is_read: false
}

notifications.forEach(async (n) => await inbox(n));
participatingGroups.forEach(async (g) => await studyGroupTab(g));
ownedGroups.forEach(async (g) => addParticipants(g.participants));
document.querySelector("#insert").addEventListener('click', async () => await createNotification());

async function addParticipants(participants) {
    for (let i = 0; i < participants.length; i++) {
        const name = (await UserDatabase.getUsername(participants[i])).name;
        possibleRecievers.push({id: participants[i], name: name});
    }
}   

async function inbox(notificationInfo) {
    const sender = await UserDatabase.getUsername(notificationInfo.sender);
    const reciever = await UserDatabase.getUsername(notificationInfo.reciever);
    const element = document.querySelector(".notifications").appendChild(document.createElement('custom-notification'));
    element.setAttribute("title", notificationInfo.subject);
    element.setAttribute("message", notificationInfo.body);
    element.setAttribute("reciever", reciever.name);
    element.setAttribute("sender", sender.name);
}

async function studyGroupTab(groupInfo) {
    const wrapper = groups.appendChild(document.createElement("div"));
    wrapper.classList.add("group");
    wrapper.innerHTML = `
        <h2> ${groupInfo.name} </h2>
        <p> ${groupInfo.course_number} </p>
        <p> ${groupInfo.description} </p>
    `
    groupInfo.participants.forEach(async (id) => {
        if (localStorage.getItem("user")) {
            const user = JSON.parse(localStorage.getItem("user"));
            if (id !== user._id) {
                const username = await UserDatabase.getUsername(id);
                possibleRecievers.push({id: id, name: username.name});
            }
        }
    });

    const ownerName = await UserDatabase.getUsername(groupInfo.owner);
    possibleRecievers.push({id: groupInfo.owner, name: ownerName.name});
    possibleRecievers.push({id: groupInfo._id, name: `Group: ${groupInfo.name}`});

    wrapper.addEventListener('click', () => zoom(groupInfo));
}

function zoom(groupInfo) {
    const dateOptions = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
    const daysOfWeek = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
    const wrapper = document.createElement("div");
    
    wrapper.classList.add("zoomedInGroup");
    document.body.querySelector(".screen").classList.toggle("blurry");
    wrapper.innerHTML = `
        <img src="./Images/close_button.png" class="close" />
        <div class="form">
            <h2> ${groupInfo.name} </h2>
            <p> Course Number: ${groupInfo.course_number}</p>
            <p> Start Date: ${new Date(Date.parse(groupInfo.start_date)).toLocaleDateString('en-US', dateOptions)} </p>
            <p> End Date: ${new Date(Date.parse(groupInfo.end_date)).toLocaleDateString('en-US', dateOptions)} </p>
            <p> Public Group: ${groupInfo.is_public} </p>
            <p> Max Participants: ${groupInfo.max_participants} </p>
            <h4> Meeting Times: </h4>
            <div class="times"></div>
            <p> ${groupInfo.description} </p>
        </div> 
    `;

    const times = wrapper.querySelector(".times");
    if (groupInfo.meeting_times) {
        groupInfo.meeting_times.forEach((mt) => {
            const time = times.appendChild(document.createElement("div"));
            const date = new Date(Date.parse(mt.dates[0]));
            time.classList.add("meetingtime");
            time.appendChild(document.createElement("h5")).innerText = `${mt.location}, ${daysOfWeek[date.getDay()]}, ${date.getHours()}:${date.getMinutes()} ${date.getHours() < 12 ? 'AM' : 'PM'}`;
        });
    }
    
    [...wrapper.getElementsByClassName("close")].forEach((elm) => elm.addEventListener('click', () => {
        document.body.lastChild.remove();
        document.body.querySelector(".screen").classList.toggle("blurry");
    }));
    
    document.body.appendChild(wrapper);
}

async function createNotification() {
    const notificationBuilder = document.createElement("div");
    notificationBuilder.classList.add("createNotification");
    document.body.querySelector(".screen").classList.toggle("blurry");

    notificationBuilder.innerHTML = `
        <img src="./Images/close_button.png" class="close" />
        <div class="form">
            <select id="recievers"> </select>
            <input type="text" placeholder="Subject Line" id="subject">
            <textarea id="body"> Body... </textarea>
            <div class="controls">
                <button class="save"> Create </button>
                <button class="close"> Cancel </button> 
            </div> 
        </div>
    `;

    const setRecievers = possibleRecievers.filter((val, index) => possibleRecievers.findIndex((v, i) => v.id === val.id && index !== i));

    console.log(setRecievers, possibleRecievers);

    setRecievers.forEach((r) => {
        const reciever = notificationBuilder.querySelector("#recievers").appendChild(document.createElement("option"));
        reciever.value = r.id;
        reciever.innerText = r.name;
    });
    
    notificationForm.reciever = possibleRecievers[0]?.id;

    notificationBuilder.querySelector("#subject").addEventListener('change', (e) => notificationForm.subject = e.target.value);
    notificationBuilder.querySelector("#body").addEventListener('change', (e) => notificationForm.body = e.target.value);
    notificationBuilder.querySelector("#recievers").addEventListener('change', (e) => notificationForm.reciever = e.target.value);
    notificationBuilder.querySelector(".save").addEventListener('click', async () => {
        if (notificationForm.subject.length === 0 ||
            notificationForm.body.length === 0) {
                alert("Cannot find body or subject");
                return;
        }

        if (notificationForm.reciever === undefined || 
            notificationForm.reciever.length === 0) {
            alert("Cannot find Reciever");
            return;
        }

        if (participatingGroups.find((g) => g._id === notificationForm.reciever)) {
            const group = participatingGroups.find((g) => g._id === notificationForm.reciever);
            console.log(group);
            group.participants.forEach(async (p) => await send(p)); 
        } else {
            await send(notificationForm.reciever);
        }
    });

    [...notificationBuilder.getElementsByClassName("close")].forEach((elm) => elm.addEventListener('click', () => {
        document.body.lastChild.remove();
        document.body.querySelector(".screen").classList.toggle("blurry");
    }));

    document.body.appendChild(notificationBuilder);
}

async function send(id) {
    notificationForm.reciever = id;
    console.log(notificationForm);
    const response = await NotificationDatabase.createNotification(notificationForm);
    
    if (response.okay) {
        alert("Successfully sent notification");
        location.reload();
        return;
    }

    alert("Unable to send notification");
    location.reload();
    return;
}