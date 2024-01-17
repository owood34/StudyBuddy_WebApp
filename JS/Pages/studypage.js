const commonResults = [...document.body.getElementsByClassName("common")];
const searchbar = document.getElementById("search");
commonResults.forEach(x => x.addEventListener('click', () => addCommonResult(x.innerText)));
searchbar.addEventListener('input', () => resize());

function resize() {
    searchbar.style.width = `${searchbar.scrollWidth}px`;
}

function addCommonResult(text) {
    searchbar.value += `${text},`;
    searchbar.style.width = `${searchbar.scrollWidth}px`;
}