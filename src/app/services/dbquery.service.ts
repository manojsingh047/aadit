import { Injectable } from '@angular/core';
import { AngularFireDatabase } from 'angularfire2/database';
import { Observable, of } from 'rxjs';
import { UserInfoModel } from '../models/user-info.model';
@Injectable({
  providedIn: 'root'
})
export class DbqueryService {
  constructor(private db: AngularFireDatabase) {}

  getSheetId(email: string){

    // return this.db.database.ref('profile').orderByChild('userId').equalTo(email).on('child_added', function (snapshot) {
    //   const sheetId: string = snapshot.child('sheetId')['node_']['value_'];
    //   console.log('sheetid=====', sheetId);
    //   return sheetId;
    // });
  }
}
