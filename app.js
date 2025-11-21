const searchBtn = document.getElementById("searchBtn");
const keywordInput = document.getElementById("keywordInput");
const resultsDiv = document.getElementById("results");

// Gunakan environment variable dari Netlify
const BACKEND_URL = process.env.REACT_APP_BACKEND_URL; // pastikan sudah ditambahkan di Netlify

searchBtn.addEventListener("click", async () => {
  const keyword = keywordInput.value.trim();
  if (!keyword) {
    return alert("Masukkan keyword terlebih dahulu");
  }

  resultsDiv.innerHTML = "Loading…";

  try {
    const res = await fetch(`${BACKEND_URL}/api/keywords?query=${encodeURIComponent(keyword)}`);

    if (!res.ok) {
      throw new Error(`HTTP error! status: ${res.status}`);
    }

    const data = await res.json();

    if (!data.items || data.items.length === 0) {
      resultsDiv.innerHTML = "<p>No results found.</p>";
    } else {
      resultsDiv.innerHTML = data.items
        .map(item => `<p>${item.snippet?.title || "No title"}</p>`)
        .join("");
    }
  } catch (err) {
    resultsDiv.innerHTML = "Error fetching data.";
    console.error("Fetch error:", err);
  }
});
