import { Directive, HostListener } from '@angular/core';

@Directive({
  selector: 'a[href]'
})
export class ExternalLinkDirective {
  @HostListener('click', ['$event'])
  onClick(event: MouseEvent): void {
    event.preventDefault();
    const target = event.target as HTMLAnchorElement;
    if (target && target.href) {
      window.open(target.href, '_blank');
    }
  }
}
