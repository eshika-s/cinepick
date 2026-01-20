import mongoose from 'mongoose';
export declare const Movie: mongoose.Model<{
    tmdbId: number;
    title: string;
    overview: string;
    voteCount: number;
    genres: ("family" | "action" | "adventure" | "comedy" | "drama" | "fantasy" | "horror" | "mystery" | "romance" | "sci-fi" | "thriller" | "documentary")[];
    moodTags: ("thriller" | "happy" | "cozy" | "mindbending" | "romantic" | "epic")[];
    language: string;
    adult: boolean;
    popularity: number;
    posterUrl?: string | null | undefined;
    backdropUrl?: string | null | undefined;
    releaseDate?: NativeDate | null | undefined;
    rating?: number | null | undefined;
    runtime?: number | null | undefined;
} & mongoose.DefaultTimestampProps, {}, {}, {}, mongoose.Document<unknown, {}, {
    tmdbId: number;
    title: string;
    overview: string;
    voteCount: number;
    genres: ("family" | "action" | "adventure" | "comedy" | "drama" | "fantasy" | "horror" | "mystery" | "romance" | "sci-fi" | "thriller" | "documentary")[];
    moodTags: ("thriller" | "happy" | "cozy" | "mindbending" | "romantic" | "epic")[];
    language: string;
    adult: boolean;
    popularity: number;
    posterUrl?: string | null | undefined;
    backdropUrl?: string | null | undefined;
    releaseDate?: NativeDate | null | undefined;
    rating?: number | null | undefined;
    runtime?: number | null | undefined;
} & mongoose.DefaultTimestampProps, {}, {
    timestamps: true;
}> & {
    tmdbId: number;
    title: string;
    overview: string;
    voteCount: number;
    genres: ("family" | "action" | "adventure" | "comedy" | "drama" | "fantasy" | "horror" | "mystery" | "romance" | "sci-fi" | "thriller" | "documentary")[];
    moodTags: ("thriller" | "happy" | "cozy" | "mindbending" | "romantic" | "epic")[];
    language: string;
    adult: boolean;
    popularity: number;
    posterUrl?: string | null | undefined;
    backdropUrl?: string | null | undefined;
    releaseDate?: NativeDate | null | undefined;
    rating?: number | null | undefined;
    runtime?: number | null | undefined;
} & mongoose.DefaultTimestampProps & {
    _id: mongoose.Types.ObjectId;
} & {
    __v: number;
}, mongoose.Schema<any, mongoose.Model<any, any, any, any, any, any>, {}, {}, {}, {}, {
    timestamps: true;
}, {
    tmdbId: number;
    title: string;
    overview: string;
    voteCount: number;
    genres: ("family" | "action" | "adventure" | "comedy" | "drama" | "fantasy" | "horror" | "mystery" | "romance" | "sci-fi" | "thriller" | "documentary")[];
    moodTags: ("thriller" | "happy" | "cozy" | "mindbending" | "romantic" | "epic")[];
    language: string;
    adult: boolean;
    popularity: number;
    posterUrl?: string | null | undefined;
    backdropUrl?: string | null | undefined;
    releaseDate?: NativeDate | null | undefined;
    rating?: number | null | undefined;
    runtime?: number | null | undefined;
} & mongoose.DefaultTimestampProps, mongoose.Document<unknown, {}, mongoose.FlatRecord<{
    tmdbId: number;
    title: string;
    overview: string;
    voteCount: number;
    genres: ("family" | "action" | "adventure" | "comedy" | "drama" | "fantasy" | "horror" | "mystery" | "romance" | "sci-fi" | "thriller" | "documentary")[];
    moodTags: ("thriller" | "happy" | "cozy" | "mindbending" | "romantic" | "epic")[];
    language: string;
    adult: boolean;
    popularity: number;
    posterUrl?: string | null | undefined;
    backdropUrl?: string | null | undefined;
    releaseDate?: NativeDate | null | undefined;
    rating?: number | null | undefined;
    runtime?: number | null | undefined;
} & mongoose.DefaultTimestampProps>, {}, mongoose.ResolveSchemaOptions<{
    timestamps: true;
}>> & mongoose.FlatRecord<{
    tmdbId: number;
    title: string;
    overview: string;
    voteCount: number;
    genres: ("family" | "action" | "adventure" | "comedy" | "drama" | "fantasy" | "horror" | "mystery" | "romance" | "sci-fi" | "thriller" | "documentary")[];
    moodTags: ("thriller" | "happy" | "cozy" | "mindbending" | "romantic" | "epic")[];
    language: string;
    adult: boolean;
    popularity: number;
    posterUrl?: string | null | undefined;
    backdropUrl?: string | null | undefined;
    releaseDate?: NativeDate | null | undefined;
    rating?: number | null | undefined;
    runtime?: number | null | undefined;
} & mongoose.DefaultTimestampProps> & {
    _id: mongoose.Types.ObjectId;
} & {
    __v: number;
}>>;
//# sourceMappingURL=Movie.d.ts.map