<h1 align="center">Challenge - Digital Republic</h1>

## Como começar:
- Clone este repositório
- Dê o comando 'npm install' no terminal da pasta raiz
- Copie as variáveis de ambiente de '.envExample' e crie um novo arquivo '.env' com as respectivas variáveis e as complete
- 'npm start' para fazer as requisições no API Client de sua preferência

## Das requisições e endpoints utilizados:
- Para criação de novas contas => POST ('/accounts') passando "nome" e "cpf"
- Para transferências entre contas => PUT ('/accounts/transfers') passando "de", "para" e "valor". Obs: "de" e "para" esperam o CPF das respectivas contas.
- Para depósitos => PUT ('/accounts/deposits') passando "cpf" e "valor"

## Cobertura de testes:
Os testes de integração podem ser checados através do comando 'npm test' na pasta raiz


