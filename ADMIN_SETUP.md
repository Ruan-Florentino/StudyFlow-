# ADMIN SETUP

Este guia explica como configurar contas de administrador na aplicação StudyFlow utilizando **Custom Claims** do Firebase Authentication.

## Por que Custom Claims?

Antes, o e-mail de administrador estava "hardcoded" nas regras do Firestore (`firestore.rules`) e em outras partes do código. Isso representava uma falha de segurança, pois qualquer pessoa com acesso ao repositório saberia o e-mail do administrador, o que não era a prática recomendada além de ser rígido de alterar.

A substituição assegura que um "Custom Claim" de `{ admin: true }` seja utilizado para dar as permissões de acesso adequado. 

## Pré-requisitos

1. Precisamos da `serviceAccountKey.json` do seu projeto no Firebase.
2. Certifique-se de que a biblioteca interna do Node.js possa inicializar o Firebase Admin SDK (`firebase-admin`). É necessário baixar do Firebase Console.

### Como obter a \`serviceAccountKey.json\`

1. Acesse o [Firebase Console](https://console.firebase.google.com/).
2. Vá ao seu Projeto > **Configurações do Projeto** (ícone de engrenagem) > Aba **Contas de Serviço** (Service Accounts).
3. Na seção "Firebase Admin SDK", selecione "Node.js" e clique em **Gerar nova chave privada** (Generate new private key).
4. Mova o arquivo baixado para a raiz do repositório da aplicação com o nome `serviceAccountKey.json`.
   > **Aviso:** Este arquivo contém chaves confidenciais. Já nos certificamos de o excluir pelo `.gitignore`, portanto nunca deverá ser enviado ao sistema de versionamento como o git.

## Executando o Script de Provisionamento de Admin

Criamos o script `scripts/set-admin-claim.mjs` que pode ser usado a seu critério para providenciar ou atualizar instâncias de custom claims.

1. Instale o Firebase Admin caso ainda não o tenha feito:
   \`\`\`bash
   npm install --save-dev firebase-admin
   \`\`\`
2. Identifique o **UID** do(s) usuário(s) que você deseja promover para o nível de administrador (pode ser encontrado no Console do Firebase > **Authentication**).
3. Execute o script passando o \`UID\` como último argumento:

   \`\`\`bash
   node scripts/set-admin-claim.mjs SEU_UID_AQUI
   \`\`\`

Se tudo ocorrer com sucesso, logo no terminal será mostrado:
\`\`\`bash
✅ Admin claim set for <SEU_UID_AQUI>
\`\`\`

## Como Remover o Claim de Admin (Reversão/Script Reverso)

Caso deseje remover esse papel de alguém, basta rodar uma pequena adaptação via Node:

\`\`\`javascript
import admin from 'firebase-admin';
import { readFileSync } from 'fs';

const serviceAccount = JSON.parse(readFileSync('./serviceAccountKey.json', 'utf8'));

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount)
});

// Passar null serve para remover os claims de administrador do UID
await admin.auth().setCustomUserClaims('UID_DA_PESSOA', null);
console.log('✅ Custom Claims limitados/removidos com sucesso');
process.exit(0);
\`\`\`

Isso assegura um fluxo totalmente limpo e voltado em segurança para dar ou revogar as permissões para pessoas essenciais, mantendo os acessos seguros no Backend/Firestore Rules.
