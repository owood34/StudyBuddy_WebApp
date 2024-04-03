window.addEventListener('keypress', (e) => {
    if (e.shiftKey) {
        if (e.key === "G") {
            location.href = "studypage.html?createGroup=true&id=undefined";
        }
    }
});