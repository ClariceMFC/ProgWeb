(function () {

	const FPS = 40;
	const TAMX = 640;
	const TAMY = 480;

	const STOP_RUN_TIMER = 5000; // O tempo que o player fica esquiando mais rápido em milisegundos
	const BASE_SPEED = 2; // Velocidade base do player
	const BOOSTED_SPEED = 4; // O ideal seria 3 para fazer sentido 20 m/s e 30 m/s porém 4 fica mais consistente
   	const PROB_ARVORE = 2;
   	const PROB_ARVOREGRANDE = 2;
   	const PROB_ROCHA = 2;
   	const PROB_TOCODEARVORE = 2;
   	const PROB_CACHORRO = 2;
   	const PROB_COGUMELO = 2;
   	const PROB_ARBUSTOEMCHAMAS = 2;

	var gameLoop;
	var actualSpeed; // Velocidade que as coisas subirão na tela
	var playerBoost; // Controlador para ativar e desativar o boost speed do player
	var monsterTimer; // Contador até o monstro aparecer
	var spawnMonster; // Define quando o mosntro será spawnado
	var montanha;
	var skier;
	var hud; // Controlador para desenhar os textos de e os retângulos fora da tela assim como organizar os pontos
	var direcoes = ['para-esquerda','para-frente','para-direita']
	var arvores = [];
	var arvoresgrandes = [];
	var rochas = [];
	var tocosdearvore = [];
	var cachorros = [];
   	var cogumelos = [];
   	var monstros = [];
   	var arbustosemchamas = [];
   	var colidiu; // Controlador que define em que o player colidiu 1 = obstáculo / 2 = cogumelo / 3 = monstro
   	var lastColision; // Controlador para saber qual foi a última colisão do player

	// Essa parte é necessária para desenhar os retângulos e o texto no canvas
		var canvas = document.createElement('canvas');
		canvas.width = window.innerWidth;
		canvas.height = window.innerHeight;
		canvas.style.position='absolute';
		canvas.style.left=0;
		canvas.style.top=0;
		canvas.style.zIndex=100000;
		document.body.appendChild(canvas);
		var context = canvas.getContext('2d');

	function init () {
		montanha = new Montanha();
  		skier = new Skier();
  		hud = new Hud();
  		colidiu = 0; // Inicia com zero por não ter colidido em nada ainda
  		spawnMonster = 0; // Vai spawnar o monstro quando for 1
  		monsterTimer = 0; // Seta o início do timer para spawnar o monstro
  		setInterval(incPontuation,1000); // Incrementa a pontuação a cada 1 segundo
  		gameLoop = setInterval(run, 1000/FPS);
  		actualSpeed = BASE_SPEED; // Se o boost estiver ativado passa a ser a velocidade adicional
  		hud.drawHud(); // Começa desenhando a hud
	}

	window.addEventListener('keydown', function (e) {
  		if (e.key == 'a')	
  			skier.mudarDirecao(-1);
  		else if (e.key == 'd')
  			skier.mudarDirecao(1)
  		else if (e.key == 'f' && actualSpeed==BASE_SPEED) { // Ativa o boost de speed se não estiver já ativo
  			actualSpeed = BOOSTED_SPEED;
  			playerBoost = setInterval(stopRun, STOP_RUN_TIMER);
  		}
	});

	function Montanha () {
   		this.element = document.getElementById("montanha");
  		this.element.style.width = TAMX + "px";
  		this.element.style.height = TAMY + "px";
	}

	function Hud(){
		this.points = 0;
		this.incPoints = function(){ // incrementa os pontos a depender da velocidade do player
			var multiplicador
			if (actualSpeed==BASE_SPEED)
				multiplicador=20;
			else
				multiplicador=30;
			this.points+=multiplicador;
			monsterTimer+=multiplicador;
			if (monsterTimer>2000){
				monsterTimer-=2000;
				spawnMonster=1; // flag para spawnar o monstro
			}
		}
		this.drawHud = function(){ // Desenha os itens da hud, caixas e textos.

			context.beginPath();
			context.rect(TAMX+16, 16, 204, 104);
			context.fillStyle = 'gray';
			context.fill();

			context.beginPath();
			context.fillStyle = 'white';
			context.rect(TAMX+22, 22, 192, 92);
			context.fill();

			context.beginPath();
			context.rect(TAMX+24, 24, 188, 88);
			context.fillStyle = 'gray';
			context.stroke();

			context.font = "14px Arial";
			context.fillStyle = "black";
			context.textAlign = "left";
			context.fillText("Metros Percorridos: ", TAMX + 28, 38);
			context.fillText("Vidas Restantes: ", TAMX + 28, 56);

			context.font = "14px Arial";
			context.fillStyle = "black";
			context.textAlign = "left";
			context.fillText(" "+Math.floor(this.points), TAMX + 160, 38);
			context.fillText(" "+skier.vidas, TAMX + 160, 56);
			//context.fillText(" "+spawnMonster+colidiu, TAMX + 160, 72);
			//context.fillText(" "+(parseInt(skier.element.style.top.substr(0,skier.element.style.top.length-2),10)+parseInt(skier.element.clientHeight,10)), TAMX + 25, 72);
			context.clearRect(TAM+16,16,204,104); // Sempre usar isso para atualizar a informação da tela, no caso, isso limpa o que está nessa posição
		}
	}

	function Skier() {
		this.element = document.getElementById("skier");
		this.direcao = 1; //0-esquerda;1-frente;2-direita
		this.vidas = 3;
		this.element.className = 'para-frente';
		this.element.style.top = '200px';
		this.element.style.left = parseInt(TAMX/2)-7 + 'px';

		this.mudarDirecao = function (giro) {
			if (this.direcao + giro >=0 && this.direcao + giro <=2) {
				this.direcao += giro;
				this.element.className = direcoes[this.direcao];
			}
	  	}

		this.andar = function () {
		 	if (this.direcao == 0){
		 		if (this.element.style.left.substr(0,this.element.style.left.length-2) > "0") // como tem sempre o px no final, pra comparar se é maior ou menor, o substr pega somete os números sem os dois últimos caracteres que são "px"
		    		this.element.style.left = (parseInt(this.element.style.left)-1*4) + "px";
		    	else{
	    			this.mudarDirecao(1);
	    			this.mudarDirecao(1);// se fosse para ele ir para baixo so precisava remover essa linha e a de baixo, que são as que invertem o player de lado
	    			this.element.style.left = (parseInt(this.element.style.left)+1*4) + "px";
		    	}
		    }else if (this.direcao == 2){
		 		if (this.element.style.left.substr(0,this.element.style.left.length-2) < TAMX-8) // como tem sempre o px no final, pra comparar se é maior ou menor, o substr pega somete os números sem os dois últimos caracteres que são "px"
	    			this.element.style.left = (parseInt(this.element.style.left)+1*4) + "px";
		    	else{
	    			this.mudarDirecao(-1);
	    			this.mudarDirecao(-1);// se fosse para ele ir para baixo so precisava remover essa linha e a de baixo, que são as que invertem o player de lado
		    		this.element.style.left = (parseInt(this.element.style.left)-1*4) + "px";
		    	}
		   	}
		}
	}

	function Arvore() {
		this.element = document.createElement('div');
		montanha.element.appendChild(this.element);
		this.element.className = 'arvore';
		this.element.style.top = TAMY + "px";
		this.element.style.left = Math.floor(Math.random() * TAMX) + "px";
   	}

   	function ArvoreGrande() {
      	this.element = document.createElement('div');
      	montanha.element.appendChild(this.element);
      	this.element.className = 'arvoregrande';
      	this.element.style.top = TAMY + "px";
      	this.element.style.left = Math.floor(Math.random() * TAMX) + "px";
   	}

   	function Rocha() {
      	this.element = document.createElement('div');
      	montanha.element.appendChild(this.element);
      	this.element.className = 'rocha';
      	this.element.style.top = TAMY + "px";
      	this.element.style.left = Math.floor(Math.random() * TAMX) + "px";
   	}

   	function TocoDeArvore() {
      	this.element = document.createElement('div');
      	montanha.element.appendChild(this.element);
      	this.element.className = 'tocodearvore';
      	this.element.style.top = TAMY + "px";
      	this.element.style.left = Math.floor(Math.random() * TAMX) + "px";
   	}

   	function Cachorro() {
      	this.element = document.createElement('div');
      	montanha.element.appendChild(this.element);
      	this.element.className = 'cachorro';
      	this.element.style.top = TAMY + "px";
      	this.element.style.left = Math.floor(Math.random() * TAMX) + "px";
   	}

   	function Cogumelo() {
		this.element = document.createElement('div');
		montanha.element.appendChild(this.element);
		this.element.className = 'cogumelo';
		this.element.style.top = TAMY + "px";
		this.element.style.left = Math.floor(Math.random() * TAMX) + "px";
   	}

   	function ArbustoEmChamas() {
		this.element = document.createElement('div');
		montanha.element.appendChild(this.element);
		this.element.className = 'arbustoemchamas';
		this.element.style.top = TAMY + "px";
		this.element.style.left = Math.floor(Math.random() * TAMX) + "px";
   	}

   	function Monstro() {
      	this.element = document.createElement('div');
      	montanha.element.appendChild(this.element);
      	this.element.className = 'monstro';
      	this.element.style.top = 0 + "px";
      	this.element.style.left = Math.floor(Math.random() * TAMX) + "px";
   	}

	function run () {
      
      	//ARVORE

      	var random = Math.floor(Math.random() * 1000);
      	if (random <= PROB_ARVORE) {
         	var arvore = new Arvore();
         	arvores.push(arvore);
      	}
      	arvores.forEach(function (a) {
         	a.element.style.top = (parseInt(a.element.style.top)-1*actualSpeed) + "px";
			if (colide(skier,a) && lastColision!=a){ // se houve colisão e ele ainda não contou ele vai setar a colisão
     			colidiu=1;
     			lastColision=a;
			}
      	});

      	//ARVORE GRANDE

      	var random = Math.floor(Math.random() * 1000);
      	if (random <= PROB_ARVOREGRANDE*3) {
         	var arvoregrande = new ArvoreGrande();
         	arvoresgrandes.push(arvoregrande);
      	}
      	arvoresgrandes.forEach(function (a) {
         	a.element.style.top = (parseInt(a.element.style.top)-1*actualSpeed) + "px";
			if (colide(skier,a) && lastColision!=a){ // se houve colisão e ele ainda não contou ele vai setar a colisão
     			colidiu=1;
     			lastColision=a;
			}
      	});

      	//ROCHA

      	var random = Math.floor(Math.random() * 1000);
      	if (random <= PROB_ROCHA*2) {
         	var rocha = new Rocha();
         	rochas.push(rocha);
      	}
      	rochas.forEach(function (a) {
         	a.element.style.top = (parseInt(a.element.style.top)-1*actualSpeed) + "px";
			if (colide(skier,a) && lastColision!=a){ // se houve colisão e ele ainda não contou ele vai setar a colisão
     			colidiu=1;
     			lastColision=a;
			}
      	});

      	//TOCO DE ARVORE

      	var random = Math.floor(Math.random() * 1000);
      	if (random <= PROB_TOCODEARVORE*2) {
         	var tocodearvore = new TocoDeArvore();
         	tocosdearvore.push(tocodearvore);
      	}
      	tocosdearvore.forEach(function (a) {
         	a.element.style.top = (parseInt(a.element.style.top)-1*actualSpeed) + "px";
			if (colide(skier,a) && lastColision!=a){ // se houve colisão e ele ainda não contou ele vai setar a colisão
     			colidiu=1;
     			lastColision=a;
			}
      	});

      	//CACHORRO

      	var random = Math.floor(Math.random() * 1000);
      	if (random <= PROB_CACHORRO*2) {
         	var cachorro = new Cachorro();
         	cachorros.push(cachorro);
      	}
      	cachorros.forEach(function (a) {
         	a.element.style.top = (parseInt(a.element.style.top)-1*actualSpeed) + "px";
         	a.element.style.left = (parseInt(a.element.style.left)+1) + "px";
			if (colide(skier,a) && lastColision!=a){ // se houve colisão e ele ainda não contou ele vai setar a colisão
     			colidiu=1;
     			lastColision=a;
			}
      	});

      	//COGUMELO

      	var random = Math.floor(Math.random() * 1000);
      	if (random <= PROB_COGUMELO*2) {
         	var cogumelo = new Cogumelo();
         	cogumelos.push(cogumelo);
      	}
      	cogumelos.forEach(function (a) {
         	a.element.style.top = (parseInt(a.element.style.top)-1*actualSpeed) + "px";
			if (colide(skier,a) && lastColision!=a){ // se houve colisão e ele ainda não contou ele vai setar a colisão
     			colidiu=2;
     			lastColision=a;
			}
      	});

      	//ARBUSTO EM CHAMAS

      	var random = Math.floor(Math.random() * 1000);
      	if (random <= PROB_ARBUSTOEMCHAMAS*2) {
         	var arbustoemchamas = new ArbustoEmChamas();
         	arbustosemchamas.push(arbustoemchamas);
      	}
      	arbustosemchamas.forEach(function (a) {
         	a.element.style.top = (parseInt(a.element.style.top)-1*actualSpeed) + "px";
			if (colide(skier,a) && lastColision!=a){ // se houve colisão e ele ainda não contou ele vai setar a colisão
     			colidiu=1;
     			lastColision=a;
			}
      	});

      	//MONSTRO

      	if (spawnMonster == 1){
      		spawnMonster = 2 ;
         	var monstro = new Monstro();
         	monstros.push(monstro);
		}
		monstros.forEach(function (a) {
			if (parseInt(a.element.style.top.substr(0,a.element.style.top.length-2),10)>-48){ // se ele ainda está na tela:
				if (actualSpeed == BASE_SPEED){ // se o player não está correndo
					if (parseInt(a.element.style.top.substr(0,a.element.style.top.length-2),10)<parseInt(skier.element.style.top.substr(0,skier.element.style.top.length-2),10)) // checa se sobe ou desce
			        	a.element.style.top = (parseInt(a.element.style.top)+2) + "px";
			       	else
			        	a.element.style.top = (parseInt(a.element.style.top)-2) + "px";
		    	}else{ // se estiver correndo vai subindo na tela lentamente até sumir
		    		a.element.style.top = (parseInt(a.element.style.top)-1) + "px";
		    	}
				if (Math.sqrt(Math.pow(parseInt(a.element.style.left.substr(0,a.element.style.left.length-2),10)-parseInt(skier.element.style.left.substr(0,skier.element.style.left.length-2),10),2))>5){ // se está distante verticalmente mais de 5 pixels ele vai tentar alinhar
					if (parseInt(a.element.style.left.substr(0,a.element.style.left.length-2),10)>parseInt(skier.element.style.left.substr(0,skier.element.style.left.length-2),10))
						a.element.style.left = (parseInt(a.element.style.left)-3)+"px";
					else
						a.element.style.left = (parseInt(a.element.style.left)+3)+"px";
				}

				if (colide(skier,a) && lastColision!=a){ // se houve colisão e ele ainda não contou ele vai setar a colisão
	     			colidiu=3;
	     			lastColision=a;
				}
			}else{
				delete a;
			}
	    });

	    if (colidiu>0){ // se houve colisão enfim ele vai reagir ao tipo de colisão
	    	if (colidiu==1){
		    	if (skier.vidas>0){ // se ainda não morreu ele vai perder vida
		    		//imagem dele recebendo dano
		    		skier.vidas-=1;
		    	}//else
		    		// imagem dele perdendo o jogo
		    }else if (colidiu == 2) // cogumelo heala ele
		    	skier.vidas+=1;
	    	colidiu=0;
	    }

		colidiu=0; // reseta a colisão para analizar o próximo frame
      	skier.andar();
  		hud.drawHud(); // Vai sempre desenhar a hud, em todos os frames do jogo
	}

	function incPontuation() {
		hud.incPoints();
	}

	function stopRun() { // Essa função basicamente reseta o contador do boost do player e volta a velocidade normal
      	actualSpeed = BASE_SPEED;
  		clearInterval(playerBoost);
	}

	function colide(a, b) { // Funcção para checar se dois objetos estão colidindo (bem rudimentar)

	    return !(
	        (parseInt(a.element.style.top.substr(0,a.element.style.top.length-2),10)  > parseInt(b.element.style.top.substr(0,b.element.style.top.length-2),10)+parseInt(b.element.clientHeight,10)) ||
	        (parseInt(b.element.style.top.substr(0,b.element.style.top.length-2),10)  > parseInt(a.element.style.top.substr(0,a.element.style.top.length-2),10)+parseInt(a.element.clientHeight,10)) ||
	        (parseInt(a.element.style.left.substr(0,a.element.style.left.length-2),10) > parseInt(b.element.style.left.substr(0,b.element.style.left.length-2),10)+parseInt(b.element.clientWidth,10)) ||
	        (parseInt(b.element.style.left.substr(0,b.element.style.left.length-2),10) > parseInt(a.element.style.left.substr(0,a.element.style.left.length-2),10)+parseInt(a.element.clientWidth,10))
	    );
	}

	function gameOver(){
		location.reload();
	}

	init();
})();