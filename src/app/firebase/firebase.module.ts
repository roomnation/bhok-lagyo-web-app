import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { provideFirebaseApp, initializeApp } from '@angular/fire/app';
import { getAuth, provideAuth } from '@angular/fire/auth';
import { getFirestore, provideFirestore } from '@angular/fire/firestore';
import { getStorage, provideStorage } from '@angular/fire/storage';
import { getAnalytics, provideAnalytics } from '@angular/fire/analytics';
import { AngularFireMessagingModule } from '@angular/fire/compat/messaging';
import { environment } from 'src/environments/environment';

const FirebaseModules = [
  provideFirebaseApp(() => initializeApp(environment.firebaseConfig)),
  provideFirestore(() => getFirestore()),
  provideAuth(() => getAuth()),
  provideStorage(() => getStorage()),
  provideAnalytics(() => getAnalytics()),
];

@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    FirebaseModules,
    AngularFireMessagingModule
  ],
  exports: [
    FirebaseModules
  ]
})
export class FirebaseModule { }
