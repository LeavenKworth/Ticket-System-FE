import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { User } from '../models/user.model';

@Injectable({
  providedIn: 'root',
})
export class UserService {
  private apiUrl = 'http://192.168.10.87:7108/api/v1/users';

  constructor(private http: HttpClient) {}

  getUserById(id: number): Observable<User> {
    return this.http.get<User>(`${this.apiUrl}/${id}`);
  }
  getAllUsers(): Observable<User[]> {

    return  this.http.get<User[]>(`${this.apiUrl}`);
  }
  deleteUser(id: number): Observable<any> {
    return  this.http.delete(`${this.apiUrl}/${id}`);
  }

}
