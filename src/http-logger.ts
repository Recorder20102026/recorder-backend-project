import { NextFunction, Request, Response } from 'express';

export function requestResponseLogger(
  request: Request,
  response: Response,
  next: NextFunction,
): void {
  const startedAt = Date.now();
  const path = request.path;

  console.log(
    JSON.stringify({
      type: 'http.request',
      method: request.method,
      path,
      timestamp: new Date(startedAt).toISOString(),
    }),
  );

  response.on('finish', () => {
    const statusCode = response.statusCode;
    const log = JSON.stringify({
      type: 'http.response',
      method: request.method,
      path,
      statusCode,
      durationMs: Date.now() - startedAt,
      timestamp: new Date().toISOString(),
    });

    if (statusCode >= 500) {
      console.error(log);
    } else {
      console.log(log);
    }
  });

  next();
}
