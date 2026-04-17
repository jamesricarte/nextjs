<wizard-report>
# PostHog post-wizard report

The wizard has completed a deep integration of PostHog analytics into your DevEvent Next.js App Router project. PostHog is initialized via `instrumentation-client.ts` (the recommended approach for Next.js 15.3+), with automatic exception capture enabled. Ingestion is routed through a reverse proxy (`/ingest`) configured in `next.config.ts` to improve ad-blocker resilience. Three client-side events were instrumented across the key interactive components.

| Event | Description | File |
|---|---|---|
| `explore_events_clicked` | User clicks the "Explore Events" CTA button — top of the discovery funnel | `components/ExploreBtn.tsx` |
| `event_card_clicked` | User clicks an event card to view details — includes `event_title`, `event_slug`, `event_location`, `event_date` properties | `components/EventCard.tsx` |
| `nav_link_clicked` | User clicks a navigation link — includes `nav_label` property | `components/Navbar.tsx` |

## Next steps

We've built some insights and a dashboard for you to keep an eye on user behavior, based on the events we just instrumented:

- **Dashboard — Analytics basics**: https://us.posthog.com/project/384889/dashboard/1475766
- **Discovery Funnel: Explore → Event Click**: https://us.posthog.com/project/384889/insights/54T5GsVG
- **Explore Events Button Clicks**: https://us.posthog.com/project/384889/insights/ZScIIJPb
- **Most Clicked Events** (breakdown by event title): https://us.posthog.com/project/384889/insights/4UQTAwwe
- **Event Card Clicks Over Time**: https://us.posthog.com/project/384889/insights/EXL2EzSA
- **Nav Link Clicks by Label**: https://us.posthog.com/project/384889/insights/6rjYBCQ6

### Agent skill

We've left an agent skill folder in your project. You can use this context for further agent development when using Claude Code. This will help ensure the model provides the most up-to-date approaches for integrating PostHog.

</wizard-report>
