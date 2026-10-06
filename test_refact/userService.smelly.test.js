const { UserService } = require ('../src/userService');

const dadosUsuarioPadrao = {
  nome: 'Fulano de Tal',
  email: 'fulano@teste.com',
  idade: 25,
};

describe('UserService - Suíte de Testes Limpos', () => {
  let userService;

  // O setup é executado antes de cada teste
  beforeEach(() => {
    userService = new UserService();
    userService._clearDB(); // Limpa o "banco" para cada teste
  });

  test('deve criar um usuário corretamente', () => {
    // Arrange: os dados do usuário estão em dadosUsuarioPadrao.

    // Act: Criar
    const usuarioCriado = userService.createUser(
      dadosUsuarioPadrao.nome,
      dadosUsuarioPadrao.email,
      dadosUsuarioPadrao.idade
    );

    // Assert
    expect(usuarioCriado.id).toBeDefined();
    expect(usuarioCriado.status).toBe('ativo');
  });

  test('deve buscar um usuário criado pelo ID', () => {
    // Arrange
    const usuarioCriado = userService.createUser(
      dadosUsuarioPadrao.nome,
      dadosUsuarioPadrao.email,
      dadosUsuarioPadrao.idade
    );

    // Act: Buscar
    const usuarioBuscado = userService.getUserById(usuarioCriado.id);

    // Assert
    expect(usuarioBuscado.nome).toBe(dadosUsuarioPadrao.nome);
    expect(usuarioBuscado.status).toBe('ativo');
  });

  // Cada tipo de usuário tem seu próprio teste, sem loop ou if.
  test('deve desativar usuários que não são administradores', () => {
    // Arrange
    const usuarioComum = userService.createUser('Comum', 'comum@teste.com', 30);

    // Act
    const resultado = userService.deactivateUser(usuarioComum.id);
    const usuarioAtualizado = userService.getUserById(usuarioComum.id);

    // Assert: verifica o resultado para o usuário comum.
    expect(resultado).toBe(true);
    expect(usuarioAtualizado.status).toBe('inativo');
  });

  test('não deve desativar usuários administradores', () => {
    // Arrange
    const usuarioAdmin = userService.createUser('Admin', 'admin@teste.com', 40, true);

    // Act
    const resultado = userService.deactivateUser(usuarioAdmin.id);
    const usuarioAtualizado = userService.getUserById(usuarioAdmin.id);

    // Assert: verifica o resultado para o admin.
    expect(resultado).toBe(false);
    expect(usuarioAtualizado.status).toBe('ativo');
  });

  test('deve incluir os usuários no relatório', () => {
    // Arrange
    const usuario1 = userService.createUser('Alice', 'alice@email.com', 28);
    userService.createUser('Bob', 'bob@email.com', 32);

    // Act
    const relatorio = userService.generateUserReport();

    // Assert: se a formatação mudar (espaços ou ordem), o teste continua válido.
    expect(relatorio).toContain(usuario1.id);
    expect(relatorio).toContain('Alice');
    expect(relatorio).toContain('Bob');
    expect(relatorio).toContain('Relatório de Usuários');
  });

  test('deve mostrar o status do usuário no relatório', () => {
    // Arrange
    userService.createUser('Alice', 'alice@email.com', 28);

    // Act
    const relatorio = userService.generateUserReport();

    // Assert: há apenas um usuário no relatório.
    expect(relatorio).toContain('Alice');
    expect(relatorio).toContain('ativo');
  });

  test('deve falhar ao criar usuário menor de idade', () => {
    // Arrange
    const idade = 17;

    // Act
    const criarUsuarioMenor = () => userService.createUser('Menor', 'menor@email.com', idade);

    // Assert: o teste falha se a exceção NÃO for lançada.
    // Sem try/catch, a ausência da validação não passa silenciosamente.
    expect(criarUsuarioMenor).toThrow();
  });

  test('deve informar quando não há usuários no relatório', () => {
    // Arrange: o setup já limpou o "banco".

    // Act
    const relatorio = userService.generateUserReport();

    // Assert: implementa o caso antes marcado como TODO.
    expect(relatorio).toContain('Nenhum usuário cadastrado');
  });
});