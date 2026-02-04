# Visual Feature Map

## Where Everything Is Located

This guide shows exactly where each requirement is implemented in the code.

---

## 🔷 ROUTING & NAVIGATION

### Routes Configuration
📁 **File:** `src/app/app.routes.ts`
```typescript
export const routes: Routes = [
  { path: '', redirectTo: '/home', pathMatch: 'full' },  ← DEFAULT ROUTE
  { path: 'home', component: HomeComponent },            ← HOME ROUTE
  { path: 'about', component: AboutComponent },          ← ABOUT ROUTE
  { path: 'services', component: ServicesComponent },    ← SERVICES ROUTE
  { path: 'contact', component: ContactComponent },      ← CONTACT ROUTE
  { path: '**', redirectTo: '/home' }                    ← WILDCARD ROUTE
];
```

### Navigation Bar with Active Highlighting
📁 **File:** `src/app/app.component.html`
```html
<nav class="navbar">
  <ul class="nav-links">
    <li>
      <a routerLink="/home" 
         routerLinkActive="active"        ← ACTIVE ROUTE HIGHLIGHTING
         [routerLinkActiveOptions]="{exact: true}">
        Home
      </a>
    </li>
    <!-- Same for About, Services, Contact -->
  </ul>
</nav>
```

---

## 🔷 SHARED SERVICE (DataService)

### Service Implementation
📁 **File:** `src/app/services/data.service.ts`

#### Singleton Pattern
```typescript
@Injectable({
  providedIn: 'root'    ← SINGLETON: One instance for entire app
})
export class DataService { }
```

#### HttpClient & Caching
```typescript
private apiUrl = 'https://jsonplaceholder.typicode.com/posts';  ← API URL
private cache$?: Observable<Post[]>;                             ← CACHE

this.cache$ = this.http.get<Post[]>(this.apiUrl).pipe(
  tap(posts => console.log('Posts fetched:', posts.length)),     ← LOGGING
  catchError(error => { /* error handling */ }),                 ← ERROR HANDLING
  shareReplay(1)                                                 ← CACHING OPERATOR
);
```

### Where Service Is Used

#### 1. HomeComponent
📁 **File:** `src/app/components/home/home.component.ts`
```typescript
constructor(private dataService: DataService) {}  ← INJECTED HERE

ngOnInit(): void {
  this.latestPosts$ = this.dataService.getPosts().pipe(
    map(posts => posts.slice(0, 5))              ← GET FIRST 5 POSTS
  );
}
```

#### 2. ServicesComponent
📁 **File:** `src/app/components/services/services.component.ts`
```typescript
constructor(private dataService: DataService) {}  ← SAME SERVICE INSTANCE

ngOnInit(): void {
  this.posts$ = this.dataService.getPosts();     ← GETS ALL POSTS
}
```

**PROOF OF CACHING:** Open browser console and navigate:
1. Go to Home page → Console shows: "Posts fetched: 100"
2. Go to Services page → Console shows NOTHING (data from cache!)
3. Go back to Home → Still NOTHING (cache working!)

---

## 🔷 OBSERVABLES & RxJS OPERATORS

### HomeComponent - Simple Observable with map
📁 **File:** `src/app/components/home/home.component.ts`
```typescript
this.latestPosts$ = this.dataService.getPosts().pipe(
  map(posts => posts.slice(0, 5))  ← MAP OPERATOR: Transform array
);
```

📁 **File:** `src/app/components/home/home.component.html`
```html
<div *ngIf="latestPosts$ | async as posts">  ← ASYNC PIPE
  <ul>
    <li *ngFor="let post of posts">
      {{ post.title }}
    </li>
  </ul>
</div>
```

### ServicesComponent - Advanced Observables
📁 **File:** `src/app/components/services/services.component.ts`

#### combineLatest Pattern
```typescript
// Two streams combined
this.filteredPosts$ = combineLatest([
  this.posts$,                              ← STREAM 1: All posts
  this.searchTerm$.pipe(startWith(''))     ← STREAM 2: Search input
]).pipe(
  map(([posts, searchTerm]) => {
    // Filter posts based on search term
    return posts.filter(/* ... */);
  })
);
```

#### Error Handling with catchError
```typescript
this.posts$ = this.dataService.getPosts().pipe(
  tap(() => this.isLoading$.next(false)),        ← TAP: Side effect
  catchError(error => {                          ← CATCHERROR: Handle errors
    this.error$.next('Failed to load data');
    this.isLoading$.next(false);
    throw error;
  })
);
```

### DataService - shareReplay for Caching
📁 **File:** `src/app/services/data.service.ts`
```typescript
this.cache$ = this.http.get<Post[]>(this.apiUrl).pipe(
  shareReplay(1)  ← SHAREREPLAY: Cache result, share with all subscribers
);
```

**RxJS Operators Summary:**
- ✅ `map` - Transform data (HomeComponent)
- ✅ `tap` - Side effects like logging (DataService, ServicesComponent)
- ✅ `catchError` - Error handling (DataService, ServicesComponent)
- ✅ `startWith` - Initial value (ServicesComponent search)
- ✅ `combineLatest` - Merge streams (ServicesComponent search)
- ✅ `shareReplay` - Caching (DataService)

---

## 🔷 PIPES

### Custom Pipe #1: TruncatePipe
📁 **File:** `src/app/pipes/truncate.pipe.ts`
```typescript
@Pipe({
  name: 'truncate',
  standalone: true
})
export class TruncatePipe implements PipeTransform {
  transform(value: string, limit: number = 100): string {
    if (value.length <= limit) return value;
    return value.substring(0, limit).trim() + '...';
  }
}
```

**Used In:**

📁 **HomeComponent** (`home.component.html`):
```html
<p>{{ post.body | truncate:100 }}</p>  ← TRUNCATE TO 100 CHARS
```

📁 **ServicesComponent** (`services.component.html`):
```html
<p>{{ post.body | truncate:150 }}</p>  ← TRUNCATE TO 150 CHARS
```

---

### Custom Pipe #2: TitleCaseWordsPipe
📁 **File:** `src/app/pipes/title-case-words.pipe.ts`
```typescript
@Pipe({
  name: 'titleCaseWords',
  standalone: true
})
export class TitleCaseWordsPipe implements PipeTransform {
  transform(value: string): string {
    return value
      .toLowerCase()
      .split(' ')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ');
  }
}
```

**Used In:**

📁 **HomeComponent** (`home.component.html`):
```html
<h3>{{ post.title | titleCaseWords | uppercase }}</h3>
     ↑                  ↑                ↑
     Original text     Custom pipe     Built-in pipe
```

---

### Built-in Pipe #1: UpperCasePipe
**Used In:**

📁 **HomeComponent** (`home.component.html`):
```html
<h3>{{ post.title | titleCaseWords | uppercase }}</h3>
```

📁 **AboutComponent** (`about.component.html`):
```html
<h2>{{ 'About This Portal' | uppercase }}</h2>
```

📁 **ContactComponent** (`contact.component.html`):
```html
<p>{{ formData.name | uppercase }}</p>
```

---

### Built-in Pipe #2: DatePipe
**Used In:**

📁 **AboutComponent** (`about.component.html`):
```html
<p><strong>Today:</strong> {{ currentDate | date:'fullDate' }}</p>
<p><strong>Time:</strong> {{ currentDate | date:'medium' }}</p>
```

📁 **ContactComponent** (`contact.component.html`):
```html
<p><strong>Submitted at:</strong> {{ Date.now() | date:'medium' }}</p>
```

---

### Built-in Pipe #3: AsyncPipe
**Used In:**

📁 **HomeComponent** (`home.component.html`):
```html
<div *ngIf="latestPosts$ | async as posts">  ← ASYNC PIPE
  <!-- posts are now unwrapped -->
</div>
```

📁 **ServicesComponent** (`services.component.html`):
```html
<div *ngIf="filteredPosts$ | async as posts">  ← ASYNC PIPE
  <!-- Automatic subscribe/unsubscribe -->
</div>
```

---

## 🔷 JSON RECORDS FROM API

### API Source
```
URL: https://jsonplaceholder.typicode.com/posts
Records: 100 posts (id 1-100)
```

### Data Model
📁 **File:** `src/app/models/post.model.ts`
```typescript
export interface Post {
  userId: number;
  id: number;
  title: string;
  body: string;
}
```

### Where JSON Records Are Displayed

#### 1. HomeComponent - Latest 5 Posts
📁 **File:** `src/app/components/home/home.component.html`
```html
<div class="latest-updates">
  <h2>Latest Updates</h2>
  <div *ngIf="latestPosts$ | async as posts">  ← 5 POSTS DISPLAYED
    <ul>
      <li *ngFor="let post of posts">
        <h3>{{ post.title | titleCaseWords | uppercase }}</h3>
        <p>{{ post.body | truncate:100 }}</p>
      </li>
    </ul>
  </div>
</div>
```

**What's Shown:**
- Post ID (implicit in *ngFor)
- Post Title (formatted with pipes)
- Post Body (truncated to 100 chars)

---

#### 2. ServicesComponent - All 100 Posts
📁 **File:** `src/app/components/services/services.component.html`
```html
<div class="posts-grid">
  <div *ngFor="let post of filteredPosts$ | async" class="post-card">
    <div class="post-header">
      <span class="post-id">ID: {{ post.id }}</span>          ← POST ID
      <span class="user-badge">User {{ post.userId }}</span>  ← USER ID
    </div>
    <h3>{{ post.title }}</h3>                                 ← TITLE
    <p>{{ post.body | truncate:150 }}</p>                     ← BODY
  </div>
</div>
```

**What's Shown:**
- Post ID
- User ID
- Post Title
- Post Body (truncated to 150 chars)

**Search Functionality:**
```html
<input
  type="text"
  placeholder="Search by title or body..."
  (input)="onSearchChange($any($event.target).value)"
/>
```

---

## 🔷 COMPONENT PAGES

### Home Page (`/home`)
📁 **Files:**
- `src/app/components/home/home.component.ts`
- `src/app/components/home/home.component.html`
- `src/app/components/home/home.component.css`

**Features:**
- ✅ Welcome message
- ✅ Latest 5 posts from API
- ✅ Uses DataService (shared)
- ✅ Uses pipes: truncate, titleCaseWords, uppercase
- ✅ Uses observable with async pipe

---

### About Page (`/about`)
📁 **Files:**
- `src/app/components/about/about.component.ts`
- `src/app/components/about/about.component.html`
- `src/app/components/about/about.component.css`

**Features:**
- ✅ Static content
- ✅ Current date with DatePipe
- ✅ Uppercase heading with pipe
- ✅ Developer info (Micko de Dios)
- ✅ Technology stack listed

---

### Services Page (`/services`)
📁 **Files:**
- `src/app/components/services/services.component.ts`
- `src/app/components/services/services.component.html`
- `src/app/components/services/services.component.css`

**Features:**
- ✅ All 100 posts from API
- ✅ Search box (real-time filtering)
- ✅ Loading state
- ✅ Error state
- ✅ Uses DataService (shared)
- ✅ Uses combineLatest for search
- ✅ Uses truncate pipe

---

### Contact Page (`/contact`)
📁 **Files:**
- `src/app/components/contact/contact.component.ts`
- `src/app/components/contact/contact.component.html`
- `src/app/components/contact/contact.component.css`

**Features:**
- ✅ Contact form (name, email, message)
- ✅ Form validation
- ✅ Submit button
- ✅ Form preview on submit
- ✅ Uses uppercase pipe on name
- ✅ Uses date pipe on submission time

---

## 🔷 QUICK LOCATION FINDER

Need to find something quickly? Use this table:

| Feature | File Location | Line to Check |
|---------|---------------|---------------|
| Routes | `app.routes.ts` | Lines 4-10 |
| Default route | `app.routes.ts` | Line 4 |
| Wildcard route | `app.routes.ts` | Line 10 |
| Active link | `app.component.html` | Lines 10-12 |
| DataService | `services/data.service.ts` | Entire file |
| Caching | `services/data.service.ts` | Lines 27-35 |
| TruncatePipe | `pipes/truncate.pipe.ts` | Lines 7-12 |
| TitleCaseWords | `pipes/title-case-words.pipe.ts` | Lines 7-15 |
| combineLatest | `services/services.component.ts` | Lines 33-43 |
| async pipe | `home.component.html` | Line 11 |
| uppercase | `home.component.html` | Line 15 |
| date | `about.component.html` | Lines 15-16 |
| API call | `services/data.service.ts` | Line 29 |

---

## 🔷 TESTING CHECKLIST

### Test Routing
1. Go to: http://localhost:4200/
2. Should redirect to: `/home`
3. Click "About" → URL changes to `/about`
4. Click "Services" → URL changes to `/services`
5. Click "Contact" → URL changes to `/contact`
6. Type random URL → Redirects to `/home`
7. Check navbar → Active link is highlighted

### Test Shared Service
1. Open browser console (F12)
2. Go to Home page
3. Console shows: "Posts fetched from API: 100"
4. Go to Services page
5. Console shows NOTHING (proves caching!)
6. Go back to Home
7. Still NOTHING (cache still working!)

### Test Observables
1. Home page loads → 5 posts appear
2. Services page → All 100 posts appear
3. Type in search box → Posts filter in real-time
4. No page refresh needed (reactive!)

### Test Pipes
1. Home page → Titles are in uppercase
2. Home page → Body text is truncated with "..."
3. About page → Date appears formatted
4. Contact page → Submit form → Name appears uppercase

---

**End of Visual Feature Map**

All features are documented and easy to locate! 🎉
