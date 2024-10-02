let personagem = document.querySelector('.personagem');
let posX = 0; // Posição inicial X do personagem
let posY = 150; // Posição inicial Y do personagem
let jogoAtivo = true; // Variável para controlar o estado do jogo
let pontuacao = 0; // Contador de pontos
let tempoDeSpawn = 750; // Tempo inicial de spawn das naves inimigas (dividido por 4)
let intervaloSpawn; // Variável para armazenar o intervalo de criação das naves inimigas
let velocidadeNaves = 40; // Aumentar a velocidade das naves em 4 vezes

// Função para atualizar o contador de pontos
function atualizarPontuacao() {
    if (!jogoAtivo) return;

    pontuacao++;
    document.getElementById('pontuacao').innerText = `Pontuação: ${pontuacao}`;
}

// Função para movimentar o personagem
function moverPersonagem(e) {
    if (!jogoAtivo) return; // Impede movimento após o game over

    switch (e.key) {
        case 'w': // Mover para cima
            posY -= 30;
            break;
        case 's': // Mover para baixo
            posY += 20;
            break;
        case 'a': // Mover para a esquerda
            posX -= 30;
            break;
        case 'd': // Mover para a direita
            posX += 30;
            break;
    }

    // Limitar o movimento para não sair da tela
    posX = Math.max(0, Math.min(posX, window.innerWidth - personagem.offsetWidth));
    posY = Math.max(0, Math.min(posY, window.innerHeight - personagem.offsetHeight));

    // Atualiza a posição do personagem
    personagem.style.left = posX + 'px';
    personagem.style.top = posY + 'px';
}


document.addEventListener('keydown', moverPersonagem);

// Função para criar a nave inimiga
function criarNaveInimiga() {
    if (!jogoAtivo) return; // Não criar novas naves após o game over

    let enemyNave = document.createElement('img');
    enemyNave.src = './images/enemy_nave.png';
    enemyNave.classList.add('enemy-nave');
    document.getElementById('game').appendChild(enemyNave);

    // Definir movimento da nave inimiga
    let posEnemyX = window.innerWidth - 100;
    let posEnemyY = Math.floor(Math.random() * (window.innerHeight - 100));
    enemyNave.style.left = posEnemyX + 'px'; // Posição inicial à direita da tela
    enemyNave.style.top = posEnemyY + 'px'; // Posicionar a nave inimiga em uma posição Y aleatória

    let interval = setInterval(() => {
        if (!jogoAtivo) {
            clearInterval(interval); // Para o movimento se o jogo acabar
            return;
        }

        posEnemyX -= velocidadeNaves; // Aumentar a velocidade em 4x
        enemyNave.style.left = posEnemyX + 'px';

        // Checar colisão com o personagem
        if (detectaColisao(personagem, enemyNave)) {
            gameOver();
            clearInterval(interval);
        }

        // Remover nave quando sair da tela
        if (posEnemyX < -80) {
            clearInterval(interval);
            enemyNave.remove();
        }
    }, 100);
}

// Função para detectar colisão entre o personagem e a nave inimiga com uma área de impacto menor
function detectaColisao(personagem, enemyNave) {
    let personagemRect = personagem.getBoundingClientRect();
    let enemyNaveRect = enemyNave.getBoundingClientRect();

    // Reduzindo a área de impacto em 20px (10px de cada lado)
    let ajuste = 10;

    return !(
        (personagemRect.top + ajuste) > (enemyNaveRect.bottom - ajuste) ||
        (personagemRect.bottom - ajuste) < (enemyNaveRect.top + ajuste) ||
        (personagemRect.right - ajuste) < (enemyNaveRect.left + ajuste) ||
        (personagemRect.left + ajuste) > (enemyNaveRect.right - ajuste)
    );
}

// Função para o fim do jogo (Game Over)
function gameOver() {
    jogoAtivo = false;
    alert(`Game Over! Sua pontuação final foi: ${pontuacao}`);
    setTimeout(() => {
        location.reload(); // Recarrega a página após o Game Over
    }, 500); // Pequeno atraso para mostrar o alerta antes de recarregar
}

// Função para iniciar o jogo e aumentar a velocidade de spawn das naves inimigas
function iniciarJogo() {
    jogoAtivo = true;
    pontuacao = 0;
    document.getElementById('pontuacao').innerText = `Pontuação: ${pontuacao}`;

    // Atualiza a pontuação a cada desvio den nave inimiga
    setInterval(atualizarPontuacao, 1000);

    // Aumentar gradualmente a velocidade de criação das naves
    intervaloSpawn = setInterval(() => {
        criarNaveInimiga();

        // Reduzir o tempo de spawn das naves
        if (tempoDeSpawn > 250) { // Limite mínimo de spawn, 4 vezes mais rápido
            tempoDeSpawn -= 25;
            clearInterval(intervaloSpawn); // Limpa o intervalo anterior
            intervaloSpawn = setInterval(criarNaveInimiga, tempoDeSpawn); // Cria um novo intervalo com o tempo atualizado
        }
    }, tempoDeSpawn);
}

// Iniciar o jogo
iniciarJogo();
