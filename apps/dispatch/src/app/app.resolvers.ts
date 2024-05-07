import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { NavigationService } from '@dispatch-commons';
import { Observable, catchError, forkJoin, of } from 'rxjs';

@Injectable()
export class InitialDataResolver {
    /**
     * Constructor
     */
    constructor(
        private _navigationService: NavigationService,
        // private _notificationsService: NotificationsService,
        // private _shortcutsService: ShortcutsService
    ) {
    }

    /**
     * Use this resolver to resolve initial mock-api for the application
     *
     * @param route
     * @param state
     */
    resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<any> {
        // Fork join multiple API endpoint calls to wait all of them to finish
        return forkJoin([
            this._navigationService.get(),
            // this._notificationsService.getAll(),
            // this._shortcutsService.getAll()
        ]).pipe(
            catchError(() => of([]))
        );
    }
}
