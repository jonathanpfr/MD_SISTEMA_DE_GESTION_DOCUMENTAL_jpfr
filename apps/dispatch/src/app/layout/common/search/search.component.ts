import { BlockScrollStrategy, Overlay } from '@angular/cdk/overlay';
import { CommonModule } from '@angular/common';
import { Component, ElementRef, EventEmitter, HostBinding, Input, OnChanges, OnDestroy, OnInit, Output, Renderer2, SimpleChanges, ViewChild, ViewEncapsulation } from '@angular/core';
import { FormsModule, ReactiveFormsModule, UntypedFormControl } from '@angular/forms';
import { MAT_AUTOCOMPLETE_SCROLL_STRATEGY, MatAutocomplete, MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatTooltipModule } from '@angular/material/tooltip';
import { RouterModule } from '@angular/router';
import { fuseAnimations } from '@fuse/animations/public-api';
import { Subject, debounceTime, filter, map, takeUntil } from 'rxjs';
// import { SearchService } from '@dispatch-commons';

@Component({
	selector: 'search',
	templateUrl: './search.component.html',
	encapsulation: ViewEncapsulation.None,
	exportAs: 'fuseSearch',
	animations: fuseAnimations,
	standalone: true,
	imports: [
		CommonModule,
		FormsModule,
		ReactiveFormsModule,
		RouterModule,
		MatAutocompleteModule,
		MatButtonModule,
		MatFormFieldModule,
		MatIconModule,
		MatTooltipModule,
		MatInputModule
	],
	providers: [
		{
			provide: MAT_AUTOCOMPLETE_SCROLL_STRATEGY,
			useFactory: (overlay: Overlay) => (): BlockScrollStrategy => overlay.scrollStrategies.block(),
			deps: [Overlay]
		}
	]
})
export class SearchComponent implements OnChanges, OnInit, OnDestroy {
	@Input() appearance: 'basic' | 'bar' = 'basic';
	@Input() debounce: number = 300;
	@Input() minLength: number = 2;
	@Output() search: EventEmitter<any> = new EventEmitter<any>();

	opened: boolean = false;
	resultSets: any[];
	searchControl: UntypedFormControl = new UntypedFormControl();
	private _matAutocomplete: MatAutocomplete;
	private _unsubscribeAll: Subject<any> = new Subject<any>();

	/**
	 * Constructor
	 */
	constructor(
		private _elementRef: ElementRef,
		// private _searchService: SearchService,
		private _renderer2: Renderer2
	) {
	}

	/**
	 * Host binding for component classes
	 */
	@HostBinding('class') get classList(): any {
		return {
			'search-appearance-bar': this.appearance === 'bar',
			'search-appearance-basic': this.appearance === 'basic',
			'search-opened': this.opened
		};
	}

	/**
	 * Setter for bar search input
	 *
	 * @param value
	 */
	@ViewChild('barSearchInput')
	set barSearchInput(value: ElementRef) {
		// If the value exists, it means that the search input
		// is now in the DOM, and we can focus on the input..
		if (value) {
			// Give Angular time to complete the change detection cycle
			setTimeout(() => {

				// Focus to the input element
				value.nativeElement.focus();
			});
		}
	}

	/**
	 * Setter for mat-autocomplete element reference
	 *
	 * @param value
	 */
	@ViewChild('matAutocomplete')
	set matAutocomplete(value: MatAutocomplete) {
		this._matAutocomplete = value;
	}

	/**
	 * On changes
	 *
	 * @param changes
	 */
	ngOnChanges(changes: SimpleChanges): void {
		// Appearance
		if ('appearance' in changes) {
			// To prevent any issues, close the
			// search after changing the appearance
			this.close();
		}
	}

	/**
	 * On init
	 */
	ngOnInit(): void {
		// Subscribe to the search field value changes
		this.searchControl.valueChanges
			.pipe(
				debounceTime(this.debounce),
				takeUntil(this._unsubscribeAll),
				map((value) => {

					// Set the resultSets to null if there is no value or
					// the length of the value is smaller than the minLength
					// so the autocomplete panel can be closed
					if (!value || value.length < this.minLength) {
						this.resultSets = null;
					}

					// Continue
					return value;
				}),
				// Filter out undefined/null/false statements and also
				// filter out the values that are smaller than minLength
				filter(value => value && value.length >= this.minLength)
			)
			.subscribe((value) => {
				/* this._searchService.get(value)
						.subscribe((resultSets: any) => {

								// Store the result sets
								this.resultSets = resultSets;

								// Execute the event
								this.search.next(resultSets);
						}); */
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
	 * On keydown of the search input
	 *
	 * @param event
	 */
	onKeydown(event: KeyboardEvent): void {
		// Escape
		if (event.code === 'Escape') {
			// If the appearance is 'bar' and the mat-autocomplete is not open, close the search
			if (this.appearance === 'bar' && !this._matAutocomplete.isOpen) {
				this.close();
			}
		}
	}

	/**
	 * Open the search
	 * Used in 'bar'
	 */
	open(): void {
		// Return if it's already opened
		if (this.opened) {
			return;
		}

		// Open the search
		this.opened = true;
	}

	/**
	 * Close the search
	 * * Used in 'bar'
	 */
	close(): void {
		// Return if it's already closed
		if (!this.opened) {
			return;
		}

		// Clear the search input
		this.searchControl.setValue('');

		// Close the search
		this.opened = false;
	}

}
