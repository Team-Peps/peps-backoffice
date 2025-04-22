import {Component, EventEmitter, Input, Output} from '@angular/core';
import {environment} from '@/environments/environment';
import {NgOptimizedImage} from '@angular/common';
import {Video} from '@/app/model/video';

@Component({
  selector: 'app-video-table',
	imports: [
		NgOptimizedImage
	],
  templateUrl: './video-table.component.html',
})
export class VideoTableComponent {

	@Input() videos: Video[] = [];

	@Output() videoToUpdate: EventEmitter<Video> = new EventEmitter();

	minioBaseUrl = environment.minioBaseUrl;

	selectVideo(video: Video) {
		this.videoToUpdate.emit(video);
	}

}
