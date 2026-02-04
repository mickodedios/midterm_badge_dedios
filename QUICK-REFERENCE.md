# Quick Reference Guide

## Component Overview

| Component | Route | Purpose | Uses Service | Uses Pipes |
|-----------|-------|---------|--------------|------------|
| Home | /home | Welcome + Latest 5 posts | ✅ DataService | ✅ truncate, titleCaseWords, uppercase |
| About | /about | Static info page | ❌ | ✅ date, uppercase |
| Services | /services | All posts + search | ✅ DataService | ✅ truncate, async |
| Contact | /contact | Contact form | ❌ | ✅ uppercase, date |

## Where Features Are Implemented

### Routing
📍 **File:** `src/app/app.routes.ts`
- Default redirect: `''` → `/home`
- Wildcard: `**` → `/home`
- Active link: `routerLinkActive="active"`

### Shared Service (DataService)
📍 **File:** `src/app/services/data.service.ts`
- **Caching:** `shareReplay(1)` + `BehaviorSubject`
- **Used in:** HomeComponent, ServicesComponent
- **API:** https://jsonplaceholder.typicode.com/posts

### Observables & RxJS

**HomeComponent** (`src/app/components/home/home.component.ts`):
```typescript
this.latestPosts$ = this.dataService.getPosts().pipe(
  map(posts => posts.slice(0, 5))
);
```

**ServicesComponent** (`src/app/components/services/services.component.ts`):
```typescript
this.filteredPosts$ = combineLatest([
  this.posts$,
  this.searchTerm$.pipe(startWith(''))
]).pipe(map([posts, term] => /* filter logic */));
```

**RxJS Operators Used:**
- `map` - Transform data
- `tap` - Logging/side effects
- `catchError` - Error handling
- `startWith` - Initial value
- `combineLatest` - Merge streams
- `shareReplay` - Caching

### Pipes

**Custom Pipes:**

1. **TruncatePipe** (`src/app/pipes/truncate.pipe.ts`)
   - Usage: `{{ text | truncate:100 }}`
   - Used in: Home, Services

2. **TitleCaseWordsPipe** (`src/app/pipes/title-case-words.pipe.ts`)
   - Usage: `{{ title | titleCaseWords }}`
   - Used in: Home

**Built-in Pipes:**

1. **UpperCasePipe**
   - Usage: `{{ text | uppercase }}`
   - Used in: Home, About, Contact

2. **DatePipe**
   - Usage: `{{ date | date:'fullDate' }}`
   - Used in: About, Contact

3. **AsyncPipe**
   - Usage: `{{ posts$ | async }}`
   - Used in: Home, Services

### JSON Records

**API Endpoint:** https://jsonplaceholder.typicode.com/posts

**Data Model** (`src/app/models/post.model.ts`):
```typescript
interface Post {
  userId: number;
  id: number;
  title: string;
  body: string;
}
```

**Display Locations:**
- **Home:** First 5 records
- **Services:** All 100 records (searchable)

## File Structure Summary

```
src/app/
├── components/
│   ├── home/          → Latest posts
│   ├── about/         → Static info
│   ├── services/      → Full list + search
│   └── contact/       → Contact form
├── services/
│   └── data.service.ts    → Shared service with caching
├── pipes/
│   ├── truncate.pipe.ts   → Custom truncate
│   └── title-case-words.pipe.ts  → Custom title case
├── models/
│   └── post.model.ts      → Post interface
├── app.routes.ts          → Route configuration
├── app.config.ts          → App providers
└── app.component.*        → Root component with navbar
```

## Key Concepts Demonstrated

### 1. Singleton Service Pattern
```typescript
@Injectable({ providedIn: 'root' })
export class DataService { }
```

### 2. Observable Caching
```typescript
this.cache$ = this.http.get<Post[]>(url).pipe(
  shareReplay(1)  // Cache and share
);
```

### 3. Reactive Search
```typescript
combineLatest([data$, search$]).pipe(
  map(([data, term]) => filter(data, term))
);
```

### 4. Custom Pipe
```typescript
@Pipe({ name: 'truncate', standalone: true })
export class TruncatePipe implements PipeTransform {
  transform(value: string, limit: number): string {
    return value.substring(0, limit) + '...';
  }
}
```

## Testing Checklist

- [ ] Navigate to all routes
- [ ] Verify active route highlighting
- [ ] Check console for single API call
- [ ] Test search functionality
- [ ] Submit contact form
- [ ] Verify pipes working
- [ ] Check mobile responsiveness
- [ ] No console errors

## Common Commands

```bash
# Install dependencies
npm install

# Run development server
ng serve

# Build for production
ng build --configuration production

# Deploy to Netlify
netlify deploy --prod --dir=dist/community-help-desk/browser
```

## Grading Rubric Quick Check

| Criteria | Points | Status |
|----------|--------|--------|
| Routing & Navigation | 3 | ✅ |
| Shared Service & HTTP | 5 | ✅ |
| Component Implementation | 3 | ✅ |
| Pipes and Observables | 5 | ✅ |
| Deployment & Documentation | 4 | ✅ |
| **Total** | **20** | **✅** |

## Submission Requirements

1. ✅ Netlify Link
2. ✅ GitHub Repo Link
3. ✅ Documentation (README.md)
4. ✅ Reflection Answers

---

**Developer:** Micko de Dios  
**Project:** Community Help Desk Portal  
**Framework:** Angular 17+
