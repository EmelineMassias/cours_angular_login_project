import {Component, OnInit} from '@angular/core';
import {FormControl, FormGroup, Validators} from "@angular/forms";
import {AuthService} from "../../services/auth/auth.service";
import {Router} from "@angular/router";

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss'
})
export class LoginComponent implements OnInit {
  form: FormGroup;
  errorMsg?: string;
  requestOnGoing: boolean = false;


  constructor(private authService: AuthService, private router: Router) { }

  ngOnInit() {
    this.initForm();
  }

  async onSubmitLogin(): Promise<void> {
    if (this.form.invalid) return;

    const { username, password, remember } = this.form.value;
    this.errorMsg = undefined;
    this.requestOnGoing = true;

    try {
      await this.authService.login(username, password, remember);
      this.router.navigateByUrl('/products');
    }
    catch (e: any) {
      if (e.status === 401) this.errorMsg = 'Pseudo ou mot de passe incorrect';
      else this.errorMsg = 'Une erreur est survenue, veuillez réessayer plus tard';
      console.log(e);
    }
    this.requestOnGoing = false;
  }

  private initForm() {
    this.form = new FormGroup({
      username: new FormControl('', [Validators.required]),
      password: new FormControl('', [Validators.required]),
      remember: new FormControl(false)
    });
  }
}
