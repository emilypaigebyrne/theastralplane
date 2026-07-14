const map = L.map("map").setView([33.6146, -85.8349], 6);

L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
  maxZoom: 19,
  attribution: "&copy; OpenStreetMap contributors"
}).addTo(map);

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

let markers = [];

function clearMarkers() {
  markers.forEach(marker => map.removeLayer(marker));
  markers = [];
}

function formatValue(value, fallback = "N/A") {
  return value !== undefined && value !== null && value !== "" ? value : fallback;
}

function renderAircraftDetails(aircraft) {
  aircraftDetailsEl.innerHTML = `
    <div class="detail-card">
      <p><strong>Call Sign:</strong> ${formatValue(aircraft.callsign)}</p>
      <p><strong>ICAO24:</strong> ${formatValue(aircraft.icao24)}</p>
      <p><strong>Latitude:</strong> ${formatValue(aircraft.latitude)}</p>
      <p><strong>Longitude:</strong> ${formatValue(aircraft.longitude)}</p>
      <p><strong>Altitude:</strong> ${formatValue(aircraft.altitude)} ft</p>
      <p><strong>Velocity:</strong> ${formatValue(aircraft.velocity)} knots</p>
      <p><strong>Origin Country:</strong> ${formatValue(aircraft.origin_country)}</p>
      <p>Heading: ${aircraft.heading}°</p>
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

    const marker = L.marker([aircraft.latitude, aircraft.longitude], {
      icon: planeIcon,
    }).addTo(map);

    marker.bindPopup(`
      <strong>${formatValue(aircraft.callsign, "Unknown Flight")}</strong><br>
      Altitude: ${formatValue(aircraft.altitude)} ft<br>
      Speed: ${formatValue(aircraft.velocity)} knots
      Heading: ${aircraft.heading}°
    `);

    marker.on("click", () => {
      renderAircraftDetails(aircraft);
    });

    markers.push(marker);
  });

  aircraftCountEl.textContent = markers.length.toString();
  lastRefreshEl.textContent = new Date().toLocaleTimeString();
}

async function loadSampleData() {
  try {
    const response = await fetch("./data/sample-aircraft.json");

    if (!response.ok) {
      throw new Error(`HTTP error: ${response.status}`);
    }

    const aircraftList = await response.json();
    addAircraftToMap(aircraftList);
  } catch (error) {
    console.error("Failed to load aircraft data:", error);
    aircraftDetailsEl.innerHTML = `
      <p style="color: red;">
        Could not load aircraft data. Check the console for details.
      </p>
    `;
  }
}

loadSampleData();