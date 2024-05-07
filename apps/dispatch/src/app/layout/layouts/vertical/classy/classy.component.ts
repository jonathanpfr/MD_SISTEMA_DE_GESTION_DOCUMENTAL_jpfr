import { HttpClientModule } from '@angular/common/http';
import { Component, OnDestroy, OnInit, ViewEncapsulation } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatDividerModule } from '@angular/material/divider';
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';
import { MatTooltipModule } from '@angular/material/tooltip';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { NavigationService } from '@dispatch-commons';
import { Navigation } from '@dispatch-commons/interfaces';
import { FuseFullscreenModule } from '@fuse/components/fullscreen/fullscreen.module';
import { FuseLoadingBarModule } from '@fuse/components/loading-bar';
import { FuseNavigationModule, FuseNavigationService, FuseVerticalNavigationComponent } from '@fuse/components/navigation';
import { FuseMediaWatcherService } from '@fuse/services/media-watcher';
import { Subject, takeUntil } from 'rxjs';
import { NotificationsComponent } from '../../../common/notifications/notifications.component';
import { SearchComponent } from '../../../common/search/search.component';
import { ShortcutsComponent } from '../../../common/shortcuts/shortcuts.component';
import { UserComponent } from '../../../common/user/user.component';
// import { UserModel } from '@dispatch-commons/models';

@Component({
	selector: 'classy-layout',
	templateUrl: './classy.component.html',
	encapsulation: ViewEncapsulation.None,
	standalone: true,
	imports: [
		HttpClientModule,
		RouterModule,
		MatButtonModule,
		MatDividerModule,
		MatIconModule,
		MatMenuModule,
		MatTooltipModule,
		FuseFullscreenModule,
		FuseLoadingBarModule,
		FuseNavigationModule,
		NotificationsComponent,
		SearchComponent,
		ShortcutsComponent,
		UserComponent
	]
})
export class ClassyLayoutComponent implements OnInit, OnDestroy {
	private _unsubscribeAll: Subject<any> = new Subject<any>();
	isScreenSmall: boolean;
	navigation: Navigation;
	user: any;
	// data: IGeneral;

	/**
	 * Constructor
	 */
	constructor(
		private _activatedRoute: ActivatedRoute,
		private _router: Router,
		private _navigationService: NavigationService,
		private _fuseMediaWatcherService: FuseMediaWatcherService,
		private _fuseNavigationService: FuseNavigationService,
		// private _sessionService: SessionService,
		// private _generalService: GeneralService
	) {
	}

	/**
	 * Getter for current year
	 */
	get currentYear(): number {
		return new Date().getFullYear();
	}

	/**
	 * On init
	 */
	ngOnInit(): void {
		// this.data = this._generalService.values;

		// Subscribe to navigation data
		this._navigationService.navigation$
			.pipe(takeUntil(this._unsubscribeAll))
			.subscribe((navigation: Navigation) => {
				this.navigation = navigation;
			});

		this.user = {}; //this._sessionService.user;

		// Subscribe to the user service
		/*  this._sessionService.user$
				 .pipe((takeUntil(this._unsubscribeAll)))
				 .subscribe((user: User) => {
						 this.user = user;
				 }); */

		// Subscribe to media changes
		this._fuseMediaWatcherService.onMediaChange$
			.pipe(takeUntil(this._unsubscribeAll))
			.subscribe(({ matchingAliases }) => {

				// Check if the screen is small
				this.isScreenSmall = !matchingAliases.includes('md');
			});
	}

	/**
	 * On destroy
	 */
	ngOnDestroy(): void {
		// Unsubscribe from all subscriptions
		this._unsubscribeAll.next(null);
		this._unsubscribeAll.complete();
	}

	// -----------------------------------------------------------------------------------------------------
	// @ Public methods
	// -----------------------------------------------------------------------------------------------------

	/**
	 * Toggle navigation
	 *
	 * @param name
	 */
	toggleNavigation(name: string): void {
		// Get the navigation
		const navigation = this._fuseNavigationService.getComponent<FuseVerticalNavigationComponent>(name);

		if (navigation) {
			// Toggle the opened status
			navigation.toggle();
		}
	}

	changeModule(): void {
		this._router.navigate(['/modulos']);
	}
}
