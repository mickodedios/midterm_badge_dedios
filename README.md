# Community Help Desk Portal

**Developer:** Micko de Dios  
**Project:** Midterm Badge - Applying Routing, Services, Pipes and Observables  
**Due Date:** February 4, 2026

## Table of Contents
1. [Project Overview](#project-overview)
2. [Features Implemented](#features-implemented)
3. [Project Structure](#project-structure)
4. [Component Documentation](#component-documentation)
5. [Services Documentation](#services-documentation)
6. [Pipes Documentation](#pipes-documentation)
7. [Observables Implementation](#observables-implementation)
8. [Routing Configuration](#routing-configuration)
9. [Installation & Setup](#installation--setup)
10. [Deployment](#deployment)
11. [Reflection Questions](#reflection-questions)

---

## Project Overview

Community Help Desk Portal is a multi-page Single Page Application (SPA) built with Angular 17+ that demonstrates the use of routing, shared services, observables, and pipes. The application fetches service tickets from a remote JSON API and displays them across multiple views with search and filtering capabilities.

### Technologies Used
- **Angular 17+** - Framework
- **TypeScript** - Programming Language
- **RxJS** - Reactive Programming
- **HttpClient** - HTTP Communication
- **JSONPlaceholder API** - Remote Data Source

---

## Features Implemented

### ✅ Required Features

1. **Angular Router Navigation**
   - Four main routes: Home, About, Services, Contact
   - Default route redirects to /home
   - Wildcard route for 404 handling
   - Active route highlighting in navbar

2. **Shared Service with Caching**
   - `DataService` implements singleton pattern
   - Uses `BehaviorSubject` and `shareReplay(1)` for caching
   - Prevents duplicate HTTP calls
   - Used in Home and Services components

3. **Observables & RxJS Operators**
   - `async` pipe for template subscriptions
   - `map`, `tap`, `catchError`, `startWith` operators
   - `combineLatest` for search functionality
   - Proper error handling and loading states

4. **Pipes Implementation**
   - **Built-in Pipes:**
     - `uppercase` - Title formatting
     - `date` - Date/time display
     - `slice` - Content preview
   - **Custom Pipes:**
     - `truncate` - Text truncation with ellipsis
     - `titleCaseWords` - Title case formatting

5. **Component Requirements Met**
   - Home: Latest 5 posts with pipes
   - About: Static page with date pipe
   - Services: Full list with search and loading states
   - Contact: Form with preview using uppercase pipe

---

## Project Structure

```
community-help-desk/
├── src/
│   ├── app/
│   │   ├── components/
│   │   │   ├── home/
│   │   │   │   ├── home.component.ts
│   │   │   │   ├── home.component.html
│   │   │   │   └── home.component.css
│   │   │   ├── about/
│   │   │   │   ├── about.component.ts
│   │   │   │   ├── about.component.html
│   │   │   │   └── about.component.css
│   │   │   ├── services/
│   │   │   │   ├── services.component.ts
│   │   │   │   ├── services.component.html
│   │   │   │   └── services.component.css
│   │   │   └── contact/
│   │   │       ├── contact.component.ts
│   │   │       ├── contact.component.html
│   │   │       └── contact.component.css
│   │   ├── services/
│   │   │   └── data.service.ts
│   │   ├── pipes/
│   │   │   ├── truncate.pipe.ts
│   │   │   └── title-case-words.pipe.ts
│   │   ├── models/
│   │   │   └── post.model.ts
│   │   ├── app.component.ts
│   │   ├── app.component.html
│   │   ├── app.component.css
│   │   ├── app.routes.ts
│   │   └── app.config.ts
│   ├── main.ts
│   ├── index.html
│   └── styles.css
├── package.json
├── tsconfig.json
├── angular.json
└── README.md
```

---

## Component Documentation

### 1. HomeComponent (`/home`)

**Purpose:** Welcome page displaying the latest 5 service tickets

**Features:**
- Fetches data from shared `DataService`
- Uses RxJS `map` operator to get first 5 posts
- Displays loading state while fetching
- Uses `async` pipe for subscription management

**Pipes Used:**
- `titleCaseWords` (custom) - Formats post titles
- `uppercase` (built-in) - Transforms titles to uppercase
- `truncate` (custom) - Limits body text to 100 characters

**Observable Pattern:**
```typescript
this.latestPosts$ = this.dataService.getPosts().pipe(
  map(posts => posts.slice(0, 5))
);
```

**Location in Code:**
- TypeScript: `src/app/components/home/home.component.ts`
- Template: `src/app/components/home/home.component.html`
- Styles: `src/app/components/home/home.component.css`

---

### 2. AboutComponent (`/about`)

**Purpose:** Static informational page about the portal

**Features:**
- Displays current date and time
- Shows developer information
- Lists technology stack
- Demonstrates pipe usage

**Pipes Used:**
- `date` (built-in) with 'fullDate' format
- `date` (built-in) with 'medium' format
- `uppercase` (built-in) - For section headers

**Code Example:**
```html
<p><strong>Today:</strong> {{ currentDate | date:'fullDate' }}</p>
<p><strong>Time:</strong> {{ currentDate | date:'medium' }}</p>
<h2>{{ 'About This Portal' | uppercase }}</h2>
```

**Location in Code:**
- TypeScript: `src/app/components/about/about.component.ts`
- Template: `src/app/components/about/about.component.html`
- Styles: `src/app/components/about/about.component.css`

---

### 3. ServicesComponent (`/services`)

**Purpose:** Main data page displaying all service tickets with search functionality

**Features:**
- Fetches all posts from shared service
- Real-time search filtering by title and body
- Loading and error state management
- Uses `combineLatest` for reactive search

**Pipes Used:**
- `truncate` (custom) - Preview body text (150 chars)
- `async` (built-in) - Automatic subscription management

**Observable Pattern:**
```typescript
this.filteredPosts$ = combineLatest([
  this.posts$,
  this.searchTerm$.pipe(startWith(''))
]).pipe(
  map(([posts, searchTerm]) => {
    if (!searchTerm.trim()) return posts;
    const term = searchTerm.toLowerCase();
    return posts.filter(post =>
      post.title.toLowerCase().includes(term) ||
      post.body.toLowerCase().includes(term)
    );
  })
);
```

**JSON Records Featured:**
- **Source:** https://jsonplaceholder.typicode.com/posts
- **Display:** All 100 posts from the API
- **Fields Shown:** ID, User ID, Title, Body (truncated)

**Location in Code:**
- TypeScript: `src/app/components/services/services.component.ts`
- Template: `src/app/components/services/services.component.html`
- Styles: `src/app/components/services/services.component.css`

---

### 4. ContactComponent (`/contact`)

**Purpose:** Contact form with live preview

**Features:**
- Template-driven form with validation
- Real-time form preview on submit
- Reset functionality
- Form state management

**Pipes Used:**
- `uppercase` (built-in) - Display name in caps
- `date` (built-in) - Show submission time

**Code Example:**
```html
<div class="preview-item">
  <strong>Name:</strong>
  <p>{{ formData.name | uppercase }}</p>
</div>
<div class="preview-item">
  <strong>Submitted at:</strong>
  <p>{{ Date.now() | date:'medium' }}</p>
</div>
```

**Location in Code:**
- TypeScript: `src/app/components/contact/contact.component.ts`
- Template: `src/app/components/contact/contact.component.html`
- Styles: `src/app/components/contact/contact.component.css`

---

## Services Documentation

### DataService

**File:** `src/app/services/data.service.ts`

**Purpose:** Singleton service for fetching and caching API data

**Key Features:**

1. **Singleton Pattern:**
   ```typescript
   @Injectable({
     providedIn: 'root'
   })
   ```

2. **Caching Mechanism:**
   - Uses `BehaviorSubject` to store posts
   - Implements `shareReplay(1)` to prevent duplicate HTTP calls
   - Cache persists for the application lifetime

3. **HTTP Client Integration:**
   ```typescript
   this.cache$ = this.http.get<Post[]>(this.apiUrl).pipe(
     tap(posts => this.postsSubject.next(posts)),
     catchError(error => throwError(() => new Error('Failed to load posts'))),
     shareReplay(1)
   );
   ```

4. **Error Handling:**
   - Catches HTTP errors
   - Logs errors to console
   - Throws user-friendly error messages

**Methods:**
- `getPosts()`: Returns Observable of all posts (with caching)
- `posts$`: Returns BehaviorSubject as Observable

**Components Using This Service:**
1. **HomeComponent** - Fetches latest 5 posts
2. **ServicesComponent** - Fetches all posts with search

**Caching Demonstration:**
Navigate between Home → Services → Home, and check the browser console. You'll see "Posts fetched from API" only ONCE, proving the cache works!

---

## Pipes Documentation

### 1. TruncatePipe (Custom)

**File:** `src/app/pipes/truncate.pipe.ts`

**Purpose:** Truncate text to specified length with ellipsis

**Usage:**
```html
{{ post.body | truncate:100 }}
{{ text | truncate:150:'...' }}
```

**Parameters:**
- `limit`: Maximum character length (default: 100)
- `ellipsis`: Suffix for truncated text (default: '...')

**Implementation:**
```typescript
transform(value: string, limit: number = 100, ellipsis: string = '...'): string {
  if (!value) return '';
  if (value.length <= limit) return value;
  return value.substring(0, limit).trim() + ellipsis;
}
```

**Used In:**
- HomeComponent - Truncate post body to 100 chars
- ServicesComponent - Truncate post body to 150 chars

---

### 2. TitleCaseWordsPipe (Custom)

**File:** `src/app/pipes/title-case-words.pipe.ts`

**Purpose:** Convert text to title case (capitalize first letter of each word)

**Usage:**
```html
{{ post.title | titleCaseWords }}
```

**Implementation:**
```typescript
transform(value: string): string {
  if (!value) return '';
  return value
    .toLowerCase()
    .split(' ')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
}
```

**Used In:**
- HomeComponent - Format post titles before applying uppercase

---

### 3. Built-in Pipes Used

**UpperCasePipe:**
- HomeComponent - Post titles
- AboutComponent - Section headers
- ContactComponent - Name preview

**DatePipe:**
- AboutComponent - Current date display
- ContactComponent - Submission timestamp

**AsyncPipe:**
- HomeComponent - `latestPosts$ | async`
- ServicesComponent - `filteredPosts$ | async`
- All observable subscriptions

---

## Observables Implementation

### Observable Patterns Used

1. **Simple Observable with Operators:**
   ```typescript
   // HomeComponent
   this.latestPosts$ = this.dataService.getPosts().pipe(
     map(posts => posts.slice(0, 5))
   );
   ```

2. **CombineLatest for Search:**
   ```typescript
   // ServicesComponent
   this.filteredPosts$ = combineLatest([
     this.posts$,
     this.searchTerm$.pipe(startWith(''))
   ]).pipe(
     map(([posts, searchTerm]) => {
       // Filter logic
     })
   );
   ```

3. **BehaviorSubject for State:**
   ```typescript
   // DataService
   private postsSubject = new BehaviorSubject<Post[]>([]);
   ```

4. **ShareReplay for Caching:**
   ```typescript
   // DataService
   this.cache$ = this.http.get<Post[]>(this.apiUrl).pipe(
     shareReplay(1)
   );
   ```

### RxJS Operators Used

| Operator | Purpose | Location |
|----------|---------|----------|
| `map` | Transform data | HomeComponent, ServicesComponent |
| `tap` | Side effects (logging) | DataService |
| `catchError` | Error handling | DataService |
| `startWith` | Initial value | ServicesComponent |
| `combineLatest` | Merge streams | ServicesComponent |
| `shareReplay` | Cache HTTP response | DataService |

---

## Routing Configuration

**File:** `src/app/app.routes.ts`

### Route Definitions

```typescript
export const routes: Routes = [
  { path: '', redirectTo: '/home', pathMatch: 'full' },  // Default route
  { path: 'home', component: HomeComponent },
  { path: 'about', component: AboutComponent },
  { path: 'services', component: ServicesComponent },
  { path: 'contact', component: ContactComponent },
  { path: '**', redirectTo: '/home' }  // Wildcard route
];
```

### Navigation Features

1. **RouterLink Directives:**
   ```html
   <a routerLink="/home" routerLinkActive="active">Home</a>
   ```

2. **Active Route Highlighting:**
   ```html
   <a routerLink="/home" 
      routerLinkActive="active"
      [routerLinkActiveOptions]="{exact: true}">
     Home
   </a>
   ```

3. **Router Outlet:**
   ```html
   <router-outlet></router-outlet>
   ```

### Testing Routes

| URL | Redirects To | Component |
|-----|-------------|-----------|
| `/` | `/home` | HomeComponent |
| `/home` | - | HomeComponent |
| `/about` | - | AboutComponent |
| `/services` | - | ServicesComponent |
| `/contact` | - | ContactComponent |
| `/invalid-route` | `/home` | HomeComponent |

---

## Installation & Setup

### Prerequisites
- Node.js (v18 or higher)
- npm (v9 or higher)
- Angular CLI (v17 or higher)

### Installation Steps

1. **Install Angular CLI globally:**
   ```bash
   npm install -g @angular/cli
   ```

2. **Install project dependencies:**
   ```bash
   cd community-help-desk
   npm install
   ```

3. **Run development server:**
   ```bash
   ng serve
   ```

4. **Open browser:**
   Navigate to `http://localhost:4200/`

### Build for Production

```bash
ng build --configuration production
```

Output will be in `dist/community-help-desk/` directory.

---

## Deployment

### Netlify Deployment

1. **Build the project:**
   ```bash
   ng build --configuration production
   ```

2. **Deploy to Netlify:**
   - Drag and drop the `dist/community-help-desk/browser` folder to Netlify
   - Or use Netlify CLI:
     ```bash
     npm install -g netlify-cli
     netlify deploy --prod --dir=dist/community-help-desk/browser
     ```

3. **Configure Netlify:**
   Create `netlify.toml` in root:
   ```toml
   [build]
     publish = "dist/community-help-desk/browser"
     command = "ng build --configuration production"

   [[redirects]]
     from = "/*"
     to = "/index.html"
     status = 200
   ```

### Netlify Link
**[Your Netlify URL will be added here after deployment]**

---

## Reflection Questions

### Question 1: Problems Solved by Observables and Shared Services

**Question:** During the development of this Angular application, what specific problems did Observables and shared services help you solve (e.g., duplicate HTTP calls, data synchronization across components), and how would these problems manifest if you relied on imperative data handling instead?

**Answer:**

Observables and shared services solved several critical problems in this application:

**1. Duplicate HTTP Calls Prevention:**

The shared `DataService` with caching using `shareReplay(1)` ensures that the API is called only once, even though both HomeComponent and ServicesComponent need the same data. Without this:
- **Problem:** Each component would make its own HTTP request
- **Impact:** 2+ API calls for the same data, increased latency, higher bandwidth usage
- **Imperative Alternative:** Would require a global variable or manual caching logic, making the code harder to maintain

**2. Data Synchronization:**

The `BehaviorSubject` in DataService ensures all components receive the same data and updates simultaneously:
- **Problem:** Without observables, components might have stale or inconsistent data
- **Impact:** User sees different information on different pages
- **Imperative Alternative:** Would need manual synchronization with callbacks or events, leading to spaghetti code

**3. Reactive Search Functionality:**

The `combineLatest` operator in ServicesComponent merges the search term stream with the posts stream:
- **Problem:** Without observables, implementing real-time search would require complex event handling
- **Impact:** Search functionality would be delayed or require explicit "search" button clicks
- **Imperative Alternative:** Would need setTimeout/debounce logic, manual array filtering, and DOM manipulation

**4. Automatic Memory Management:**

The `async` pipe automatically subscribes and unsubscribes from observables:
- **Problem:** Manual subscription management leads to memory leaks
- **Impact:** Application performance degrades over time
- **Imperative Alternative:** Must remember to unsubscribe in ngOnDestroy, easy to forget

**5. Loading and Error States:**

Observables make it easy to handle loading and error states declaratively:
- **Problem:** Without observables, tracking request states requires manual flags
- **Impact:** Poor user experience with no feedback during loading
- **Imperative Alternative:** Multiple boolean flags, complex state management

**Imperative Approach Would Result In:**
- Manual XMLHttpRequest or fetch calls in each component
- Global variables to store data (poor encapsulation)
- Complex callback chains (callback hell)
- No automatic unsubscription (memory leaks)
- Manual DOM updates on data changes
- Difficult to test and maintain

---

### Question 2: Performance Issues and Debugging Strategy

**Question:** If the application began experiencing performance issues or inconsistent data displays, which parts of your implementation (services, observables, pipes, or routing) would you investigate first, and what concrete changes would you apply to resolve the issue?

**Answer:**

**Investigation Priority:**

**1. FIRST: Observables & Subscriptions**

**Why:** Memory leaks from unmanaged subscriptions are the #1 cause of Angular performance issues.

**What to Check:**
- Are there any manual subscriptions without unsubscribe?
- Are `async` pipes used consistently?
- Are BehaviorSubjects being completed on destroy?

**Concrete Changes:**
```typescript
// BAD - Memory leak
this.dataService.getPosts().subscribe(posts => {
  this.posts = posts;
});

// GOOD - Auto-cleanup with async pipe
this.posts$ = this.dataService.getPosts();
```

**Tools to Use:**
- Chrome DevTools Memory Profiler
- Angular DevTools for component tree inspection
- RxJS leak detection: `tap(val => console.log('Stream active:', val))`

---

**2. SECOND: Shared Service & Caching**

**Why:** Excessive HTTP calls or cache invalidation issues cause data inconsistency.

**What to Check:**
- Is `shareReplay(1)` working correctly?
- Are multiple instances of the service being created?
- Is the API being called repeatedly?

**Concrete Changes:**
```typescript
// Add logging to verify single call
this.cache$ = this.http.get<Post[]>(this.apiUrl).pipe(
  tap(() => console.log('API CALLED - Should happen once')),
  shareReplay(1)
);

// If cache needs refresh, implement invalidation
private invalidateCache(): void {
  this.cache$ = undefined;
  this.loadPosts();
}
```

**Verification:**
- Check Network tab in DevTools
- Ensure service is `providedIn: 'root'` (singleton)
- Add timestamps to data to verify freshness

---

**3. THIRD: Pipes (Custom & Built-in)**

**Why:** Impure pipes or expensive transformations can cause performance issues.

**What to Check:**
- Are pipes pure or impure?
- Are pipes being called repeatedly on change detection?
- Are pipe transformations computationally expensive?

**Concrete Changes:**
```typescript
// Ensure pipes are pure (default)
@Pipe({
  name: 'truncate',
  standalone: true,
  pure: true  // Explicit declaration
})

// If filtering is needed, use memoization
@Pipe({ name: 'filterPosts', pure: true })
export class FilterPostsPipe implements PipeTransform {
  private cache = new Map();
  
  transform(posts: Post[], term: string): Post[] {
    const key = `${posts.length}-${term}`;
    if (this.cache.has(key)) return this.cache.get(key);
    
    const filtered = posts.filter(p => 
      p.title.includes(term) || p.body.includes(term)
    );
    this.cache.set(key, filtered);
    return filtered;
  }
}
```

---

**4. FOURTH: Routing**

**Why:** Routing issues usually affect navigation, not performance or data display.

**What to Check:**
- Are components being destroyed properly?
- Are route guards causing delays?
- Is preloading strategy appropriate?

**Concrete Changes:**
```typescript
// Implement route preloading for faster navigation
import { PreloadAllModules } from '@angular/router';

export const appConfig: ApplicationConfig = {
  providers: [
    provideRouter(routes, withPreloading(PreloadAllModules))
  ]
};

// Add route guards for data prefetching
const routes: Routes = [
  { 
    path: 'services', 
    component: ServicesComponent,
    resolve: { posts: PostsResolver }  // Prefetch data
  }
];
```

---

**Specific Performance Scenarios:**

**Scenario 1: Inconsistent Data Display**

**Diagnosis:**
- Check if components are using the same service instance
- Verify `async` pipe is used consistently
- Look for manual subscriptions that might have stale data

**Solution:**
```typescript
// Ensure singleton service
@Injectable({ providedIn: 'root' })

// Use async pipe everywhere
<div *ngIf="posts$ | async as posts">
```

---

**Scenario 2: Slow Search Functionality**

**Diagnosis:**
- Search triggers too frequently (every keystroke)
- No debouncing on search input
- Filtering entire large dataset on each change

**Solution:**
```typescript
// Add debouncing
this.searchTerm$ = new Subject<string>();
this.filteredPosts$ = this.searchTerm$.pipe(
  debounceTime(300),  // Wait 300ms after typing stops
  distinctUntilChanged(),  // Only if value changed
  switchMap(term => this.filterPosts(term))
);
```

---

**Scenario 3: Slow Initial Load**

**Diagnosis:**
- API response time is slow
- Too much data being fetched at once
- No loading indicators

**Solution:**
```typescript
// Implement pagination
getPosts(page: number = 1, limit: number = 20): Observable<Post[]> {
  return this.http.get<Post[]>(
    `${this.apiUrl}?_page=${page}&_limit=${limit}`
  ).pipe(
    shareReplay(1)
  );
}

// Add loading state
isLoading$ = new BehaviorSubject(true);
posts$ = this.dataService.getPosts().pipe(
  tap(() => this.isLoading$.next(false))
);
```

---

**Monitoring Tools:**

1. **Angular DevTools:**
   - Component tree inspection
   - Change detection profiling
   - Performance profiler

2. **Chrome DevTools:**
   - Network tab (API calls)
   - Performance tab (FPS, memory)
   - Memory profiler (heap snapshots)

3. **RxJS Debugging:**
   ```typescript
   import { tap } from 'rxjs/operators';
   
   this.posts$.pipe(
     tap(val => console.log('Stream update:', val)),
     tap(() => console.log('Memory usage:', performance.memory))
   );
   ```

---

**Summary Priority List:**

1. ✅ **Check Observables first** - Memory leaks are most common
2. ✅ **Verify Service caching** - Duplicate API calls waste resources
3. ✅ **Audit Pipes** - Impure pipes can trigger excessive recalculations
4. ✅ **Review Routing last** - Usually not the performance bottleneck

**Key Principle:** Always measure before optimizing. Use profiling tools to identify the actual bottleneck rather than guessing.

---

## Assignment Requirements Checklist

### Routing & Navigation ✅
- [x] /home → HomeComponent
- [x] /about → AboutComponent
- [x] /services → ServicesComponent
- [x] /contact → ContactComponent
- [x] Default route redirects to /home
- [x] Wildcard route redirects to /home
- [x] Navbar visible on all pages
- [x] routerLinkActive highlights current page

### Shared Service ✅
- [x] DataService fetches from JSONPlaceholder API
- [x] Returns Observable<Post[]>
- [x] Implements caching (BehaviorSubject + shareReplay)
- [x] Used in Home component (latest 5 posts)
- [x] Used in Services component (all posts)
- [x] Singleton service (providedIn: 'root')

### Observables ✅
- [x] posts$ | async in templates
- [x] RxJS operators: map, tap, catchError, startWith, combineLatest
- [x] Proper error handling
- [x] Loading states

### Pipes ✅
- [x] Built-in: uppercase
- [x] Built-in: date
- [x] Custom: truncate
- [x] Custom: titleCaseWords
- [x] All pipes used meaningfully in UI

### Component Requirements ✅
- [x] **Home:** Welcome message + latest 5 posts + pipes
- [x] **About:** Current date/time + uppercase heading
- [x] **Services:** All posts + search + loading/error states
- [x] **Contact:** Form + preview with pipes

### Documentation ✅
- [x] Where pipes are featured
- [x] Where observables are featured
- [x] Where JSON records are featured
- [x] Reflection question answers
- [x] Clear README

---

## Credits

**API Source:** [JSONPlaceholder](https://jsonplaceholder.typicode.com/)  
**Framework:** Angular  
**Developer:** Micko de Dios  
**Course:** Midterm Badge Assignment  

---

## License

This project is submitted for educational purposes as part of the Midterm Badge assignment.

---

**End of Documentation**
"# midterm_badge_dedios" 
"# midterm_badge_dedios" 
