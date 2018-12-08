import { Injectable } from '@angular/core';
import { AngularFireDatabase } from 'angularfire2/database';
@Injectable({
  providedIn: 'root'
})
export class DbqueryService {
  db: any;
  constructor(db: AngularFireDatabase) { 
   this.db = db;
  }

  getSheetId(){
    console.log('###################');
    this.db.database.ref('profile').orderByChild('userId').equalTo('karuna.bhardwaj@gmail.com').on('child_added', function(snapshot) {
      const sheet=snapshot.child('sheetId').node_.value_;
      console.log('sheetid=====',sheet);
      return sheet;
    });
  }
}
