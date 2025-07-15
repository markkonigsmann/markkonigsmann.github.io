function lerpColor(color1, color2, t) {
  const c1 = parseInt(color1.slice(1), 16);
  const c2 = parseInt(color2.slice(1), 16);

  const r1 = (c1 >> 16) & 0xff, g1 = (c1 >> 8) & 0xff, b1 = c1 & 0xff;
  const r2 = (c2 >> 16) & 0xff, g2 = (c2 >> 8) & 0xff, b2 = c2 & 0xff;

  const r = Math.round(r1 + (r2 - r1) * t);
  const g = Math.round(g1 + (g2 - g1) * t);
  const b = Math.round(b1 + (b2 - b1) * t);

  return `rgb(${r}, ${g}, ${b})`;
}

function setGradientByTime() {
  const now = new Date();
  const hour = now.getHours();
  const minute = now.getMinutes();
  const totalMinutes = hour * 60 + minute;
  const t = totalMinutes / (24 * 60); // [0, 1]

  let topStart, topEnd, bottomStart, bottomEnd, bandT;

  if (hour >= 5 && hour < 7) {
    // Dawn: soft yellow to light blue
    topStart = "#FFB347";  // orange
    topEnd = "#87CEFA";    // light blue
    bottomStart = "#FAD6A5";
    bottomEnd = "#AEE6FF";
    bandT = (hour * 60 + minute - 300) / 120;
  } else if (hour >= 7 && hour < 18) {
    // Day
    topStart = "#87CEFA";   // sky blue
    topEnd = "#0D1B2A";     // dark navy
    bottomStart = "#AEE6FF";
    bottomEnd = "#1B0036";
    bandT = (hour * 60 + minute - 420) / (11 * 60);
  } else if (hour >= 18 && hour < 20) {
    // Dusk: pink → indigo
    topStart = "#FF69B4"; // pink
    topEnd = "#4B0082";   // indigo
    bottomStart = "#FFA07A";
    bottomEnd = "#1B0036";
    bandT = (hour * 60 + minute - 1080) / 120;
  } else {
    // Night
    topStart = "#0D1B2A";
    topEnd = "#0D1B2A";
    bottomStart = "#1B0036";
    bottomEnd = "#1B0036";
    bandT = 0;
  }

  const topColor = lerpColor(topStart, topEnd, bandT);
  const bottomColor = lerpColor(bottomStart, bottomEnd, bandT);

  document.body.style.background = `linear-gradient(to bottom, ${topColor}, ${bottomColor})`;

  handleStars(hour);
  handleAurora(hour);
  handleClouds(hour);
  updateTextColors(hour, minute);
}


function handleStars(hour) {
  const isNight = hour >= 20 || hour < 5;

  let starLayer = document.getElementById("star-layer");

  if (!starLayer) {
    starLayer = document.createElement("div");
    starLayer.id = "star-layer";
    document.body.appendChild(starLayer);
  }

  if (isNight) {
    starLayer.style.display = "block";
    generateStars(starLayer, 100); // number of stars
  } else {
    starLayer.style.display = "none";
  }
}

function generateStars(container, count) {
  container.innerHTML = "";
  for (let i = 0; i < count; i++) {
    const star = document.createElement("div");
    star.className = "star";

    const size = Math.random() * 2 + 1;
    const top = Math.random() * 60; // only top 60% of the screen
    const left = Math.random() * 100;
    const opacity = 1 - top / 60 * 5; // denser at top, fades lower

    star.style.width = `${size}px`;
    star.style.height = `${size}px`;
    star.style.top = `${top}vh`;
    star.style.left = `${left}vw`;
    star.style.opacity = opacity.toFixed(2);
    container.appendChild(star);
  }
}

setGradientByTime();
setInterval(setGradientByTime, 10 * 60 * 1000);


function handleAurora(hour) {
  const isNight = hour >= 20 || hour < 5;

  let auroraLayer = document.getElementById("aurora-layer");

  if (!auroraLayer) {
    auroraLayer = document.createElement("div");
    auroraLayer.id = "aurora-layer";
    document.body.appendChild(auroraLayer);

    const aurora = document.createElement("div");
    aurora.className = "aurora";
    auroraLayer.appendChild(aurora);
  }

  auroraLayer.style.display = isNight ? "block" : "none";
}

function handleClouds(hour) {
  const isDay = hour >= 7 && hour < 18;

  let cloudLayer = document.getElementById("cloud-layer");

  if (!cloudLayer) {
    cloudLayer = document.createElement("div");
    cloudLayer.id = "cloud-layer";

    const cloud = document.createElement("div");
    cloud.className = "cloud";
    cloudLayer.appendChild(cloud);

    document.body.appendChild(cloudLayer);
  }

  cloudLayer.style.display = isDay ? "block" : "none";
}

function updateTextColors(hour, minute) {
  const totalMinutes = hour * 60 + minute;
  const t = totalMinutes / (24 * 60);

  // Day → Night colors
  const dayText = "#100000";  // almost black
  const nightText = "#eeeeee"; // soft white

  const dayAccent = "#333333";
  const nightAccent = "#cccccc";

  const primary = lerpColor(dayText, nightText, t);
  const accent = lerpColor(dayAccent, nightAccent, t);

  document.documentElement.style.setProperty("--text-primary", primary);
  document.documentElement.style.setProperty("--text-accent", accent);
}
