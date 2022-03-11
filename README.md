# Boas vindas ao repositório do projeto Task Organizer

Esse projeto foi desenvolvido como projeto bônus no módulo de Backend, no curso de Desenvolvimento Web da [Trybe](https://www.betrybe.com/?utm_medium=cpc&utm_source=google&utm_campaign=Brand&utm_content=ad03_din_h), o objetivo desse projeto foi colocar em pratica meus conhecimentos em Node.js, fazendo o uso de tokens de autenticação, usar a biblioteca JWT, consultar arquivos do banco de dados através de uma api REST e realizar testes de integração.

---

## Preview do projeto

![preview](./images/preview.png)

# Sumário

- [Boas vindas ao repositório do projeto Task Organizer!](#boas-vindas-ao-repositório-do-projeto-task-organizer)
- [Estrutura de diretórios e arquivos](#Estrutura-de-diretórios-e-arquivos)
- [Instalação do projeto localmente](#Instalação-do-projeto-localmente)

---

## Estrutura de diretórios e arquivos

~~~ bash
.
├── .vscode
│   └── settings.json
├── auth
│       └── validateToken.js
├── controllers
│       ├── taskController.js
│       └── userController.js
├── images
├── messages
│   └── errorMessages.js
├── models
│   ├── connection.js
│   ├── taskModel.js
│   └── userModel.js
├── services
│   ├── taskService.js
│   └── userService.js
│── tests
│       ├── connectionMock.js
│       ├── login.test.js
│       ├── task.test.js
│       └── user.test.js
├── .env
├── .eslintignore
├── .eslintrc.json
├── .gitignore
├── index.js
├── package-lock.json
├── package.json
├── Procfile
└── README.md
~~~

---

## Desenvolvimento

Este projeto foi desenvolvido utilizando a arquitetura de camadas MSC.

Através dessa aplicação, é possível realizar as operações básicas que se pode fazer em um determinado banco de dados: Criação, Leitura, Atualização e Exclusão (ou `CRUD`).

Para realizar qualquer tipo de alteração no banco de dados (como cadastro, edição ou exclusão de tarefas) será necessário autenticar-se.

A autenticação é feita via `JWT`.

## Instalação do projeto localmente

Após cada um dos passos, haverá um exemplo do comando a ser digitado para fazer o que está sendo pedido, caso tenha dificuldades e o exemplo não seja suficiente, não hesite em me contatar em *iago.pferreiravr@gmail.com*.

Passo 1. Abra o terminal e crie um duretório no local de sua preferência com o comando `mkdir`:

~~~bash
mkdir projetos-iago
~~~

Passo 2. Entre no diretório que você acabou de criar:

~~~bash
cd projetos-iago
~~~

Passo 3. Clone o projeto:

~~~bash
git clone git@github.com:IagoPFerreira/task-organizer-bk.git
~~~

Passo 4. Após terminado a clonagem, entre no diretório que você acabou de clonar:

~~~bash
cd task-organizer-bk
~~~

Passo 5. Instale todas as dependências do projeto:

~~~bash
npm install
~~~

Passo 6. Após a instalação das dependências, rode a aplicação

~~~bash
npm run dev
~~~

A aplicação começará a rodar e no seu terminal deve aparecer as seguintes mensagens:

![terminal](./images/terminal.png)

⚠️ **Atenção** ⚠️

Essa aplicação foi desenvolvida utilizando MongoDB, é necessário para o funcionamento correto desse projeto que o MongoDB esteja instalado na sua máquina, caso você não o tenha instalado, você pode seguir o passo a passo da [documentação do MongoDB para a instalação](https://docs.mongodb.com/manual/installation/).

---

## Utilizando as rotas

Localmente todas as rotas irão rodar na porta 8080, dito isso, no local onde você fará as requisições adicione a seguinte URL `http://localhost:8080` e depois adicione o endpoint ao qual deseja fazer a requisição, exemplo `http://localhost:8080/users`.

Voce pode usar as ferramentas [Postman](https://www.postman.com/), [Insomnia](https://insomnia.rest/), [Thunder Client](https://www.thunderclient.com/), dentre outras para fazer as requisições.

Caso haja algum erro nas requisições por falta de informação passada no corpo da requisição, ou informação passada da forma errada, as requisições irão retornar mensagens de erro descritivas de cada erro.

---

### POST /users

~~~http
http://localhost:8080/users
~~~

Esta é uma rota de cadastro de novos usuários, essa rota espera no corpo da requisição um JSON com as seguintes chaves:

~~~JSON
{
  "name": "teste",
  "email": "teste@email.com",
  "password": "teste"
}
~~~

E o retorno dessa requisição será:

~~~JSON
{
  "data": {
    "name": "teste",
    "email": "teste@email.com",
    "userId": "61fc4196c3a6729be7aa249c"
  }
}
~~~

---

### POST /login

~~~http
http://localhost:8080/login
~~~

Esta é uma rota de realização de login, essa rota espera no corpo da requisição um JSON com as seguintes chaves:

~~~JSON
{
  "email": "teste@email.com",
  "password": "teste"
}
~~~

E o retorno dessa requisição será:

~~~JSON
{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJuYW1lIjoidGVzdGUiLCJlbWFpbCI6InRlc3RlQGVtYWlsLmNvbSIsInVzZXJJZCI6IjYxZmM0MTk2YzNhNjcyOWJlN2FhMjQ5YyIsImlhdCI6MTY0MzkyMjAxNCwiZXhwIjoxNjQzOTI5MjE0fQ.rCKUPkzjVeFXkiPDnzFXhsyueP_6WhBHIOnHLrDUDPg"
}
~~~

Este token será o token de autenticação de que deverá ser passado para outras requisições

---

### GET /users

~~~http
http://localhost:8080/users
~~~

Esta é uma rota de busca de todas as pessoas usuárias cadastradas no banco de dados, essa rota não espera nada no corpo da requisição, mas espera um `header` chamado `Authorization`.

![authorization](images/authorization.png)

E o retorno dessa requisição será um array das pessoas usuárias cadastradas:

~~~JSON
{
  "data": [
    {
      "name": "Yarpen Zigrin",
      "email": "yarpenzigrin@anao.com",
      "role": "admin",
      "userId": "6185a3967437e410feb01ea5"
    },
    {
      "name": "Yarpen Zigrin Jr",
      "email": "yarpenzigrinjr@anao.com",
      "role": "user",
      "userId": "6185a51f043eac2b05a219ef"
    },
    {
      "name": "teste",
      "email": "teste@email.com",
      "role": null,
      "userId": "61fc4196c3a6729be7aa249c"
    }
  ]
}
~~~

---

### POST /users/admin

~~~http
http://localhost:8080/users/admin
~~~

Esta é uma rota de cadastro de novos usuários adminstradores, por padrão os novos usuários possuem o `role` de `users`, tendo acesso e papel de usuário comum.

Somente uma pessoa adminstradora consegue cadastrar uma nova pessoa administradora, essa rota espera no corpo da requisição um JSON com as seguintes chaves:

~~~JSON
{
    "name": "teste",
    "email": "teste@email.com",
    "password": "teste",
    "role": "admin"
}
~~~

E também é necessário passar o token de autenticação:

![authorization](images/authorization.png)

E o retorno dessa requisição será:

~~~JSON
{
  "data": {
    "name": "teste",
    "email": "teste@email.com",
    "role": "admin",
    "userId": "61fc4196c3a6729be7aa249c"
  }
}
~~~

---

### POST /tasks

~~~http
http://localhost:8080/tasks
~~~

Esta é uma rota de cadastro de novas tarefas, essa rota espera no corpo da requisição um JSON com as seguintes chaves:

~~~JSON
{
    "name": "Escrever a documentação da API",
    "status": "Em andamento"
}
~~~

E também é necessário passar o token de autenticação:

![authorization](images/authorization.png)

E o retorno dessa requisição será:

~~~JSON
{
  "data": {
    "name": "Escrever a documentação da API",
    "status": "Em andamento",
    "date": "03/02/2022",
    "_id": "61fc475ec3a6729be7aa249d"
  }
}
~~~

---

### GET /tasks

~~~http
http://localhost:8080/tasks
~~~

Esta é uma rota de busca de todas as tarefas cadastradas no banco de dados, essa rota não espera nada no corpo da requisição, mas espera um `header` chamado `Authorization`.

![authorization](images/authorization.png)

E o retorno dessa requisição será um array das tarefas cadastradas, o estado da tarefa (`Concluído` ou `Em andamento`):

~~~JSON
{
  "data": [
    {
      "_id": "618315851641ce8519b8e8bb",
      "name": "Andar",
      "status": "Concluído",
      "date": "03/11/2021"
    },
    {
      "_id": "618411cc7a4878edb5f98393",
      "name": "Codar",
      "status": "Em andamento",
      "date": "04/11/2021"
    },
    {
      "_id": "61fc475ec3a6729be7aa249d",
      "name": "Escrever a documentação da API",
      "status": "Em andamento",
      "date": "03/02/2022"
    }
  ]
}
~~~

---

### PUT /tasks

~~~http
http://localhost:8080/tasks
~~~

Esta é uma rota de atualização de tarefas, essa rota espera no corpo da requisição um JSON com as seguintes chaves:

~~~JSON
{
  "_id": "618411cc7a4878edb5f98393",
  "name": "Codar",
  "status": "Concluído",
  "date": "04/11/2021"
}
~~~

E também é necessário passar o token de autenticação:

![authorization](images/authorization.png)

E o retorno dessa requisição será:

~~~JSON
{
  "data": {
    "_id": "618411cc7a4878edb5f98393",
    "name": "Codar",
    "status": "Concluído",
    "date": "04/11/2021"
  }
}
~~~

---

### GET tasks/:id

~~~http
http://localhost:8080/tasks/61fab004f2a5298b06477e84
~~~

Esta é uma rota de busca de uma tarefa cadastrada específica no banco de dados, essa rota não espera nada no corpo da requisição, mas espera o `_id` de uma tarefa específica, como parâmetro de rota.

E também é necessário passar o token de autenticação:

![authorization](images/authorization.png)

E o retorno dessa requisição será da tarefa:

~~~JSON
{
  "data": {
    "_id": "61830f8540441578e68f868e",
    "name": "Andar",
    "status": "Concluído",
    "date": "03/11/2021"
  }
}
~~~

---

### DELETE tasks/:id

~~~http
http://localhost:8080/tasks/61fab004f2a5298b06477e84
~~~

Esta é uma rota de deleção de uma tarefa cadastrada específica no banco de dados, essa rota não espera nada no corpo da requisição, mas espera o `_id` de uma tarefa específica, como parâmetro de rota.

E o retorno dessa requisição será um objeto vazio.

---

⚠️ **Este é um projeto que ainda está em desenvolvimento, há espaço para melhorias e novas implementações, ambas serão feitas com o tempo, caso você tenha alguma sugestão, envie-a para mim no meu e-mail *iago.pferreiravr@gmail.com*** ⚠️

---

## Link para o portfolio

Você pode ir ao meu portfolio e conferir os outros projetos que eu já desenvolvi

<https://iagopferreira.github.io/portfolio-react>
