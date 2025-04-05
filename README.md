# Detective Chatbot Project

## Sobre o Projeto

O chatbot foi construído utilizando as seguintes tecnologias:

- **Dialogflow ES:** Para processamento de linguagem natural e criação do fluxo conversacional.
- **Google Cloud Run:** Para hospedar o backend do jogo e os serviços de webhook.
- **Google Cloud Storage:** Para armazenar as pistas do jogo (textos e imagens) em formato JSON.
- **Node.js:** Linguagem de programação utilizada para criar a lógica do backend.

## Funcionalidade Backend

- **Geração de pistas aleatórias:** O chatbot fornece pistas textuais e visuais de forma aleatória, garantindo que o jogador receba todas as informações necessárias para resolver o mistério.
- **Avaliação de respostas:** Um quiz final testa as conclusões do jogador, determinando se ele desvendou o caso corretamente.

## Código Fonte

O código fonte do backend, desenvolvido em Node.js, está disponível [aqui](services_monk-dialogflow-webhook/index.js).

## Design do Projeto

O design do projeto foi criado utilizando o Figma. Você pode visualizar o desenho do fluxo conversacional [aqui](https://www.figma.com/board/cjBqVj0rNc8JJkrV5kIfMU/Detective-Chatbot-Project?node-id=0-1&t=luwIUFgga7UjdX8L-1).
