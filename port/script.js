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
const projectOrder = ["lrp", "fabinho"];
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

// SNAKE REAL — motor JavaScript independente de animacoes CSS.
(() => {
  const canvas = document.querySelector('.snake-canvas');
  const stage = canvas?.closest('.profile-stage');
  if (!canvas || !stage) return;
  const ctx = canvas.getContext('2d');
  const pointer = { x: 0, y: 0, active: false, lastMove: 0 };
  const vectors = [[1,0], [0,1], [-1,0], [0,-1]];
  let cols = 24, rows = 16, cell = 20, ox = 0, oy = 0;
  let snake = [], apple = null, heading = 0, score = 0;
  let last = 0, accumulator = 0, frameId = 0;
  const interval = 125; // Velocidade intermediaria.
  const snakeLength = 9; // Comprimento fixo, sem crescimento.
  const wrap = (n, max) => (n + max) % max;
  const key = p => `${p.x},${p.y}`;
  const same = (a,b) => a.x === b.x && a.y === b.y;
  const nextCell = (p, dir) => ({ x: wrap(p.x + vectors[dir][0],cols), y: wrap(p.y + vectors[dir][1],rows) });

  function newApple() {
    const occupied = new Set(snake.map(key));
    const empty = [];
    for (let y=0;y<rows;y++) for(let x=0;x<cols;x++) {
      if (!occupied.has(`${x},${y}`)) empty.push({x,y});
    }
    apple = empty.length ? empty[Math.floor(Math.random()*empty.length)] : null;
  }
  function reset() {
    snake = Array.from({length:snakeLength}, (_,i) => ({x:wrap(Math.floor(cols*.22)-i,cols), y:Math.floor(rows*.75)}));
    heading=0; score=0; accumulator=0; newApple();
    const label=stage.querySelector('.profile-micro-bottom');
    if(label) label.textContent='SNAKE / MOUSE + MOVIMENTO AUTOMÁTICO';
  }
  function resize() {
    const rect=stage.getBoundingClientRect();
    cols=rect.width<420?18:24;
    rows=rect.height<390?14:16;
    cell=Math.min(rect.width/cols,rect.height/rows);
    ox=(rect.width-cols*cell)/2; oy=(rect.height-rows*cell)/2;
    const ratio=Math.min(devicePixelRatio||1,2);
    canvas.width=Math.max(1,Math.round(rect.width*ratio));
    canvas.height=Math.max(1,Math.round(rect.height*ratio));
    ctx.setTransform(ratio,0,0,ratio,0,0);
    reset(); render();
  }
  function targetCell() {
    if (!pointer.active || performance.now() - pointer.lastMove > 2200) return null;
    return {
      x: Math.max(0,Math.min(cols-1,Math.floor((pointer.x-ox)/cell))),
      y: Math.max(0,Math.min(rows-1,Math.floor((pointer.y-oy)/cell)))
    };
  }
  // Busca em largura: encontra um caminho ate o cursor sem atravessar o corpo.
  function routeTo(target) {
    if (!target) return null;
    const blocked=new Set(snake.slice(0,-1).map(key));
    const queue=[{p:snake[0],first:null}];
    const visited=new Set([key(snake[0])]);
    for(let i=0;i<queue.length;i++) {
      const {p,first}=queue[i];
      if(same(p,target)) return first;
      for(let dir=0;dir<4;dir++) {
        if(first===null && (dir+2)%4===heading) continue;
        const n=nextCell(p,dir), k=key(n);
        if(visited.has(k)||blocked.has(k)) continue;
        visited.add(k);queue.push({p:n,first:first===null?dir:first});
      }
    }
    return null;
  }
  function step() {
    const target=targetCell();
    // Segue o cursor quando ele se move; sem movimento, passeia ate a maca.
    const destination = target && !same(snake[0], target) ? target : apple;
    let choice=routeTo(destination);
    const occupied=new Set(snake.slice(0,-1).map(key));
    const safe=d => d!==null && (d+2)%4!==heading && !occupied.has(key(nextCell(snake[0],d)));
    if (!safe(choice)) {
      choice=[heading,(heading+1)%4,(heading+3)%4].find(safe);
    }
    if(choice===undefined || choice===null) {reset();return;}
    heading=choice;
    const head=nextCell(snake[0],heading);
    const ate=apple && same(head,apple);
    const collision=snake.slice(0,-1).some(part=>same(part,head));
    if(collision) return; // Nao reinicia nem aumenta o corpo.
    snake.unshift(head);
    snake.pop(); // Tamanho sempre fixo.
    if(ate) newApple(); // A maca muda de lugar, mas nao cresce.

  }
  function render() {
    const w=canvas.width/(Math.min(devicePixelRatio||1,2));
    const h=canvas.height/(Math.min(devicePixelRatio||1,2));
    ctx.clearRect(0,0,w,h);
    ctx.fillStyle='rgba(116,18,29,.055)';ctx.fillRect(ox,oy,cols*cell,rows*cell);
    if(apple) {
      const x=ox+apple.x*cell,y=oy+apple.y*cell;
      ctx.fillStyle='#d92335';
      ctx.fillRect(Math.round(x+cell*.18),Math.round(y+cell*.18),Math.max(3,Math.floor(cell*.64)),Math.max(3,Math.floor(cell*.64)));
    }
    snake.forEach((part,i)=>{
      const x=ox+part.x*cell+1.5,y=oy+part.y*cell+1.5,s=cell-3;
      ctx.fillStyle=i===0?'#440910':i%2?'#a23b4b':'#74121d';
      ctx.fillRect(x,y,s,s);
      if(i===0){
        ctx.fillStyle='#fff';
        if(heading%2===0){
          const ex=heading===0?x+s*.70:x+s*.18;
          ctx.fillRect(ex,y+s*.18,Math.max(2,s*.12),Math.max(2,s*.12));
          ctx.fillRect(ex,y+s*.68,Math.max(2,s*.12),Math.max(2,s*.12));
        }else{
          const ey=heading===1?y+s*.70:y+s*.18;
          ctx.fillRect(x+s*.18,ey,Math.max(2,s*.12),Math.max(2,s*.12));
          ctx.fillRect(x+s*.68,ey,Math.max(2,s*.12),Math.max(2,s*.12));
        }
      }
    });
  }
  function loop(time) {
    if(!last)last=time;
    accumulator+=Math.min(time-last,100);last=time;
    while(accumulator>=interval){step();accumulator-=interval;}
    render();frameId=requestAnimationFrame(loop);
  }
  function updatePointer(event) {
    const rect=stage.getBoundingClientRect();
    pointer.x=event.clientX-rect.left;pointer.y=event.clientY-rect.top;
    pointer.active=true;pointer.lastMove=performance.now();
  }
  // Captura o mouse na pagina inteira, inclusive sobre a foto e outros elementos.
  document.addEventListener('pointermove', event => {
    if(event.pointerType === 'mouse' || event.pointerType === 'pen') updatePointer(event);
  }, {passive:true});
  document.addEventListener('pointerleave',()=>{pointer.active=false;});
  window.addEventListener('blur',()=>{pointer.active=false;});
  // ResizeObserver tambem responde a mudancas no layout, nao apenas na janela.
  if(typeof ResizeObserver!=='undefined')new ResizeObserver(resize).observe(stage);
  else window.addEventListener('resize',resize,{passive:true});
  document.addEventListener('visibilitychange',()=>{last=0;});
  window.addEventListener('pagehide',()=>cancelAnimationFrame(frameId));
  resize();frameId=requestAnimationFrame(loop);
})();
