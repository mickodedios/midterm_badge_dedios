import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { DataService } from '../../services/data.service';
import { Post } from '../../models/post.model';
import { TruncatePipe } from '../../pipes/truncate.pipe';
import { TitleCaseWordsPipe } from '../../pipes/title-case-words.pipe';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, TruncatePipe, TitleCaseWordsPipe],
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {
  latestPosts$!: Observable<Post[]>;

  constructor(private dataService: DataService) {}

  ngOnInit(): void {
    // Get only the first 5 posts using RxJS map operator
    this.latestPosts$ = this.dataService.getPosts().pipe(
      map(posts => posts.slice(0, 5))
    );
  }
}
