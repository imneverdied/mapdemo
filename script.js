// Sample events data
var eventsData = [];
// 新增 populateRegions 函數
function populateRegions() {
  const regionSelect = document.getElementById('region');
  const regions = new Set(eventsData.map((event) => event.region));

  regions.forEach((region) => {
    const option = document.createElement('option');
    option.value = region;
    option.text = region;
    regionSelect.add(option);
  });
}

// 新增 populateEvents 函數
function populateEvents() {
  const eventSelect = document.getElementById('event');
  const events = new Set(eventsData.map((event) => event.name));

  events.forEach((event) => {
    const option = document.createElement('option');
    option.value = event;
    option.text = event;
    eventSelect.add(option);
  });
}
function import_from_excel() {
  const fileInput = document.createElement('input');
  fileInput.type = 'file';
  fileInput.accept = '.xlsx, .xls';

  fileInput.addEventListener('change', () => {
    const file = fileInput.files[0];
    const reader = new FileReader();

    reader.onload = (e) => {
      const data = e.target.result;
      const workbook = XLSX.read(data, { type: 'binary' });
      const sheetName = workbook.SheetNames[0];
      const worksheet = workbook.Sheets[sheetName];
      const jsonData = XLSX.utils.sheet_to_json(worksheet, { header: 1 });

      // 清空地區下拉選單
      const regionSelect = document.getElementById('region');
      regionSelect.innerHTML = '<option value="">全區</option>';

      // 清空議題下拉選單
      const eventSelect = document.getElementById('event');
      eventSelect.innerHTML = '<option value="">全部議題</option>';

      eventsData = jsonData.slice(1).map((row) => {
        return {
          name: row[0],
          event: row[1],
          region: row[2],
          status: row[3],
          lat: parseFloat(row[4]),
          lng: parseFloat(row[5]),
          date: row[6],
        };
      });

      populateRegions();
      populateEvents();
      addMarkers();
    };

    reader.readAsBinaryString(file);
  });

  fileInput.click();
}

fetch('events.json')
  .then((response) => response.json())
  .then((data) => {
    eventsData = data;
    console.log(eventsData);

    // 呼叫 populateRegions 和 populateEvents 函數
    populateRegions();
    populateEvents();
  })
  .catch((error) => {
    console.error('載入JSON檔案時發生錯誤:', error);
  });

// Initialize map
var map = L.map('map', {
  zoomControl: false, // 關閉 Zoom In 和 Zoom Out 按鈕
}).setView([24.9937, 121.2967], 13); // Taoyuan center coordinates

L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
  maxZoom: 19,
}).addTo(map);

// Function to add markers to map
// Function to add markers to map
function addMarkers() {
  // Clear existing markers
  map.eachLayer(function (layer) {
    if (layer instanceof L.Marker) {
      map.removeLayer(layer);
    }
  });

  // Filter events based on user selection
  var filteredEvents = eventsData.filter(function (event) {
    var regionFilter = document.getElementById('region').value;
    var eventFilter = document.getElementById('event').value;
    var statusFilter = document.getElementById('status').value;
    var startDateFilter = document.getElementById('startDate').value;
    var endDateFilter = document.getElementById('endDate').value;

    return (
      (regionFilter === '' || event.region === regionFilter) &&
      (eventFilter === '' || event.name === eventFilter) &&
      (statusFilter === '' || event.status === statusFilter) &&
      (startDateFilter === '' || event.date >= startDateFilter) &&
      (endDateFilter === '' || event.date <= endDateFilter)
    );
  });

  // Add markers for filtered events
  filteredEvents.forEach(function (event) {
    var marker = L.marker([event.lat, event.lng]).addTo(map);
    var popupContent = '<div><p>' + event.name + '</br>' + event.status;
    ('</p><button id="showImageBtn">紀錄</button></div>');
    marker.bindPopup(popupContent);

    // Add event listener to the button inside popup
    marker.on('popupopen', function () {
      document
        .getElementById('showImageBtn')
        .addEventListener('click', function () {
          // Create a large popup window to display the image
          var imageUrl = '前台事件紀錄.png'; // 替換為你的圖片 URL
          var imagePopup = L.popup().setContent(
            '<img src="' + imageUrl + '" style="width: 800px; height: auto;"/>'
          ); // 設置圖片寬度為 400px，高度自動調整
          marker.bindPopup(imagePopup).openPopup();
        });
    });
  });
}
// Initial markers
addMarkers();
// Event listeners for filtering
document.getElementById('region').addEventListener('change', addMarkers);
document.getElementById('event').addEventListener('change', addMarkers);
document.getElementById('status').addEventListener('change', addMarkers);
document.getElementById('startDate').addEventListener('change', addMarkers);
document.getElementById('endDate').addEventListener('change', addMarkers);

window.onload = function () {
  addMarkers(); //等待整體載入完成刷新一次
};
