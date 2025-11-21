const searchBtn = document.getElementById("searchBtn");
const keywordInput = document.getElementById("keywordInput");
const resultsDiv = document.getElementById("results");

// URL backend Render
const BACKEND_URL = "https://youtube-keyword-finder-backend.onrender.com";

searchBtn.addEventListener("click", async () => {
  const keyword = keywordInput.value.trim();
  if (!keyword) {
    return alert("Masukkan keyword terlebih dahulu");
  }

  resultsDiv.innerHTML = "<p>Loading…</p>";

  try {
    const res = await fetch(`${BACKEND_URL}/api/keywords?query=${encodeURIComponent(keyword)}`);

    if (!res.ok) {
      throw new Error(`HTTP error! status: ${res.status}`);
    }

    const data = await res.json();

    if (!data.videos || data.videos.length === 0) {
      resultsDiv.innerHTML = "<p>No results found.</p>";
    } else {
      resultsDiv.innerHTML = data.videos
        .map(video => `
          <div class="video-card">
            <img src="${video.thumbnail}" alt="thumbnail">
            <div class="video-info">
              <h3>${video.title}</h3>
              <p>Views: ${video.views} | Likes: ${video.likes} | Comments: ${video.comments}</p>
              <p>Channel: ${video.channelTitle} | Subscribers: ${video.channelInfo?.subscribers || 'N/A'}</p>
              <a href="https://www.youtube.com/watch?v=${video.videoId}" target="_blank">Watch on YouTube</a>
            </div>
          </div>
        `)
        .join("");
    }
  } catch (err) {
    resultsDiv.innerHTML = "<p>Error fetching data.</p>";
    console.error("Fetch error:", err);
  }
});