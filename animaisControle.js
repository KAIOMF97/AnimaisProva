let listaAnimal = []; //conjunto de dados
let oQueEstaFazendo = ''; //variável global de controle
let animal = null; //variavel global 
bloquearAtributos(true);



function dadosIniciais() { //dados iniciais da lista
    listaAnimal.push(new Animal('0', 'Leão', 'Leonidas', 'Dourado', '2017-08-10', 'Macho', 'Perigo Extremo'));
    listaAnimal.push(new Animal('1', 'Gorila', 'Juca', 'Preto', '2002-11-26', 'Macho', 'Perigo Considerável'));
    listaAnimal.push(new Animal('2', 'Arara', 'Max', 'Azul', '2020-05-04', 'Macho', 'Nenhum Perigo'));
    listaAnimal.push(new Animal('3', 'Girafa', 'Gina', 'Amarelo', '1997-01-01', 'Fêmea', 'Baixo Perigo'));
    listaAnimal.push(new Animal('4', 'Hipopótamo', 'Glória', 'Roxo', '1999-01-01', 'Fêmea', 'Alto Perigo'));
    listaAnimal.push(new Animal('5', 'Golfinho', 'Boto', 'Azul', '2010-01-01', 'Macho', 'Baixo Perigo'));
    listaAnimal.push(new Animal('6', 'Tigre', 'Risadinha', 'Laranja', '2018-05-25', 'Macho', 'Perigo Extremo'));
    listar();
}


function fazerDownload() { //gera um arquivo csv com as informações de listaAnimal
    nomeParaSalvar = "./Animal.csv";  //define o nome do arquivo csv
    let textoCSV = "";
    for (let i = 0; i < listaAnimal.length; i++) {
        const linha = listaAnimal[i]; //variavel linha contem as informações de cada musica
        textoCSV += linha.id + ";" + //concatena os dados das musicas formatados para linha csv (separada por ;)
            linha.especie + ";" +
            linha.nome + ";" +
            linha.cor + ";" +
            linha.dataNascimento + ";" +
            linha.sexo + ";" +
            linha.nivelPerigo + "\n";
    }


    salvarEmArquivo(nomeParaSalvar, textoCSV);
}


function salvarEmArquivo(nomeArq, conteudo) {
    /*cria um blob (objeto que representa dados de arquivo) que armazena "[conteudo]" como arquivo de texto,
    criando um arquivo temporário*/
    const blob = new Blob([conteudo], { type: 'text/plain' });
    //cria o elemento "a" (link temporário) usado para adicionar o dowload do arquivo
    const link = document.createElement('a'); /*cria uma URL temporária que aponta para o blob e
    atribui ela ao href do link para que ele "aponte" para o arquivo gerado (permitindo seu download)*/
    link.href = URL.createObjectURL(blob);
    link.download = nomeArq; // Nome do arquivo de download
    link.click(); //inicia o processo de dowload automaticamente
    // Libera o objeto URL
    URL.revokeObjectURL(link.href); //remove a URL temporária que foi criada (liberando a memória)
}


// Função para abrir o seletor de arquivos para upload (para processar o arquivo selecionado)
function fazerUpload() {
    
    const input = document.createElement('input');
    //cria o elemento input do tipo file (serve para abrir o seletor de arquivos)
    input.type = 'file';
    input.accept = '.csv'; // Aceita apenas arquivos CSV do sistema local
    input.onchange = function (event) {
        /*associa uma função de evento ao onchange, que será chamada quando o usuário selecionar um arquivo
        O evento change é disparado quando um arquivo é selecionado*/
        const arquivo = event.target.files[0]; //acessa o arquivo selecionado e armazena na variavel arquivo
        console.log(arquivo.name);
        if (arquivo) {
            processarArquivo(arquivo);
        }
        /*verifica se um arquivo foi selecionado: 
        se sim, chama a função processarArquivo e passa o arquivo selecionado como argumento
        permitindo que o arquivo seja lido e processado na função processarArquivo*/
    };
    input.click(); //seletor de arquivos exibido automaticamente
    
}


// Função para processar o arquivo CSV e transferir os dados para a listaAnimal
function processarArquivo(arquivo) {
    const leitor = new FileReader();  //objeto que permite ler arquivos locais no navegador 
    leitor.onload = function (e) {
        const conteudo = e.target.result; // Conteúdo do arquivo CSV
        const linhas = conteudo.split('\n'); // Separa o conteúdo por linha
        listaAnimal = []; // Limpa a lista atual (se necessário)
        for (let i = 0; i < linhas.length; i++) {
            const linha = linhas[i].trim();  //linhas[i] representa cada linha do arquivo CSV
            if (linha) { //verifica se a linha não está vazia
                const dados = linha.split(';'); // Separa os dados por ';'
                if (dados.length === 7) { //verifica os sete campos
                    // Adiciona os dados à listaAnimal como um objeto
                    listaAnimal.push({
                        id: dados[0],
                        especie: dados[1],
                        nome: dados[2],
                        cor: dados[3],
                        dataNascimento: dados[4],
                        sexo: dados[5],
                        nivelPerigo: dados[6]
                    })
                }
            }
        }
        listar(); //exibe a lista atualizada
    };
    leitor.readAsText(arquivo); // Lê o arquivo como texto
}



//backend (não interage com o html)
function procurePorChavePrimaria(chave) {
    for (let i = 0; i < listaAnimal.length; i++) {
        const animal = listaAnimal[i];
        if (animal.id == chave) {
            animal.posicaoNaLista = i;
            return listaAnimal[i];
        }
    }
    return null;//não achou
}

// Função para procurar um elemento pela chave primária   -------------------------------------------------------------
function procure() {
    const id = document.getElementById("id").value;
    if (isNaN(id) || !Number.isInteger(Number(id))) {
        mostrarAviso("Precisa ser um número inteiro");
        document.getElementById("id").focus();
        return;
    }

    if (id) { // se digitou um Id
        animal = procurePorChavePrimaria(id);
        if (animal) { //achou na lista
            mostrarDadosanimal(animal);
            visibilidadeDosBotoes('inline', 'none', 'inline', 'inline', 'none'); // Habilita botões de alterar e excluir
            mostrarAviso("Achou na lista, pode alterar ou excluir");
        } else { //não achou na lista
            limparAtributos();
            visibilidadeDosBotoes('inline', 'inline', 'none', 'none', 'none');
            mostrarAviso("Não achou na lista, pode inserir");
        }
    } else {
        document.getElementById("id").focus();
        return;
    }
}

//backend->frontend
function inserir() {
    bloquearAtributos(false);
    visibilidadeDosBotoes('none', 'none', 'none', 'none', 'inline'); //visibilidadeDosBotoes(procure,inserir,alterar,excluir,salvar)
    oQueEstaFazendo = 'inserindo';
    mostrarAviso("INSERINDO - Digite os atributos e clic o botão salvar");
    document.getElementById("inputId").focus();

}

// Função para alterar um elemento da lista
function alterar() {

    // Remove o readonly dos campos
    bloquearAtributos(false);

    visibilidadeDosBotoes('none', 'none', 'none', 'none', 'inline');

    oQueEstaFazendo = 'alterando';
    mostrarAviso("ALTERANDO - Digite os atributos e clic o botão salvar");
}

// Função para excluir um elemento da lista
function excluir() {
    bloquearAtributos(false);
    visibilidadeDosBotoes('none', 'none', 'none', 'none', 'inline'); //visibilidadeDosBotoes(procure,inserir,alterar,excluir,salvar)

    oQueEstaFazendo = 'excluindo';
    mostrarAviso("EXCLUINDO - clic o botão salvar para confirmar a exclusão");
}

function salvar() {
    //gerencia operações inserir, alterar e excluir na lista

    // obter os dados a partir do html

    let id;
    if (animal == null) {
        id = parseInt(document.getElementById("id").value);
    } else {
        id = animal.id;
    }

    const especie = document.getElementById("especie").value;
    const nome = document.getElementById("nome").value;
    const cor = document.getElementById("cor").value;
    const dataNascimento = document.getElementById("dataNascimento").value;
    const sexo = document.getElementById("sexo").value;
    const nivelPerigo = document.getElementById("nivelPerigo").value;
    //verificar se o que foi digitado pelo USUÁRIO está correto
    if (id && especie && nome && cor && dataNascimento && sexo && nivelPerigo) {// se tudo certo 
        switch (oQueEstaFazendo) {
            case 'inserindo':
                animal = new Animal(id, especie, nome, cor, dataNascimento, sexo, nivelPerigo);
                listaAnimal.push(animal);
                mostrarAviso("Inserido na lista");
                break;
            case 'alterando':
                animalAlterado = new Animal(id, especie, nome, cor, dataNascimento, sexo, nivelPerigo);
                listaAnimal[animal.posicaoNaLista] = animalAlterado;
                mostrarAviso("Alterado");
                break;
            case 'excluindo':
                let novaLista = [];
                for (let i = 0; i < listaAnimal.length; i++) {
                    if (animal.posicaoNaLista != i) {
                        novaLista.push(listaAnimal[i]);
                    }
                }
                listaAnimal = novaLista;
                mostrarAviso("EXCLUIDO");
                break;
            default:
                // console.error('Ação não reconhecida: ' + oQueEstaFazendo);
                mostrarAviso("Erro aleatório");
        }
        visibilidadeDosBotoes('inline', 'none', 'none', 'none', 'none');
        limparAtributos();
        listar();
        document.getElementById("inputId").focus();
    } else {
        alert("Erro nos dados digitados");
        return;
    }
}

//backend
function preparaListagem(lista) {
        let texto = "<table><tr><th>ID</th><th>Espécie</th><th>Nome</th><th>Cor</th><th>Data de Nascimento</th><th>Sexo</th><th>Nível de Perigo</th></tr>";
        
        // Usando um loop 'for' para iterar pela lista
        for (let i = 0; i < lista.length; i++) {
            let animal = lista[i];
            texto += `<tr>
                <td>${animal.id}</td>
                <td>${animal.especie}</td>
                <td>${animal.nome}</td>
                <td>${animal.cor}</td>
                <td>${animal.dataNascimento}</td>
                <td>${animal.sexo}</td>
                <td>${animal.nivelPerigo}</td>
            </tr>`;
        }
    
        texto += "</table>";
        return texto;
    }

dadosIniciais();

//backend->frontend (interage com html)
function listar() {
    document.getElementById("outputSaida").innerHTML = preparaListagem(listaAnimal);
}

function cancelarOperacao() {
    limparAtributos();
    bloquearAtributos(true);
    visibilidadeDosBotoes('inline', 'none', 'none', 'none', 'none');
    mostrarAviso("Cancelou a operação de edição");
}

function mostrarAviso(mensagem) {
    //printa a mensagem na divAviso
    document.getElementById("divAviso").innerHTML = mensagem;
}

// Função para mostrar os dados do animal nos campos
function mostrarDadosanimal(animal) {
    document.getElementById("id").value = animal.id;
    document.getElementById("especie").value = animal.especie;
    document.getElementById("nome").value = animal.nome;
    document.getElementById("cor").value = animal.cor;
    document.getElementById("dataNascimento").value = animal.dataNascimento;
    document.getElementById("sexo").value = animal.sexo;
    document.getElementById("nivelPerigo").value = animal.nivelPerigo;

    // Define os campos como readonly
    bloquearAtributos(true);
}

// Função para limpar os dados dos campos
function limparAtributos() {
    document.getElementById("nome").value = "";
    document.getElementById("especie").value = "";
    document.getElementById("cor").value = "";
    document.getElementById("dataNascimento").value = "";
    document.getElementById("sexo").value = "";
    document.getElementById("nivelPerigo").value = "";

    bloquearAtributos(true);
}

function bloquearAtributos(soLeitura) {
    //quando a chave primaria possibilita edicao, tranca (readonly) os outros e vice-versa
    document.getElementById("id").readOnly = !soLeitura;
    document.getElementById("especie").readOnly = soLeitura;
    document.getElementById("nome").readOnly = soLeitura;
    document.getElementById("cor").readOnly = soLeitura;
    document.getElementById("dataNascimento").readOnly = soLeitura;
    document.getElementById("sexo").readOnly = soLeitura;
    document.getElementById("nivelPerigo").readOnly = soLeitura;
}

// Função para deixar visível ou invisível os botões
function visibilidadeDosBotoes(btProcure, btInserir, btAlterar, btExcluir, btSalvar) {
    //  visibilidadeDosBotoes('none', 'none', 'none', 'none', 'inline'); 
    //none significa que o botão ficará invisível (visibilidade == none)
    //inline significa que o botão ficará visível 

    document.getElementById("btProcure").style.display = btProcure;
    document.getElementById("btInserir").style.display = btInserir;
    document.getElementById("btAlterar").style.display = btAlterar;
    document.getElementById("btExcluir").style.display = btExcluir;
    document.getElementById("btSalvar").style.display = btSalvar;
    document.getElementById("btCancelar").style.display = btSalvar; // o cancelar sempre aparece junto com o salvar
    document.getElementById("id").focus();
}