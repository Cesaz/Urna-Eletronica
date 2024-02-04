let seuVotoPara = document.querySelector('.d1_area_1 span'); // Your vote for (element that displays "Your vote for")
let cargo = document.querySelector('.d1_area_2 span'); // Position (element that displays the position/title)
let descricao = document.querySelector('.d1_area_4'); // Description (element that displays candidate's name and party)
let aviso = document.querySelector('.d2'); // Warning (element that displays messages or alerts)
let lateral = document.querySelector('.d1_right'); // Sidebar (element that displays candidate photos)
let numeros = document.querySelector('.d1_area_3'); // Numbers (element that displays the number input area)
let confirmaAudio = document.querySelector('#confirma_audio');
let fimAudio = document.querySelector('#fim_audio');

let etapaAtual = 0; // Current stage (current step of the voting process)
let numero = ''; // Number (current input number for the candidate)
let votoBranco = false; // Blank vote (indicates if the voter has selected a blank vote)
let votos = []; // Votes (array to store the voter's choices)

function comecarEtapa() {
    let etapa = etapas[etapaAtual]; // Get the current stage data from the "etapas" array

    let numeroHTML = '';
    numero = '';
    votoBranco = false;

    for (let i = 0; i < etapa.numeros; i++) {
        if (i === 0) {
            numeroHTML += '<div class="numero pisca"></div>'; // Creates number input area with a blinking cursor for the first digit
        } else {
            numeroHTML += '<div class="numero"></div>'; // Creates number input area for the remaining digits
        }
    }

    seuVotoPara.style.display = 'none'; // Hide the "Your vote for" element
    cargo.innerHTML = etapa.titulo; // Display the position/title of the current stage
    descricao.innerHTML = ''; // Clear the candidate description area
    aviso.style.display = 'none'; // Hide any warning messages
    lateral.innerHTML = ''; // Clear the candidate photo area
    numeros.innerHTML = numeroHTML; // Display the number input area for the current stage
}

function atualizaInterface() {
    let etapa = etapas[etapaAtual]; // Get the current stage data from the "etapas" array
    let candidato = etapa.candidatos.filter((item) => {
        if (item.numero === numero) {
            return true;
        } else {
            return false;
        }
    });

    if (candidato.length > 0) {
        candidato = candidato[0];
        seuVotoPara.style.display = 'block'; // Show the "Your vote for" element
        aviso.style.display = 'block'; // Show any warning messages
        descricao.innerHTML = `Nome: ${candidato.nome}<br/>Partido: ${candidato.partido}`; // Display candidate's name and party

        let fotosHtml = '';
        for (let i in candidato.fotos) {
            if (candidato.fotos[i].small) {
                fotosHtml += `<div class="d1_imagem small"><img src="images/${candidato.fotos[i].url}" alt="">${candidato.fotos[i].legenda}</div>`;
            } else {
                fotosHtml += `<div class="d1_imagem"><img src="images/${candidato.fotos[i].url}" alt="">${candidato.fotos[i].legenda}</div>`;
            }
        }

        lateral.innerHTML = fotosHtml; // Display the candidate photos
    } else {
        seuVotoPara.style.display = 'block'; // Show the "Your vote for" element
        aviso.style.display = 'block'; // Show any warning messages
        descricao.innerHTML = '<div class="aviso_grande pisca">VOTO NULO</div>'; // Display a warning message for null vote
    }
}

function clicou(n) {
    let elNumero = document.querySelector('.numero.pisca');
    if (elNumero !== null) {
        elNumero.innerHTML = n; // Fill the current digit with the clicked number
        numero = `${numero}${n}`; // Add the clicked number to the overall number

        elNumero.classList.remove('pisca'); // Remove the blinking cursor class from the current digit
        if (elNumero.nextElementSibling !== null) {
            elNumero.nextElementSibling.classList.add('pisca'); // Add the blinking cursor class to the next digit
        } else {
            atualizaInterface(); // Update the interface (e.g., display candidate information) after entering all digits
        }
    }
}

function branco() {
    if (numero === '') {
        votoBranco = true;
        seuVotoPara.style.display = 'block'; // Show the "Your vote for" element
        aviso.style.display = 'block'; // Show any warning messages
        numeros.innerHTML = ''; // Clear the number input area
        descricao.innerHTML = '<div class="aviso_grande pisca">VOTO EM BRANCO</div>'; // Display a warning message for blank vote
    } else {
        alert("Para votar em BRANCO, não pode ter digitado nenhum número!"); // Alert message if trying to vote blank after entering a number
    }
}

function corrige() {
    comecarEtapa(); // Restart the current stage (reset all inputs and display)
}

function confirma() {
    let etapa = etapas[etapaAtual]; // Get the current stage data from the "etapas" array
    let votoConfirmado = false;

    confirmaAudio.play()

    if (votoBranco === true) {
        votoConfirmado = true;
        votos.push({
            etapa: etapas[etapaAtual].titulo,
            voto: 'branco'
        });
    } else if (numero.length === etapa.numeros) {
        votoConfirmado = true;
        votos.push({
            etapa: etapas[etapaAtual].titulo,
            voto: numero
        });
    }

    if (votoConfirmado) {
        etapaAtual++;
        if (etapas[etapaAtual] !== undefined) {
            comecarEtapa(); // Move to the next stage if available
        } else {
            document.querySelector('.tela').innerHTML = '<div class="aviso_gigante pisca">FIM</div>'; // Display the end screen
            fimAudio.play(); // Play the end screen sound effect
            console.log(votos); // Output the collected votes to the console
        }
    }
}

comecarEtapa(); // Start the voting process by initializing the first stage