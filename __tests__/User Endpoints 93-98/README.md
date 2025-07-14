# Testes para Endpoints de Usuários (93-98)

Este diretório contém os testes para os endpoints relacionados a usuários, cobrindo as seguintes funcionalidades:

1.  **GET /users**: Listar todos os usuários.
2.  **GET /users/{id}/apikey**: Obter a chave de API de um usuário.
3.  **GET /users/{id}/permissions**: Obter as permissões de um usuário.
4.  **POST /users/create**: Criar um novo usuário.
5.  **PATCH /users/{id}/edit**: Editar um usuário existente.
6.  **POST /users/register**: Registrar um novo usuário e uma nova empresa.

## Estrutura dos Testes

-   `get-users.test.js`: Testa a listagem de todos os usuários.
-   `get-user-apikey.test.js`: Testa a obtenção da chave de API de um usuário.
-   `get-user-permissions.test.js`: Testa a obtenção das permissões de um usuário.
-   `create-user.test.js`: Testa a criação de um novo usuário.
-   `edit-user.test.js`: Testa a edição de um usuário.
-   `register-user-company.test.js`: Testa o registro de um novo usuário e empresa.

Os mocks para as chamadas da Supabase são configurados em cada arquivo de teste usando `jest.spyOn` para garantir que as chamadas de serviço sejam interceptadas corretamente. Os dados de teste são gerados dinamicamente usando a biblioteca `@faker-js/faker`. 