import { Injectable } from "@angular/core";
import { FuseNavigationItem } from "@fuse/components/navigation";
import { Observable, ReplaySubject, catchError, of, switchMap, tap } from "rxjs";
import { Navigation } from "../interfaces/application/navigation.interface";
import { MenuService } from "./menu.service";

@Injectable({
  providedIn: 'root'
})
export class NavigationService {
  private _navigation: ReplaySubject<Navigation> = new ReplaySubject<Navigation>(1);
  private _modules: ReplaySubject<FuseNavigationItem[]> = new ReplaySubject<FuseNavigationItem[]>(1);

  /**
   * Constructor
   */
  constructor(
    private _menuService: MenuService,
    // private _sessionService: SessionService,
    // private _generalService: GeneralService
  ) { }

  /**
   * Getter for navigation
   */
  get navigation$(): Observable<Navigation> {
    return this._navigation.asObservable();
  }

  get modules$(): Observable<FuseNavigationItem[]> {
    return this._modules.asObservable();
  }

  /**
   * Get all navigation data
   */
  get(): Observable<Navigation> {
    return this._menuService.getMenu()
      .pipe(
        catchError(() => {
          console.warn('No se pudo cargar el menú del sistema');
          return of([] as FuseNavigationItem[]);
        }),
        tap(res => {
          this._modules.next(res);
        }),
        switchMap(itemsNavigation => {
          const navigation: Navigation = {
            compact: [],
            default: itemsNavigation,
            futuristic: [],
            horizontal: itemsNavigation,
          };

          return of(navigation);
        }),
        tap((navigation) => {
          this._navigation.next(navigation);
        })
      );
  }
}