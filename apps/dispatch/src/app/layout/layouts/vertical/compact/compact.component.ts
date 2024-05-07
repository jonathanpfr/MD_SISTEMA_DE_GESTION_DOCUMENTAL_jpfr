import { CommonModule } from '@angular/common';
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
import { FuseFullscreenModule } from '@fuse/components/fullscreen';
import { FuseLoadingBarModule } from '@fuse/components/loading-bar';
import { FuseNavigationModule, FuseNavigationService, FuseVerticalNavigationComponent } from '@fuse/components/navigation';
import { FuseMediaWatcherService } from '@fuse/services/media-watcher';
import { Subject, takeUntil } from 'rxjs';
import { NotificationsComponent } from '../../../common/notifications/notifications.component';
import { SearchComponent } from '../../../common/search/search.component';
import { ShortcutsComponent } from '../../../common/shortcuts/shortcuts.component';
import { UserComponent } from '../../../common/user/user.component';

@Component({
	selector: 'compact-layout',
	templateUrl: './compact.component.html',
	encapsulation: ViewEncapsulation.None,
	standalone: true,
	imports: [
		CommonModule,
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
		UserComponent,
	]
})
export class CompactLayoutComponent implements OnInit, OnDestroy {
	isScreenSmall: boolean;
	navigation: Navigation;
	private _unsubscribeAll: Subject<any> = new Subject<any>();

	/**
	 * Constructor
	 */
	constructor(
		private _activatedRoute: ActivatedRoute,
		private _router: Router,
		private _navigationService: NavigationService,
		private _fuseMediaWatcherService: FuseMediaWatcherService,
		private _fuseNavigationService: FuseNavigationService
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
		// Subscribe to navigation data
		this._navigationService.navigation$
			.pipe(takeUntil(this._unsubscribeAll))
			.subscribe((navigation: Navigation) => {
				this.navigation = navigation;
			});

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
