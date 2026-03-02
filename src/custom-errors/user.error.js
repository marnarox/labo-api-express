export class EmailAlreadyExistsError extends Error {
  statusCode = 400;

  constructor() {
    super("Email already exists");
  }
}

export class NickNameAlreadyExistsError extends Error {
  statusCode = 400;

  constructor() {
    super("This nickname already exists");
  }
}

export class InvalidCredentialsError extends Error {
  statusCode = 400;

  constructor() {
    super("Invalid credentials");
  }
}

export class OrganizerDoesNotExist extends Error{
  statusCode = 400;

  constructor(){
    super("only admins can create tournaments")
  }
}

export class IsRegisteredError extends Error{
  statusCode = 400;

  constructor(){
    super("You're not registered")
  }
}
