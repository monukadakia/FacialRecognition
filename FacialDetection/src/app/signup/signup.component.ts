import { Component, OnInit } from '@angular/core';
import {AuthGuardService} from '../../services/auth-guard.service';
import {Router} from '@angular/router';

@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.css']
})

export class SignupComponent implements OnInit {

  constructor(private authGuardService: AuthGuardService, private router: Router) { }

  ngOnInit() {
    $('.text-danger').hide();
    $('#email').on('keydown', function() {
      $('.text-danger').hide();
    });
    $('#pwd').on('keydown', function() {
      $('.text-danger').hide();
    });
    $('#confirmPwd').on('keydown', function() {
      $('.text-danger').hide();
    });
    this.authGuardService.afAuth.authState.subscribe(a => {
      if (a !== null) {
        this.router.navigate(['/home']);
      }
    });
  }

  signup() {
    const firstName = $('#first-name').val().toString().trim();
    const lastName = $('#last-name').val().toString().trim();
    const email = $('#email').val().toString().trim();
    const password = $('#pwd').val().toString().trim();
    const confirmPwd = $('#confirmPwd').val().toString().trim();
    if (email.length < 1) {
      $('#emptyEmail').show();
      return;
    }
    if (!this.isValidEmail(email)) {
      $('#invalidEmail').show();
      return;
    }
    if (password.length < 1) {
      $('#emptyPwd').show();
      return;
    }
    if (password.length < 6) {
      $('#invalidPwd').show();
      return;
    }
    if (confirmPwd.length < 1) {
      $('#emptyConfirmPwd').show();
      return;
    }
    if (password !== confirmPwd) {
      $('#invalidConfirmPwd').show();
      return;
    }
    const self = this;
    $.getJSON("http://jsonip.com/?callback=?", function (data) {
      self.authGuardService.signup(email, password).then(a => {
        self.authGuardService.afDB.list('/users/' + a.uid).
        push({info: {firstName: firstName, lastName: lastName, ipAddress: data.ip, lastLoginOn: new Date().toLocaleString()}});
        self.authGuardService.login(email, password).then(a2 => {
          self.router.navigate(['/home']);
        });
      }).catch(a => {
        $('#duplicateEmail').show();
      });
    });
  }

  isValidEmail(email) {
    const re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return re.test(email);
  }
}
