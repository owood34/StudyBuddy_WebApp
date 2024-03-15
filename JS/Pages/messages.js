import * as StudyGroupDatabase from '../Database/StudyGroupDatabase.js';

const groups = document.querySelector(".studyGroups").querySelector(".groups");
const ownedGroups = await StudyGroupDatabase.getAllOwnedStudyGroups();
const dateOptions = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
const daysOfWeek = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

if (!ownedGroups.length) {
    alert("There was an Error Getting your Owned Groups");
}

ownedGroups?.forEach((g) => createGroup(g));

function createGroup(groupInfo) {
    if (!groupInfo) {
        return;
    }
    const wrapper = groups.appendChild(document.createElement("div"));
    wrapper.classList.add("group");
    wrapper.innerHTML = `
        <h2> ${groupInfo.name} </h2>
        <p> ${groupInfo.course_number} </p>
        <p> ${groupInfo.description} </p>
    `
    wrapper.addEventListener('click', () => edit(groupInfo, false));
}

function edit(groupInfo, mode) {
    const wrapper = document.createElement("div");
    wrapper.classList.add("zoomedInGroup");
    if (!mode) {
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
            <div class="controls">
                <button class="edit"> Edit </button>
                <button class="close"> Cancel </button>
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

        wrapper.querySelector(".edit").addEventListener('click', async () => await edit(groupInfo, true));
    } else {
        document.body.lastChild.remove();
        console.log(groupInfo);
        const start_date = new Date(Date.parse(groupInfo.start_date));
        const end_date = new Date(Date.parse(groupInfo.end_date));
        const form = {
            name: groupInfo.name,
            course_number: groupInfo.course_number,
            start_date: start_date,
            end_date: end_date,
            is_public: groupInfo.is_public,
            meeting_times: [],
            description: groupInfo.description,
            school: groupInfo.school,
            max_participants: groupInfo.max_participants
        }

        wrapper.innerHTML = `
            <img src="./Images/close_button.png" class="close" />
            <div class="form">
                <h2> <input type="text" id="title" name="title" placeholder="${groupInfo.name}"> </h2>
                <p> Course Number: <input type="text" id="course_number" name="course_number" placeholder="${groupInfo.course_number}"></p>
                <div class="start_date"> Start Date:
                    <p class="start_weekday"> </p>
                    <select class="start_month"> </select>
                    <select class="start_day"> </select>
                </div>
                <div class="end_date">
                    <p> End Date: </p>
                    <p class="end_weekday"> </p>
                    <select class="end_month"> </select>
                    <select class="end_day"> </select>
                </div>
                <p> Is this a public group? <input type="checkbox" id="is_public" name="is_public" checked=${groupInfo.is_public}> </p>
                <p> Max Participants: <select class="max_participants"> </select> </p>
                <div class="times">
                    <div class="timeText">
                        <h4> Meeting Times: </h4>
                        <img src="./Images/add_button.png" class="addTime" />
                    </div>
                </div>
                <p> <input type="text" id="description" name="description" placeholder="${groupInfo.description}"> </p>
            </div>
            <div class="controls">
                <button class="save"> Save </button>
                <button class="close"> Cancel </button>
            </div> 
        `;

        wrapper.querySelector("#title").addEventListener('change', (e) => form.name = e.target.value);
        wrapper.querySelector("#course_number").addEventListener('change', (e) => form.course_number = e.target.value);
        wrapper.querySelector("#description").addEventListener('change', (e) => form.description = e.target.value);
        wrapper.querySelector("#is_public").addEventListener('change', (e) => form.is_public = e.target.checked);

        wrapper.querySelector(".max_participants").addEventListener('change', (e) => form.max_participants = e.target.value);

        wrapper.querySelector(".start_month").addEventListener('change', (e) => form.start_date.setMonth(e.target.value));
        wrapper.querySelector(".start_day").addEventListener('change', (e) => form.start_date.setDate(e.target.value));
        
        wrapper.querySelector(".end_month").addEventListener('change', (e) => form.end_date.setMonth(e.target.value));
        wrapper.querySelector(".end_day").addEventListener('change', (e) => form.end_date.setDate(e.target.value));

        for (let i = 1; i < 32; i++) {
            const startDay = wrapper.querySelector(".start_day").appendChild(document.createElement("option"));
            startDay.value = i;
            startDay.innerText = i;
            startDay.selected = i === start_date.getDate();
    
            const endDay = wrapper.querySelector(".end_day").appendChild(document.createElement("option"));
            endDay.value = i;
            endDay.innerText = i;
            endDay.selected = i === end_date.getDate();
        }

        for (let i = 0; i < months.length; i++) {
            const startMonth = wrapper.querySelector(".start_month").appendChild(document.createElement("option"));
            startMonth.value = i;
            startMonth.innerText = months[i];
            startMonth.selected = i === start_date.getMonth();

            const endMonth = wrapper.querySelector(".end_month").appendChild(document.createElement("option"));
            endMonth.value = i;
            endMonth.innerText = months[i];
            endMonth.selected = i === end_date.getMonth();
        }

        for (let i = 1; i < 9; i++) {
            const participants = wrapper.querySelector(".max_participants").appendChild(document.createElement("option"));
            participants.value = i;
            participants.innerText = i;
            participants.selected = i === groupInfo.max_participants;
        }

        groupInfo.meeting_times.forEach((mt) => form.meeting_times.push(addMeetingTime(wrapper, mt, form.meeting_times)));

        wrapper.querySelector(".addTime").addEventListener('click', () => form.meeting_times.push(addMeetingTime(wrapper, undefined, form.meeting_times)));

        wrapper.querySelector(".save").addEventListener("click", async () => {
            if (start_date.getTime() > end_date.getTime()) {
                alert("Start Date cannot be greater than End Date!");
                return;
            }

            if (form.name.length === 0) {
                alert("Cannot Find Name of Study Group");
                return;
            }

            if (form.meeting_times.length === 0) {
                alert("Cannot Find Meeting Times");
                return;
            }
            
            form.meeting_times.forEach((mt) => {
                mt.time = new Date(mt.dates[0].getTime());
                mt.day = mt.day ? mt.day : mt.dates[0].getDay();
                if (mt.day) {
                    console.log("Going Inside");
                    delete mt.dates;
                    mt.dates = [];

                    let mtDate = new Date(form.start_date.getTime());
                    mtDate.setHours(mt.time.getHours(), mt.time.getMinutes());
                    
                    let difference = +(mt.day) - mtDate.getDay();
                    if (difference < 0) {
                        difference += 7;
                    } 

                    mtDate.setDate(mtDate.getDate() + difference);
                    while (mtDate.getTime() < form.end_date.getTime()) {
                        mt.dates.push(new Date(mtDate.getTime()));
                        mtDate.setDate(mtDate.getDate() + 7);
                    }
                }
            });

            await StudyGroupDatabase.editStudyGroupById(groupInfo._id, form);
            document.body.lastChild.remove();
            document.body.querySelector(".screen").classList.toggle("blurry");
            location.reload();
        });

    }

    [...wrapper.querySelectorAll(".close")].forEach((e) => e.addEventListener('click', () => { 
        document.body.lastChild.remove();
        document.body.querySelector(".screen").classList.toggle("blurry"); 
    }));

    document.body.appendChild(wrapper);
}

function addMeetingTime(wrapper, mt, meeting_times) {
    const mtDay = mt?.dates[0] ? new Date(Date.parse(mt.dates[0])) : new Date();
    const mtDiv = wrapper.querySelector(".times").appendChild(document.createElement("div"));
    mtDiv.index = meeting_times.length;
    mtDiv.classList.add("mtDiv");

    const location = mtDiv.appendChild(document.createElement("input"));
    location.type = "text";
    location.id = "location";
    location.name = "location";
    location.placeholder = mt ? mt.location : "";

    location.addEventListener('change', (e) => meeting_times[mtDiv.index].location = e.target.value);

    const day = mtDiv.appendChild(document.createElement("select"));
    day.classList.add("day");
    day.addEventListener('change', (e) => meeting_times[mtDiv.index].day = e.target.value);

    for (let i = 0; i < daysOfWeek.length; i++) {
        const d = day.appendChild(document.createElement("option"));
        d.value = i;
        d.innerHTML = daysOfWeek[i];
        d.selected = i === mtDay.getDay();
    }

    const time = mtDiv.appendChild(document.createElement("div"));
    time.classList.add("time");

    const hour = time.appendChild(document.createElement("select"));
    hour.addEventListener('change', (e) => meeting_times[mtDiv.index].dates[0].setHours(e.target.value));

    time.appendChild(document.createElement("p")).innerText = ":";
    const min = time.appendChild(document.createElement("select"));
    min.addEventListener('change', (e) => meeting_times[mtDiv.index].dates[0].setMinutes(e.target.value));

    for (let i = 1; i < 24; i++) {
        const h = hour.appendChild(document.createElement("option"));
        h.value = i;
        h.text = i > 12 ? i - 12 : i;
        h.selected = i === mtDay.getHours();
    }

    for (let i = 0; i < 60; i += 5) {
        const m = min.appendChild(document.createElement("option"));
        m.value = i < 10 ? `0${i}` : `${i}`;
        m.innerHTML = i < 10 ? `0${i}` : i;
        m.selected = i === mtDay.getMinutes();
    }

    const remove = time.appendChild(document.createElement("img"));
    remove.src = './Images/remove_button.png';
    remove.classList.add("remove");
    remove.addEventListener('click', () => { 
        meeting_times.splice(location.index, 1);
        console.log(meeting_times);
        const divs = [...wrapper.querySelector(".times").getElementsByClassName("mtDiv")]
        divs[mtDiv.index].remove();
        divs.splice(mtDiv.index, 1);
        for (let i = 0; i < divs.length; i++) { 
            divs[i].index = i;
            console.log(divs[i], divs[i].index);
        }
    })


    return { dates: [mtDay], location: location.placeholder };
}