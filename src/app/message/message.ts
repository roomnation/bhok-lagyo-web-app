import { DocumentData, FirestoreDataConverter, PartialWithFieldValue, QueryDocumentSnapshot, SetOptions, SnapshotOptions, Timestamp, WithFieldValue } from "@angular/fire/firestore"

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
        const data = snapshot.data()
        return {
            ...data,
            messageType: data['messageType'] ?? MessageType.text,
            sentByMe: data['from'] == this.me,
            timestamp: new Date(data['timestamp'].toMillis())
        }
    }
}