import { Request, Response, NextFunction } from 'express';
export interface AuthRequest extends Request {
    user?: any;
    headers: any;
    params: any;
    body: any;
    query: any;
}
export declare const generateToken: (userId: string) => never;
export declare const protect: (req: AuthRequest, res: Response, next: NextFunction) => Promise<Response<any, Record<string, any>> | undefined>;
//# sourceMappingURL=auth.d.ts.map