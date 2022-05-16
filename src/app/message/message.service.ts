import { Injectable } from '@angular/core';
import { collection, doc, DocumentReference, Firestore, limit, orderBy, query, setDoc } from '@angular/fire/firestore';
import { getDocs } from 'firebase/firestore';
import { Observable, from } from 'rxjs';
import { environment } from 'src/environments/environment';
import { AuthService } from '../auth/auth.service';
import { Message, MessageConverter, MessageType } from './message';

@Injectable({
  providedIn: 'root'
})
export class MessageService {
  private collection: string; //collection where message threads are stored
  private all: string; //document id for public message thread
  private subCollection: string; //collections where messages are stored
  private paginateField: string;

  //collection (message-thread) -> specific thread (all/public) -> sub collection (specific message id)

  getMessages$(): Observable<Message[]> {
    return from(this.getMessage());
  }

  sendMessage(arg0: string) {
    setDoc(this.getDocRef(this.all), {
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

  private async getMessage(): Promise<Message[]> {
    const q = query(this.getMessageCollection(this.all), orderBy(this.paginateField, "desc"), limit(20));
    const querySnapshot = await getDocs(q);
    const messages: Message[] = [];
    querySnapshot.forEach((doc) => messages.push(doc.data()));
    return messages;
  }
  
  constructor(private firestore: Firestore,
    private authService: AuthService) {
    this.collection = environment.message.collection;
    this.subCollection = environment.message.subCollection;
    this.all = environment.message.threads.all;
    this.paginateField = ;
  }
}


