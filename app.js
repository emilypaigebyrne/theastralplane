const map = L.map("map").setView([33.6146, -85.8349], 6);

L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
  maxZoom: 19,
  attribution: "&copy; OpenStreetMap contributors"
}).addTo(map);

let allAircraft = [];

const planeIcon = L.divIcon({
  html: "🛩️",
  className: "plane-marker",
  iconSize: [32, 32],
  iconAnchor: [16, 16],
  popupAnchor: [0, -16],
});

const aircraftCountEl = document.getElementById("aircraft-count");
const lastRefreshEl = document.getElementById("last-refresh");
const aircraftDetailsEl = document.getElementById("aircraft-details");
const refreshButton = document.getElementById("refresh-button");
const callsignFilterEl = document.getElementById("callsign-filter");
const applyFilterButton = document.getElementById("apply-filter-button");
const clearFilterButton = document.getElementById("clear-filter-button");

let markers = [];

function clearMarkers() {
  markers.forEach(marker => map.removeLayer(marker));
  markers = [];
}

function formatValue(value, fallback = "N/A") {
  return value !== undefined && value !== null && value !== "" ? value : fallback;
}

function renderAircraftDetails(aircraft) {
  const callsign = formatValue(aircraft.callsign, "Unknown Flight");
const altitude = formatValue(aircraft.altitude, "Unknown");
const speed = formatValue(aircraft.velocity, "Unknown");
const country = formatValue(aircraft.origin_country, "Unknown");
const location = formatValue(aircraft.location, "Unknown");
  aircraftDetailsEl.innerHTML = `
  <div class="detail-card">
    <p class="detail-label">Selected Aircraft</p>
    <h2 class="aircraft-callsign">${callsign}</h2>

    <div class="detail-row">
      <span class="detail-label">Altitude</span>
      <span class="detail-value">${altitude} ft</span>
    </div>

    <div class="detail-row">
      <span class="detail-label">Speed</span>
      <span class="detail-value">${speed} knots</span>
    </div>

    <div class="detail-row">
      <span class="detail-label">Country</span>
      <span class="detail-value">${country}</span>
    </div>

    <div class="detail-row">
      <span class="detail-label">Location</span>
      <span class="detail-value">${location}</span>
    </div>
  </div>
`;
}

function addAircraftToMap(aircraftList) {
  clearMarkers();

  aircraftList.forEach(aircraft => {
    if (
      typeof aircraft.latitude !== "number" ||
      typeof aircraft.longitude !== "number"
    ) {
      return;
    }

    const heading = aircraft.heading ?? 0;
    const rotation = heading - 45;

    const rotatedPlaneIcon = L.divIcon({
      className: "plane-marker",
      html: `
        <div style="transform: rotate(${rotation}deg);">
          ✈️
        </div>
      `,
      iconSize: [30, 30],
      iconAnchor: [15, 15],
    });

    const marker = L.marker([aircraft.latitude, aircraft.longitude], {
      icon: rotatedPlaneIcon,
    }).addTo(map);

    marker.bindPopup(`
      <strong>${formatValue(aircraft.callsign, "Unknown Flight")}</strong><br>
      Altitude: ${formatValue(aircraft.altitude)} ft<br>
      Speed: ${formatValue(aircraft.velocity)} knots<br>
      Heading: ${formatValue(aircraft.heading)}°
    `);

    marker.on("click", () => {
      renderAircraftDetails(aircraft);
    });

    markers.push(marker);
  });

  aircraftCountEl.textContent = markers.length.toString();
  lastRefreshEl.textContent = new Date().toLocaleTimeString();
}

refreshButton.addEventListener("click", () => {
  loadSampleData();
});

async function loadSampleData() {
  try {
    const response = await fetch("./data/sample-aircraft.json");

    if (!response.ok) {
      throw new Error(`HTTP error: ${response.status}`);
    }

    const aircraftList = await response.json();

allAircraft = aircraftList;

addAircraftToMap(allAircraft);
  } catch (error) {
    console.error("Failed to load aircraft data:", error);
    aircraftDetailsEl.innerHTML = `
      <p style="color: red;">
        Could not load aircraft data. Check the console for details.
      </p>
    `;
  }
  function applyCallsignFilter() {
  const filterValue = callsignFilterEl.value.trim().toLowerCase();

  const filteredAircraft = allAircraft.filter((aircraft) => {
    const callsign = String(aircraft.callsign ?? "").toLowerCase();

    return callsign.includes(filterValue);
  });

  addAircraftToMap(filteredAircraft);
}
applyFilterButton.addEventListener("click", () => {
  applyCallsignFilter();
});

clearFilterButton.addEventListener("click", () => {
  callsignFilterEl.value = "";
  addAircraftToMap(allAircraft);
});
}

loadSampleData();