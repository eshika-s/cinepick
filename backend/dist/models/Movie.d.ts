import { Model } from 'sequelize';
export declare class Movie extends Model {
    id: number;
    tmdbId: number;
    title: string;
    overview: string;
    posterUrl?: string;
    backdropUrl?: string;
    releaseDate?: Date;
    rating?: number;
    voteCount: number;
    genres: string[];
    moodTags: string[];
    runtime?: number;
    language: string;
    adult: boolean;
    popularity: number;
    readonly createdAt: Date;
    readonly updatedAt: Date;
}
//# sourceMappingURL=Movie.d.ts.map