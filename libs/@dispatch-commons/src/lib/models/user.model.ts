export enum UserRol {
  admin = "ADMIN",
  other = "OTHER"
}

export interface ITokenResponse {
  access_token: string;
  refresh_token: string;
}

export interface TokenDecoded {  
  exp: number;  
  id: string;
  name: string;
  email: string;
  area: string;
  role: UserRol;
  avatar?: string;
}

export class TokenModel {  
  exp: number;  
  id: string;
  name: string;
  email: string;
  area: string;
  role: UserRol;
  avatar?: string;

  constructor(tokenDecoded: TokenDecoded) {    
    this.exp = tokenDecoded.exp;    
    this.id = tokenDecoded.id;
    this.name = tokenDecoded.name;
    this.email = tokenDecoded.email;
    this.area = tokenDecoded.area;
    this.role = tokenDecoded.role;
    this.avatar = tokenDecoded.avatar;
  }

  get isExpired(): boolean {
    return new Date().getTime() > this.exp * 1000;
  }
}

export class UserModel {
  id: string;
  name: string;
  email: string;
  area: string;
  role: UserRol;
  avatar?: string;

  constructor(tokenDecoded?: TokenDecoded) {
    if (tokenDecoded) {
      this.id = tokenDecoded.id;
      this.name = tokenDecoded.name;
      this.email = tokenDecoded.email;
      this.area = tokenDecoded.area;
      this.role = tokenDecoded.role;
      this.avatar = tokenDecoded.avatar;
    }
  }

  isAdmin() {
    return this.role === UserRol.admin;
  }

  hasRole(rols: UserRol[]) {
    return rols.includes(this.role);
  }
}
