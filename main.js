let listaDeItens = []; //É um array vazio que vai armazenar os itens da lista de compras.
let itemAEditar; // Índice do item que está sendo editado.

const form = document.getElementById("form-itens");
const itensInput = document.getElementById("receber-item");
const ulItens = document.getElementById("lista-de-itens");
const ulItensComprados = document.getElementById("itens-comprados");
const listaRecuperada = localStorage.getItem("listaDeItens"); //String obtida do localStorage que pode conter a lista previamente salva.

function atualizaLocalStorage() {
  //Converte o array listaDeItens em uma string JSON e o salva no localStorage com a chave "listaDeItens".

  localStorage.setItem("listaDeItens", JSON.stringify(listaDeItens));
}

//Verifica se existe uma lista salva no localStorage. Se existir, parseia o JSON para um objeto JavaScript e atribui a listaDeItens, então chama mostrarItem() para renderizar a lista. Se não existir, inicia listaDeItens como um array vazio.
if (listaRecuperada) {
  listaDeItens = JSON.parse(listaRecuperada);
  mostrarItem();
} else {
  listaDeItens = [];
}

form.addEventListener("submit", function (evento) {
  //Este evento é ativado quando o formulário é enviado (quando o usuário clica em "adicionar" ou pressiona Enter).
  evento.preventDefault();
  salvarItem();
  mostrarItem();
  itensInput.focus(); //Reposiciona o cursor automaticamente no campo de entrada após a adição do item.
});

function salvarItem() {
  const comprasItem = itensInput.value;
  const checarDuplicado = listaDeItens.some(
    (elemento) => elemento.valor.toUpperCase() === comprasItem.toUpperCase() //Verifica se o item já existe na lista, comparando de forma case-insensitive(maiúscula e minúscula).
  );

  if (checarDuplicado) {
    alert("Item já existe");
  } else {
    listaDeItens.push({
      valor: comprasItem,
      checar: false,
    });

    atualizaLocalStorage();
  }
  itensInput.value = ""; //Limpa o campo de entrada após a adição do item.
}

function mostrarItem() {
  ulItens.innerHTML = ""; // Limpa o conteúdo das listas antes
  ulItensComprados.innerHTML = ""; // de renderizar os itens novamente.

  listaDeItens.forEach((elemento, index) => {
    if (elemento.checar) {
      ulItensComprados.innerHTML += `
       <li class="item-compra is-flex is-justify-content-space-between" data-value="${index}">
        <div>
            <input type="checkbox" checked class="is-clickable" />  
            <span class="itens-comprados is-size-5">${elemento.valor}</span>
        </div>
        <div>
            <i class="fa-solid fa-trash is-clickable deletar"></i>
        </div>
    </li>
      `;
    } else {
      ulItens.innerHTML += ` <li class="item-compra is-flex is-justify-content-space-between" data-value="${index}">
        <div>
            <input type="checkbox" class="is-clickable" />
            <input type="text" class="is-size-5" value="${elemento.valor}" ${
        index !== Number(itemAEditar) ? "disabled" : ""
      }></input>
        </div>

        <div>
        ${
          index === Number(itemAEditar)
            ? '<button onclick="salvarEdicao()"> <i class="fa-regular fa-floppy-disk is-clickable"></i></button>'
            : '<i class="fa-regular is-clickable fa-pen-to-square editar"></i>'
        }
            <i class="fa-solid fa-trash is-clickable deletar"></i>
        </div>
    </li>
    `;
    }
  });

  const inputsCheck = document.querySelectorAll('input[type="checkbox"]'); // Seleciona todos os checkboxes e adiciona um listener para o evento "click".
  // Quando clicado:
  inputsCheck.forEach((i) => {
    i.addEventListener("click", (evento) => {
      const valorDoElemento =
        evento.target.parentElement.parentElement.getAttribute("data-value"); // Obtém o índice do item através do atributo data-value.
      listaDeItens[valorDoElemento].checar = evento.target.checked; // Atualiza o atributo checar do item correspondente.
      mostrarItem(); // Chama mostrarItem() para atualizar a exibição.
    });
  });

  const deletarObjetos = document.querySelectorAll(".deletar");
  deletarObjetos.forEach((button) => {
    button.addEventListener("click", (evento) => {
      valorDoElemento =
        evento.target.parentElement.parentElement.getAttribute("data-value");
      listaDeItens.splice(valorDoElemento, 1); // Remove o item do array
      mostrarItem(); // Atualiza a lista exibida
      atualizaLocalStorage();
    });
  });

  const editarItens = document.querySelectorAll(".editar");
  editarItens.forEach((button) => {
    button.addEventListener("click", (evento) => {
      itemAEditar =
        evento.target.parentElement.parentElement.getAttribute("data-value");
      mostrarItem(); // Atualiza a lista exibida

      // Coloca o cursor no campo de input do item a ser editado
      const itemEditavel = document.querySelector(
        `[data-value="${itemAEditar}"] input[type="text"]`
      );
      itemEditavel.focus(); // Coloca o foco no campo de texto para edição
    });
  });
}

function salvarEdicao() {
  const itemEditado = document.querySelector(
    `[data-value="${itemAEditar}"] input[type="text"]` //Seleciona o campo de texto do item que está sendo editado.
  );
  console.log(itemEditado.value);
  listaDeItens[itemAEditar].valor = itemEditado.value;
  itemAEditar = -1; //Atualiza o valor do item na listaDeItens com o novo texto inserido.
  mostrarItem();

  atualizaLocalStorage();
}
