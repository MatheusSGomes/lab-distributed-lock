# Lab Distributed Lock

## Problema

Em sistemas distribuídos, o gerenciamento de acesso simultâneo a recursos compartilhados é um desafio crítico.

### Cenário

Imagine um sistema de reservas de passagens aéreas operando em múltiplos servidores na nuvem. Quando um cliente inicia a compra de uma passagem, a aplicação precisa **verificar se ainda há assentos disponíveis no voo**.

O problema ocorre quando dois clientes tentam reservar o **último assento** ao mesmo tempo. Sem um controle adequado, ambos podem receber a confirmação de disponibilidade e prosseguir com a compra. No momento do pagamento, o sistema pode acabar vendendo mais assentos do que realmente existem, gerando **overbooking**.

### Impacto no Negócio

O overbooking é extremamente prejudicial para uma companhia aérea, pois pode gerar:

- **Insatisfação do cliente**: Um passageiro que pagou pela passagem pode descobrir que seu assento não está garantido.
- **Custos financeiros**: A empresa pode ser forçada a oferecer compensações, reacomodações ou até reembolsos, aumentando seus custos operacionais.
- **Danos à reputação**: Reclamações e processos judiciais podem impactar negativamente a imagem da empresa.

Esse tipo de problema não ocorre apenas no setor aéreo. Ele pode acontecer em diversas áreas:

- **E-commerce**: Um site que vende um único produto disponível pode permitir que dois clientes realizem a compra simultaneamente.
- **Hospedagem de eventos**: Dois usuários podem tentar reservar o último ingresso disponível para um show.
- **Locação de veículos**: Um mesmo carro pode ser alugado para dois clientes diferentes ao mesmo tempo.

## Solução

Para evitar esse tipo de problema, implementamos um **Distributed Lock** usando **PHP e Redis**.

- Quando um cliente inicia a compra de uma passagem, um **bloqueio temporário** é criado no Redis.
- Esse bloqueio impede que outro cliente reserve o mesmo assento enquanto o pagamento está pendente.
- O bloqueio expira após um tempo limite caso o pagamento não seja concluído, liberando o assento para novos clientes.

### Tecnologias utilizadas

- **PHP** para a implementação da lógica de reserva.
- **Redis** como mecanismo de lock distribuído, garantindo que um assento não seja reservado por mais de um cliente ao mesmo tempo.

Este repositório contém um exemplo prático dessa solução, ajudando a prevenir concorrência indesejada e garantindo um sistema de reservas mais seguro e confiável.
