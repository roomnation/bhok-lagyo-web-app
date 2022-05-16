import { DocumentData, FirestoreDataConverter, PartialWithFieldValue, QueryDocumentSnapshot, SetOptions, SnapshotOptions, WithFieldValue } from "firebase/firestore";
import { AuthResponse } from "./auth/auth-response";

export interface Blacklist extends AuthResponse {
    time?: Date;
}

export class BlacklistConverter implements FirestoreDataConverter<Blacklist> {
    toFirestore(modelObject: WithFieldValue<Blacklist>): DocumentData;

    toFirestore(modelObject: PartialWithFieldValue<Blacklist>, options: SetOptions): DocumentData;

    toFirestore(modelObject: Blacklist, options?: unknown): import("@firebase/firestore").DocumentData {
        return {
            ...modelObject
        }
    }

    fromFirestore(snapshot: QueryDocumentSnapshot<DocumentData>, options?: SnapshotOptions): Blacklist {
        return {
            ...snapshot.data()
        }
    }
}