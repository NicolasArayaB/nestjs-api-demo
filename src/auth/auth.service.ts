import { Injectable } from "@nestjs/common";

@Injectable({})
export class AuthService {
  signup() {
    return "I'm signup"
  }

  signin() {
    return "I'm signin"
  }
}