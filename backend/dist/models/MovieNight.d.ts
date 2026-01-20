import mongoose from 'mongoose';
export declare const MovieNight: mongoose.Model<{
    date: NativeDate;
    createdAt: NativeDate;
    updatedAt: NativeDate;
    title: string;
    movies: mongoose.Types.ObjectId[];
    time: string;
    host: mongoose.Types.ObjectId;
    guests: mongoose.Types.DocumentArray<{
        name: string;
        status: "pending" | "confirmed" | "declined";
        email?: string | null | undefined;
    }, mongoose.Types.Subdocument<mongoose.mongo.BSON.ObjectId, any, {
        name: string;
        status: "pending" | "confirmed" | "declined";
        email?: string | null | undefined;
    }> & {
        name: string;
        status: "pending" | "confirmed" | "declined";
        email?: string | null | undefined;
    }>;
    status: "planned" | "ongoing" | "completed" | "cancelled";
    theme?: "Classic Movie Night" | "Horror Marathon" | "Comedy Fest" | "Action Adventure" | "Romantic Evening" | "Sci-Fi Journey" | "Documentary Night" | "Family Fun" | null | undefined;
    notes?: string | null | undefined;
} & mongoose.DefaultTimestampProps, {}, {}, {}, mongoose.Document<unknown, {}, {
    date: NativeDate;
    createdAt: NativeDate;
    updatedAt: NativeDate;
    title: string;
    movies: mongoose.Types.ObjectId[];
    time: string;
    host: mongoose.Types.ObjectId;
    guests: mongoose.Types.DocumentArray<{
        name: string;
        status: "pending" | "confirmed" | "declined";
        email?: string | null | undefined;
    }, mongoose.Types.Subdocument<mongoose.mongo.BSON.ObjectId, any, {
        name: string;
        status: "pending" | "confirmed" | "declined";
        email?: string | null | undefined;
    }> & {
        name: string;
        status: "pending" | "confirmed" | "declined";
        email?: string | null | undefined;
    }>;
    status: "planned" | "ongoing" | "completed" | "cancelled";
    theme?: "Classic Movie Night" | "Horror Marathon" | "Comedy Fest" | "Action Adventure" | "Romantic Evening" | "Sci-Fi Journey" | "Documentary Night" | "Family Fun" | null | undefined;
    notes?: string | null | undefined;
} & mongoose.DefaultTimestampProps, {}, {
    timestamps: true;
}> & {
    date: NativeDate;
    createdAt: NativeDate;
    updatedAt: NativeDate;
    title: string;
    movies: mongoose.Types.ObjectId[];
    time: string;
    host: mongoose.Types.ObjectId;
    guests: mongoose.Types.DocumentArray<{
        name: string;
        status: "pending" | "confirmed" | "declined";
        email?: string | null | undefined;
    }, mongoose.Types.Subdocument<mongoose.mongo.BSON.ObjectId, any, {
        name: string;
        status: "pending" | "confirmed" | "declined";
        email?: string | null | undefined;
    }> & {
        name: string;
        status: "pending" | "confirmed" | "declined";
        email?: string | null | undefined;
    }>;
    status: "planned" | "ongoing" | "completed" | "cancelled";
    theme?: "Classic Movie Night" | "Horror Marathon" | "Comedy Fest" | "Action Adventure" | "Romantic Evening" | "Sci-Fi Journey" | "Documentary Night" | "Family Fun" | null | undefined;
    notes?: string | null | undefined;
} & mongoose.DefaultTimestampProps & {
    _id: mongoose.Types.ObjectId;
} & {
    __v: number;
}, mongoose.Schema<any, mongoose.Model<any, any, any, any, any, any>, {}, {}, {}, {}, {
    timestamps: true;
}, {
    date: NativeDate;
    createdAt: NativeDate;
    updatedAt: NativeDate;
    title: string;
    movies: mongoose.Types.ObjectId[];
    time: string;
    host: mongoose.Types.ObjectId;
    guests: mongoose.Types.DocumentArray<{
        name: string;
        status: "pending" | "confirmed" | "declined";
        email?: string | null | undefined;
    }, mongoose.Types.Subdocument<mongoose.mongo.BSON.ObjectId, any, {
        name: string;
        status: "pending" | "confirmed" | "declined";
        email?: string | null | undefined;
    }> & {
        name: string;
        status: "pending" | "confirmed" | "declined";
        email?: string | null | undefined;
    }>;
    status: "planned" | "ongoing" | "completed" | "cancelled";
    theme?: "Classic Movie Night" | "Horror Marathon" | "Comedy Fest" | "Action Adventure" | "Romantic Evening" | "Sci-Fi Journey" | "Documentary Night" | "Family Fun" | null | undefined;
    notes?: string | null | undefined;
} & mongoose.DefaultTimestampProps, mongoose.Document<unknown, {}, mongoose.FlatRecord<{
    date: NativeDate;
    createdAt: NativeDate;
    updatedAt: NativeDate;
    title: string;
    movies: mongoose.Types.ObjectId[];
    time: string;
    host: mongoose.Types.ObjectId;
    guests: mongoose.Types.DocumentArray<{
        name: string;
        status: "pending" | "confirmed" | "declined";
        email?: string | null | undefined;
    }, mongoose.Types.Subdocument<mongoose.mongo.BSON.ObjectId, any, {
        name: string;
        status: "pending" | "confirmed" | "declined";
        email?: string | null | undefined;
    }> & {
        name: string;
        status: "pending" | "confirmed" | "declined";
        email?: string | null | undefined;
    }>;
    status: "planned" | "ongoing" | "completed" | "cancelled";
    theme?: "Classic Movie Night" | "Horror Marathon" | "Comedy Fest" | "Action Adventure" | "Romantic Evening" | "Sci-Fi Journey" | "Documentary Night" | "Family Fun" | null | undefined;
    notes?: string | null | undefined;
} & mongoose.DefaultTimestampProps>, {}, mongoose.ResolveSchemaOptions<{
    timestamps: true;
}>> & mongoose.FlatRecord<{
    date: NativeDate;
    createdAt: NativeDate;
    updatedAt: NativeDate;
    title: string;
    movies: mongoose.Types.ObjectId[];
    time: string;
    host: mongoose.Types.ObjectId;
    guests: mongoose.Types.DocumentArray<{
        name: string;
        status: "pending" | "confirmed" | "declined";
        email?: string | null | undefined;
    }, mongoose.Types.Subdocument<mongoose.mongo.BSON.ObjectId, any, {
        name: string;
        status: "pending" | "confirmed" | "declined";
        email?: string | null | undefined;
    }> & {
        name: string;
        status: "pending" | "confirmed" | "declined";
        email?: string | null | undefined;
    }>;
    status: "planned" | "ongoing" | "completed" | "cancelled";
    theme?: "Classic Movie Night" | "Horror Marathon" | "Comedy Fest" | "Action Adventure" | "Romantic Evening" | "Sci-Fi Journey" | "Documentary Night" | "Family Fun" | null | undefined;
    notes?: string | null | undefined;
} & mongoose.DefaultTimestampProps> & {
    _id: mongoose.Types.ObjectId;
} & {
    __v: number;
}>>;
//# sourceMappingURL=MovieNight.d.ts.map