export class DateInThePastError extends Error {
  statusCode = 400;

  constructor() {
    super("The date cannot be in the past");
  }
}

export class PlayerRangeError extends Error {
  statusCode = 400;

  constructor() {
    super("The number of minimum players must be less or equal to the maximum player number");
  }
}

export class EloRangeError extends Error {
  statusCode = 400;

  constructor() {
    super("The minimum elo must be less than or equal to the max elo");
  }
  
}

export class RegistrationPeriodTooShortError extends Error {
  statusCode = 400;

  constructor() {
    super("The registration end date must be at least one day per minimum player after the creation date");
  }
}


export class YouCantDeleteThisTournamentError extends Error {
  statusCode = 400;

  constructor() {
    super("You don't have the rights to do that");
  }
}

export class TournamentNotFoundError extends Error {
  statusCode = 404;

  constructor() {
    super("Tournament not found");
  }
}

export class TournamentAlreadyStartedError extends Error{
  statusCode = 400;

  constructor(){
    super("You can't delete a tournament that already started")
  }
}

export class IsAlreadyRegisteredError extends Error{
  statusCode = 400;

  constructor(){
    super("You are already registered here")
  }
}

export class RegistrationClosedError extends Error{
  statusCode = 400;

  constructor(){
    super("You cannot register anymore")
  }
}


export class WrongGenderError extends Error{
  statusCode = 400;

  constructor(){
    super("Only woman or others can register")
  }
}

export class TournamentIsFullError extends Error{
  statusCode = 400;

  constructor(){
    super("No more locations available")
  }
}
export class EloRangeIsNotMatchingError extends Error{
  statusCode = 400;

  constructor(){
    super("You do not match elo's condition")
  }
}

export class WrongCategoryError extends Error{
    statusCode = 400;

  constructor(){
    super("Your age does not match any tournament category.")
  }
}