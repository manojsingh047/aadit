import { Injectable } from '@angular/core';
import { AngularFireAuth } from 'angularfire2/auth';
import { AngularFireDatabase, AngularFireList, AngularFireObject } from 'angularfire2/database';
import * as firebase from 'firebase/app';


import AuthProvider = firebase.auth.AuthProvider;
import { GoogleDriveService } from './google-drive.service';
import { UserProfileModel, UserInfoModel, TokenModel } from '../models/user-info.model';
import { Router } from '@angular/router';
import { DbqueryService } from './dbquery.service';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private user: firebase.User;
  constructor(
    public afAuth: AngularFireAuth,
    private afDb: AngularFireDatabase,
    private googleDriveService: GoogleDriveService,
    private router: Router,
    private dbService: DbqueryService
  ) {
    afAuth.authState.subscribe(user => {
      this.user = user;
    });
  }

  get authenticated(): boolean {
    return this.user !== null;
  }

  getEmail() {
    return this.user && this.user.email;
  }
  signOut(): Promise<void> {
    localStorage.clear();
    return this.afAuth.auth.signOut();
  }
  signInWithEmail(credentials) {
    console.log('Sign in with email');
    return this.afAuth.auth.signInWithEmailAndPassword(credentials.email,
      credentials.password)
      .then(res => {
        return this.signInHandler(res);
      });
  }
  signUp(credentials) {
    return this.afAuth.auth.createUserWithEmailAndPassword(credentials.email, credentials.password)
      .then((createUserWithCredsResponse) => {

        console.log('createUserWithCredsResponse', createUserWithCredsResponse);

        return this.signInHandler(createUserWithCredsResponse);
      });
  }
  signInWithGoogle() {
    const provider = new firebase.auth.GoogleAuthProvider();
    provider.addScope('https://www.googleapis.com/auth/spreadsheets');
    provider.addScope('https://www.googleapis.com/auth/drive');

    return this.oauthSignIn(provider)
      .then(res => {
        console.log('signInWithGoogle', res);
        this.signInHandler(res);
      });
  }


  public signInHandler(data): void {
    console.log('this.signInHandler', data);

    this.afDb.database.ref('profile').orderByChild('userId').equalTo(data['additionalUserInfo']['profile']['email']).on('child_added', (snapshot) => {
      const sheetId: string = snapshot.child('sheetId')['node_']['value_'];

      const userInfo = new UserInfoModel(new TokenModel(data['credential']['accessToken'], data['user']['refreshToken'], sheetId), new UserProfileModel(data['additionalUserInfo']['profile']['email'], data['additionalUserInfo']['profile']['family_name'], data['additionalUserInfo']['profile']['given_name'], data['additionalUserInfo']['profile']['name'], data['additionalUserInfo']['profile']['picture']));

      console.log('userInfo', userInfo);

      localStorage.setItem('userInfo', JSON.stringify(userInfo));
      if (data.additionalUserInfo.isNewUser) {
        // return this.setUpNewUser(data);
      }
      this.router.navigate(['/home']);
    });

  }



  public oauthSignIn(provider: AuthProvider): any {
    if (!(<any>window).cordova) {
      return this.afAuth.auth.signInWithPopup(provider);
    } else {
      return this.afAuth.auth.signInWithRedirect(provider)
        .then(() => {
          return this.afAuth.auth.getRedirectResult().then(result => {
            return this.signInHandler(result);
          }).catch(function (error) {
            console.error(error.message);
          });
        });
    }
  }
}
