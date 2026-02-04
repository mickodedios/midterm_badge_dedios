import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Observable, BehaviorSubject, combineLatest, of } from 'rxjs';
import { map, startWith, catchError, tap, delay } from 'rxjs/operators';
import { DataService } from '../../services/data.service';
import { Post } from '../../models/post.model';
import { TruncatePipe } from '../../pipes/truncate.pipe';

@Component({
  selector: 'app-services',
  standalone: true,
  imports: [CommonModule, FormsModule, TruncatePipe],
  templateUrl: './services.component.html',
  styleUrls: ['./services.component.css']
})
export class ServicesComponent implements OnInit {
  searchTerm$ = new BehaviorSubject<string>('');
  posts$!: Observable<Post[]>;
  filteredPosts$!: Observable<Post[]>;
  isLoading$ = new BehaviorSubject<boolean>(true);
  error$ = new BehaviorSubject<string>('');

  constructor(private dataService: DataService) {}

  ngOnInit(): void {
    console.log('ServicesComponent initialized');
    
    // Fetch posts from shared service
    this.posts$ = this.dataService.getPosts().pipe(
      tap(posts => {
        console.log('Posts received in component:', posts.length);
        this.isLoading$.next(false);
        if (posts.length === 0) {
          this.error$.next('No posts available. Please check your internet connection.');
        }
      }),
      catchError(error => {
        console.error('Component error:', error);
        this.error$.next('Failed to load service tickets. Please try again later.');
        this.isLoading$.next(false);
        return of([]);
      })
    );

    // Combine search term stream with posts stream
    this.filteredPosts$ = combineLatest([
      this.posts$,
      this.searchTerm$.pipe(startWith(''))
    ]).pipe(
      map(([posts, searchTerm]) => {
        if (!searchTerm.trim()) {
          return posts;
        }
        const term = searchTerm.toLowerCase();
        return posts.filter(post =>
          post.title.toLowerCase().includes(term) ||
          post.body.toLowerCase().includes(term)
        );
      })
    );
  }

  onSearchChange(term: string): void {
    this.searchTerm$.next(term);
  }
}