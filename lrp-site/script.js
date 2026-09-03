const header = document.querySelector('.site-header');
const menuButton = document.querySelector('.menu-toggle');
const mobileMenu = document.querySelector('#mobile-menu');
document.body.classList.add('js-ready');

function syncHeader(){
  header.classList.toggle('scrolled', window.scrollY > 10);
}
syncHeader();
window.addEventListener('scroll', syncHeader, {passive:true});

menuButton.addEventListener('click', () => {
  const open = menuButton.getAttribute('aria-expanded') === 'true';
  menuButton.setAttribute('aria-expanded', String(!open));
  mobileMenu.hidden = open;
});

mobileMenu.querySelectorAll('a').forEach(link => {
  link.addEventListener('click', () => {
    mobileMenu.hidden = true;
    menuButton.setAttribute('aria-expanded', 'false');
  });
});

const revealElements = document.querySelectorAll('.reveal');
if('IntersectionObserver' in window){
  const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      entry.target.classList.toggle('visible', entry.isIntersecting);
    });
  }, {threshold:0.08, rootMargin:'0px 0px -8% 0px'});
  revealElements.forEach(element => observer.observe(element));
} else {
  revealElements.forEach(element => element.classList.add('visible'));
}

// Mantém apenas um item do FAQ aberto por vez.
const details = [...document.querySelectorAll('.accordion details')];
details.forEach(item => item.addEventListener('toggle', () => {
  if(item.open){
    details.filter(other => other !== item).forEach(other => other.open = false);
  }
}));

const form = document.querySelector('#contact-form');
const note = document.querySelector('#form-note');
form.addEventListener('submit', event => {
  event.preventDefault();
  if(!form.checkValidity()){
    form.reportValidity();
    return;
  }
  const formData = new FormData(form);
  const message = [
    'Olá, LRP! Gostaria de falar sobre contabilidade.',
    `Nome: ${formData.get('nome')}`,
    `E-mail: ${formData.get('email')}`,
    `Mensagem: ${formData.get('mensagem')}`
  ].join('\n');
  window.open(`https://wa.me/5511996484307?text=${encodeURIComponent(message)}`, '_blank', 'noopener');
  note.textContent = 'Abrindo o WhatsApp com sua mensagem.';
});
