/* ============================================================
   PORTFÓLIO LUCAS ROBSON — JAVASCRIPT
   O JS adiciona comportamento à página: menu mobile, animações
   de entrada, filtro dos cursos, carrossel de projetos e formulário.
   ============================================================ */

// Seleciona os elementos do menu para poder abrir/fechar no celular.
const menuToggle = document.querySelector(".menu-toggle");
// Referência ao conjunto de links do menu.
const navLinks = document.querySelector(".nav-links");

menuToggle?.addEventListener("click", () => {
  const open = navLinks.classList.toggle("open");
  menuToggle.setAttribute("aria-expanded", open);
});

document.querySelectorAll(".nav-links a").forEach(link => {
  link.addEventListener("click", () => navLinks.classList.remove("open"));
});

// ============================================================
// ANIMAÇÕES DE ENTRADA
// IntersectionObserver espera a seção aparecer na tela e então
// adiciona a classe "visible", que é animada pelo CSS.
// ============================================================
// Animações de entrada
// Observador responsável por revelar elementos conforme entram na tela.
const observer = new IntersectionObserver((entries, obs) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add("visible");
      obs.unobserve(entry.target);
    }
  });
}, { threshold: 0.12 });

document.querySelectorAll(".reveal").forEach(el => observer.observe(el));

// ============================================================
// FILTRO DOS CURSOS
// Cada card possui data-year="2025" ou data-year="2026".
// O botão escolhido define quais cards ficam visíveis.
// ============================================================
// Filtro dos cursos
// Botões de filtro e cards de cursos.
const filterButtons = document.querySelectorAll(".course-filters button");
const courses = document.querySelectorAll(".course-card");

filterButtons.forEach(button => {
  button.addEventListener("click", () => {
    filterButtons.forEach(btn => btn.classList.remove("active"));
    button.classList.add("active");

    const filter = button.dataset.filter;
    courses.forEach(card => {
      card.classList.toggle("hidden", filter !== "all" && card.dataset.year !== filter);
    });
  });
});

// ============================================================
// CARROSSEL DE PROJETOS
// O track é deslocado em blocos de 100% para mostrar um slide por vez.
// Os espaços "editable-project" podem receber seus próximos projetos.
// ============================================================
// Carrossel de projetos — basta substituir os blocos "editable-project"
// Elementos do carrossel e controles de navegação.
const track = document.querySelector("#projectTrack");
const projectOrder = ["lrp", "primor", "quiz", "donate"];
const orderedSlides = [...track.querySelectorAll(".project-slide")].sort((first, second) => projectOrder.indexOf(first.dataset.project) - projectOrder.indexOf(second.dataset.project));
orderedSlides.forEach(slide => track.appendChild(slide));
const slides = document.querySelectorAll(".project-slide");
const prev = document.querySelector("#prevProject");
const next = document.querySelector("#nextProject");
const counter = document.querySelector("#projectCounter");
const dotsContainer = document.querySelector("#projectDots");

let currentProject = 0;

slides.forEach((_, index) => {
  const dot = document.createElement("button");
  dot.setAttribute("aria-label", `Ir para projeto ${index + 1}`);
  dot.addEventListener("click", () => goToProject(index));
  dotsContainer.appendChild(dot);
});

const dots = dotsContainer.querySelectorAll("button");

function goToProject(index) {
  currentProject = (index + slides.length) % slides.length;
  track.style.transform = `translateX(-${currentProject * 100}%)`;
  counter.textContent = `${String(currentProject + 1).padStart(2, "0")} / ${String(slides.length).padStart(2, "0")}`;
  dots.forEach((dot, i) => dot.classList.toggle("active", i === currentProject));
}

prev.addEventListener("click", () => goToProject(currentProject - 1));
next.addEventListener("click", () => goToProject(currentProject + 1));
goToProject(0);

// ============================================================
// FORMULÁRIO
// Abre o WhatsApp com os dados preenchidos pelo visitante.
// ============================================================
document.querySelector("#contactForm")?.addEventListener("submit", (event) => {
  event.preventDefault();
  const data = new FormData(event.currentTarget);
  const message = encodeURIComponent(
    `Olá, Lucas!\n\nMeu nome: ${data.get("nome")}\nMeu e-mail: ${data.get("email")}\n\nMensagem:\n${data.get("mensagem")}`
  );
  window.open(`https://wa.me/5511937556610?text=${message}`, "_blank", "noopener,noreferrer");
});

// Menu do header grande no celular.
const headerMenuToggle = document.querySelector(".header-menu-toggle");
const headerNav = document.querySelector(".header-nav");

headerMenuToggle?.addEventListener("click", () => {
  const aberto = headerNav.classList.toggle("open");
  headerMenuToggle.setAttribute("aria-expanded", aberto);
});

document.querySelectorAll(".header-nav a").forEach(link => {
  link.addEventListener("click", () => {
    headerNav.classList.remove("open");
    headerMenuToggle?.setAttribute("aria-expanded", "false");
  });
});

// Alterna o tema e preserva a escolha do visitante.
const themeToggle = document.querySelector(".theme-toggle");
const savedTheme = localStorage.getItem("portfolio-theme");

function applyTheme(dark) {
  document.body.classList.toggle("dark-theme", dark);
  themeToggle?.setAttribute("aria-pressed", String(dark));
  themeToggle?.setAttribute("aria-label", dark ? "Ativar tema claro" : "Ativar tema escuro");
  const icon = themeToggle?.querySelector(".theme-toggle-icon");
  const label = themeToggle?.querySelector(".theme-toggle-label");
  if (icon) icon.textContent = dark ? "☀" : "☾";
  if (label) label.textContent = dark ? "TEMA CLARO" : "TEMA ESCURO";
}

// O modo escuro e o padrao; o claro so permanece quando foi escolhido.
applyTheme(savedTheme !== "light");
themeToggle?.addEventListener("click", () => {
  const dark = !document.body.classList.contains("dark-theme");
  applyTheme(dark);
  localStorage.setItem("portfolio-theme", dark ? "dark" : "light");
});

// Snake editorial: experiencia automatica em grid, limitada ao palco direito.
(() => {
  const canvas = document.querySelector(".snake-canvas");
  const frame = canvas?.closest(".profile-stage");
  const photo = frame?.querySelector("[data-profile-photo]");
  if (!canvas || !frame) return;

  const context = canvas.getContext("2d");
  const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
  const pointer = { x: 0, y: 0, active: false };
  const directions = { up: { x: 0, y: -1 }, down: { x: 0, y: 1 }, left: { x: -1, y: 0 }, right: { x: 1, y: 0 } };
  let columns = 24;
  let rows = 16;
  let cellSize = 20;
  let pixelRatio = 1;
  let snake = [];
  let direction = "up";
  let nextDirection = "up";
  let stepTimer = 0;
  let stepDuration = 125;
  let lastTime = 0;
  let animationFrame;
  let score = 0;

  function resize() {
    const bounds = frame.getBoundingClientRect();
    const compact = bounds.width < 420;
    columns = compact ? 18 : bounds.width < 700 ? 21 : 24;
    rows = compact ? 14 : bounds.height < 400 ? 14 : 16;
    cellSize = Math.min(bounds.width / columns, bounds.height / rows);
    pixelRatio = Math.min(window.devicePixelRatio || 1, 2);
    canvas.width = Math.round(bounds.width * pixelRatio);
    canvas.height = Math.round(bounds.height * pixelRatio);
    context.setTransform(pixelRatio, 0, 0, pixelRatio, 0, 0);
    snake = [];
    const startX = Math.floor(columns * .14);
    const startY = Math.floor(rows * .78);
    for (let index = 0; index < 11; index += 1) snake.push({ x: (startX + index) % columns, y: startY });
    direction = "up";
    nextDirection = "up";
    stepTimer = 0;
    draw();
  }

  function isOpposite(first, second) {
    return directions[first].x + directions[second].x === 0 && directions[first].y + directions[second].y === 0;
  }

  function chooseDirection() {
    if (!pointer.active) return;
    const head = snake[0];
    const headX = (head.x + .5) * cellSize;
    const headY = (head.y + .5) * cellSize;
    const horizontal = pointer.x - headX;
    const vertical = pointer.y - headY;
    const preferred = Math.abs(horizontal) > Math.abs(vertical)
      ? (horizontal < 0 ? "left" : "right")
      : (vertical < 0 ? "up" : "down");
    if (!isOpposite(direction, preferred)) nextDirection = preferred;
  }

  function chooseAutomaticZigzag() {
    const head = snake[0];
    if (direction === "up" && head.y <= 2) nextDirection = head.x < columns / 2 ? "right" : "left";
    if (direction === "right" && head.x >= columns - 2) nextDirection = "down";
    if (direction === "down" && head.y >= rows - 3) nextDirection = "left";
    if (direction === "left" && head.x <= 2) nextDirection = "up";
  }

  function step() {
    if (pointer.active) chooseDirection();
    else chooseAutomaticZigzag();
    if (!isOpposite(direction, nextDirection)) direction = nextDirection;
    const vector = directions[direction];
    const head = snake[0];
    const nextHead = { x: (head.x + vector.x + columns) % columns, y: (head.y + vector.y + rows) % rows };
    snake.unshift(nextHead);
    snake.pop();
    score = (score + 1) % 999;
  }

  function draw(time = 0) {
    const delta = Math.min(time - lastTime || 16, 40);
    lastTime = time;
    stepTimer += delta;
    if (!reduceMotion.matches && stepTimer >= stepDuration) {
      stepTimer %= stepDuration;
      step();
    }

    const bounds = frame.getBoundingClientRect();
    const offsetX = (bounds.width - columns * cellSize) / 2;
    const offsetY = (bounds.height - rows * cellSize) / 2;
    context.clearRect(0, 0, bounds.width, bounds.height);
    context.fillStyle = "rgba(116,18,29,.07)";
    context.fillRect(offsetX, offsetY, columns * cellSize, rows * cellSize);

    snake.slice().reverse().forEach((segment, index) => {
      const x = offsetX + segment.x * cellSize + 2;
      const y = offsetY + segment.y * cellSize + 2;
      const size = cellSize - 4;
      const isHead = index === snake.length - 1;
      context.fillStyle = isHead ? "#500c14" : index % 3 === 0 ? "#8f2b38" : "#74121d";
      context.fillRect(x, y, size, size);
      if (isHead) {
        context.fillStyle = "#e9d4d5";
        context.fillRect(x + size * .32, y + size * .32, Math.max(2, size * .18), Math.max(2, size * .18));
      }
    });

    if (!reduceMotion.matches) animationFrame = window.requestAnimationFrame(draw);
  }

  function updatePointer(event) {
    const bounds = frame.getBoundingClientRect();
    pointer.x = event.clientX - bounds.left;
    pointer.y = event.clientY - bounds.top;
    pointer.active = true;
    if (photo) {
      const offsetX = (pointer.x / bounds.width - .5) * -7;
      const offsetY = (pointer.y / bounds.height - .5) * -5;
      photo.style.transform = `translate(-50%, -50%) translate(${offsetX}px, ${offsetY}px)`;
    }
  }

  frame.addEventListener("pointerenter", updatePointer);
  frame.addEventListener("pointermove", updatePointer);
  frame.addEventListener("pointerleave", () => {
    pointer.active = false;
    if (photo) photo.style.transform = "translate(-50%, -50%)";
  });
  window.addEventListener("resize", resize, { passive: true });
  resize();
  if (reduceMotion.matches) draw();
  window.addEventListener("pagehide", () => window.cancelAnimationFrame(animationFrame), { once: true });
})();
