# 📱 Checklist de Teste Mobile — Pré-Deploy Study Flow

## 🎯 Fluxo Crítico (testar em iOS + Android)

### Cadastro
- [ ] Tela de cadastro abre
- [ ] Campos aceitam input
- [ ] Teclado não cobre o botão de submit
- [ ] Validação de erro aparece corretamente
- [ ] Sucesso redireciona pro onboarding

### Onboarding
- [ ] Telas de onboarding navegam
- [ ] Botão "próximo" funciona
- [ ] Botão "pular" funciona
- [ ] Estado é salvo no final

### Questão
- [ ] Lista de questões carrega
- [ ] Clica numa questão e abre
- [ ] Alternativas são clicáveis
- [ ] Submit responde
- [ ] Feedback aparece (certo/errado)
- [ ] XP sobe na barra
- [ ] Próxima questão carrega

### Flashcard
- [ ] Lista de flashcards abre
- [ ] Flip do card funciona (touch)
- [ ] Botões de avaliação funcionam
- [ ] Estado SM-2 salva

### Geral
- [ ] Bottom nav funciona em TODOS os 6 itens
- [ ] Dark mode renderiza correto
- [ ] Não tem scroll horizontal
- [ ] Inputs não causam zoom (font-size >= 16px)
- [ ] Imagens carregam
- [ ] Service Worker registra (modo offline)
- [ ] App pode ser instalado como PWA

### iOS Específico
- [ ] Safe area respeitada (notch)
- [ ] Status bar não cobre conteúdo
- [ ] Apple touch icon aparece ao instalar

### Android Específico
- [ ] Maskable icon aparece correto
- [ ] Theme color aplicado na status bar
- [ ] Back button do Android funciona
