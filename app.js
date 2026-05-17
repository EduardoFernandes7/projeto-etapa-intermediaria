// Elementos do DOM
const cepInput = document.getElementById('cepInput');
const buscarBtn = document.getElementById('buscarBtn');
const resultBox = document.getElementById('resultBox');
const errorMessage = document.getElementById('errorMessage');

const logradouro = document.getElementById('logradouro');
const bairro = document.getElementById('bairro');
const cidade = document.getElementById('cidade');
const estado = document.getElementById('estado');

// Função responsável por consumir a API
async function buscarCEP(cep) {
    // Remove caracteres não numéricos
    const cleanCEP = cep.replace(/\D/g, '');

    // Validação inicial simples
    if (cleanCEP.length !== 8) {
        showError('Por favor, digite um CEP válido com 8 dígitos.');
        return;
    }

    try {
        // Esconde caixas anteriores
        resultBox.classList.add('hidden');
        errorMessage.classList.add('hidden');

        // Requisição HTTP GET para a API Pública ViaCEP
        const response = await fetch(`https://viacep.com.br/ws/${cleanCEP}/json/`);
        
        if (!response.ok) {
            throw new Error('Erro na comunicação com o servidor.');
        }

        const data = await response.json();

        // A API do ViaCEP retorna "erro: true" se o CEP não existir na base deles
        if (data.erro) {
            showError('CEP não encontrado na base de dados.');
            return;
        }

        // Injeta os dados na interface (GUI)
        logradouro.innerText = data.logradouro || 'Não informado';
        bairro.innerText = data.bairro || 'Não informado';
        cidade.innerText = data.localidade;
        estado.innerText = data.uf;

        // Mostra o resultado
        resultBox.classList.remove('hidden');

    } catch (error) {
        showError('Falha ao conectar com o serviço de CEP. Verifique sua internet.');
        console.error(error);
    }
}

function showError(msg) {
    errorMessage.innerText = msg;
    errorMessage.classList.remove('hidden');
    resultBox.classList.add('hidden');
}

// Event Listners
buscarBtn.addEventListener('click', () => {
    buscarCEP(cepInput.value);
});

cepInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') {
        buscarCEP(cepInput.value);
    }
});