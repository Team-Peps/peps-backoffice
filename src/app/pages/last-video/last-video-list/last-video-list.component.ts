import {ChangeDetectorRef, Component, OnInit} from '@angular/core';
import {VideoService} from '@/app/service/video.service';
import {environment} from '@/environments/environment';
import {Video} from '@/app/model/video';
import {UpdateLastVideoComponent} from '@/app/pages/last-video/update-last-video/update-last-video.component';
import {VideoTableComponent} from '@/app/pages/last-video/last-video-list/video-table/video-table.component';

@Component({
  selector: 'app-last-video-list',
	imports: [
		UpdateLastVideoComponent,
		VideoTableComponent
	],
  templateUrl: './last-video-list.component.html',
})
export class LastVideoListComponent implements OnInit {

	constructor(
		private readonly videoService: VideoService,
		private readonly cdr: ChangeDetectorRef,
	) {}

	minioBaseUrl = environment.minioBaseUrl;

	videos: Video[] = [];
	selectedVideo: Video | null = null;
	isCreateVideo: boolean = false;

	ngOnInit() {
		this.loadVideos();
	}

	loadVideos(): void {
		this.videoService.getAllVideos().subscribe(videos => {
			this.videos = videos;
			this.cdr.detectChanges();
		});
	}

	selectVideo(video: Video): void {
		this.selectedVideo = video;
		this.isCreateVideo = false;
		this.cdr.detectChanges();
		document.getElementById("updateVideo")?.scrollIntoView({behavior: "smooth"});
	}

	toggleCreateVideo() {
		this.isCreateVideo = !this.isCreateVideo;
		this.selectedVideo = null;
		this.cdr.detectChanges();
	}

}
