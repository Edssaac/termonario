// Lista de constantes necessárias para o projeto:
const form = document.querySelector("form"); // Formulário
const input = document.getElementById("termo"); // Input de pesquisa
const infos = document.getElementById("div--info"); // Campo de informações
const informacoes = document.getElementById("info"); // textarea de informações
const alert = document.getElementById("alert"); // Aviso de erro
const limpar = document.getElementById("limpar"); // Botão de limpar

// Função responsável por sortear uma palavra aleatória:
function obterPalavraAleatoria() {
    const palavras = [
        "Admoesta",
        "Coledocoduodenostomia",
        "Dacriocistossiringotomia",
        "Estrênuo",
        "Exórdio",
        "Fenecimento",
        "Ígneo",
        "Loquaz",
        "Ooforossalpingectomia",
        "Parco",
        "Rubicundo",
        "Traquelossuboccipital",
        "Tênue",
    ];

    const sorteada = Math.floor(Math.random() * palavras.length);

    return palavras[sorteada];
}

async function pesquisarTermo(termo) {
    const endpoint = "https://significado.herokuapp.com/v2/";
    const response = await fetch(`${endpoint}${termo}`);

    if (response.status !== 200) {
        return false;
    }

    const data = await response.json();

    return data;
}

// Função responsável por limpar e ocultar as informações exibidas na tela:
function limparInformacoes() {
    infos.classList.add("ocultado");
    limpar.classList.add("ocultado");
    alert.classList.add("ocultado");
    informacoes.value = "";
}

// Escutando o evento de submit do form (realizado ao pesquisar um termo):
form.addEventListener("submit", async (event) => {
    event.preventDefault();
    limparInformacoes();

    if (input.value == "") {
        return;
    }

    const dados = await pesquisarTermo(input.value);

    if (dados) {
        infos.classList.remove("ocultado");
        var texto = "";

        for (var i = 0; i < dados.length; i++) {
            if (i !== 0) {
                texto += '\n' + "-".repeat(10) + "\n";
            }

            texto += "📚 Tipo: " + (dados[i].partOfSpeech ? dados[i].partOfSpeech : "-");

            texto += "\n📜 Significados:\n";
            for (var significado of dados[i].meanings) {
                texto += `\t▪️ ${significado}\n`;
            }

            texto += "🔎 Etimologia: " + (dados[i].etymology ? dados[i].etymology : "-");
        }

        informacoes.value = texto;
    } else {
        alert.classList.remove("ocultado");
    }

    limpar.classList.remove("ocultado");
});

limpar.addEventListener("click", () => {
    limparInformacoes();

    input.value = "";
    input.focus();
});

// Iniciando a extensão com uma palavra aleátoria como placeholder:
onload = () => {
    input.placeholder = obterPalavraAleatoria();
}