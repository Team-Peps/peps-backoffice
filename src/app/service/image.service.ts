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

	maxSize: number = 10;
	allowedFormats = [
		'image/avif',
		'image/webp',
		'image/svg+xml',
		'image/jpeg',
		'image/png'
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
			this.toastService.show('Format de fichier non pris en charge. Formats autorisés : AVIF, WEBP, SVG, JPG, PNG', 'error');
			return false;
		}
		return true;
	}

	getImageRequirementHtml(): SafeHtml {
		return this.sanitizer.bypassSecurityTrustHtml(`<span class="text-xs">⚠️ L'image doit être au format WEBP, AVIF, SVG, JPG ou PNG et ne pas faire plus de ${this.maxSize}Mo ! ⚠️</span>`);
	}

	getAcceptedFormats(): string {
		return this.allowedFormats.join(",");
	}

	async checkWidthHeight(file: File, width: number, height: number): Promise<boolean> {
		return await new Promise<boolean>((resolve) => {
			const img = new Image();
			img.onload = () => {
				if (img.width !== width || img.height !== height) {
					this.toastService.show(`L'image doit avoir une taille de ${width}x${height} pixels`, 'error');
					resolve(false);
				} else {
					resolve(true);
				}
			};
			img.onerror = () => {
				this.toastService.show('Erreur lors du chargement de l\'image', 'error');
				resolve(false);
			};
			img.src = URL.createObjectURL(file);
		});
	}
}
