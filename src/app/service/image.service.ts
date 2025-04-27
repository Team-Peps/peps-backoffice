import {Injectable} from '@angular/core';
import {ToastService} from '@/app/service/toast.service';
import {DomSanitizer, SafeHtml} from '@angular/platform-browser';

@Injectable({
	providedIn: 'root'
})
export class ImageService {

	constructor(
		private readonly toastService: ToastService,
		private readonly sanitizer: DomSanitizer,
	) {}

	maxSize: number = 2;
	allowedFormats = [
		'image/avif',
		'image/webp'
	];

	checkSize(file: File): boolean {
		const maxSize = this.maxSize * 1024 * 1024;
		console.log(`Taille du fichier : ${file.size} octets, taille max : ${maxSize} octets`);
		if (file.size > maxSize) {
			this.toastService.show(`Le fichier ne doit pas dépasser ${maxSize} Mo`, 'error');
			return false;
		}
		return true;
	}

	checkFormat(file: File): boolean {
		if (!this.allowedFormats.includes(file.type)) {
			this.toastService.show('Format de fichier non pris en charge. Formats autorisés : AVIF, WEBP', 'error');
			return false;
		}
		return true;
	}

	getImageRequirementHtml(): SafeHtml {
		return this.sanitizer.bypassSecurityTrustHtml(`<span class="text-xs">⚠️ L'image doit être au format WEBP ou AVIF et ne pas faire plus de ${this.maxSize}Mo ! ⚠️</span>`);
	}

	getAcceptedFormats(): string {
		return this.allowedFormats.join(",");
	}
}
