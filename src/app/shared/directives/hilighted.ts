import { Directive, ElementRef, HostListener } from '@angular/core';

@Directive({
  selector: '[appHilighted]',
})
export class Hilighted {
  constructor(private ele : ElementRef) {}

  @HostListener('mouseenter')
  onMouseEnter(){
    this.ele.nativeElement.style.backgroundColor = 'yellow';
  }

  @HostListener('mouseleave')
  onMouseLeave(){
    this.ele.nativeElement.style.backgroundColor = '';
  }

}
