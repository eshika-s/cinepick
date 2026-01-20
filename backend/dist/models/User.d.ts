import mongoose from 'mongoose';
export declare const User: mongoose.Model<{
    email: string;
    username: string;
    isEmailVerified: boolean;
    lastLogin: NativeDate;
    movieNights: mongoose.Types.ObjectId[];
    createdAt: NativeDate;
    updatedAt: NativeDate;
    password?: string | null | undefined;
    firstName?: string | null | undefined;
    lastName?: string | null | undefined;
    avatar?: string | null | undefined;
    googleId?: string | null | undefined;
    appleId?: string | null | undefined;
    preferences?: {
        favoriteGenres: ("family" | "action" | "adventure" | "comedy" | "drama" | "fantasy" | "horror" | "mystery" | "romance" | "sci-fi" | "thriller" | "documentary")[];
        moodPreferences: mongoose.Types.DocumentArray<{
            weight: number;
            lastSelected: NativeDate;
            mood?: "thriller" | "happy" | "cozy" | "mindbending" | "romantic" | "epic" | null | undefined;
        }, mongoose.Types.Subdocument<mongoose.mongo.BSON.ObjectId, any, {
            weight: number;
            lastSelected: NativeDate;
            mood?: "thriller" | "happy" | "cozy" | "mindbending" | "romantic" | "epic" | null | undefined;
        }> & {
            weight: number;
            lastSelected: NativeDate;
            mood?: "thriller" | "happy" | "cozy" | "mindbending" | "romantic" | "epic" | null | undefined;
        }>;
        dislikedMovies: string[];
        likedMovies: string[];
        watchlist: string[];
        ratingThreshold: number;
    } | null | undefined;
} & mongoose.DefaultTimestampProps, {}, {}, {}, mongoose.Document<unknown, {}, {
    email: string;
    username: string;
    isEmailVerified: boolean;
    lastLogin: NativeDate;
    movieNights: mongoose.Types.ObjectId[];
    createdAt: NativeDate;
    updatedAt: NativeDate;
    password?: string | null | undefined;
    firstName?: string | null | undefined;
    lastName?: string | null | undefined;
    avatar?: string | null | undefined;
    googleId?: string | null | undefined;
    appleId?: string | null | undefined;
    preferences?: {
        favoriteGenres: ("family" | "action" | "adventure" | "comedy" | "drama" | "fantasy" | "horror" | "mystery" | "romance" | "sci-fi" | "thriller" | "documentary")[];
        moodPreferences: mongoose.Types.DocumentArray<{
            weight: number;
            lastSelected: NativeDate;
            mood?: "thriller" | "happy" | "cozy" | "mindbending" | "romantic" | "epic" | null | undefined;
        }, mongoose.Types.Subdocument<mongoose.mongo.BSON.ObjectId, any, {
            weight: number;
            lastSelected: NativeDate;
            mood?: "thriller" | "happy" | "cozy" | "mindbending" | "romantic" | "epic" | null | undefined;
        }> & {
            weight: number;
            lastSelected: NativeDate;
            mood?: "thriller" | "happy" | "cozy" | "mindbending" | "romantic" | "epic" | null | undefined;
        }>;
        dislikedMovies: string[];
        likedMovies: string[];
        watchlist: string[];
        ratingThreshold: number;
    } | null | undefined;
} & mongoose.DefaultTimestampProps, {}, {
    timestamps: true;
    toJSON: {
        transform: (doc: any, ret: any) => any;
    };
}> & {
    email: string;
    username: string;
    isEmailVerified: boolean;
    lastLogin: NativeDate;
    movieNights: mongoose.Types.ObjectId[];
    createdAt: NativeDate;
    updatedAt: NativeDate;
    password?: string | null | undefined;
    firstName?: string | null | undefined;
    lastName?: string | null | undefined;
    avatar?: string | null | undefined;
    googleId?: string | null | undefined;
    appleId?: string | null | undefined;
    preferences?: {
        favoriteGenres: ("family" | "action" | "adventure" | "comedy" | "drama" | "fantasy" | "horror" | "mystery" | "romance" | "sci-fi" | "thriller" | "documentary")[];
        moodPreferences: mongoose.Types.DocumentArray<{
            weight: number;
            lastSelected: NativeDate;
            mood?: "thriller" | "happy" | "cozy" | "mindbending" | "romantic" | "epic" | null | undefined;
        }, mongoose.Types.Subdocument<mongoose.mongo.BSON.ObjectId, any, {
            weight: number;
            lastSelected: NativeDate;
            mood?: "thriller" | "happy" | "cozy" | "mindbending" | "romantic" | "epic" | null | undefined;
        }> & {
            weight: number;
            lastSelected: NativeDate;
            mood?: "thriller" | "happy" | "cozy" | "mindbending" | "romantic" | "epic" | null | undefined;
        }>;
        dislikedMovies: string[];
        likedMovies: string[];
        watchlist: string[];
        ratingThreshold: number;
    } | null | undefined;
} & mongoose.DefaultTimestampProps & {
    _id: mongoose.Types.ObjectId;
} & {
    __v: number;
}, mongoose.Schema<any, mongoose.Model<any, any, any, any, any, any>, {}, {}, {}, {}, {
    timestamps: true;
    toJSON: {
        transform: (doc: any, ret: any) => any;
    };
}, {
    email: string;
    username: string;
    isEmailVerified: boolean;
    lastLogin: NativeDate;
    movieNights: mongoose.Types.ObjectId[];
    createdAt: NativeDate;
    updatedAt: NativeDate;
    password?: string | null | undefined;
    firstName?: string | null | undefined;
    lastName?: string | null | undefined;
    avatar?: string | null | undefined;
    googleId?: string | null | undefined;
    appleId?: string | null | undefined;
    preferences?: {
        favoriteGenres: ("family" | "action" | "adventure" | "comedy" | "drama" | "fantasy" | "horror" | "mystery" | "romance" | "sci-fi" | "thriller" | "documentary")[];
        moodPreferences: mongoose.Types.DocumentArray<{
            weight: number;
            lastSelected: NativeDate;
            mood?: "thriller" | "happy" | "cozy" | "mindbending" | "romantic" | "epic" | null | undefined;
        }, mongoose.Types.Subdocument<mongoose.mongo.BSON.ObjectId, any, {
            weight: number;
            lastSelected: NativeDate;
            mood?: "thriller" | "happy" | "cozy" | "mindbending" | "romantic" | "epic" | null | undefined;
        }> & {
            weight: number;
            lastSelected: NativeDate;
            mood?: "thriller" | "happy" | "cozy" | "mindbending" | "romantic" | "epic" | null | undefined;
        }>;
        dislikedMovies: string[];
        likedMovies: string[];
        watchlist: string[];
        ratingThreshold: number;
    } | null | undefined;
} & mongoose.DefaultTimestampProps, any>>;
//# sourceMappingURL=User.d.ts.map