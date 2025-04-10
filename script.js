let map = L.map('map').setView([25.37, 85.13], 6);
L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png').addTo(map);
let marker;

function updateMap() {
  const lat = parseFloat(document.getElementById("latitude").value);
  const lon = parseFloat(document.getElementById("longitude").value);
  if (!isNaN(lat) && !isNaN(lon)) {
    if (marker) map.removeLayer(marker);
    marker = L.marker([lat, lon]).addTo(map).bindPopup("Sample Location").openPopup();
    map.setView([lat, lon], 12);
  }
}

function calculateWQI() {
  const data = {
    ph: +document.getElementById("ph").value,
    tds: +document.getElementById("tds").value,
    tss: +document.getElementById("tss").value,
    bod: +document.getElementById("bod").value,
    fluoride: +document.getElementById("fluoride").value,
    nitrate: +document.getElementById("nitrate").value,
    chloride: +document.getElementById("chloride").value,
    alkalinity: +document.getElementById("alkalinity").value,
    hardness: +document.getElementById("hardness").value
  };

  const bisLimits = {
    ph: 6.5, tds: 500, tss: 100, bod: 3,
    fluoride: 1, nitrate: 45, chloride: 250,
    alkalinity: 200, hardness: 300
  };

  let total = 0, count = 0;

  for (let param in bisLimits) {
    if (!isNaN(data[param]) && data[param] !== 0) {
      let q = (data[param] / bisLimits[param]) * 100;
      if (q > 100) q = 100;
      total += q;
      count++;
    }
  }

  const wqi = count > 0 ? (total / count).toFixed(2) : "0.00";
  let status = "Excellent";
  if (wqi > 50 && wqi <= 100) status = "Good";
  else if (wqi > 100 && wqi <= 200) status = "Poor";
  else if (wqi > 200 && wqi <= 300) status = "Very Poor";
  else if (wqi > 300) status = "Unsuitable";

  document.getElementById("wqi").value = wqi;
  document.getElementById("status").value = status;
}

function exportPDF() {
  const { jsPDF } = window.jspdf;
  const doc = new jsPDF();

  const station = document.getElementById("station").value;
  const substation = document.getElementById("substation").value;
  const lat = document.getElementById("latitude").value;
  const lon = document.getElementById("longitude").value;
  const wqi = document.getElementById("wqi").value;
  const status = document.getElementById("status").value;

  doc.setFontSize(16);
  doc.text("Water Quality Index Report", 70, 20);
  doc.setFontSize(12);
  doc.text(`Station: ${station}`, 20, 40);
  doc.text(`Sub-Station: ${substation}`, 20, 50);
  doc.text(`Latitude: ${lat}`, 20, 60);
  doc.text(`Longitude: ${lon}`, 20, 70);
  doc.text(`WQI: ${wqi}`, 20, 90);
  doc.text(`Status: ${status}`, 20, 100);

  doc.save("Water_Quality_Report.pdf");
}
