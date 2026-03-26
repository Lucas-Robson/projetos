function jogar(escolha) {
  let opcoes = ['pedra', 'papel', 'tesoura'];

  // Computador escolhendo de forma aleatória
  let computador = opcoes[Math.floor(Math.random() * 3)];

  let resultado = ""
if(escolha == computador) {
resultado = "empate"
} else if (
(escolha == "pedra" && computador == "tesoura") ||
(escolha == "papel" && computador == "pedra") ||
(escolha == "tesoura" && computador == "papel")) {
resultado = "Jogador Ganhou"
} else {
resultado = "Computador Ganhou"
}
let resultado1 = document.getElementById
("resultado")
resultado1. innerText ="jogador:"+escolha+" computador:"+computador+" resultado:"+resultado;
}