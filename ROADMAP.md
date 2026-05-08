# ROADMAP — Sistema Costelão

Este documento apresenta o plano de evolução do Sistema Costelão, organizado em etapas de curto, médio e longo prazo. Utilize as checkboxes para acompanhar o progresso das melhorias e integrações.

---

## ✅ Curto Prazo

- [ ] Melhorias de UX
  - [ ] Revisar fluxos de cadastro, entrada e saída para maior clareza e agilidade
  - [ ] Adicionar feedbacks visuais e mensagens de erro/sucesso mais detalhadas
  - [ ] Otimizar responsividade e acessibilidade das telas
- [ ] Documentação de Deploy na Vercel
  - [ ] Criar tutorial passo a passo para publicação do sistema na Vercel
  - [ ] Incluir exemplos de configuração de variáveis de ambiente e proteção de dados sensíveis
 - [ ] Ajustes na Baixa de Estoque
   - [ ] Revisar regras de negócio para baixa parcial e total
   - [ ] Garantir rastreabilidade e logs detalhados de cada movimentação
   - [x] Otimização da Saída de Estoque
     - [x] Implementar suporte a leitor de código de barras (EAN-13) no campo de busca.
     - [x] Focar automaticamente no campo de quantidade após o bipe do leitor.
     - [x] Criar atalhos de teclado para confirmar a saída sem usar o mouse.
     - [x] Exibir alerta sonoro se o lote selecionado não for o mais antigo (alerta de quebra de PEPS).

---


## ⏳ Médio Prazo

- [ ] Automação de CI/CD
  - [ ] Configurar pipeline de testes automatizados (ex: GitHub Actions, Vercel CI)
  - [ ] Automatizar deploy em ambiente de homologação e produção
  - [ ] Implementar notificações de falhas e aprovações de release
- [ ] Módulo de Compras: Sugestão automática de pedidos e Relatórios PDF/Excel
  - [ ] Implementar algoritmo de sugestão automática de pedidos de compra
  - [ ] Gerar relatórios de compras e estoque em PDF/Excel
  - [ ] Permitir exportação de itens críticos e pedidos sugeridos
  - [ ] Exibir histórico de movimentações e rupturas por produto

---


## 🚀 Longo Prazo

- [ ] Monitoramento Integrado
  - [ ] Pesquisar e selecionar solução de integração de câmeras (ex: RTSP, serviços de terceiros)
  - [ ] Implementar visualização de câmeras no painel do sistema
  - [ ] Garantir controle de acesso às imagens por perfil de usuário
- [ ] Integração via API com ERP/PDV
  - [ ] Mapear endpoints necessários para sincronização de inventário
  - [ ] Implementar autenticação segura entre sistemas
  - [ ] Sincronizar entradas, saídas e inventário em tempo real
  - [ ] Validar consistência de dados e tratar conflitos
- [ ] Integração Financeira e Algoritmo de Previsão de Demanda
  - [ ] Integrar módulo de compras ao setor financeiro para análise de impacto no fluxo de caixa
  - [ ] Implementar algoritmo de previsão de demanda baseado em histórico de consumo
  - [ ] Automatizar recomendações de compra considerando sazonalidade e promoções

---

Mantenha este roadmap atualizado conforme as etapas forem concluídas. Para dúvidas ou sugestões, registre nos comentários do projeto.
