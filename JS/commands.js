window.addEventListener('keypress', (e) => {
    if (e.shiftKey) {
        if (e.key === "G") {
            close();
            open("studypage.html?createGroup=true");
        }
    }
});