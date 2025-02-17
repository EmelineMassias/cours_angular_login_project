import { Injectable } from '@angular/core';
import {HttpClient, HttpHeaders} from "@angular/common/http";
import {environment} from "../../../environments/environment.development";
import {lastValueFrom, map, tap} from "rxjs";
import {LocalStorageService} from "../local-storage/local-storage.service";
import {User, UserHttp} from "../../entities/user.entity";
import {UserService} from "../user/user.service";

interface LoginHttp {
  token: string;
  refresh_token: string;
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  token?: string;

  private url: string;

  constructor(private http: HttpClient, private localStorageService: LocalStorageService,
              private userService: UserService) {
    this.url = environment.API_URL + environment.API_RESOURCES.AUTH;
  }

  async checkLocalStorageToken(): Promise<void> {
    const tokenLocalStorage = this.localStorageService.getItem(environment.LOCAL_STORAGE.ACCESS_TOKEN)
    console.log("Token récupéré depuis le localStorage :", tokenLocalStorage);
    if(tokenLocalStorage) {this.token = tokenLocalStorage
      await this.getProfile()
    }
  }

  async login (username: string, password: string, remember: boolean): Promise<void> {
    const obs = this.http
      .post<LoginHttp>(`${this.url}/login`, { username, password })
      .pipe(
        tap(res => {
          console.log("Réponse de l'API :", res);
          this.token = res.token;

          if (remember) {
            this.localStorageService.setItem(environment.LOCAL_STORAGE.ACCESS_TOKEN, res.token);
          }
        }),
        map(() => undefined) // ✅ Retire l'appel à getProfile()
      );
    return lastValueFrom(obs)
  }

  async getProfile(): Promise<void>{
    console.log("Token utilisé pour getProfile():", this.token);
    if(!this.token) throw new Error('Aucun jeton n\'a été trouvé')

    const headers = new HttpHeaders({
      Authorization: `Bearer ${this.token}`
    })

    const obs = this.http
      .get<UserHttp>(`${this.url}/profile`, {headers})
      .pipe(
        map(userHttp => User.fromHttp(userHttp)),
        tap(user => this.userService.currentUser = user),
        map(() => undefined)
      )
    return lastValueFrom(obs)
  }
}
