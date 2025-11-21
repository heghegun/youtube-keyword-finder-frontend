const searchBtn = document.getElementById("searchBtn");
const keywordInput = document.getElementById("keywordInput");
const filterInput = document.getElementById("filterInput");
const resultsDiv = document.getElementById("results");

const BACKEND_URL = "https://youtube-keyword-finder-backend.onrender.com";

let videoData = []; // menyimpan data untuk filter & sort

searchBtn.addEventListener("click", async () => {
  const keyword = keywordInput.value.trim();
  if (!keyword) return alert("Masukkan keyword terlebih dahulu");

  resultsDiv.innerHTML = "<p>Loading…</p>";

  try {
    const res = await fetch(`${BACKEND_URL}/api/keywords?query=${encodeURIComponent(keyword)}`);
    if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);
    const data = await res.json();

    if (!data.videos || data.videos.length === 0) {
      resultsDiv.innerHTML = "<p>No results found.</p>";
      return;
    }

    videoData = data.videos; // simpan data untuk interaksi selanjutnya
    renderTable(videoData);
  } catch (err) {
    resultsDiv.innerHTML = "<p>Error fetching data.</p>";
    console.error("Fetch error:", err);
  }
});

// Render tabel Excel-style
function renderTable(videos) {
  const tableHTML = `
    <table id="videoTable">
      <thead>
        <tr>
          <th data-key="index">#</th>
          <th data-key="title">Title</th>
          <th data-key="views">Views</th>
          <th data-key="likes">Likes</th>
          <th data-key="comments">Comments</th>
          <th data-key="channelTitle">Channel</th>
          <th data-key="subscribers">Subscribers</th>
          <th data-key="duration">Duration</th>
          <th data-key="publishedAt">Published At</th>
          <th>Link</th>
        </tr>
      </thead>
      <tbody>
        ${videos.map((video, idx) => {
          const highlight = video.views > 1000000 ? 'highlight' : ''; // highlight video >1M views
          return `<tr class="${highlight}">
            <td>${idx + 1}</td>
            <td>${video.title}</td>
            <td>${video.views}</td>
            <td>${video.likes}</td>
            <td>${video.comments}</td>
            <td>${video.channelTitle}</td>
            <td>${video.channelInfo?.subscribers || 'N/A'}</td>
            <td>${video.duration}</td>
            <td>${video.publishedAt.split('T')[0]}</td>
            <td><a href="https://www.youtube.com/watch?v=${video.videoId}" target="_blank">Watch</a></td>
          </tr>`;
        }).join('')}
      </tbody>
    </table>
  `;
  resultsDiv.innerHTML = tableHTML;

  addSorting(); // aktifkan sorting kolom
}

// Sorting kolom
function addSorting() {
  const headers = document.querySelectorAll("#videoTable th[data-key]");
  headers.forEach(header => {
    header.addEventListener("click", () => {
      const key = header.getAttribute("data-key");
      let sorted = [...videoData];

      if (key === 'title' || key === 'channelTitle' || key === 'duration' || key === 'publishedAt') {
        // sort string ascending
        sorted.sort((a,b) => a[key].localeCompare(b[key]));
      } else {
        // sort number descending
        sorted.sort((a,b) => (parseInt(b[key] || 0)) - (parseInt(a[key] || 0)));
      }

      renderTable(sorted);
    });
  });
}

// Filter by keyword/title/channel
filterInput.addEventListener("input", () => {
  const filter = filterInput.value.toLowerCase();
  const filtered = videoData.filter(v => 
    v.title.toLowerCase().includes(filter) || 
    v.channelTitle.toLowerCase().includes(filter)
  );
  renderTable(filtered);
});
