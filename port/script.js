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
// Impede o envio tradicional e monta um link mailto para abrir
// o aplicativo de e-mail com assunto e mensagem preenchidos.
// ============================================================
// Formulário: abre o cliente de e-mail
document.querySelector("#contactForm")?.addEventListener("submit", (event) => {
  event.preventDefault();
  const data = new FormData(event.currentTarget);
  const subject = encodeURIComponent(`Contato pelo portfólio — ${data.get("nome")}`);
  const body = encodeURIComponent(
    `Nome: ${data.get("nome")}\nE-mail: ${data.get("email")}\n\nMensagem:\n${data.get("mensagem")}`
  );
  window.location.href = `mailto:lucas.filhotar@gmail.com?subject=${subject}&body=${body}`;
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
