---
layout: post
title: "Terceiro laboratório SRE + AppSec – Cloud Security Telemetry"
date: 2025-06-10
author: Kanedasec
lang: pt
category: Observabilidade para Segurança
---

Observabilidade para Segurança: Terceiro laboratório SRE + AppSec – Cloud Security Telemetry
===========================================================================================

Nos dois primeiros labs eu fiquei no terreno “confortável” do aplicativo: login, métricas, alertas, evidência automática.  
Mas, na prática, uma boa parte do risco hoje mora fora do código – mora na **nuvem**: permissões frouxas, trilha de auditoria desligada, chaves sem rotação, serviço de detecção de ameaças desabilitado.

Esse terceiro laboratório nasceu de uma pergunta bem direta:

> “Se alguém me perguntar **como está a postura de segurança da minha conta AWS agora**, eu tenho um lugar simples para olhar?”

## O laboratório

<a href="https://github.com/kanedasec/Cloud-Security-Telemetry-Lab-3">Lab 3 no Github</a>

A ideia foi criar um pequeno **exporter em Python** que conversa com a AWS via `boto3` e expõe, em formato Prometheus, alguns sinais mínimos de segurança em nuvem:

- se o **CloudTrail** está com logging habilitado
- se o **GuardDuty** tem findings de alta severidade em aberto
- qual é a **idade máxima das chaves de acesso IAM** ativas
- se as **chaves KMS gerenciadas pelo cliente** têm **rotação automática** ligada

Esse exporter roda em um container ao lado do **Prometheus** e do **Grafana** via `docker-compose`.  
No final do lab, eu tenho um dashboard chamado **Cloud Security Posture Overview** que responde em segundos perguntas que normalmente caem em planilha, e-mail ou evidência manual de auditoria.

## Exporter em Python: traduzindo AWS em métricas

O coração do lab é o arquivo `aws_exporter.py`. Ele faz quatro coisas principais:

1. Cria uma `Session` com um usuário IAM de leitura (`cloud-telemetry-monitor`).
2. Chama as APIs necessárias de cada serviço:
   - `cloudtrail.describe_trails()`, `cloudtrail.get_trail_status()`
   - `guardduty.list_detectors()`, `guardduty.list_findings()`
   - `iam.list_users()`, `iam.list_access_keys()`
   - `kms.list_keys()`, `kms.describe_key()`, `kms.get_key_rotation_status()`
3. Converte o resultado em métricas Prometheus usando `prometheus_client` (`Gauge`).
4. Sobe um pequeno HTTP server na porta `9100` com `/metrics`.

As quatro métricas principais ficaram assim:

- `aws_cloudtrail_logging_enabled`  
  `1` se pelo menos um trail está em logging; `0` caso contrário.

- `aws_guardduty_high_findings`  
  Quantidade de findings com severidade >= 7. Se o GuardDuty nem estiver habilitado, eu marco como `-1`.

- `aws_iam_access_key_max_age_days`  
  Idade máxima, em dias, entre todas as chaves de acesso IAM ativas. É a métrica que conversa direto com a política de rotação de credenciais.

- `aws_kms_rotation_all_enabled`  
  `1` se todas as chaves KMS **gerenciadas pelo cliente** têm rotação automática; `0` se pelo menos uma fugir da regra.

O padrão que eu tentei manter foi: **1 = postura ok, 0 = postura quebrada**, e, quando faz sentido, um valor especial para “serviço desabilitado” (como o `-1` do GuardDuty).

## Stack com Prometheus + Grafana

No `docker-compose.yml`, eu deixei tudo rodando na mesma rede:

- `aws-exporter` – container Python com o exporter
- `prometheus` – coletando de `aws-exporter:9100`
- `grafana` – servindo a UI do dashboard

O Prometheus usa um `prometheus.yml` bem simples, com um job único:

```yaml
scrape_configs:
  - job_name: 'aws-cloud-security-exporter'
    static_configs:
      - targets: ['aws-exporter:9100']
```

Depois de subir a stack, o fluxo fica:

1. Exporter lê a conta AWS a cada 60 segundos.
2. Prometheus faz scrape das métricas.
3. Grafana puxa do Prometheus e desenha o painel de postura.

## Cloud Security Posture Overview no Grafana

No Grafana, montei um dashboard único para esse lab: **Cloud Security Posture Overview**.  
A ideia era caber em uma tela só, com quatro blocos bem claros:

1. **CloudTrail Logging Status**
   - `aws_cloudtrail_logging_enabled`
   - Stat simples, 0 ou 1.
   - Verde quando é 1 – porque sem trilha de auditoria não tem como falar de segurança ou forense sério.

2. **GuardDuty: High Severity Findings**
   - `aws_guardduty_high_findings`
   - Se é `0`, fico tranquilo. Se é `>0`, é sinal de que tem coisa em aberto.  
   - Se aparece `-1`, significa que o GuardDuty nem está habilitado – o que, por si só, já é um insight.

3. **IAM Access Key Rotation Compliance**
   - `aws_iam_access_key_max_age_days`
   - Coloquei uma linha de referência em 90 dias.  
   - Quando passa disso, a métrica fica vermelha e a conversa com GRC fica simples: “tem chave velha demais, viola a política”.

4. **KMS Key Rotation Status**
   - `aws_kms_rotation_all_enabled`
   - 1 quando todas as CMKs têm rotação automática ligada, 0 quando pelo menos uma não tem.
   - Aqui a leitura é quase binária: ou estamos aderentes à política de rotação de chaves criptográficas, ou não estamos.

O resultado é um painel de **postura mínima**: não resolve segurança em nuvem, mas já torna visível aquilo que normalmente fica escondido em config de console, planilha ou evidência de auditoria.

<img src="/assets/img/posts/Appsec-Labs/Terceiro-laboratório-SRE+AppSec/1-1.png" style="width:100%;">
<br>

## ITGC de nuvem em formato de SLI/SLO

Uma parte legal desse lab foi traduzir itens típicos de checklist de auditoria para linguagem de métrica:

- **Logging & Monitoring** → `aws_cloudtrail_logging_enabled`
- **Monitoramento de segurança** → `aws_guardduty_high_findings`
- **Rotação de credenciais** → `aws_iam_access_key_max_age_days`
- **Gestão de chaves criptográficas** → `aws_kms_rotation_all_enabled`

Com isso, perguntas como:

- “Temos CloudTrail habilitado?”  
- “GuardDuty está rodando?”  
- “Chaves IAM giram em até 90 dias?”  
- “Todas as CMKs têm rotação automática?”  

Deixam de ser respondidas com “sim/não” em e-mail e passam a ser respondidas com **métricas versionadas e um histórico de SLO**.

## Por que isso importa?

Esse lab não foi sobre “aprender boto3” ou “subir mais um dashboard”.  
Foi sobre treinar um jeito de pensar segurança em nuvem como **telemetria operacional**, não como só política ou documento.

Com ele eu ganho:

- um painel simples para discutir postura de nuvem com SRE, GRC e times de produto;
- um ponto de partida para criar alertas (por exemplo, “alguém desligou o CloudTrail” ou “chave IAM passou de 120 dias”);
- uma base para, no futuro, versionar esses controles, gerar evidência automática e integrar tudo na esteira de CI/CD.

Esse foi meu Dia 3 da série.  
O próximo passo natural é começar a conectar esses sinais de nuvem com o que já existe em aplicação: identidade, fluxo de login, eventos de auditoria, tudo falando a mesma língua de **métrica, alerta e SLO**.