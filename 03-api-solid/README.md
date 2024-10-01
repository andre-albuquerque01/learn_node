# App

GymPass style app.

## RFs (Requisitos funcionais)

- [x] Dever ser possível se cadastrar;
- [x] Dever ser possível se autenticar;
- [x] Dever ser possível obter o perfil de um usuário logado;
- [x] Dever ser possível o número de check-ins realizados pelo usuário logado;
- [x] Dever ser possível o usuário obter seu histórico de check-ins;
- [ ] Dever ser possível o usuário buscar academias próximas;
- [ ] Dever ser possível o usuário buscar academias pelo nome;
- [x] Dever ser possível o usuário realizar o check-in em uma academia;
- [ ] Dever ser possível ser possível validar o check-in de um usuário;
- [x] Dever ser possível cadastrar uma academia;

## RNs (Regra de negócio)

- [x] O usuário não deve se cadastrar com um email duplicado;
- [x] O usuário não pode fazer 2 check-ins no mesmo dia;
- [x] O usuário não pode fazer check-in se não estiver perto (100m) da academia;
- [ ] O check-in só pode ser validado até 20 minutos após criado;
- [ ] O check-in só pode ser validado por administradores;
- [ ] A academia só pode ser cadastrada por administradores;

## RNFs (Requisitos não funcionais)

- [x] A senha do usuário precisa estar criptografada;
- [x] Os dados da aplicação precisa estar persistido em uma banco de dados;
- [x] Todas listas de dados precisam estar paginadas com 20 itens por página;
- [ ] O usuário deve ser identificado por um JWT (JSON WEB TOKEN);
