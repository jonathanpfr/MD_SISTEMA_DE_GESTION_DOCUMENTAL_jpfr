import { Injectable } from '@angular/core';
import { ITokenResponse, TokenDecoded, TokenModel, UserModel, UserRol } from '../models/user.model';
import { TokenJwt } from '../utils';
import { CryptoService } from './crypto.service';

// Una sola instancia del servicio en toda la aplicacion: providedIn: 'root'
@Injectable({
  providedIn: 'root'
})
export class SessionService {
  private _key = '4yiUtNTHa4';
  private _dataStorage: ITokenResponse;
  private _tokenDecoded: TokenDecoded;

  constructor(private crypto: CryptoService) { }

  /**
   * Usuario recuperado del storage
   * @returns UserModel
   */
  get user(): UserModel {
    // return this.token ? new UserModel(this.tokenDecoded) : null;

    /**
     * ATENCION:
     * Este es un usuario de prueba, debe activarse el codigo de la linea superior para 
     * recuperar el usuario desde el el storage del navegador (previamente guardado con el metodo create)
     * Modificar UserModel con las propiedades que necesita la aplicacion
     */
    return new UserModel({
      id: '64473',
      name: 'Fredy Carrasco Yovera',
      email: 'email@cgr.gob.pe',
      area: 'Sub Gerencia de Sistemas de Información',
      exp: 999999999,
      role: UserRol.admin
    });
  }

  get token(): string | null {
    try {
      const _dataStorage = this.dataStorage;
      const _tokenModel = new TokenModel(this.tokenDecoded);
      return _tokenModel.isExpired ? null : _dataStorage.access_token;
    } catch (e) {
      return null;
    }
  }

  get tokenDecoded(): TokenDecoded {
    this._tokenDecoded = this._tokenDecoded || TokenJwt.decode(this.dataStorage.access_token);
    return this._tokenDecoded;
  }

  get dataStorage(): ITokenResponse {
    try {
      this._dataStorage = this._dataStorage ||
        JSON.parse(this.crypto.get(localStorage.getItem(this._key))) as ITokenResponse;

      return this._dataStorage;
    } catch (e) {
      return null;
    }
  }

  create(token: ITokenResponse) {
    this._tokenDecoded = null;
    this._dataStorage = null;
    localStorage.setItem(this._key, this.crypto.set(JSON.stringify(token)));
  }

  destroy() {
    this._tokenDecoded = null;
    this._dataStorage = null;
    localStorage.removeItem(this._key);
  }

}
