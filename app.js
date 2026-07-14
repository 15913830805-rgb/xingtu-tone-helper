const fileInput = document.querySelector("#fileInput");
const dropzone = document.querySelector("#dropzone");
const previewWrap = document.querySelector("#previewWrap");
const previewCanvas = document.querySelector("#previewCanvas");
const resultPreview = document.querySelector("#resultPreview");
const beforeCanvas = document.querySelector("#beforeCanvas");
const afterCanvas = document.querySelector("#afterCanvas");
const styleSamples = document.querySelector("#styleSamples");
const sampleGrid = document.querySelector("#sampleGrid");
const imageInfo = document.querySelector("#imageInfo");
const sceneSelect = document.querySelector("#sceneSelect");
const styleSelect = document.querySelector("#styleSelect");
const strengthRange = document.querySelector("#strengthRange");
const resultTitle = document.querySelector("#resultTitle");
const analysisCards = document.querySelector("#analysisCards");
const recipeList = document.querySelector("#recipeList");
const searchTags = document.querySelector("#searchTags");
const searchXhs = document.querySelector("#searchXhs");
const searchDouyin = document.querySelector("#searchDouyin");
const searchWeb = document.querySelector("#searchWeb");
const resetBtn = document.querySelector("#resetBtn");
const sampleBtn = document.querySelector("#sampleBtn");
const recipeTemplate = document.querySelector("#recipeTemplate");

let currentImage = null;
let currentStats = null;

const baseRecipes = {
  cream: {
    name: "濂舵补鑳剁墖",
    note: "閫傚悎浜哄儚銆佸挅鍟″簵銆侀槾澶╁鍐咃紝鑲よ壊鏌斿拰涓嶈剰銆?,
    scene: ["portrait", "food", "city"],
    params: {
      浜害: 6,
      瀵规瘮搴? -12,
      楗卞拰搴? -6,
      閿愬寲: 12,
      缁撴瀯: -8,
      楂樺厜: -22,
      闃村奖: 18,
      鑹叉俯: 8,
      鑹茶皟: 3,
      瑜壊: 18,
      棰楃矑: 12,
      鏆楄: 8,
    },
  },
  clean: {
    name: "娓呴€忓喎鐧?,
    note: "閫傚悎鑷媿銆佺櫧澧欍€佽摑澶╋紝鐢婚潰骞插噣鍋忎寒銆?,
    scene: ["portrait", "landscape"],
    params: {
      浜害: 12,
      瀵规瘮搴? -6,
      楗卞拰搴? -4,
      閿愬寲: 18,
      缁撴瀯: 4,
      楂樺厜: -18,
      闃村奖: 22,
      鑹叉俯: -8,
      鑹茶皟: 5,
      瑜壊: 6,
      棰楃矑: 0,
      鏆楄: 0,
    },
  },
  japan: {
    name: "鏃ョ郴閫氶€?,
    note: "閫傚悎鏃呰銆佽鎷嶃€佽嚜鐒跺厜锛岄鑹茶交浣嗕笉鐏般€?,
    scene: ["landscape", "city", "portrait"],
    params: {
      浜害: 10,
      瀵规瘮搴? -10,
      楗卞拰搴? 8,
      閿愬寲: 10,
      缁撴瀯: -4,
      楂樺厜: -28,
      闃村奖: 26,
      鑹叉俯: 4,
      鑹茶皟: -2,
      瑜壊: 10,
      棰楃矑: 5,
      鏆楄: 0,
    },
  },
  night: {
    name: "澶滄櫙姘涘洿",
    note: "閫傚悎璺伅銆佽溅娴併€侀洦澶滐紝鍘嬩綇楂樺厜锛屼繚鐣欑伅鍏夊眰娆°€?,
    scene: ["night", "city"],
    params: {
      浜害: -4,
      瀵规瘮搴? 16,
      楗卞拰搴? 10,
      閿愬寲: 22,
      缁撴瀯: 12,
      楂樺厜: -42,
      闃村奖: 8,
      鑹叉俯: -6,
      鑹茶皟: 4,
      瑜壊: 4,
      棰楃矑: 10,
      鏆楄: 18,
    },
  },
  food: {
    name: "椋熺墿鏆栬皟",
    note: "閫傚悎鐢滃搧銆佺伀閿呫€佸挅鍟★紝鎻愰娆蹭絾涓嶈繃榛勩€?,
    scene: ["food"],
    params: {
      浜害: 8,
      瀵规瘮搴? 8,
      楗卞拰搴? 14,
      閿愬寲: 16,
      缁撴瀯: 8,
      楂樺厜: -14,
      闃村奖: 14,
      鑹叉俯: 10,
      鑹茶皟: -2,
      瑜壊: 0,
      棰楃矑: 0,
      鏆楄: 4,
    },
  },
};

const tagsByStyle = {
  cream: ["閱掑浘 濂舵补鑳剁墖 鍙傛暟", "灏忕孩涔?鍚屾濂舵补鎰熻皟鑹?, "鎶栭煶 姘涘洿鎰熻皟鑹?閱掑浘"],
  clean: ["閱掑浘 娓呴€忓喎鐧?鍙傛暟", "鑷媿鍐风櫧鐨皟鑹?, "灏忕孩涔?閫氶€忔劅淇浘"],
  japan: ["閱掑浘 鏃ョ郴閫氶€?鍙傛暟", "鏃呰鐓х墖閱掑浘璋冭壊", "灏忕孩涔?鏃ョ郴鑳剁墖鍙傛暟"],
  night: ["閱掑浘 澶滄櫙姘涘洿 鍙傛暟", "闆ㄥ鐏厜璋冭壊鏁欑▼", "鎶栭煶 澶滄櫙鐢靛奖鎰熻皟鑹?],
  food: ["閱掑浘 椋熺墿璋冭壊 鍙傛暟", "鎺㈠簵鐓х墖閱掑浘鍙傛暟", "灏忕孩涔?缇庨鏆栬皟婊ら暅"],
};

function clamp(value, min = -100, max = 100) {
  return Math.max(min, Math.min(max, Math.round(value)));
}

function formatValue(value) {
  return value > 0 ? `+${value}` : String(value);
}

function loadFile(file) {
  if (!file || !file.type.startsWith("image/")) return;
  const img = new Image();
  img.onload = () => loadImageElement(img);
  img.src = URL.createObjectURL(file);
}

function renderPreview(img) {
  const ratio = img.width / img.height;
  const targetW = ratio >= 1 ? 960 : 720;
  const targetH = Math.round(targetW / ratio);
  previewCanvas.width = targetW;
  previewCanvas.height = targetH;
  const ctx = previewCanvas.getContext("2d");
  ctx.clearRect(0, 0, targetW, targetH);
  ctx.drawImage(img, 0, 0, targetW, targetH);
  previewWrap.classList.remove("hidden");
  dropzone.classList.add("hidden");
  sampleBtn.classList.add("hidden");
  imageInfo.textContent = `${img.width}脳${img.height}锛屽凡瀹屾垚鏈湴鍙栨牱鍒嗘瀽`;
}

function loadImageElement(img) {
  currentImage = img;
  renderPreview(img);
  currentStats = analyzeImage(img);
  updateResults();
}

function useSampleImage() {
  const canvas = document.createElement("canvas");
  canvas.width = 900;
  canvas.height = 1200;
  const ctx = canvas.getContext("2d");
  const sky = ctx.createLinearGradient(0, 0, 0, canvas.height);
  sky.addColorStop(0, "#e9c189");
  sky.addColorStop(0.46, "#657d84");
  sky.addColorStop(1, "#18202a");
  ctx.fillStyle = sky;
  ctx.fillRect(0, 0, canvas.width, canvas.height);
  ctx.fillStyle = "rgba(255,210,130,.32)";
  ctx.beginPath();
  ctx.arc(710, 180, 120, 0, Math.PI * 2);
  ctx.fill();
  ctx.fillStyle = "#24313a";
  ctx.fillRect(0, 760, canvas.width, 440);
  ctx.fillStyle = "#d09a74";
  ctx.beginPath();
  ctx.arc(450, 470, 118, 0, Math.PI * 2);
  ctx.fill();
  ctx.fillStyle = "#2b2527";
  ctx.beginPath();
  ctx.arc(450, 430, 125, Math.PI, Math.PI * 2);
  ctx.fill();
  ctx.fillStyle = "#cab9a2";
  ctx.fillRect(330, 590, 240, 280);
  ctx.fillStyle = "#816450";
  ctx.fillRect(250, 860, 400, 90);
  const img = new Image();
  img.onload = () => loadImageElement(img);
  img.src = canvas.toDataURL("image/png");
}

function analyzeImage(img) {
  const sample = document.createElement("canvas");
  const size = 96;
  sample.width = size;
  sample.height = size;
  const ctx = sample.getContext("2d", { willReadFrequently: true });
  ctx.drawImage(img, 0, 0, size, size);
  const data = ctx.getImageData(0, 0, size, size).data;

  let brightness = 0;
  let saturation = 0;
  let warmth = 0;
  let darkPixels = 0;
  let skinLike = 0;
  let greenBlue = 0;
  let warmFood = 0;

  for (let i = 0; i < data.length; i += 4) {
    const r = data[i] / 255;
    const g = data[i + 1] / 255;
    const b = data[i + 2] / 255;
    const max = Math.max(r, g, b);
    const min = Math.min(r, g, b);
    const lum = 0.2126 * r + 0.7152 * g + 0.0722 * b;
    const sat = max === 0 ? 0 : (max - min) / max;

    brightness += lum;
    saturation += sat;
    warmth += r - b;
    if (lum < 0.22) darkPixels += 1;
    if (r > 0.42 && g > 0.26 && b > 0.18 && r > b * 1.18 && r > g * 0.92) skinLike += 1;
    if (g > r * 1.04 || b > r * 1.08) greenBlue += 1;
    if (r > 0.48 && g > 0.30 && r > b * 1.35 && sat > 0.28) warmFood += 1;
  }

  const total = data.length / 4;
  brightness /= total;
  saturation /= total;
  warmth /= total;

  const scene =
    darkPixels / total > 0.42
      ? "night"
      : skinLike / total > 0.18
        ? "portrait"
        : warmFood / total > 0.2
          ? "food"
          : greenBlue / total > 0.35
            ? "landscape"
            : "city";

  return {
    brightness,
    saturation,
    warmth,
    scene,
    labels: {
      brightness: brightness < 0.38 ? "鍋忔殫" : brightness > 0.68 ? "鍋忎寒" : "姝ｅ父",
      warmth: warmth > 0.06 ? "鍋忔殩" : warmth < -0.04 ? "鍋忓喎" : "涓€?,
      saturation: saturation < 0.22 ? "鍋忕伆" : saturation > 0.46 ? "鍋忔祿" : "閫備腑",
    },
  };
}

function adjustedRecipe(key, stats, strength, forcedScene) {
  const source = baseRecipes[key];
  const params = { ...source.params };
  const scene = forcedScene === "auto" ? stats.scene : forcedScene;

  if (stats.brightness < 0.38) {
    params.浜害 += 8;
    params.闃村奖 += 10;
    params.楂樺厜 += 4;
  }
  if (stats.brightness > 0.68) {
    params.浜害 -= 8;
    params.楂樺厜 -= 12;
    params.瀵规瘮搴?+= 4;
  }
  if (stats.saturation > 0.46) params.楗卞拰搴?-= 10;
  if (stats.saturation < 0.22) params.楗卞拰搴?+= 8;
  if (stats.warmth > 0.06 && key !== "food") params.鑹叉俯 -= 8;
  if (stats.warmth < -0.04 && key !== "clean" && key !== "night") params.鑹叉俯 += 6;
  if (scene === "portrait") {
    params.缁撴瀯 -= 8;
    params.閿愬寲 = Math.min(params.閿愬寲, 16);
  }
  if (scene === "night") {
    params.楂樺厜 -= 12;
    params.鏆楄 += 8;
  }

  const scale = strength / 100;
  Object.keys(params).forEach((name) => {
    params[name] = clamp(params[name] * scale);
  });
  return { ...source, key, params };
}

function rankRecipes(stats, forcedScene, forcedStyle) {
  const scene = forcedScene === "auto" ? stats.scene : forcedScene;
  const keys = Object.keys(baseRecipes);
  if (forcedStyle !== "auto") {
    return [forcedStyle, ...keys.filter((key) => key !== forcedStyle)];
  }
  return keys.sort((a, b) => {
    const ar = baseRecipes[a].scene.includes(scene) ? 0 : 1;
    const br = baseRecipes[b].scene.includes(scene) ? 0 : 1;
    return ar - br;
  });
}

function copyRecipe(recipe) {
  const lines = [
    `閱掑浘璋冭壊鍙傛暟锝?{recipe.name}`,
    recipe.note,
    ...Object.entries(recipe.params).map(([name, value]) => `${name} ${formatValue(value)}`),
  ];
  navigator.clipboard.writeText(lines.join("\n"));
}

function drawCanvasCover(ctx, img, width, height) {
  const ratio = img.width / img.height;
  const targetRatio = width / height;
  let sx = 0;
  let sy = 0;
  let sw = img.width;
  let sh = img.height;
  if (ratio > targetRatio) {
    sw = img.height * targetRatio;
    sx = (img.width - sw) / 2;
  } else {
    sh = img.width / targetRatio;
    sy = (img.height - sh) / 2;
  }
  ctx.drawImage(img, sx, sy, sw, sh, 0, 0, width, height);
}

function drawTonedImage(canvas, img, recipe, width = 1080, height = 1440) {
  canvas.width = width;
  canvas.height = height;
  const p = recipe.params;
  const brightness = 1 + (p.浜害 || 0) / 120;
  const contrast = 1 + (p.瀵规瘮搴?|| 0) / 120;
  const saturate = 1 + (p.楗卞拰搴?|| 0) / 110;
  const warmth = p.鑹叉俯 || 0;
  const sepia = Math.max(0, warmth) / 180;
  const hue = (p.鑹茶皟 || 0) * 0.8 - Math.min(0, warmth) * 0.5;

  const afterCtx = canvas.getContext("2d");
  afterCtx.clearRect(0, 0, width, height);
  afterCtx.filter = `brightness(${brightness}) contrast(${contrast}) saturate(${saturate}) sepia(${sepia}) hue-rotate(${hue}deg)`;
  drawCanvasCover(afterCtx, img, width, height);
  afterCtx.filter = "none";

  if ((p.瑜壊 || 0) > 0) {
    afterCtx.fillStyle = `rgba(232, 214, 184, ${Math.min(0.18, p.瑜壊 / 180)})`;
    afterCtx.fillRect(0, 0, width, height);
  }
  if ((p.鏆楄 || 0) > 0) {
    const vignette = afterCtx.createRadialGradient(width / 2, height / 2, height * 0.2, width / 2, height / 2, height * 0.72);
    vignette.addColorStop(0, "rgba(0,0,0,0)");
    vignette.addColorStop(1, `rgba(0,0,0,${Math.min(0.36, p.鏆楄 / 90)})`);
    afterCtx.fillStyle = vignette;
    afterCtx.fillRect(0, 0, width, height);
  }
}

function drawTonePreview(recipe) {
  if (!currentImage) return;
  resultPreview.classList.remove("hidden");
  const width = 1080;
  const height = 1440;
  [beforeCanvas, afterCanvas].forEach((canvas) => {
    canvas.width = width;
    canvas.height = height;
  });

  const beforeCtx = beforeCanvas.getContext("2d");
  beforeCtx.clearRect(0, 0, width, height);
  drawCanvasCover(beforeCtx, currentImage, width, height);
  drawTonedImage(afterCanvas, currentImage, recipe, width, height);
}

function drawStyleSamples(recipes) {
  if (!currentImage) return;
  styleSamples.classList.remove("hidden");
  sampleGrid.replaceChildren();
  recipes.forEach((recipe) => {
    const card = document.createElement("button");
    card.className = `styleCard${recipe.key === styleSelect.value ? " active" : ""}`;
    card.type = "button";

    const canvas = document.createElement("canvas");
    drawTonedImage(canvas, currentImage, recipe, 720, 960);

    const name = document.createElement("strong");
    name.textContent = recipe.name;
    const desc = document.createElement("span");
    desc.textContent = recipe.note;

    card.append(canvas, name, desc);
    card.addEventListener("click", () => {
      styleSelect.value = recipe.key;
      updateResults();
      window.scrollTo({ top: 0, behavior: "smooth" });
    });
    sampleGrid.appendChild(card);
  });
}

function updateSearchLinks(tags, recipe) {
  const query = `${recipe.name} 閱掑浘 璋冭壊 鍙傛暟 濂界湅 濂借瘎`;
  const encoded = encodeURIComponent(query);
  searchXhs.href = `https://www.xiaohongshu.com/search_result?keyword=${encoded}`;
  searchDouyin.href = `https://www.douyin.com/search/${encoded}?type=general`;
  searchWeb.href = `https://www.bing.com/search?q=${encodeURIComponent(`${query} site:xiaohongshu.com OR site:douyin.com`)}`;
  [searchXhs, searchDouyin, searchWeb].forEach((link) => {
    link.title = `鑱旂綉鎼滅储锛?{query}`;
  });
}

function renderRecipe(recipe, index) {
  const node = recipeTemplate.content.firstElementChild.cloneNode(true);
  node.querySelector("h3").textContent = `${index + 1}. ${recipe.name}`;
  node.querySelector("p").textContent = recipe.note;
  const params = node.querySelector(".params");
  Object.entries(recipe.params).forEach(([name, value]) => {
    const item = document.createElement("div");
    item.className = "param";
    item.innerHTML = `<b>${name}</b><span>${formatValue(value)}</span>`;
    params.appendChild(item);
  });
  const button = node.querySelector("button");
  button.addEventListener("click", () => {
    copyRecipe(recipe);
    button.textContent = "宸插鍒?;
    setTimeout(() => (button.textContent = "澶嶅埗"), 1200);
  });
  return node;
}

function updateResults() {
  if (!currentStats) return;
  const scene = sceneSelect.value;
  const style = styleSelect.value;
  const strength = Number(strengthRange.value);
  const ranked = rankRecipes(currentStats, scene, style);
  const recipes = ranked.slice(0, 3).map((key) => adjustedRecipe(key, currentStats, strength, scene));
  const allRecipes = Object.keys(baseRecipes).map((key) => adjustedRecipe(key, currentStats, strength, scene));

  resultTitle.textContent = `鎺ㄨ崘锛?{recipes[0].name}`;
  analysisCards.children[0].querySelector("span").textContent = currentStats.labels.brightness;
  analysisCards.children[1].querySelector("span").textContent = currentStats.labels.warmth;
  analysisCards.children[2].querySelector("span").textContent = currentStats.labels.saturation;

  recipeList.replaceChildren(...recipes.map(renderRecipe));
  const tags = [...new Set(recipes.flatMap((recipe) => tagsByStyle[recipe.key]))];
  searchTags.replaceChildren(
    ...tags.map((text) => {
      const tag = document.createElement("span");
      tag.className = "tag";
      tag.textContent = text;
      return tag;
    }),
  );
  drawTonePreview(recipes[0]);
  drawStyleSamples(allRecipes);
  updateSearchLinks(tags, recipes[0]);
}

fileInput.addEventListener("change", (event) => loadFile(event.target.files[0]));

dropzone.addEventListener("dragover", (event) => {
  event.preventDefault();
  dropzone.style.borderColor = "var(--accent)";
});

dropzone.addEventListener("dragleave", () => {
  dropzone.style.borderColor = "";
});

dropzone.addEventListener("drop", (event) => {
  event.preventDefault();
  dropzone.style.borderColor = "";
  loadFile(event.dataTransfer.files[0]);
});

[sceneSelect, styleSelect, strengthRange].forEach((control) => {
  control.addEventListener("input", updateResults);
});

resetBtn.addEventListener("click", () => {
  currentImage = null;
  currentStats = null;
  fileInput.value = "";
  previewWrap.classList.add("hidden");
  resultPreview.classList.add("hidden");
  styleSamples.classList.add("hidden");
  sampleGrid.replaceChildren();
  dropzone.classList.remove("hidden");
  sampleBtn.classList.remove("hidden");
  resultTitle.textContent = "鍏堜笂浼犵収鐗?;
  recipeList.replaceChildren();
  searchTags.replaceChildren();
  [...analysisCards.querySelectorAll("span")].forEach((span) => (span.textContent = "-"));
});

sampleBtn.addEventListener("click", useSampleImage);
