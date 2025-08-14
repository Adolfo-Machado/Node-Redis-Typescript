# API com Node.js, TypeScript e Redis

Este é um projeto de exemplo que demonstra como construir uma API simples com Node.js e Express, utilizando TypeScript para tipagem estática e o Redis como banco de dados em memória.

## 🚀 Tecnologias Utilizadas

- **Node.js**: Ambiente de execução JavaScript no servidor.
- **TypeScript**: Superset do JavaScript que adiciona tipagem estática.
- **Express.js**: Framework para construção de APIs em Node.js.
- **ioredis**: Cliente Redis para Node.js, robusto e com bom desempenho.
- **Docker**: Para facilitar a execução de uma instância do Redis.

---

## 📋 Pré-requisitos

Antes de começar, você vai precisar ter as seguintes ferramentas instaladas em sua máquina:
- [Node.js (versão 18 ou superior)](https://nodejs.org/en/)
- [NPM](https://www.npmjs.com/) ou [Yarn](https://yarnpkg.com/)
- [Docker](https://www.docker.com/get-started)

### ❗ Importante: Instância do Redis

Para que esta aplicação funcione corretamente, **é necessário ter uma instância do Redis em execução e acessível na porta padrão (6379)**. 
Este projeto inclui um arquivo `docker-compose.yml` para simplificar este processo.

#### Usando Docker Compose (Recomendado)

Com o Docker e o Docker Compose instalados, execute o seguinte comando na raiz do projeto para iniciar o serviço do Redis em segundo plano:

Ou se preferir pode iniciar um contêiner Redis com o seguinte comando no seu terminal:

```bash
docker-compose up -d
```

- `docker run`: Cria e inicia um novo contêiner.
- `--name meu-redis`: Nomeia o contêiner para fácil referência.
- `-p 6379:6379`: Mapeia a porta 6379 do contêiner para a porta 6379 da sua máquina local.
- `-d`: Executa o contêiner em modo "detached" (em segundo plano).
- `redis`: Utiliza a imagem oficial do Redis.

---

## ⚙️ Instalação e Execução

1.  **Clone o repositório:**
    ```bash
    git clone <URL_DO_SEU_REPOSITORIO>
    cd node-redis-typescript
    ```

2.  **Instale as dependências:**
    ```bash
    npm install
    ```

3.  **Inicie o servidor de desenvolvimento:**
    ```bash
    npm run dev
    ```

Após esses passos, a API estará em execução e pronta para receber requisições. O `nodemon` irá reiniciar o servidor automaticamente sempre que houver uma alteração nos arquivos `.ts`.