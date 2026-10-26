import 'reflect-metadata';
import { VercelRequest, VercelResponse } from '@vercel/node';
import { NestExpressApplication } from '@nestjs/platform-express';
import { createApp } from '../src/app';

let appPromise: Promise<NestExpressApplication> | undefined;

async function getApp() {
  appPromise ??= createApp();
  const app = await appPromise;
  await app.init();
  return app;
}

export default async function api(
  request: VercelRequest,
  response: VercelResponse,
) {
  const app = await getApp();
  app.getHttpAdapter().getInstance()(request, response);
}
