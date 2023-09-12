
# Elevaty Logger
elevaty-logger é uma biblioteca para facilitar o envio de logs para o Amazon Simple Queue Service (SQS) e registros no terminal. Com uma interface simples, você pode validar e enviar logs de forma eficiente.

# Instalação
Instale a biblioteca usando npm:

```bash
npm install elevaty-logger
```

# Como usar
Importar a Classe: Importe a classe LogSender do pacote.

Chamar o método configure: Use o método configure para configurar o LogSender com as credenciais da AWS e a URL da fila SQS.

Enviar um Log: Use o método sendLog para enviar um log para o SQS.

# Exemplo com import ES6

```javascript
import { logSender } from 'elevaty-logger';

logSender.configure({
  region: REGION,
  queueUrl: QUEUE_URL,
  accessKeyId: AWS_ACCESS_KEY_ID,
  secretAccessKey: AWS_SECRET_ACCESS_KEY,
  application: 'your-application-name',
});

// Em qualquer parte de sua applicação você pode enviar um log
const meuLog = {
  level: 'info',
  application: 'minhaAplicacao',
  merchant: '123',
  // outros campos do log...
};

logSender.sendLog(meuLog)
```

## Exemplo com require CommonJS

```javascript
const { logSender } = require('elevaty-logger');

logSender.configure({
  region: REGION,
  queueUrl: QUEUE_URL,
  accessKeyId: AWS_ACCESS_KEY_ID,
  secretAccessKey: AWS_SECRET_ACCESS_KEY,
  application: 'your-application-name',
});

// Em qualquer parte de sua applicação você pode enviar um log
const meuLog = {
  level: 'info',
  application: 'minhaAplicacao',
  merchant: '123',
  // outros campos do log...
};

logSender.sendLog(meuLog)
```

## Se desejar ver os dados de retorno:

```javascript
const result = await logSender.sendLog(meuLog)
console.log(result)
```

## Utilizando than e catch:

```javascript
logSender.sendLog(meuLog)
  .then(result => console.log(result))
  .catch(error => console.log(error))
```

# Estrutura do Log
Os logs devem seguir a estrutura abaixo:

- level: (obrigatório) Nível do log (e.g., 'info', 'error').
- application: (obrigatório) Nome da aplicação.
- Outros campos opcionais.

# Testes

Para rodar os testes, execute o comando abaixo:

```bash
npm run test
```

# Publicação

Para publicar uma nova versão, execute o comando abaixo:

```bash
npm run compile
```

No package.json, altere a versão e execute o comando abaixo dentro da pasta dist do projeto:

```bash
npm publish
```

Tudo o que esta na pasta dist será publicado no npm ou na plataforma desejada, o codigo que foca dentro da pasta src não será publicado ele apenas é usado para compilar o codigo nas versoes es5 e es6 com typescript que será publicado, ao realizar manutenção no codigo altere o codigo dentro da pasta src/lib/LogSender.ts e depois execute o comando npm run compile para gerar o codigo compilado na pasta dist.

# Depois de instalar a biblioteca

Para utilizar a biblioteca em seu projeto, você deve criar quatro variáveis de ambiente do projeto onde a lib será utilizada:

- AWS_ACCESS_KEY_ID: Chave de acesso da AWS.
- AWS_SECRET_ACCESS_KEY: Chave secreta de acesso da AWS.
- REGION: Região da AWS.
- QUEUE_URL: URL da fila SQS.
