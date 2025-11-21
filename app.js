const searchBtn = document.getElementById("searchBtn");
const keywordInput = document.getElementById("keywordInput");
const resultsDiv = document.getElementById("results");

const BACKEND_URL = "https://youtube-keyword-finder-backend.onrender.com";

searchBtn.addEventListener("click", async () => {
  const keyword = keywordInput.value.trim();
  if (!keyword) {
    return alert("Masukkan keyword terlebih dahulu");
  }

  resultsDiv.innerHTML = "<p>Loading…</p>";

  try {
    const res = await fetch(`${BACKEND_URL}/api/keywords?query=${encodeURIComponent(keyword)}`);
    if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);

    const data = await res.json();

    if (!data.videos || data.videos.length === 0) {
      resultsDiv.innerHTML = "<p>No results found.</p>";
      return;
    }

    // Buat tabel Excel-style
    let tableHTML = `
      <table>
        <thead>
          <tr>
            <th>#</th>
            <th>Title</th>
            <th>Views</th>
            <th>Likes</th>
            <th>Comments</th>
            <th>Channel</th>
            <th>Subscribers</th>
            <th>Duration</th>
            <th>Published At</th>
            <th>Link</th>
          </tr>
        </thead>
        <tbody>
          ${data.videos.map((video, index) => `
            <tr>
              <td>${index + 1}</td>
              <td>${video.title}</td>
              <td>${video.views}</td>
              <td>${video.likes}</td>
              <td>${video.comments}</td>
              <td>${video.channelTitle}</td>
              <td>${video.channelInfo?.subscribers || 'N/A'}</td>
              <td>${video.duration}</td>
              <td>${video.publishedAt.split('T')[0]}</td>
              <td><a href="https://www.youtube.com/watch?v=${video.videoId}" target="_blank">Watch</a></td>
            </tr>
          `).join('')}
        </tbody>
      </table>
    `;

    resultsDiv.innerHTML = tableHTML;

  } catch (err) {
    resultsDiv.innerHTML = "<p>Error fetching data.</p>";
    console.error("Fetch error:", err);
  }
});
