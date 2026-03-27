export class MatchNotFoundError extends Error {
  statusCode = 404;

  constructor() {
    super("Match not found");
  }
}