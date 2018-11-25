import { Component, OnInit } from '@angular/core';

import { Platform } from '@ionic/angular';
import { SplashScreen } from '@ionic-native/splash-screen/ngx';
import { StatusBar } from '@ionic-native/status-bar/ngx';
import { SheetTabsTitleConst } from "./constants/sheet.constant";
import { Router, ActivatedRoute, ParamMap } from '@angular/router';
import { AuthService } from './services/auth.service';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html'
})
export class AppComponent implements OnInit {
  public appPages = [
    {
      title: 'Home',
      url: '/home',
      icon: 'home'
    },
    {
      title: 'List',
      url: '/list',
      icon: 'list'
    }
  ];

  constructor(
    private platform: Platform,
    private splashScreen: SplashScreen,
    private statusBar: StatusBar,
    private router: Router,
    private auth: AuthService
  ) {
    this.initializeApp();
  }
  initializeApp() {
    this.platform.ready().then(() => {
      this.statusBar.styleDefault();
    });
  
    this.auth.afAuth.authState
      .subscribe(
        user => {
          console.log('user',user);
          if (user) {
            this.router.navigate(['/home']);
          } else {
            this.router.navigate(['/login']);
          }
        },
        () => {
          this.router.navigate(['/login']);
        }
      );
  }
    
  logout() {
    this.auth.signOut();
    this.router.navigate(['/login']);
  }
  ngOnInit() { }

}
