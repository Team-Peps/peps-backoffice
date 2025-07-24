import { Injectable, ComponentFactoryResolver, Injector, ApplicationRef, EmbeddedViewRef } from '@angular/core';
import {ToastComponent, ToastType} from '../core/components/toast/toast.component';

@Injectable({
	providedIn: 'root'
})
export class ToastService {

	constructor(
		private componentFactoryResolver: ComponentFactoryResolver,
		private injector: Injector,
		private appRef: ApplicationRef
	) {}

	show(message: string, details: string, type: ToastType = 'info', duration: number = 3000): void {
		const factory = this.componentFactoryResolver.resolveComponentFactory(ToastComponent);
		const componentRef = factory.create(this.injector);

		componentRef.instance.message = message;
		componentRef.instance.type = type;
		componentRef.instance.details = details;
		componentRef.instance.duration = duration;

		// Ajouter le composant au DOM
		this.appRef.attachView(componentRef.hostView);

		// Ajouter le composant à un élément DOM spécifique
		const domElem = (componentRef.hostView as EmbeddedViewRef<any>).rootNodes[0];
		document.body.appendChild(domElem);
	}
}
