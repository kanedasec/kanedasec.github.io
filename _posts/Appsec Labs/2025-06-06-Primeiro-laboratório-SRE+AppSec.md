---
layout: post
title: "Primeiro laboratório SRE + AppSec - Métricas e Visualização"
date: 2025-06-06
author: Kanedasec
lang: pt
category: Observabilidade para Segurança
---

Observabilidade para Segurança: Primeiro laboratório SRE + AppSec
================================================================================

Nos últimos meses eu venho estudando como aproximar SRE, observabilidade e segurança no contexto de desenvolvimento de forma realmente prática — não aquela segurança burocrática que só aparece em auditoria e controles internos, mas segurança que vive no ciclo de vida do sistema. Esse laboratório foi o meu “Dia 1” dessa jornada.

A ideia é simples: pegar um risco de segurança bem básico (falhas de login) e transformar isso em **métrica, indicador e objetivo de confiabilidade**. Se SRE funciona monitorando disponibilidade, será que também funciona para AppSec? A resposta é sim — e muito melhor do que eu esperava.

## O laboratório

<a href="https://github.com/kanedasec/SRE-Security-Observability-Lab-1">Lab 1 no Github</a>

Eu comecei criando uma API Flask pequena, com três endpoints: `/healthz`, `/login` e `/metrics`.  
O `/login` é “inseguro de propósito”: ele falha aleatoriamente, simulando tanto erros legítimos quanto possíveis ataques.

Depois eu instrumentei tudo com o `prometheus_client`. A partir daí, coisas que normalmente seriam **logs perdidos no SIEM**, passaram a virar **métricas**:

- tentativas de login (`login_requests_total`)
- falhas (`login_failures_total`)
- latência (`login_latency_seconds`)

Com Prometheus + Grafana via docker-compose, consegui observar essas métricas ao vivo.  
Isso transforma risco em **curvas**, e curvas contam histórias melhores do que qualquer relatório.

## Onde entra SRE nisso?

SRE é baseado em três conceitos:

- **SLI**: o que medimos  
- **SLO**: o objetivo  
- **SLA**: o compromisso formal

Para segurança, usei:

- SLI de confiabilidade do login
- SLI de latência
- SLO de 99% de sucesso
- SLO de p95 < 300 ms

Isso faz com que segurança deixe de ser subjetiva e vire **confiabilidade de controle**.

<img src="/assets/img/posts/Appsec-Labs/Primeiro-laboratório-SRE+AppSec/3-1.png" style="width:100%;">
<br>
Novo Dashboard sendo criado com os SLI indicados

## Por que isso importa para AppSec?

Segurança moderna é observabilidade.  
Qualquer controle que não possa ser observado não pode ser confiado.

Com esse lab:

- Controles viram números  
- Riscos viram gráficos  
- AppSec ganha uma linguagem operacional  
- Fica muito mais fácil automatizar alertas, evidências e ITGCs

Esse foi meu Dia 1.  
Nos próximos, vou evoluir para alertas, SLO-based security, integração com AWS (GuardDuty, IAM, CloudTrail), e evidências automatizadas.

