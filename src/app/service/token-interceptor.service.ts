import {Injectable} from "@angular/core";
import { HttpErrorResponse, HttpEvent, HttpHandler, HttpInterceptor, HttpRequest } from "@angular/common/http";
import {Observable, throwError, BehaviorSubject} from "rxjs";
import {catchError, switchMap, filter, take} from "rxjs/operators";
import {AuthService} from './auth.service';

@Injectable()
export class TokenInterceptorService implements HttpInterceptor {

	private isRefreshing = false;
	private readonly refreshTokenSubject: BehaviorSubject<any> = new BehaviorSubject<any>(null);

	constructor(private readonly authService: AuthService) {}

	intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
		const excludedUrls = [
			'auth/refresh-token',
			'auth/authenticate',
		];

		if (!excludedUrls.some(url => request.url.includes(url))) {
			if (this.authService.getToken()) {
				request = this.addToken(request, this.authService.getToken());
			}

			return next.handle(request).pipe(catchError(error => {
				if (error instanceof HttpErrorResponse && error.status === 401) {
					return this.handle401Error(request, next);
				} else {
					return throwError(error);
				}
			}));
		} else {
			return next.handle(request);
		}
	}

	private addToken(request: HttpRequest<any>, token: string) {
		return request.clone({
			setHeaders: {
				'Authorization': `Bearer ${token}`
			}
		});
	}

	private handle401Error(request: HttpRequest<any>, next: HttpHandler) {
		if (!this.isRefreshing) {
			this.isRefreshing = true;
			this.refreshTokenSubject.next(null);

			return this.authService.refreshToken().pipe(
				switchMap((token: any) => {
					this.isRefreshing = false;
					this.refreshTokenSubject.next(token.access_token);
					return next.handle(this.addToken(request, token.access_token));
				}),
				catchError(error => {
					return throwError(error);
				})
			);

		} else {
			return this.refreshTokenSubject.pipe(
				filter(token => token != null),
				take(1),
				switchMap(jwt => {
					return next.handle(this.addToken(request, jwt));
				}));
		}
	}
}
