import { Model } from 'sequelize';
export declare class User extends Model {
    id: number;
    email: string;
    password?: string;
    username: string;
    firstName?: string;
    lastName?: string;
    avatar?: string;
    googleId?: string;
    appleId?: string;
    isEmailVerified: boolean;
    lastLogin: Date;
    preferences: any;
    readonly createdAt: Date;
    readonly updatedAt: Date;
}
//# sourceMappingURL=User.d.ts.map