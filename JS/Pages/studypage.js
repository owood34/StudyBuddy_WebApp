const commonResults = [...document.body.getElementsByClassName("common")];
const searchbar = document.getElementById("search");
const urlParams = new URLSearchParams(window.location.search);
const didCommand = decodeURIComponent(urlParams.get("createGroup"));
console.log(didCommand);

document.getElementById("insert").addEventListener('click', () => createGroup());

commonResults.forEach(x => x.addEventListener('click', () => addCommonResult(x.innerText)));
searchbar.addEventListener('input', () => resize());

if (didCommand === "true") {
    createGroup();
}

function resize() {
    searchbar.style.width = `${searchbar.scrollWidth}px`;
}

function addCommonResult(text) {
    searchbar.value += `${text},`;
    searchbar.style.width = `${searchbar.scrollWidth}px`;
}

function createGroup() {
    document.body.querySelector(".content").classList.toggle("blurry");
    const createGroupWrapper = document.body.appendChild(document.createElement("div"));
    createGroupWrapper.classList.add("createStudyGroupPopup");
    const today = new Date();
    const weekAfter = new Date(today.setDate(today.getDate() + 7));

    createGroupWrapper.innerHTML = `
        <img src="./Images/close_button.png" class="close" />
        <h2> Create a Study Group </h2>
        <div class="form-group">
            <label for="name"> Study Group Name: </label>
            <input type="text" placeholder="What is the name of the study group?" id="name">
        </div>
        <div class="form-group">
            <label for="location"> Where is this Study Group taking place? </label>
            <input type="text" placeholder="Location" id="location">
        </div>
        <div class="form-group">
            <label for="className"> What class is this Study Group for? </label>
            <input type="text" placeholder="Class Name" id="className">
        </div>
        <div class="form-group">
            <label for="maxParticipants"> Max Participants in your Study Group? : </label>
            <select name="maxParticipants">
                <option value="6">  </option>
                <option value="1"> 1 </option>
                <option value="2"> 2 </option>
                <option value="3"> 3 </option>
                <option value="4"> 4 </option>
                <option value="5"> 5 </option>
                <option value="6"> 6 </option>
                <option value="7"> 7 </option>
                <option value="8"> 8 </option>
            </select>
        </div>
        <div class="form-group">
            <label for="className"> Does this class have a class number? </label>
            <input type="checkbox" id="classNum" name="hasClassNumber" value="true">
            <input type="text" placeholder="Class Name" class="checkBoxRequired">
        </div>
        <div class="form-group">
            <label for="groupType"> What class is this Study Group for? </label>
            <select name="groupType">
                <option value="public">  </option>
                <option value="public"> Public </option>
                <option value="private"> Private </option>
            </select>
        </div>
        <div class="form-group">
            <label for="startDate"> What day will your Study Group take place? </label>
            <input type="date" id="startDate" name="startDate"
                min="${today.getFullYear()}-${(convertTime(today.getMonth() + 1))}-${convertTime(today.getDate())}"
                max="${today.getFullYear()}-12-31">
        </div>
        <div class="form-group">
            <label for="weeklyDate"> Will your Study Group be a weekly accurance? </label>
            <input type="checkbox" id="weeklyDate" name="weeklyDate" value="true">
            <div class="checkBoxRequired" id="endDate">
                <label for="endDate"> When will your Study Group End? </label>
                <input type="date" id="endDate" name="endDate"
                    min="${weekAfter.getFullYear()}-${(convertTime(weekAfter.getMonth() + 1))}-${convertTime(weekAfter.getDate())}"
                    max="${weekAfter.getFullYear()}-12-31">
            </div>
        </div>
        <div class="form-group">
            <button class="create"> Create </button>
            <button class="close"> Close </button> 
        </div>
    `;

    [...createGroupWrapper.getElementsByClassName("close")].forEach(x => x.addEventListener('click', () => { 
        document.body.querySelector(".content").classList.toggle("blurry");
        [...document.body.getElementsByClassName("createStudyGroupPopup")][0].remove();
    }));

    createGroupWrapper.querySelector("#classNum").addEventListener('change', () => 
        createGroupWrapper.querySelector("#inputClassNum").style.visibility = 
            createGroupWrapper.querySelector("#classNum").checked ? 
                "visible" : "hidden");
}

function convertTime(time) {
    return (time < 10 ? `0${time}` : `${time}`);
}