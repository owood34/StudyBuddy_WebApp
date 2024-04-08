window.addEventListener('keypress', (e) => {
    if (e.ctrlKey) {
        if (e.key === "G") {
            location.href = "studypage.html?createGroup=true";
        }
    }
});