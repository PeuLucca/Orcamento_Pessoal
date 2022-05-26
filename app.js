class Despesa{
    constructor(ano, mes, dia, tipo, descricao, valor){
        this.ano = ano,
        this.mes = mes,
        this.dia = dia,
        this.tipo = tipo,
        this.descricao = descricao,
        this.valor = valor
    }

    validarDados(){
        for( let i in this ){
            if( this[i] == undefined || this[i] == '' || this[i] == null ){
                return false
            }
        }

        return true
    }
}

class Bd{

    constructor(){
        let id = localStorage.getItem('id')

        if(id === null){
            localStorage.setItem('id', 0)
        }
    }

    getProximoId(){
        let proximoId = localStorage.getItem('id')
        return parseInt( proximoId ) + 1
    }

    gravar(despesa){
        let id = this.getProximoId()

        localStorage.setItem( id, JSON.stringify(despesa) )
        localStorage.setItem( 'id' , id )
    }

    recuperarTodosRegistros(){

        // array de despesas
        let despesas = Array()

        let id = localStorage.getItem( 'id' )

        for( let i = 1; i<=id; i++ ){
            let despesa = JSON.parse( localStorage.getItem(i) )
            if( despesa === null ){
                continue 
                // continue: quando dentro de uma estrutura de laço
                // faz com que o laço pule para a interação seguinte
            }

            despesa.id = i
            despesas.push( despesa )
        }

        return despesas
    } 

    pesquisar(despesa){
        let despesasFiltradas = Array()

        despesasFiltradas = this.recuperarTodosRegistros()
        
        console.log( despesa ) // despesa digitada pelo cliente
        console.log( despesasFiltradas ) // todas as despesas

        //ano
        if( despesa.ano != '' ){
            despesasFiltradas 
            = despesasFiltradas.filter(i=>i.ano==despesa.ano)
        }

        //mes
        if( despesa.mes != '' ){
            despesasFiltradas 
            = despesasFiltradas.filter(i=>i.mes==despesa.mes)
        }

        //dia
        if( despesa.dia != '' ){
            despesasFiltradas 
            = despesasFiltradas.filter(i=>i.dia==despesa.dia)
        }

        //tipo
        if( despesa.tipo != '' ){
            despesasFiltradas 
            = despesasFiltradas.filter(i=>i.tipo==despesa.tipo)
        }

        //descrição
        if( despesa.descricao != '' ){
            despesasFiltradas 
            = despesasFiltradas.filter(i=>i.descricao==despesa.descricao)
        }

        //valor
        if( despesa.valor != '' ){
            despesasFiltradas 
            = despesasFiltradas.filter(i=>i.valor==despesa.valor)
        }


        console.log( despesasFiltradas ) // despesa selecionada

        return despesasFiltradas
    }

    remover(id){
        localStorage.removeItem(id)

        document.getElementById('modal_titulo').innerHTML = 'Despesa excluída'
        document.getElementById('modal-titulo-div').className = 'modal-header text-warning'
        document.getElementById('modal_conteudo').innerHTML = 'Despesa excluída com sucesso'
        document.getElementById('modal_btn').innerHTML = 'Ok, entendi'
        document.getElementById('modal_btn').className = 'btn btn-warning'
        $('#modalRegistroDespesa').modal('show')

    }

}

function recarregarPagina(){
    window.location.reload()
}


let bd = new Bd()
function cadastrarDespesa(){

    let ano = document.getElementById('ano')
    let mes = document.getElementById('mes')
    let dia = document.getElementById('dia')
    let tipo = document.getElementById('tipo')
    let descricao = document.getElementById('descricao')
    let valor = document.getElementById('valor')

    let despesa = new Despesa( ano.value, mes.value, dia.value,
        tipo.value, descricao.value, valor.value)


    if( despesa.validarDados() ){

        bd.gravar( despesa )
        limparCampos( ano,mes,dia,tipo,descricao,valor )

        document.getElementById('modal_titulo').innerHTML 
        = 'Registro inserido com sucesso'
        document.getElementById('modal-titulo-div').className = 
        'modal-header text-success'
        document.getElementById('modal_conteudo').innerHTML 
        = 'Despesa cadastrada com sucesso'
        document.getElementById('modal_btn').innerHTML = 'Ok, entendi'
        document.getElementById('modal_btn').className = 'btn btn-success'

        $('#modalRegistroDespesa').modal('show')

    }else{

        document.getElementById('modal_titulo').innerHTML 
        = 'Erro na inclusão do registro'
        document.getElementById('modal-titulo-div').className = 
        'modal-header text-danger'
        document.getElementById('modal_conteudo').innerHTML 
        = 'Erro na gravação, verifique se todos os'+
        ' campos foram preenchidos corretamente'
        document.getElementById('modal_btn').innerHTML = 'Voltar e corrigir'
        document.getElementById('modal_btn').className = 'btn btn-danger'

        $('#modalRegistroDespesa').modal('show')

    }

}

function limparCampos( ano,mes,dia,tipo,descricao,valor ){

     ano.value = ''
     mes.value = ''
     dia.value = ''
     tipo.value = ''
     descricao.value = ''
     valor.value = ''
}

function carregaListaDespesas(despesas = Array()){

    if( despesas.length == 0 ){
        despesas = bd.recuperarTodosRegistros()
    }

    //<tbody>
    let listaDespesas = document.getElementById('listaDespesas')
    listaDespesas.innerHTML = ''

    /* Exemplo:
    <tr>
              <td>15/03/2018</td>
              <td>Alimentação</td>
              <td>Compras do mês</td>
              <td>R$ 250,00</td>
    </tr>
    */

    despesas.forEach(function(d){ 
          
        // criando <tr> - Linha
        let linha = listaDespesas.insertRow() // cria linha
        // criar <td> - Coluna
        linha.insertCell(0).innerHTML = `${d.dia}/${d.mes}/${d.ano}`
        linha.insertCell(1).innerHTML = d.tipo
        linha.insertCell(2).innerHTML = d.descricao
        linha.insertCell(3).innerHTML = `R$ ${d.valor}`

        // criar botao de exclusão
        let btn = document.createElement('button')
        btn.className = 'btn btn-danger'
        btn.innerHTML = '<i class="fas fa-times"></i>'
        btn.id = `id_despesa${d.id}` 
        btn.onclick = function(){ // remover despesa

            bd.remover(d.id)
            //window.location.reload()
        }

        linha.insertCell(4).append(btn)

        console.log(d)

    })

}

function pesquisarDespesas(){

    let ano = document.getElementById('ano')
    let mes = document.getElementById('mes')
    let dia = document.getElementById('dia')
    let tipo = document.getElementById('tipo')
    let descricao = document.getElementById('descricao')
    let valor = document.getElementById('valor')

    let despesa = new Despesa( ano.value, mes.value, dia.value,
        tipo.value, descricao.value, valor.value)

    let despesas = bd.pesquisar( despesa )
    carregaListaDespesas(despesas)
}