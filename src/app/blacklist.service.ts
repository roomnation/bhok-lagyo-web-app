import { Injectable } from '@angular/core';
import { doc, Firestore, getDoc, setDoc } from '@angular/fire/firestore';
import { collection, DocumentReference } from 'firebase/firestore';
import { Observable } from 'rxjs';
import { AuthService } from './auth/auth.service';
import { Blacklist, BlacklistConverter } from './blacklist';
import { EmployeeService } from './employee/employee.service';

@Injectable({
  providedIn: 'root'
})
export class BlacklistService {
  addedToBlackList = false;

  constructor(private firestore: Firestore,
    private authService: AuthService,
    private employeeService: EmployeeService) { }

  write(arg0: Blacklist) {
    if (!this.addedToBlackList) {
      setDoc(this.getDocRef(arg0?.id ?? ''), arg0);
      this.addedToBlackList = true;
    }
  }

  isBlackListed$(): Observable<boolean> {
    const id = this.authService.currentUser?.id ?? '';
    return new Observable((observer) => {
      getDoc(this.getDocRef(id))
        .then((doc) => {
          const blacklistTimestamp = new Date(((doc.data()?.time as any)?.seconds ?? 0) * 1000);
          console.log(blacklistTimestamp);
          const serverTimestamp = new Date(this.employeeService.getTimestamp$().value);
          const sameday = blacklistTimestamp.getFullYear() === serverTimestamp.getFullYear() &&
            blacklistTimestamp.getMonth() === serverTimestamp.getMonth() &&
            blacklistTimestamp.getDate() === serverTimestamp.getDate();
          observer.next(sameday);
          observer.complete();
        })
    });
  }

  private getDocRef(id: string): DocumentReference<Blacklist> {
    return doc(this.getBlacklistCollection(), id);
  }

  private getBlacklistCollection(...args: string[]) {
    return collection(this.firestore, 'blacklist', ...args)
      .withConverter(new BlacklistConverter());
  }
}
