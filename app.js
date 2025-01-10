const urlApi = 'https://jsonplaceholder.typicode.com/users'

//função para carregar todos os dados e mostrar ao usuario quando a tela carrega
window.onload = () => {
    obterDados().then((response) => mostrarDados(response))
}
//função para fazer a conexão com  a api
function chamarApi() {
    return new Promise((resolve, reject) => {
        //fazendo conexão com Api 
        fetch(urlApi).then((response) => {
            //validando se a requisição retornou com algum erro
            if (!response.ok) {
                reject(`Erro ${response.status} durante a requisição. Por favor contacte seu administrador de T.I`)
            }
            resolve(response)
        })
    })
}

//função para obter dados do Json retornado pela Api
function obterDados() {
    chamarTelaLoading()
    return new Promise((resolve) => {
        chamarApi()
            //alertando caso de erro 
            .catch((erro) => { mostrarErro(erro) })
            //obtendo a resposta da api e transformadno em arquivo json
            .then((response) => {
                response.json()
                    .then((dados) => {
                        // criando um array de objetos e fazendo um loop para extrair o nome, email e cidade do arquivo json para o novo array de objetos 
                        dadosUsuarios = []
                        dados.forEach(dado => {
                            dadosUsuarios.push({ nome: dado.name, email: dado.email, cidade: dado.address.city })
                        });
                        tirarTelaLoading()
                        resolve(dadosUsuarios)
                    })
            })
    })
}

//função para validar se o dado digitado pelo usuario está presente no array de ususarios
function buscarDados(dadoBuscado) {
    const input = document.getElementById("container_form_inputText")
    input.value = ""
    //variavel para validar se o dado foi encontrado
    let encontrouDado = false
    //array de resultados da busca
    obterDados().then((dadosUsuarios) => {
        usuariosEncontrados = []

        //criando expressão regular para realizar a busca do dado dentro da string
        const regex = new RegExp(dadoBuscado, "gi")
        dadosUsuarios.forEach(usuario => {
            //validação se o dado digitado está no objeto. Se o dado for em branco todos os usuarios serão retornados
            if (usuario.nome.match(regex) || usuario.email.match(regex) || usuario.cidade.match(regex)) {
                //passando todos os resultados encontrados para o array 
                usuariosEncontrados.push(usuario)
                encontrouDado = true
            }
        });

        //trataiva caso o dado digitado não seja encontrado
        if (encontrouDado === false) {
            alert(`O valor "${dadoBuscado}" infelizmente não foi encontrado em nossa base de dados`)
        } else {
            //chamando a função que mostrará os dados ao usuário
            mostrarDados(usuariosEncontrados)
        }

    })
}

//função para mostrar ao usuario os dados vindos da função buscarDados caso o dado seja encontrado
function mostrarDados(usuariosEncontrados) {
    //pegando a referencia do corpo da tabela
    const corpoTabela = document.getElementById('container_table_tbody')
    const tr = document.createElement("tr")

    //limpando o corpo da tabela
    corpoTabela.innerHTML = '<tbody></tbody>'

    //adicionando o elemento tr na tabela
    corpoTabela.appendChild(tr)
    //fazendo um loop para adicionar uma linha para cada usuario encontrado na busca
    usuariosEncontrados.forEach(usuario => {
        novaLinhaUsuario = `   <td>${usuario.nome}</td>
                                <td>${usuario.email}</td>
                                <td>${usuario.cidade}</td>
                            `
        tr.insertAdjacentHTML('beforebegin', novaLinhaUsuario)
    })

}

//função para fazer a tela de loading
function chamarTelaLoading() {
    //atribuindo às variaveis div e p a criação das respectivas tags 
    const div = document.createElement("div")
    const p = document.createElement("p")
    const gif = document.createElement("img")

    gif.src = "img/gif_loading.gif"
    //atribuindo a tag p o texto
    p.innerText = "Buscando dados.."
    //adicionando o id na div
    div.id = "div_loading"
    //adiionando a tag p na div e posteriormente adicionando a div no corpo do html
    div.appendChild(gif)
    div.appendChild(p)
    document.body.appendChild(div)
}

//função para retirar a tela de loading
function tirarTelaLoading() {
    // obtendo a referencia da div de loading
    divLoading = document.getElementById("div_loading")
    //removendo a div de loading após 0.7s
    setTimeout(() => { divLoading.remove() }, 700)
}

//detectando o clique da tecla Enter e acionando o click do botão 
document.addEventListener('keypress', (e) => {
    btnContainer = document.getElementById("container_form_btn")
    if (e.key === "Enter") {
        btnContainer.click()
    }
})

//função que cria uma pagina de erro e mostra ao usuário
function mostrarErro(erro) {
    const div = document.createElement("div")
    const p = document.createElement("p")
    const img = document.createElement("img")

    img.src = "img/alerta.png"
    p.innerText = erro
    div.id = "div_erro"
    //adiionando as tags na div e posteriormente adicionando a div no corpo do html
    div.appendChild(img)
    div.appendChild(p)
    document.body.appendChild(div)
}