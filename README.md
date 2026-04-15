# 🚗 Sistema de Gestão de Aluguel de Veículos

Este projeto é uma aplicação **Fullstack** composta por um backend robusto em Java e um frontend moderno em React, projetada para gerenciar processos de locação de automóveis.

---

## 🛠️ Tecnologias Principais

### Backend
- Java 21  
- Micronaut Framework 4.10.11  
- Hibernate / JPA para persistência de dados  
- PostgreSQL como banco de dados relacional  

### Frontend
- React com Vite  
- Tailwind CSS para estilização  
- Axios para consumo da API REST  

---

## 📂 Estrutura do Projeto

### 🔙 Backend (Micronaut)

A organização do código segue o padrão de camadas para facilitar a escalabilidade:

- `br.gestao.model`: Entidades JPA que representam as tabelas do banco de dados, como **Automovel**, **Cliente** e **Pedido**.  
- `br.gestao.repository`: Interfaces que utilizam o Micronaut Data para operações CRUD.  
- `br.gestao.service`: Camada de lógica de negócio e regras de validação.  
- `br.gestao.controller`: Endpoints REST que gerenciam as requisições HTTP.  
- `br.gestao.config`: Configurações globais, incluindo o filtro de CORS para integração com o frontend.  

---

### 🎨 Frontend (React)

Organizado de forma modular para componentes reutilizáveis:

- `src/components`: Elementos de UI (Botões, Inputs, Modais).  
- `src/pages`: Páginas principais da aplicação (Dashboard, Cadastro de Veículos).  
- `src/services`: Configurações do Axios e chamadas para os endpoints do backend.  
- `src/context`: Gerenciamento de estado global (Autenticação).  

---

## 🏃 Como Rodar a Aplicação

### 1️⃣ Backend

Certifique-se de ter o **JDK 21** instalado.

```bash
# Navegue até a pasta do backend
cd GestaoAluguelVeiculos

# Execute a aplicação usando o Maven Wrapper
./mvnw mn:run

# Histórias de Usuário - Sistema de Aluguel de Carros

## Épico 1: Acesso e Cadastro
* **US01 - Cadastro Prévio:** Como um usuário, eu quero me cadastrar previamente no sistema, para que eu tenha permissão para utilizá-lo.

## Épico 2: Gestão de Pedidos (Portal do Cliente)
* **US02 - Introduzir Pedido:** Como cliente, eu quero introduzir um pedido de aluguel através da Internet, para iniciar o processo de locação de um automóvel.
* **US03 - Consultar Pedido:** Como cliente, eu quero consultar meus pedidos de aluguel, para acompanhar o status da minha solicitação.
* **US04 - Modificar Pedido:** Como cliente, eu quero modificar um pedido de aluguel, para corrigir ou atualizar informações antes da aprovação.
* **US05 - Cancelar Pedido:** Como cliente, eu quero cancelar um pedido de aluguel, caso eu não precise mais do veículo.

## Épico 3: Avaliação e Contratos (Portal do Agente)
* **US06 - Avaliação Financeira:** Como agente (empresa ou banco), eu quero analisar os pedidos do ponto de vista financeiro, para avaliar a viabilidade do aluguel.
* **US07 - Modificação por Agente:** Como agente, eu quero poder modificar os pedidos de aluguel, para ajustar termos ou condições durante o processo de avaliação.
* **US08 - Encaminhamento de Contrato:** Como agente, eu quero colocar os pedidos com parecer positivo à consideração, para que o contrato possa ser executado.
* **US09 - Contrato de Crédito:** Como banco agente, eu quero associar um contrato de crédito a um aluguel de automóvel, para financiar a operação.

## Épico 4: Base de Dados e Cadastros
* **US10 - Dados do Contratante:** Como sistema, eu preciso armazenar os dados de identificação do contratante (RG, CPF, Nome, Endereço), profissão, entidades empregadoras e até 3 rendimentos, para compor o contrato legalmente.
* **US11 - Dados do Automóvel:** Como sistema, eu preciso registrar as informações do automóvel (matrícula, ano, marca, modelo e placa), para manter o controle dos veículos.
* **US12 - Propriedade do Veículo:** Como sistema, eu preciso registrar os automóveis como propriedade de clientes, empresas ou bancos, dependendo do tipo de contrato.
