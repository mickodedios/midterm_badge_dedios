import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, BehaviorSubject, throwError } from 'rxjs';
import { tap, catchError, shareReplay } from 'rxjs/operators';
import { Post } from '../models/post.model';

@Injectable({
  providedIn: 'root'
})
export class DataService {
  private apiUrl = 'https://jsonplaceholder.typicode.com/posts';
  private postsSubject = new BehaviorSubject<Post[]>([]);
  private cache$?: Observable<Post[]>;

  constructor(private http: HttpClient) {
    this.loadPosts();
  }

  /**
   * Fetches posts from API with caching mechanism
   * Uses shareReplay to prevent multiple HTTP calls
   */
  private loadPosts(): void {
    if (!this.cache$) {
      this.cache$ = this.http.get<Post[]>(this.apiUrl).pipe(
        tap(posts => {
          console.log('Posts fetched from API:', posts.length);
          this.postsSubject.next(posts);
        }),
        catchError(error => {
          console.error('Error fetching posts:', error);
          return throwError(() => new Error('Failed to load posts'));
        }),
        shareReplay(1) // Cache the result and share with all subscribers
      );
    }
  }

  /**
   * Returns an Observable of all posts
   * Multiple components can subscribe without triggering new HTTP calls
   */
  getPosts(): Observable<Post[]> {
    if (!this.cache$) {
      this.loadPosts();
    }
    return this.cache$!;
  }

  /**
   * Returns posts as BehaviorSubject for components that need it
   */
  get posts$(): Observable<Post[]> {
    return this.postsSubject.asObservable();
  }
}
