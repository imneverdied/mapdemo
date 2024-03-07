// 模擬地圖數據
const mapData = [
  {
    region: 'north',
    event: 'event1',
    date: '2024-03-01',
    lat: 25.0392,
    lng: 121.525,
  },
  {
    region: 'south',
    event: 'event2',
    date: '2024-03-02',
    lat: 22.6206,
    lng: 120.312,
  },
  {
    region: 'east',
    event: 'event3',
    date: '2024-03-03',
    lat: 23.9868,
    lng: 121.628,
  },
  // 更多數據...
];

// 初始化地圖
const map = L.map('map').setView([23.6978, 120.9605], 7);

L.tileLayer('https://{s}.tile.openstreetmap.tw/{z}/{x}/{y}.png', {
  attribution:
    '&copy; <a href="https://www.openstreetmap.org">OpenStreetMap Taiwan</a>',
  maxZoom: 18,
}).addTo(map);

// 在地圖上加上標記
mapData.forEach((data) => {
  L.marker([data.lat, data.lng])
    .addTo(map)
    .bindPopup(`${data.region} - ${data.event}`);
});

// 篩選數據
function filterData() {
  // 篩選邏輯
}

// 監聽篩選器更改
document.getElementById('region').addEventListener('change', filterData);
document.getElementById('event').addEventListener('change', filterData);
document.getElementById('start-date').addEventListener('change', filterData);
document.getElementById('end-date').addEventListener('change', filterData);
