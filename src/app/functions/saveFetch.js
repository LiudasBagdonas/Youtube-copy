
function saveFetch(data) {

    fetch("http://localhost:8080/youtubeAPI/save", {
        method: "POST",
        headers: { 'Content-Type': 'application/json', },
        body: JSON.stringify(data),
    })
        .then((res) => res.json())
}

export default saveFetch;