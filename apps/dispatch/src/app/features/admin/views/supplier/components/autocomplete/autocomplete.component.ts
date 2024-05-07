import { NgClass } from '@angular/common';
import { AfterViewInit, Component, ElementRef, OnDestroy, Optional, Self, effect, input, output, signal, untracked, viewChild } from '@angular/core';
import { ControlValueAccessor, FormControl, FormsModule, NgControl, ReactiveFormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { ClickOutDirective } from '@dispatch-commons';
import { FuseScrollbarModule } from '@fuse/directives/scrollbar';
import { Observable, Subject, of } from 'rxjs';
import { catchError, debounceTime, distinctUntilChanged, map, switchMap, takeUntil, tap } from 'rxjs/operators';

@Component({
  selector: 'custom-autocomplete',
  templateUrl: './autocomplete.component.html',
  styleUrls: ['./autocomplete.component.scss'],
  standalone: true,
  imports: [
    NgClass, 
    FormsModule, 
    ReactiveFormsModule, 
    ClickOutDirective, 
    FuseScrollbarModule,
    MatFormFieldModule,
    MatInputModule,
    MatIconModule
  ]
})
export class AutocompleteComponent implements AfterViewInit, OnDestroy, ControlValueAccessor {
  readonly perfectScroll = viewChild<ElementRef>('perfectScroll');
  readonly inputSearch = viewChild<ElementRef>('inputSearch');

  readonly options = input<any>();
  readonly label = input<string>();
  readonly items = input<any[]>([]);
  readonly bindLabel = input<string>();
  readonly bindValue = input<string>();
  readonly selected = output<any>();

  readonly searchControl: FormControl = new FormControl();
  readonly filtered = signal<any[]>([]);
  readonly disabled = signal<boolean>(false);
  readonly value = signal<any>(null);
  readonly show = signal<boolean>(false);
  readonly isLoading = signal<boolean>(false);

  readonly destroy$ = new Subject<void>();

  onChange: (value: string) => void;
  onTouch: () => void;

  constructor(@Optional() @Self() public ngControl: NgControl) {
    ngControl && (ngControl.valueAccessor = this);

    effect(() => {
      if (this.items()) {
        untracked(() => { this.filtered.set(this.items()) });
      }
    })
  }

  get control() {
    return this.ngControl.control as FormControl;
  }

  updateValue(): void {
    // Para que actualice el formControl debe llamarse a onChange
    this.onChange && this.onChange(this.value());
  }

  writeValue(value: any): void {
    this.value.set(value);
    // this.control.setValue(value?.label);
  }

  registerOnChange(fn: any): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: any): void {
    this.onTouch = fn;
  }

  setDisabledState?(isDisabled: boolean): void {
    this.disabled.set(isDisabled);
    isDisabled ? this.searchControl.disable() : this.searchControl.enable();
  }

  ngAfterViewInit() {
    this.watchControlSearch();
  }

  watchControlSearch(): void {
    this.searchControl.valueChanges.pipe(
      takeUntil(this.destroy$),
      distinctUntilChanged(),
      tap(() => this.isLoading.set(true)),
      debounceTime(this.hasFunction() ? 400 : 0),
      switchMap(value => this.hasFunction() ? this.handleFunction(value) : this.handleFilter(value)),
      takeUntil(this.destroy$)
    ).subscribe((results: any[]) => {
      this.filtered.set(results);
      this.isLoading.set(false);
      this.scrollToTop();
    });
  }

  hasFunction(): boolean {
    return !!this.options()?.fn;
  }

  handleFunction(value: string): Observable<any[]> {
    if (!this.show()) {
      return of([]);
    }

    return this.options().fn(value).pipe(
      takeUntil(this.destroy$),
      map((res: any[]) => this.mapping(res.slice(0, 100), value)),
      catchError(() => of([]))
    );
  }

  handleFilter(value: string): Observable<any[]> {
    const filtered = this.items().filter(x => `${x[this.bindLabel()]}`.toUpperCase().indexOf(value?.toUpperCase()) != -1);
    return of(this.mapping(filtered, value));
  }

  scrollToTop(): void {
    if (this.perfectScroll()) {
      this.perfectScroll().nativeElement.scrollTop = 0;
    }
  }

  mapping(values: any[], text: string) {
    return values.map(item => {
      item._label = item[this.bindLabel()]?.replace(new RegExp(`(${text})`, 'ig'), `<strong>$1</strong>`);

      return item;
    });
  }

  optionSelected(item: any): void {
    this.show.set(false);
    this.value.set({ value: item[this.bindValue()], label: item[this.bindLabel()] });
    this.updateValue();
    this.selected.emit(this.value());
  }

  showOptions(): void {
    this.onTouch();

    this.show.set(!this.show());

    this.show() &&
      !this.disabled() &&
      (
        setTimeout(() => {
          this.inputSearch().nativeElement.focus();
        }, 10)
      );
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

}
