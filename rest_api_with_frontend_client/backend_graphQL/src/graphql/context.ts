import { PrismaClient } from '@prisma/client';
import { Request, Response } from 'express';

export interface GraphQLContext {
  prisma: PrismaClient;
  req: Request;
  res: Response;
}
