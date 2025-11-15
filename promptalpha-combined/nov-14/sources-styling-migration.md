# Sources Page Styling Migration - November 14, 2024

## Overview
This document summarizes the comprehensive styling migration work completed across two sessions to standardize all source-related components to match the consistent design pattern established in the Overview page.

## Sessions Summary

### Session 1: Main Sources Page Migration
**Objective:** Migrate the Sources page to reuse the visibility and brand chart components from the Overview page, ensuring consistent styling across the application.

### Session 2: Source Details Page Migration
**Objective:** Apply the same styling patterns to all child components of the source-details page, including converting the "Cited in Prompts" component from cards to a table format.

---

## Components Modified

### 1. Sources Content Page (`components/sources-content.tsx`)

#### Changes:
- **Replaced** `SourceCitationChart` and `SourceCitationRankTable` with `SourceVisibilityDashboard`
- **Removed** `CitationAnalytics` pie chart component
- **Added** search functionality for both Domains and URLs tabs
- **Converted** div-based grid layouts to proper HTML table structures
- **Added** consistent headers with:
  - Icon + Title + Dynamic count
  - Search input (200px width)
  - Export button

#### New Features:
- Real-time filtering for domains and URLs
- Striped row styling (`odd:bg-card`, `even:bg-muted/50`)
- Hover effects and transitions
- Green background highlighting for user's own sources (type === "You")
- Pagination controls
- Sorting functionality for table columns

---

### 2. Source Visibility Transform (`lib/utils/source-visibility-transform.ts`)

#### New File Created:
- Data transformation utilities for `SourceVisibilityDashboard` component
- Transforms source domain data to match BrandVisibilityDashboardEnhanced format
- Type definitions for raw data from Supabase RPC functions
- Color assignment logic for chart lines and avatars
- Time series data transformation functions

#### Key Functions:
```typescript
transformSourceVisibilityData(domains, timeSeries, topDomains)
transformTimeSeriesData(timeSeriesData)
getBrandColorsFromTimeSeries(timeSeriesData)
```

---

### 3. Source Visibility Dashboard (`components/source-visibility-dashboard.tsx`)

#### New Component Created:
- Adapted from `BrandVisibilityDashboardEnhanced` for sources
- **Left panel:** Line chart showing daily citation share
- **Right panel:** Ranking table with sources
- Features: sorting, hover effects, tooltips
- Consistent with Overview page design

---

### 4. Source Visibility Chart (`components/source-visibility-chart.tsx`)

#### Changes:
- Replaced `Card` wrapper with new header structure
- Updated loading skeleton to match new style
- Added consistent header with:
  - TrendingUp icon
  - Title with subtitle ("Last 7 days")
  - Export button
- Chart content wrapped in proper padding container

---

### 5. Source Cited Prompts (`components/source-cited-prompts.tsx`)

#### Major Transformation:
**Before:** Card-based layout with individual prompt cards
**After:** HTML table structure matching Citation Share Rank table

#### Table Columns:
1. **Prompt:** Shows prompt text with line clamping (max 2 lines)
2. **Category:** Displays category badge (Navigational, Informational, Commercial)
3. **Citations:** Shows citation count
4. **Brands:** Shows user brand indicator ("You") + competitor logos
5. **Providers:** Shows provider logos with overflow count

#### Styling Features:
- Striped rows with hover effects
- Consistent header with MessageSquare icon
- Fixed column widths for stability
- Better data density - more information in less space
- Maintained all original functionality (brand indicators, badges, colors)

---

### 6. Source Related URLs (`components/source-related-urls.tsx`)

#### Changes:
- **Converted** from div-based grid layout to proper HTML table
- **Added** search functionality with filter logic
- **Added** new header with:
  - LinkIcon and title with dynamic URL count
  - Search input (200px width)
  - Export button
- **Applied** striped row styling and hover effects
- Maintained all existing functionality (favicons, links, brand/provider badges)

#### Table Columns:
- URL (with favicon and title)
- Prompt/Topic
- Citations (clickable link to response details)
- Position
- Brands (logo badges)
- Provider (logo badge)

---

### 7. Source Recent Citations (`components/source-recent-citations.tsx`)

#### Changes:
- Added consistent header wrapper to all states (loading, empty, data)
- Added FileText icon and dynamic citation count in header
- Updated loading, empty, and data states with new header structure
- **Kept** card grid layout (works well for this use case)
- Added citation count display in header

---

## Design Patterns Applied

### Consistent Header Structure
All components now follow this pattern:
```tsx
<div className="rounded-xl bg-card text-card-foreground overflow-hidden shadow-sm border-component">
  <header className="flex items-center gap-1 mb-0 border-b border-component mt-0 mx-0 pl-3 pr-1.5 min-h-10">
    <span className="size-4 mr-1">
      <Icon className="w-4 h-4 text-muted-foreground" />
    </span>
    <h1 className="font-medium text-sm truncate">
      Title
      <span className="text-muted-foreground text-sm font-medium">
        <span className="mx-1">·</span>
        Subtitle or count
      </span>
    </h1>
    <div className="flex-1" />
    {/* Optional: Search input and/or Export button */}
  </header>
  <div className="p-4">
    {/* Content */}
  </div>
</div>
```

### Table Structure
All tables now use proper semantic HTML:
```tsx
<table className="caption-bottom text-sm w-full border-t border-b">
  <thead className="[&_tr]:border-b [&_tr]:bg-muted/50 [&_tr]:hover:bg-muted/50">
    <tr className="transition-colors border-b border-border">
      <th className="text-left align-middle font-medium text-xs text-muted-foreground p-2 h-1 bg-base border-r border-border">
        {/* Header content */}
      </th>
    </tr>
  </thead>
  <tbody className="[&_tr:last-child]:border-0">
    <tr className="border-b border-border transition-colors odd:bg-card hover:bg-muted/50 even:bg-muted/50 hover:even:bg-muted/85">
      {/* Row content */}
    </tr>
  </tbody>
</table>
```

### Styling Classes
- **Striped rows:** `odd:bg-card`, `even:bg-muted/50`
- **Hover effects:** `hover:bg-muted/50`, `hover:even:bg-muted/85`
- **Borders:** `border-component`, `border-border`
- **Header height:** `min-h-10`
- **Button height:** `h-7`
- **Icon size:** `w-4 h-4`
- **Text sizes:** `text-sm` (body), `text-xs` (headers)

---

## Files Modified Summary

### New Files Created (3):
1. `/lib/utils/source-visibility-transform.ts` - Data transformation utilities
2. `/components/source-visibility-dashboard.tsx` - New dashboard component
3. `/nov-14/sources-styling-migration.md` - This documentation

### Files Modified (5):
1. `/components/sources-content.tsx` - Main sources page with tabs
2. `/components/source-visibility-chart.tsx` - Citation frequency chart
3. `/components/source-cited-prompts.tsx` - Prompts table (major transformation)
4. `/components/source-related-urls.tsx` - Related URLs table
5. `/components/source-recent-citations.tsx` - Recent citations cards

---

## Technical Improvements

### Data Density
- Tables now show more information in less space
- Better use of screen real estate
- Easier to scan and compare data

### Consistency
- All components match the Overview page design
- Standardized header structure across all components
- Consistent spacing, borders, and colors

### User Experience
- Search functionality for quick filtering
- Sortable columns where applicable
- Hover effects for better interactivity
- Clickable rows for navigation
- Export buttons for data export (placeholders for future implementation)

### Performance
- Proper use of React hooks (useState, useMemo, useEffect)
- Efficient filtering and sorting
- Pagination for large datasets
- Memoized data transformations

---

## Build Status

✅ **All builds completed successfully**

The application compiled without errors. Unrelated warnings about dynamic server usage in `/brand-iq/generated-pages` were present but not related to these changes.

---

## Color Coding

### Source Types:
- **You:** Green (`bg-[#D1FAE5]`, `text-[#059669]`)
- **Competitor:** Red (`bg-[#FEE2E2]`, `text-[#DC2626]`)
- **UGC:** Blue (`bg-[#DBEAFE]`, `text-[#2563EB]`)
- **Editorial:** Indigo (`bg-[#E0E7FF]`, `text-[#4F46E5]`)
- **Corporate:** Amber (`bg-[#FEF3C7]`, `text-[#D97706]`)
- **Reference:** Purple (`bg-[#F3E8FF]`, `text-[#9333EA]`)
- **Institutional:** Green (`bg-[#D1FAE5]`, `text-[#10B981]`)
- **Other:** Gray (`bg-[#F3F4F6]`, `text-[#6B7280]`)

### Category Colors (Prompts):
- **Navigational:** Blue (`bg-blue-100`, `text-blue-800`)
- **Informational:** Green (`bg-green-100`, `text-green-800`)
- **Commercial:** Orange (`bg-orange-100`, `text-orange-800`)
- **Default:** Gray (`bg-gray-100`, `text-gray-800`)

---

## Next Steps / Future Enhancements

1. **Implement Export Functionality:**
   - Add CSV/JSON export for domains
   - Add CSV/JSON export for URLs
   - Add CSV/JSON export for prompts

2. **Add Sorting to Cited Prompts Table:**
   - Sort by prompt text
   - Sort by category
   - Sort by citation count
   - Sort by brands

3. **Add Pagination to Cited Prompts:**
   - Currently shows all prompts
   - Could benefit from pagination if many prompts

4. **Enhance Search Capabilities:**
   - Add advanced filters (by type, by provider, etc.)
   - Add date range filtering for time series

5. **Add Analytics:**
   - Track user interactions with tables
   - Monitor search queries
   - Analyze most viewed sources

---

## Conclusion

This migration successfully standardized all source-related components to match the consistent design patterns established in the Overview page. The changes improve:

- **Visual Consistency:** All components now share the same header structure, table styling, and interaction patterns
- **Data Presentation:** Better use of tables for structured data, improved readability
- **User Experience:** Added search functionality, better hover states, and clearer visual hierarchy
- **Code Quality:** Proper semantic HTML, consistent class naming, reusable patterns
- **Maintainability:** Easier to update and extend with new features

The application now provides a cohesive, professional interface for viewing and analyzing source citations across all pages.
