import { Request, Response } from 'express';

export const getHealth = (req: Request, res: Response) => {
  res.status(200).json({
    status: 'ok',
    message: 'Backend server is running smoothly',
    timestamp: new Date().toISOString()
  });
};

export const getWelcome = (req: Request, res: Response) => {
  res.status(200).json({
    message: 'Welcome to Addy Job API',
    version: '1.0.0'
  });
};
