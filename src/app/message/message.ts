import { DocumentData, FirestoreDataConverter, PartialWithFieldValue, QueryDocumentSnapshot, SetOptions, SnapshotOptions, WithFieldValue } from "@angular/fire/firestore"

export interface Message {
    id?: string,
    from?: string,
    displayName?: string,
    text?: string,
    messageType: MessageType,
    readonly sentByMe?: boolean
    timestamp?: Date
}

export enum MessageType {
    'unknown',
    'action',
    'text'
}

export class MessageConverter implements FirestoreDataConverter<Message> {
    constructor(private me: string) {
    }

    toFirestore(modelObject: WithFieldValue<Message>): DocumentData;

    toFirestore(modelObject: PartialWithFieldValue<Message>, options: SetOptions): DocumentData;

    toFirestore(modelObject: Message, options?: unknown): import("@firebase/firestore").DocumentData {
        return {
            ...modelObject
        }
    }

    fromFirestore(snapshot: QueryDocumentSnapshot<DocumentData>, options?: SnapshotOptions): Message {
        return {
            ...snapshot.data(),
            messageType: snapshot.data()['messageType'] ?? MessageType.text,
            sentByMe: snapshot.data()['from'] == this.me       
        }
    }
}