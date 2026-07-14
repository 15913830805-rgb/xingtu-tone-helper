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
    name: "\u5976\u6CB9\u80F6\u7247",
    note: "\u9002\u5408\u4EBA\u50CF\u3001\u5496\u5561\u5E97\u3001\u9634\u5929\u5BA4\u5185\uFF0C\u80A4\u8272\u67D4\u548C\u4E0D\u810F\u3002",
    scene: ["portrait", "food", "city"],
    params: {
      \u4EAE\u5EA6: 6,
      \u5BF9\u6BD4\u5EA6: -12,
      \u9971\u548C\u5EA6: -6,
      \u9510\u5316: 12,
      \u7ED3\u6784: -8,
      \u9AD8\u5149: -22,
      \u9634\u5F71: 18,
      \u8272\u6E29: 8,
      \u8272\u8C03: 3,
      \u892A\u8272: 18,
      \u9897\u7C92: 12,
      \u6697\u89D2: 8,
    },
  },
  clean: {
    name: "\u6E05\u900F\u51B7\u767D",
    note: "\u9002\u5408\u81EA\u62CD\u3001\u767D\u5899\u3001\u84DD\u5929\uFF0C\u753B\u9762\u5E72\u51C0\u504F\u4EAE\u3002",
    scene: ["portrait", "landscape"],
    params: {
      \u4EAE\u5EA6: 12,
      \u5BF9\u6BD4\u5EA6: -6,
      \u9971\u548C\u5EA6: -4,
      \u9510\u5316: 18,
      \u7ED3\u6784: 4,
      \u9AD8\u5149: -18,
      \u9634\u5F71: 22,
      \u8272\u6E29: -8,
      \u8272\u8C03: 5,
      \u892A\u8272: 6,
      \u9897\u7C92: 0,
      \u6697\u89D2: 0,
    },
  },
  japan: {
    name: "\u65E5\u7CFB\u901A\u900F",
    note: "\u9002\u5408\u65C5\u884C\u3001\u8857\u62CD\u3001\u81EA\u7136\u5149\uFF0C\u989C\u8272\u8F7B\u4F46\u4E0D\u7070\u3002",
    scene: ["landscape", "city", "portrait"],
    params: {
      \u4EAE\u5EA6: 10,
      \u5BF9\u6BD4\u5EA6: -10,
      \u9971\u548C\u5EA6: 8,
      \u9510\u5316: 10,
      \u7ED3\u6784: -4,
      \u9AD8\u5149: -28,
      \u9634\u5F71: 26,
      \u8272\u6E29: 4,
      \u8272\u8C03: -2,
      \u892A\u8272: 10,
      \u9897\u7C92: 5,
      \u6697\u89D2: 0,
    },
  },
  night: {
    name: "\u591C\u666F\u6C1B\u56F4",
    note: "\u9002\u5408\u8DEF\u706F\u3001\u8F66\u6D41\u3001\u96E8\u591C\uFF0C\u538B\u4F4F\u9AD8\u5149\uFF0C\u4FDD\u7559\u706F\u5149\u5C42\u6B21\u3002",
    scene: ["night", "city"],
    params: {
      \u4EAE\u5EA6: -4,
      \u5BF9\u6BD4\u5EA6: 16,
      \u9971\u548C\u5EA6: 10,
      \u9510\u5316: 22,
      \u7ED3\u6784: 12,
      \u9AD8\u5149: -42,
      \u9634\u5F71: 8,
      \u8272\u6E29: -6,
      \u8272\u8C03: 4,
      \u892A\u8272: 4,
      \u9897\u7C92: 10,
      \u6697\u89D2: 18,
    },
  },
  food: {
    name: "\u98DF\u7269\u6696\u8C03",
    note: "\u9002\u5408\u751C\u54C1\u3001\u706B\u9505\u3001\u5496\u5561\uFF0C\u63D0\u98DF\u6B32\u4F46\u4E0D\u8FC7\u9EC4\u3002",
    scene: ["food"],
    params: {
      \u4EAE\u5EA6: 8,
      \u5BF9\u6BD4\u5EA6: 8,
      \u9971\u548C\u5EA6: 14,
      \u9510\u5316: 16,
      \u7ED3\u6784: 8,
      \u9AD8\u5149: -14,
      \u9634\u5F71: 14,
      \u8272\u6E29: 10,
      \u8272\u8C03: -2,
      \u892A\u8272: 0,
      \u9897\u7C92: 0,
      \u6697\u89D2: 4,
    },
  },
};

const tagsByStyle = {
  cream: ["\u9192\u56FE \u5976\u6CB9\u80F6\u7247 \u53C2\u6570", "\u5C0F\u7EA2\u4E66 \u540C\u6B3E\u5976\u6CB9\u611F\u8C03\u8272", "\u6296\u97F3 \u6C1B\u56F4\u611F\u8C03\u8272 \u9192\u56FE"],
  clean: ["\u9192\u56FE \u6E05\u900F\u51B7\u767D \u53C2\u6570", "\u81EA\u62CD\u51B7\u767D\u76AE\u8C03\u8272", "\u5C0F\u7EA2\u4E66 \u901A\u900F\u611F\u4FEE\u56FE"],
  japan: ["\u9192\u56FE \u65E5\u7CFB\u901A\u900F \u53C2\u6570", "\u65C5\u884C\u7167\u7247\u9192\u56FE\u8C03\u8272", "\u5C0F\u7EA2\u4E66 \u65E5\u7CFB\u80F6\u7247\u53C2\u6570"],
  night: ["\u9192\u56FE \u591C\u666F\u6C1B\u56F4 \u53C2\u6570", "\u96E8\u591C\u706F\u5149\u8C03\u8272\u6559\u7A0B", "\u6296\u97F3 \u591C\u666F\u7535\u5F71\u611F\u8C03\u8272"],
  food: ["\u9192\u56FE \u98DF\u7269\u8C03\u8272 \u53C2\u6570", "\u63A2\u5E97\u7167\u7247\u9192\u56FE\u53C2\u6570", "\u5C0F\u7EA2\u4E66 \u7F8E\u98DF\u6696\u8C03\u6EE4\u955C"],
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
  imageInfo.textContent = `${img.width}\u00D7${img.height}\uFF0C\u5DF2\u5B8C\u6210\u672C\u5730\u53D6\u6837\u5206\u6790`;
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
      brightness: brightness < 0.38 ? "\u504F\u6697" : brightness > 0.68 ? "\u504F\u4EAE" : "\u6B63\u5E38",
      warmth: warmth > 0.06 ? "\u504F\u6696" : warmth < -0.04 ? "\u504F\u51B7" : "\u4E2D\u6027",
      saturation: saturation < 0.22 ? "\u504F\u7070" : saturation > 0.46 ? "\u504F\u6D53" : "\u9002\u4E2D",
    },
  };
}

function adjustedRecipe(key, stats, strength, forcedScene) {
  const source = baseRecipes[key];
  const params = { ...source.params };
  const scene = forcedScene === "auto" ? stats.scene : forcedScene;

  if (stats.brightness < 0.38) {
    params.\u4EAE\u5EA6 += 8;
    params.\u9634\u5F71 += 10;
    params.\u9AD8\u5149 += 4;
  }
  if (stats.brightness > 0.68) {
    params.\u4EAE\u5EA6 -= 8;
    params.\u9AD8\u5149 -= 12;
    params.\u5BF9\u6BD4\u5EA6 += 4;
  }
  if (stats.saturation > 0.46) params.\u9971\u548C\u5EA6 -= 10;
  if (stats.saturation < 0.22) params.\u9971\u548C\u5EA6 += 8;
  if (stats.warmth > 0.06 && key !== "food") params.\u8272\u6E29 -= 8;
  if (stats.warmth < -0.04 && key !== "clean" && key !== "night") params.\u8272\u6E29 += 6;
  if (scene === "portrait") {
    params.\u7ED3\u6784 -= 8;
    params.\u9510\u5316 = Math.min(params.\u9510\u5316, 16);
  }
  if (scene === "night") {
    params.\u9AD8\u5149 -= 12;
    params.\u6697\u89D2 += 8;
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
    `\u9192\u56FE\u8C03\u8272\u53C2\u6570\uFF5C${recipe.name}`,
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
  const brightness = 1 + (p.\u4EAE\u5EA6 || 0) / 120;
  const contrast = 1 + (p.\u5BF9\u6BD4\u5EA6 || 0) / 120;
  const saturate = 1 + (p.\u9971\u548C\u5EA6 || 0) / 110;
  const warmth = p.\u8272\u6E29 || 0;
  const sepia = Math.max(0, warmth) / 180;
  const hue = (p.\u8272\u8C03 || 0) * 0.8 - Math.min(0, warmth) * 0.5;

  const afterCtx = canvas.getContext("2d");
  afterCtx.clearRect(0, 0, width, height);
  afterCtx.filter = `brightness(${brightness}) contrast(${contrast}) saturate(${saturate}) sepia(${sepia}) hue-rotate(${hue}deg)`;
  drawCanvasCover(afterCtx, img, width, height);
  afterCtx.filter = "none";

  if ((p.\u892A\u8272 || 0) > 0) {
    afterCtx.fillStyle = `rgba(232, 214, 184, ${Math.min(0.18, p.\u892A\u8272 / 180)})`;
    afterCtx.fillRect(0, 0, width, height);
  }
  if ((p.\u6697\u89D2 || 0) > 0) {
    const vignette = afterCtx.createRadialGradient(width / 2, height / 2, height * 0.2, width / 2, height / 2, height * 0.72);
    vignette.addColorStop(0, "rgba(0,0,0,0)");
    vignette.addColorStop(1, `rgba(0,0,0,${Math.min(0.36, p.\u6697\u89D2 / 90)})`);
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
  const query = `${recipe.name} \u9192\u56FE \u8C03\u8272 \u53C2\u6570 \u597D\u770B \u597D\u8BC4`;
  const encoded = encodeURIComponent(query);
  searchXhs.href = `https://www.xiaohongshu.com/search_result?keyword=${encoded}`;
  searchDouyin.href = `https://www.douyin.com/search/${encoded}?type=general`;
  searchWeb.href = `https://www.bing.com/search?q=${encodeURIComponent(`${query} site:xiaohongshu.com OR site:douyin.com`)}`;
  [searchXhs, searchDouyin, searchWeb].forEach((link) => {
    link.title = `\u8054\u7F51\u641C\u7D22\uFF1A${query}`;
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
    button.textContent = "\u5DF2\u590D\u5236";
    setTimeout(() => (button.textContent = "\u590D\u5236"), 1200);
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

  resultTitle.textContent = `\u63A8\u8350\uFF1A${recipes[0].name}`;
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
  resultTitle.textContent = "\u5148\u4E0A\u4F20\u7167\u7247";
  recipeList.replaceChildren();
  searchTags.replaceChildren();
  [...analysisCards.querySelectorAll("span")].forEach((span) => (span.textContent = "-"));
});

sampleBtn.addEventListener("click", useSampleImage);
