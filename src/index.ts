// Importa as bibliotecas necessárias.
// 'express' é um framework para construir aplicações web em Node.js.
// 'Request' e 'Response' são tipos do Express para lidar com requisições e respostas HTTP.
import express, { Request, Response } from 'express';

// 'ioredis' é um cliente Redis para Node.js, usado para se comunicar com o banco de dados Redis.
import Redis from 'ioredis';

// 'cors' é um middleware para habilitar o Cross-Origin Resource Sharing,
// permitindo que o frontend (rodando em um domínio diferente) acesse esta API.
import cors from 'cors';

// Objeto de configuração para centralizar as variáveis de ambiente e valores padrão.
const Config = {
    // Tempo de cache para o token em segundos. O valor é pego da variável de ambiente TOKEN_CACHE_TIME.
    // Se a variável não existir, usa "86400" (24 horas) como padrão, parseInt converte a string para um número inteiro.
    TOKEN_CACHE_TIME: parseInt(process.env.TOKEN_CACHE_TIME || "86400"),

    // URL de conexão com o Redis. Pega da variável de ambiente REDIS_CONNECTION.
    // Se não existir, usa a URL para um Redis local como padrão.
    REDIS_URL: process.env.REDIS_CONNECTION || "redis://127.0.0.1:6379",

    // Prefixo para as chaves do Redis. Ajuda a organizar e evitar conflitos de chaves
    // se o mesmo Redis for usado por múltiplas aplicações.
    REDIS_INSTANCE: process.env.REDIS_INSTANCE || "Project_RedisLocal_",
};

// Cria uma instância da aplicação Express.
const app = express();
const PORT = process.env.PORT || 2000;

// Cria uma nova instância do cliente Redis, passando a URL de conexão, este cliente será usado para todas as operações com o Redis.
const redisClient = new Redis(Config.REDIS_URL);


const getAllProducts = async (): Promise<any> => {

    // Simula um tempo de resposta variável para a "consulta ao banco de dados".
    const time = Math.random() * 5000;

    // Retorna uma Promise, que é um objeto que representa a eventual conclusão (ou falha) de uma operação assíncrona.
    return new Promise((resolve) => {

        // setTimeout agenda a execução de uma função após um determinado tempo.
        setTimeout(() => {

            // 'resolve' é chamado para cumprir a Promise com o resultado.
            resolve([
                { id: 1, name: 'Produto 1' },
                { id: 2, name: 'Produto 2' },
                { id: 3, name: 'Produto 3' },
                { id: 4, name: 'Produto 4' },
            ]);
        }, time);
    });
};

// Habilita o middleware do CORS na aplicação Express.
// Isso adiciona os cabeçalhos HTTP necessários para permitir requisições de outras origens (domínios).
app.use(cors());

// Define uma rota GET no caminho '/clear', esta rota serve para limpar o cache de produtos no Redis manualmente.
app.get('/clear', async (req: Request, res: Response) => {

    try {
        // `redisClient.del` remove uma chave do Redis.
        // A chave é construída usando o prefixo (REDIS_INSTANCE) e um nome ('getAllProducts').
        await redisClient.del(`${Config.REDIS_INSTANCE}getAllProducts`).then(() => {
            return res.send({ ok: true });
        });
    }
    catch {
        console.log('erro ao limpar cache');
    }
});


app.get('/', async (req: Request, res: Response) => {

    // 1. Tenta buscar os dados do cache do Redis primeiro, `redisClient.get` busca o valor associado à chave especificada.
    const productsFromCache = await redisClient.get(`${Config.REDIS_INSTANCE}getAllProducts`);

    // 2. Verifica se os dados foram encontrados no cache.
    if (productsFromCache) {
        console.log('Retornando dados do cache');

        // `JSON.parse` converte a string JSON (que é como o Redis armazena) de volta para um objeto JavaScript.
        return res.send(JSON.parse(productsFromCache));
    }

    // 3. Se não encontrou no cache, busca os dados da fonte original.
    console.log('Buscando dados da fonte original (getAllProducts)');
    const products = await getAllProducts();

    // 4. Armazena os dados recém-buscados no cache para futuras requisições.
    // `redisClient.set` armazena um par chave-valor no Redis.
    // `JSON.stringify` converte o objeto/array de produtos para uma string no formato JSON.
    await redisClient.set(`${Config.REDIS_INSTANCE}getAllProducts`, JSON.stringify(products));

    // 5. Envia os produtos para o cliente.
    res.send(products);
});


// Inicia o servidor Express para que ele comece a "ouvir" por requisições na porta definida.
const server = app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});


// --- Lógica para Encerramento (Graceful Shutdown) ---

// Ouve o evento 'SIGINT'. Este sinal é enviado quando é pressionado Ctrl+C no terminal.
process.on('SIGINT', () => {
    console.log('SIGINT signal received: closing server and Redis client');

    // 1. Fecha o servidor HTTP. `server.close()` para não aceitar novas conexões e espera as conexões existentes terminarem.
    server.close(() => {
        console.log('Server closed');

        // 2. Após o servidor fechar, fecha a conexão com o Redis.
        redisClient.quit(() => {

            console.log('Redis client disconnected');

            // 3. Encerra o processo do Node.js com código 0 (sucesso).
            process.exit(0);
        });
    });
});

// Ouve o evento 'exit'.
process.on('exit', (code) => {
    console.log(`Process exited with code: ${code}`);
});
