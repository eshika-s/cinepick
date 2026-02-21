import { Model } from 'sequelize';
export declare class MovieNight extends Model {
    id: number;
    title: string;
    date: Date;
    time: string;
    hostId: number;
    guests: any[];
    theme?: string;
    notes?: string;
    status: string;
    readonly createdAt: Date;
    readonly updatedAt: Date;
}
export declare const MovieNightMovies: import("sequelize").ModelCtor<Model<any, any>>;
//# sourceMappingURL=MovieNight.d.ts.map