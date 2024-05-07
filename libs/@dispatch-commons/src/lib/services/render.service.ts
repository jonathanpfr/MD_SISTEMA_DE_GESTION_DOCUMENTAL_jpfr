import { Injectable, ComponentFactoryResolver, Injector } from '@angular/core';

@Injectable()
export class RenderComponentService {

	constructor(
		private resolver: ComponentFactoryResolver,
		private injector: Injector
	) { }

	create(component: any, data?: any): string {
		const factory = this.resolver.resolveComponentFactory(component);
		const componentRef = factory.create(this.injector);
		if (data) {
			for (const key in data) {
				componentRef.instance[key] = data[key];
			}
		}

		componentRef.changeDetectorRef.detectChanges();
		// Obtenemos el html
		return componentRef.location.nativeElement.innerHTML;
	}

}
