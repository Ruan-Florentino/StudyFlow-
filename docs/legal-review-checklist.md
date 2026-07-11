# Checklist de revisão jurídica (pré-lançamento)

Documento para **advogado** ou responsável legal validar antes de escalar tráfego pago ou submissão nas lojas. Não substitui parecer formal.

## Identificação do fornecedor

- [ ] Razão social e CNPJ corretos nos Termos e na Política de Privacidade.
- [ ] Endereço e contato (e-mail do encarregado) conferem com registro societário e canais oficiais.
- [ ] Nome do produto (**Athena**) consistente em lojas, site e documentos.

## Assinatura e lojas

- [ ] Texto dos Termos alinhado ao fluxo real: **Google Play** e **Apple App Store** como meio principal de cobrança.
- [ ] Preço exibido no app (referência) compatível com **preço nas lojas** (moeda local, impostos, país de distribuição).
- [ ] Descrição da assinatura na **ficha da loja** não contradiz Termos nem o que o app entrega (benefícios vs. `PremiumGate`).
- [ ] Política de cancelamento / reembolso: coerente com políticas da Google e Apple e com o CDC, quando aplicável.

## Menores e consentimento

- [ ] Faixa etária e uso por adolescentes (13–18) coerentes com Termos, Política e requisitos das lojas.
- [ ] Se houver coleta específica de menores: bases legais e consentimento parental conforme LGPD e guidelines.

## LGPD e dados

- [ ] Política de Privacidade cobre: auth (ex.: Supabase), IA, assinatura nas lojas, notificações de servidor, suporte.
- [ ] Transferência internacional e subprocessadores: lista e fundamentos revisados.
- [ ] Canal do titular (Art. 18) testado na prática (e-mail responde no prazo).

## Conteúdo educacional e IA

- [ ] Limitação de responsabilidade (sem garantia de aprovação) e avisos sobre erros de IA suficientes para o risco do produto.
- [ ] Cenários de **demo** vs. dados reais claramente indicados onde ainda houver perfil fictício.

## Documentos internos

- [ ] Data de “última atualização” nos Termos e na Política reflete a versão em produção.
- [ ] Registro de versão arquivado (PDF ou commit) para prova em eventual disputa.

## Pós-assinatura e suporte

- [ ] Página de suporte e modelo de e-mail pós-compra alinhados ao procedimento interno (runbook §2.2).

---

**Última revisão de estrutura (documento):** mantida pelo time de produto; parecer jurídico é externo a este arquivo.
