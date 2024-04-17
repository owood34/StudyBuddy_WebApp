window.addEventListener('keypress', (e) => {
    if (e.ctrlKey) {
        console.log("here");
        if (e.key === "G") {
            location.href = "studypage.html?createGroup=true";
        }
    }
});