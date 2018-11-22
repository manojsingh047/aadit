import { Injectable } from '@angular/core';
import { AngularFireAuth } from 'angularfire2/auth';
import { AngularFireDatabase, AngularFireList, AngularFireObject } from 'angularfire2/database';
import * as firebase from 'firebase/app';


import AuthProvider = firebase.auth.AuthProvider;
import { GoogleDriveService } from './google-drive.service';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private user: firebase.User;
  constructor(
    public afAuth: AngularFireAuth,
    private afDb: AngularFireDatabase,
    private googleDriveService: GoogleDriveService
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
    provider.addScope('profile');
    provider.addScope('email');
    provider.addScope('https://www.googleapis.com/auth/spreadsheets');
    provider.addScope('https://www.googleapis.com/auth/drive');

    return this.oauthSignIn(provider)
      .then(res => {
        console.log("signInWithGoogle", res);
        this.signInHandler(res);
      });
  }


  public signInHandler(data) {
    console.log("this.signInHandler", data);
    sessionStorage.setItem(this.googleDriveService.SESSION_STORAGE_KEY, data.credential.accessToken);
    console.log('data.credential.access_token', data.credential.accessToken);
    if (data.additionalUserInfo.isNewUser) {
      return this.setUpNewUser(data);
    }
    return true;
  }

  public setUpNewUser(newUserData) {
    // console.log('newUserData',newUserData);
    // console.log('this.googleDriveService.getToken()',this.googleDriveService.getToken());

    this.googleDriveService.createUser(newUserData.user.uid, this.googleDriveService.getToken()).subscribe((createUserResponse) => {

      const userData = {
        userId: newUserData.user.uid,
        sheetId: createUserResponse.spreadsheetId
      };
      
      this.afDb.list(`/profile/${newUserData.user.uid}`).push(userData).then((response) => {
        console.log('list',response);

        // this.navCtrl.push(Login, { message: 'User saved successfully. Please login now', status: 'Success' });
      }, err => {
        // this.navCtrl.push(Login, { message: 'Failed to save the user information. Please try again.', status: 'Error' });
      });


      // this.sheetService.saveUser(this.user, this.gSheetService.getToken(), createUserResponse.spreadsheetId).subscribe((saveUserResponse) => {

      //   const nameData = new UserName(`${this.user["first_name"]} ${this.user["last_name"]}`, this.user["first_name"], this.user["last_name"], this.user["first_name"]);
      //   const setupData = new UserSetup(false, false, false);

      //   const userData = new UserProfile(createUserWithCredsResponse.user.uid, createUserResponse.spreadsheetId, nameData, this.user["email"], "", this.user["phone"], setupData);

      //   // console.log("createUserResponse:::", createUserWithCredsResponse);
      //   // console.log("saveUserResponse:::", saveUserResponse);
      //   // console.log("data:::", createUserResponse);
      //   // console.log("userData:::", userData);

      //   this.afDb.list(`/profile/${createUserWithCredsResponse.user.uid}`).push(userData).then((response) => {
      //     // loader.dismiss();
      //     // this.navCtrl.push(Login, { message: 'User saved successfully. Please login now', status: 'Success' });
      //   }, err => {
      //     // this.navCtrl.push(Login, { message: 'Failed to save the user information. Please try again.', status: 'Error' });
      //   });

      // }, (err) => {
      //   loader.dismiss();
      //   this.navCtrl.push(Login, { message: 'Failed to save the user information. Please try again.', status: 'Error' });
      // });
    });
  }

  public oauthSignIn(provider: AuthProvider) {
    if (!(<any>window).cordova) {
      return this.afAuth.auth.signInWithPopup(provider);
    } else {
      return this.afAuth.auth.signInWithRedirect(provider)
        .then(() => {
          return this.afAuth.auth.getRedirectResult().then(result => {
            return this.signInHandler(result);
          }).catch(function (error) {
            alert(error.message);
          });
        });
    }
  }
}
