import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { HomePage } from '../home/home.page';
import { AuthService } from '../services/auth.service';
import { Router, ActivatedRoute, ParamMap } from '@angular/router';
import { MenuController } from '@ionic/angular';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})
export class LoginPage implements OnInit {

  loginForm: FormGroup;
  loginError: string;

  constructor(
    private auth: AuthService,
    private fb: FormBuilder,
    private router: Router,
    private menuCtrl: MenuController
  ) { }

  ngOnInit() {
    this.loginForm = this.fb.group({
      email: ['', Validators.compose([Validators.required, Validators.email])],
      password: ['', Validators.compose([Validators.required, Validators.minLength(6)])]
    });
  }

  ionViewWillEnter(){
    this.menuCtrl.enable(false);
  }


  login() {
    let data = this.loginForm.value;

    if (!data.email) {
      return;
    }

    let credentials = {
      email: data.email,
      password: data.password
    };

    this.auth.signInWithEmail(credentials)
      .then(
        () => this.router.navigate(['/home']),
        error => this.loginError = error.message
      );
  }

  signup(){
    this.router.navigate(['/signup']);
  }

  loginWithGoogle() {
    this.auth.signInWithGoogle();
  }

}
