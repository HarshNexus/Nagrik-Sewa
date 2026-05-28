declare global {
  namespace Express {
    interface Request {
      user?: {
        _id?: any;
        userId?: string;
        email?: string;
        role?: string;
        isSystemAdmin?: boolean;
        [key: string]: any;
      };
    }
  }
}

export {};
