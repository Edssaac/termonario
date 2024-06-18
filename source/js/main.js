const form = document.querySelector("form");
const input = document.getElementById("term");
const infoSection = document.getElementById("div--info");
const infoTextarea = document.getElementById("info");
const alertBox = document.getElementById("alert");
const clearButton = document.getElementById("clear");

const getRandomWord = () => {
    const words = [
        "Diletante",
        "Escamotear",
        "Êmulo",
        "Obnubilar",
        "Pândego",
        "Peregrino",
        "Perquirir",
        "Quimera",
        "Serpejar",
        "Torvo"
    ];

    const randomIndex = Math.floor(Math.random() * words.length);

    return words[randomIndex];
};

const clearInformation = () => {
    infoSection.classList.add("hidden");
    clearButton.classList.add("hidden");
    alertBox.classList.add("hidden");
    infoTextarea.value = "";
};

const searchTerm = async (term) => {
    const endpoint = `https://api.dicionario-aberto.net/word/${term.toLowerCase()}/1`;

    try {
        const response = await fetch(endpoint);

        if (response.status !== 200) {
            throw new Error("Não foi possível se conectar ao serviço.");
        }

        const data = await response.json();

        return data.length > 0 ? data : null;
    } catch (error) {
        console.error("Erro ao consultar termo:", error);

        return null;
    }
};

const parseXMLToText = (xml) => {
    const parser = new DOMParser();
    const xmlDoc = parser.parseFromString(xml, "text/xml");
    const entry = xmlDoc.getElementsByTagName("entry")[0];
    let text = '';

    if (!entry) {
        return text;
    }

    const orthElement = entry.getElementsByTagName('orth')[0];
    const orth = orthElement ? orthElement.textContent : 'N/A';
    const etymElement = entry.getElementsByTagName('etym')[0];
    const etym = etymElement ? etymElement.textContent : 'N/A';
    const etymOrig = etymElement ? etymElement.getAttribute('orig') : 'N/A';

    text += `Ortografia: ${orth} \n\n`;
    text += `Significados: \n`;
    text += `--------------------\n\n`;

    const senses = entry.getElementsByTagName('sense');

    for (let sense of senses) {
        const gramGrpElement = sense.getElementsByTagName('gramGrp')[0];
        const gramGrp = gramGrpElement ? gramGrpElement.textContent : '';
        const usgs = sense.getElementsByTagName('usg');
        let usgText = [];

        for (let usg of usgs) {
            if (usg.textContent) {
                usgText.push(usg.textContent);
            }
        }

        const defElement = sense.getElementsByTagName('def')[0];
        const def = defElement ? defElement.textContent.trim().split('\n').map(d => d.trim()).join('\n - ') : 'Definição não encontrada';

        text += `${gramGrp ? `Grupo Gramatical: ${gramGrp}\n` : ''}`;
        text += `${usgText.length > 0 ? `Estilo: ${usgText.join(', ')}\n` : ''}`;
        text += `Definições:\n - ${def}\n\n`;
        text += `--------------------\n\n`;
    }

    text += `Etimologia:\n  Origem: ${etymOrig}\n  ${etym}`;

    return text;
};

window.onload = () => {
    input.placeholder = getRandomWord();
};

clearButton.addEventListener("click", () => {
    clearInformation();

    input.value = "";
    input.focus();
});

form.addEventListener("submit", async (event) => {
    event.preventDefault();
    clearInformation();

    const searchTermValue = input.value.trim();

    if (searchTermValue === "") {
        return;
    }

    const data = await searchTerm(searchTermValue);

    if (data === null) {
        alertBox.classList.remove("hidden");
        clearButton.classList.remove("hidden");

        return;
    }

    let text = "";

    data.forEach((term) => {
        if ('xml' in term && term.xml !== "") {
            text = parseXMLToText(term.xml);
        }
    });

    if (text.length === 0) {
        alertBox.classList.remove("hidden");
        clearButton.classList.remove("hidden");

        return;
    }

    infoTextarea.value = text;
    infoSection.classList.remove("hidden");
    clearButton.classList.remove("hidden");
});