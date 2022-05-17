import { Injectable } from '@angular/core';
import { collection, doc, DocumentReference, Firestore, limit, onSnapshot, onSnapshotsInSync, orderBy, query, setDoc } from '@angular/fire/firestore';
import { getDocs, where } from 'firebase/firestore';
import { nextTick } from 'process';
import { Observable, from, BehaviorSubject } from 'rxjs';
import { environment } from 'src/environments/environment';
import { AuthService } from '../auth/auth.service';
import { Message, MessageConverter, MessageType } from './message';

@Injectable({
  providedIn: 'root'
})
export class MessageService {
  private collection: string; //collection where message threads are stored
  private messageThread: string; //document id for public message thread
  private subCollection: string; //collections where messages are stored

  //collection (message-thread) -> specific thread (all/public) -> sub collection (specific message id)
  private messages: Message[] = [];
  private messageSubject$ = new BehaviorSubject<Message[]>(this.messages);

  getMessages$(): Observable<Message[]> {
    return this.messageSubject$;
  }

  sendMessage(arg0: string) {
    setDoc(this.getDocRef(this.messageThread), {
      text: arg0,
      from: this.authService.currentUser?.id,
      displayName: this.authService.currentUser?.name,
      timestamp: new Date(),
      messageType: MessageType.text
    });

  }

  private getDocRef(id: string): DocumentReference<Message> {
    return doc(this.getMessageCollection(id));
  }

  private getMessageCollection(...args: string[]) {
    return collection(collection(this.firestore, this.collection), args[0], this.subCollection)
      .withConverter(new MessageConverter(this.authService.currentUser?.id!));
  }

  private async loadMessages() {
    const q = query(this.getMessageCollection(this.messageThread), orderBy("timestamp", "desc"), limit(20));
    const querySnapshot = await getDocs(q);
    const messages: Message[] = [];
    querySnapshot.forEach((doc) => messages.push(doc.data()));
    this.messages = messages;
  }

  private async subscribeToMessageRealTimeEvent() {
    onSnapshot(query(this.getMessageCollection(this.messageThread), orderBy("timestamp", "asc")), {
      next: (snapshot) => {
        const docs = snapshot.docs;
        const dataList = docs.map(it => it.data());
        this.messages = dataList;
        this.messageSubject$.next(this.messages);
      }
    });
  }

  constructor(private firestore: Firestore,
    private authService: AuthService) {
    this.collection = environment.message.collection;
    this.subCollection = environment.message.subCollection;
    this.messageThread = environment.message.threads.all;
    this.subscribeToMessageRealTimeEvent();
  }
}


