const functions = require('@google-cloud/functions-framework');
const { Storage } = require('@google-cloud/storage');

let pistasEnviadas = []; // Array para armazenar as pistas enviadas

functions.http('handleWebhook', async (req, res) => {
  const tag = req.body.queryResult.intent.displayName;
  const parameters = req.body.queryResult.parameters;
  let jsonResponse = {};

  if (tag === 'clue.generator.start') {
            //Trata do envio das pistas aleatórias  
            try{
                const storage = new Storage();
                const bucket = storage.bucket('monk-bcknd-data');
                const file = bucket.file('data/clue.json');
                // Baixa conteúdo do arquivo como uma string
                const contents = await file.download();
                const jsonData = JSON.parse(contents.toString());
                let clues = jsonData.clues;
            
                //Verificar disponibilidade das pistas
                clues = clues.filter(pista => !pistasEnviadas.includes(pista.id));

                if(clues.length === 0){
                    //Redireciona para o contexto de finalização do envio de pistas
                    jsonResponse = {
                        followupEventInput:{
                            name:'clue_generator_end', //Evento que aciona a intent
                            languageCode: req.body.queryResult.languageCode // Mantém o idioma
                        }
                    };  
                } else {
                    //Escolha de pista aleatorias
                    const randomIndex = Math.floor(Math.random()* clues.length);
                    //Define pista enviadas do array para não repetir
                    const pista = clues[randomIndex];
                    pistasEnviadas.push(pista.id); // Adicionar pista enviada ao array

                    //Enviar pista, conforme tipo texto ou imagem
                    if(pista.tipo === 'string'){
                        jsonResponse = {
                            fulfillment_messages: [{ text: {text: [pista.content] } } ],
                        };
                    } else if (pista.tipo === 'image') {
                        jsonResponse = {
                            fulfillment_messages: [{
                                payload: {
                                    richContent: [
                                        [{
                                            type: 'image',
                                            rawUrl: pista.content
                                        }]
                                    ]
                                }
                            }]
                        };
                    }
                } 
            } catch (error) {
                    console.error('Erro ao acessar o arquivo do Cloud Storage:', error);
                    jsonResponse = {
                        fulfillment_messages: [
                            {
                            text: {
                                text: [ 'Desculpe, o sistema não respondeu! Volte mais tarde, por gentileza.'],
                            },
                            },
                        ],
                    };
                }
        
    } else if(tag === 'quiz.solution') {
        try{
            const answers = ["A", "C", "A", "B", "A", "B", "A", "C", "B"];
            let score = 0;
            let userAnswer = [];
            
            //Capturar respostas
            for (let i = 1; i <= answers.length; i++) {
                const answer = parameters[`question${i}`];
                if (answer) {
                    userAnswer.push(answer.toUpperCase());
                }
            }

            // Tratativa das respostas
            for(let i = 0; i <= answers.length; i++ ){
                if(userAnswer[i] === answers[i]){
                    score++;
                }
            }

            //Verificação de pontuação e status do jogador
            let message = '';
            if (score === 10) {
                message = `Sua pontuação foi de ${score} pontos. Excelente, Sherlock encontrou um concorrente à altura.`;
            } else if (score >= 8 && score <= 9) {
                message = `Sua pontuação foi de ${score} pontos. Está se saindo melhor que o Watson, parabéns!`;
            } else if (score >= 4 && score <= 7) {
                message = `Sua pontuação foi de ${score} pontos. Você tem potencial, a Scotland Yard te daria uma vaga com certeza.`;
            } else {
                message = `Sua pontuação foi menor do que 4 pontos. Sherlock irá tirar um sarro de você por um tempo!`;
            }

            // Direcionamento para finalização do jogo
            jsonResponse = {
                fulfillmentMessages: [
                    { text: { text: [message] } },
                    { payload: {
                        richContent: [
                            [{
                                type: 'chips',
                                options: [{
                                    text: 'Ver solução!',
                                }]
                            }]
                        ]}
                    }                                    
                ]
            };
            
        } catch (error){
            console.error('Erro ao processar o quiz:', error);
            jsonResponse = {
                fulfillment_messages: [{ text: { text: ['Desculpe, ocorreu um erro ao processar as respostas.😐'] } }],
            };
        }
    }
  res.send(jsonResponse);
});
