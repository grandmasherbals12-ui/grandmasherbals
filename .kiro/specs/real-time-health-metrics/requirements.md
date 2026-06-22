# Requirements Document

## Introduction

This document defines the requirements for the Real-Time Health Metrics Enhancement feature for Grandma's Herbals wellness platform. The feature ensures consistent design layout across all member-uploaded health metrics and provides real-time auto-updating of information and dates when members submit data. Members will experience live dashboard updates without page refresh, instant reflection of metric changes in the UI, and automatic date/timestamp synchronization across the platform while maintaining visual consistency with the existing olive green theme and Cormorant Garamond font.

## Glossary

- **Daily_Progress_System**: The system that manages collection, storage, and display of member health metrics tracked over 3-day periods
- **Member**: An authenticated user who submits daily health metric data through the platform
- **Health_Metric**: A measurable data point tracking wellness progress (pain reduction, mood improvement, energy, mental clarity, walking comfort, knee comfort)
- **Real_Time_Update**: An automatic UI update that occurs within 2 seconds of a database change without requiring page refresh
- **Progress_Entry**: A single submission of health metrics by a member for a specific date
- **Dashboard**: The member-facing interface displaying health metrics, progress trends, and report status
- **Supabase_Realtime**: The PostgreSQL-based real-time subscription service used for broadcasting database changes
- **Visual_Consistency**: Adherence to the established design system including olive green color palette (#5a8a5c, #2d5a30), Cormorant Garamond font, and existing component patterns
- **Timestamp**: An ISO 8601 formatted date-time value stored in UTC and displayed in the member's local timezone
- **Update_Indicator**: A visual element (animation, badge, or highlight) that shows a UI component has recently received new data

## Requirements

### Requirement 1: Consistent Design Layout

**User Story:** As a member, I want all health metric forms and displays to have a consistent visual design, so that I have a familiar and professional experience throughout the platform.

#### Acceptance Criteria

1. THE Daily_Progress_System SHALL apply the olive green color palette (#5a8a5c primary, #2d5a30 dark, olive-50 through olive-900 scale) to all health metric components
2. THE Daily_Progress_System SHALL use Cormorant Garamond font for all headings and body text in health metric interfaces
3. THE Daily_Progress_System SHALL reuse existing UI components (Button, Input, Label, Textarea, Slider) for all health metric forms
4. THE Daily_Progress_System SHALL maintain consistent spacing, border radius, and shadow patterns across all health metric displays
5. WHEN a member views any health metric interface, THE Daily_Progress_System SHALL present form elements with consistent visual states (default, hover, focus, disabled)
6. THE Daily_Progress_System SHALL apply consistent icon styling and sizes across all health metric indicators

### Requirement 2: Real-Time Data Synchronization

**User Story:** As a member, I want my health metrics to update automatically across all my open browser tabs, so that I always see the most current information without manual refreshing.

#### Acceptance Criteria

1. WHEN a Progress_Entry is inserted or updated in the database, THE Daily_Progress_System SHALL broadcast the change via Supabase_Realtime within 500 milliseconds
2. WHEN a Real_Time_Update is received, THE Dashboard SHALL update the displayed metrics within 2 seconds without page refresh
3. WHEN multiple browser tabs are open for the same Member, THE Daily_Progress_System SHALL synchronize metric updates across all tabs within 3 seconds
4. THE Daily_Progress_System SHALL maintain a persistent real-time subscription to the daily_progress_entries table for the authenticated Member
5. IF the real-time connection is interrupted, THEN THE Daily_Progress_System SHALL attempt to reconnect automatically every 5 seconds for up to 3 minutes
6. WHEN the real-time connection is restored, THE Daily_Progress_System SHALL fetch the latest data and update the UI

### Requirement 3: Instant Progress Entry Reflection

**User Story:** As a member, I want to see my submitted health metrics appear immediately in my dashboard, so that I receive instant confirmation of my data submission.

#### Acceptance Criteria

1. WHEN a Member submits a Progress_Entry, THE Daily_Progress_System SHALL display the submitted data in the UI within 2 seconds
2. WHEN a Progress_Entry is successfully saved, THE Daily_Progress_System SHALL show an Update_Indicator on the affected dashboard components for 5 seconds
3. THE Daily_Progress_System SHALL update progress charts and trend visualizations within 2 seconds of receiving new metric data
4. WHEN a submission is in progress, THE Daily_Progress_System SHALL display a loading state on the submit button and disable form inputs
5. IF a submission fails, THEN THE Daily_Progress_System SHALL display an error message and preserve the form data for retry
6. WHEN a Progress_Entry updates computed averages (avg_mood, avg_energy, avg_mental_clarity), THE Dashboard SHALL reflect the new calculated values within 2 seconds

### Requirement 4: Automatic Date and Timestamp Management

**User Story:** As a member, I want dates and timestamps to update automatically and display in my local timezone, so that I see accurate time information regardless of when I access the platform.

#### Acceptance Criteria

1. THE Daily_Progress_System SHALL store all Timestamps in UTC format in the database
2. WHEN displaying a Timestamp to a Member, THE Daily_Progress_System SHALL convert it to the Member's local timezone using browser timezone detection
3. THE Dashboard SHALL display relative time labels (e.g., "2 minutes ago", "1 hour ago") for Progress_Entry submissions within the last 24 hours
4. THE Dashboard SHALL automatically update relative time labels every 60 seconds without page refresh
5. WHEN the system date changes to a new day, THE Dashboard SHALL update all date-dependent displays within 60 seconds
6. THE Daily_Progress_System SHALL format dates consistently across all interfaces using the pattern "MMM DD, YYYY" (e.g., "Jan 15, 2025")
7. WHEN a Progress_Entry is created, THE Daily_Progress_System SHALL automatically set the entry_date field to the current date in the Member's timezone

### Requirement 5: Real-Time Report Status Updates

**User Story:** As a member, I want to see the status of my progress report generation in real-time, so that I know when my report is ready to view.

#### Acceptance Criteria

1. WHEN a progress report generation is triggered, THE Daily_Progress_System SHALL display a status indicator showing "Generating Report..."
2. WHEN the report_generated field changes to true in the database, THE Dashboard SHALL update the status indicator to "Report Ready" within 2 seconds
3. WHEN a report PDF is generated and the report_pdf_url field is populated, THE Dashboard SHALL display a "View Report" button within 2 seconds
4. THE Dashboard SHALL display real-time progress for email_sent, sms_sent, and encouragement_sent status fields
5. WHEN a scheduled report delivery occurs (at 9 AM), THE Dashboard SHALL update the delivery status indicators within 30 seconds
6. IF report generation fails, THEN THE Dashboard SHALL display an error status and provide a retry option

### Requirement 6: Live Dashboard Metric Updates

**User Story:** As a member, I want my dashboard to automatically refresh when new metrics are available from the backend, so that I don't need to manually reload the page to see updates.

#### Acceptance Criteria

1. THE Dashboard SHALL subscribe to Supabase_Realtime changes on the daily_progress_entries table filtered by the authenticated Member's ID
2. WHEN any Health_Metric value changes for the Member, THE Dashboard SHALL update the corresponding display element within 2 seconds
3. THE Dashboard SHALL display Update_Indicators (subtle animation or highlight) on metric cards that receive new data
4. THE Dashboard SHALL maintain smooth transitions when updating chart data, using a 300-millisecond fade animation
5. WHEN multiple metrics update simultaneously, THE Dashboard SHALL batch the updates and render them in a single UI update cycle
6. THE Dashboard SHALL display a connection status indicator showing "Live" when real-time subscriptions are active

### Requirement 7: Visual Update Indicators

**User Story:** As a member, I want to see visual feedback when my health data updates, so that I know which metrics have recently changed.

#### Acceptance Criteria

1. WHEN a Health_Metric value updates, THE Daily_Progress_System SHALL apply a subtle pulse animation to the metric display for 3 seconds
2. THE Daily_Progress_System SHALL display a small "Updated" badge with a timestamp on recently changed metric cards
3. THE Update_Indicator SHALL use the olive-600 color with 80% opacity for consistency with the design system
4. WHEN an Update_Indicator is displayed, THE Daily_Progress_System SHALL automatically remove it after 5 seconds
5. THE Daily_Progress_System SHALL display a "Live" badge with a green dot indicator when real-time updates are active
6. IF the real-time connection is disconnected, THEN THE Daily_Progress_System SHALL display a "Reconnecting..." badge with an amber indicator

### Requirement 8: Multi-Device Synchronization

**User Story:** As a member, I want my health metrics to stay synchronized across my phone, tablet, and computer, so that I see consistent data regardless of which device I'm using.

#### Acceptance Criteria

1. WHEN a Member submits a Progress_Entry from any device, THE Daily_Progress_System SHALL broadcast the update to all devices where the Member is logged in
2. THE Daily_Progress_System SHALL synchronize updates across devices within 5 seconds
3. WHEN a Member logs in on a new device, THE Dashboard SHALL load the most recent Progress_Entry data
4. THE Daily_Progress_System SHALL handle concurrent submissions from multiple devices by using the latest Timestamp as the authoritative version
5. WHEN network connectivity is restored on a device, THE Daily_Progress_System SHALL synchronize any pending updates within 10 seconds
6. THE Dashboard SHALL display identical data across all devices after synchronization completes

### Requirement 9: Form State Preservation

**User Story:** As a member, I want my partially completed form data to be preserved if I navigate away or lose connection, so that I don't lose my progress when filling out health metrics.

#### Acceptance Criteria

1. WHILE a Member is filling out the DailyProgressForm, THE Daily_Progress_System SHALL save form field values to browser local storage every 30 seconds
2. WHEN a Member returns to an incomplete form, THE Daily_Progress_System SHALL restore the saved form data from local storage
3. WHEN a Progress_Entry is successfully submitted, THE Daily_Progress_System SHALL clear the locally saved form data
4. IF the browser crashes or is closed, THEN THE Daily_Progress_System SHALL restore the form state when the Member reopens the form within 24 hours
5. THE Daily_Progress_System SHALL display a "Draft Saved" indicator when form data is persisted to local storage
6. WHEN form data is older than 24 hours, THE Daily_Progress_System SHALL clear it and start with a fresh form

### Requirement 10: Performance and Scalability

**User Story:** As a member, I want the real-time updates to be fast and responsive, so that my experience remains smooth even when many members are using the system.

#### Acceptance Criteria

1. THE Daily_Progress_System SHALL limit Supabase_Realtime subscriptions to only the authenticated Member's own data
2. THE Dashboard SHALL debounce rapid consecutive updates to render at most once every 500 milliseconds
3. THE Daily_Progress_System SHALL use React Query or similar caching to avoid redundant data fetches
4. WHEN the Dashboard receives a Real_Time_Update, THE Daily_Progress_System SHALL update only the affected UI components, not the entire page
5. THE Daily_Progress_System SHALL maintain UI responsiveness with no more than 100 milliseconds delay for user interactions during real-time updates
6. THE Dashboard SHALL display no more than 30 days of historical metric data by default to optimize rendering performance

