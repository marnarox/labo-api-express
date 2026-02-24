export class EmailAlreadyExistsError extends Error {
  statusCode = 400;

  constructor() {
    super("Email already exists");
  }
}

export class NickNameAlreadyExistsError extends Error {
  statusCode = 400;

  constructor() {
    super("Email already exists");
  }
}

export class InvalidCredentialsError extends Error {
  statusCode = 400;

  constructor() {
    super("Invalid credentials");
  }
}