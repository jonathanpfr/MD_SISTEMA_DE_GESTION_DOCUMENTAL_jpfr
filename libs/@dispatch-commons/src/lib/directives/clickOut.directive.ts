import { Directive, ElementRef, EventEmitter, HostListener, Output } from '@angular/core';

@Directive({
  selector: '[clickOut]',
  standalone: true
})
export class ClickOutDirective {

  constructor(private elementRef: ElementRef) { }

  @Output() outside: EventEmitter<boolean> = new EventEmitter();

  @HostListener('document:click', ['$event.target'])
  onMouseEnter(targetElement: HTMLElement) {
    const clickedInside = this.elementRef.nativeElement.contains(targetElement);
    if (!clickedInside) {
      // console.log('click outside directive');
      this.outside.emit(true);
    }
  }

}
