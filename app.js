const searchBtn = document.getElementById("searchBtn");
const keywordInput = document.getElementById("keywordInput");
const resultsDiv = document.getElementById("results");

const BACKEND_URL = "https://youtube-keyword-finder-backend.onrender.com/"; // ganti dengan URL Render nanti

searchBtn.addEventListener("click", async () => {
  const keyword = keywordInput.value.trim();
  if (!keyword) return alert("Masukkan keyword");

  resultsDiv.innerHTML = "Loading...";

  try {
    const res = await fetch(`${BACKEND_URL}/api/keywords?query=${keyword}`);
    const data = await res.json();

    resultsDiv.innerHTML = data.items
      .map(item => `<p>${item.snippet.title}</p>`)
      .join("");
  } catch (err) {
    resultsDiv.innerHTML = "Error fetching data";
    console.error(err);
  }
});
