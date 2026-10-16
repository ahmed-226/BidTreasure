# AGENTS.md

## Project mission

BidTreasure is a React/Vite client for an auction marketplace. It supports browsing auctions, live/manual bidding, auto-bidding, Buy It Now, watchlists, seller listings, user dashboards, messaging, seller verification, reviews/ratings, disputes, shipping details, and notifications.

This repository is currently a **client-side demonstration**. It does not contain a server, database, migrations, API routes, authentication service, WebSocket server, payment integration, or persistent file storage. Most data is mocked in React components and persisted only in browser `localStorage`. The next major task is to introduce a real backend without breaking the current UI behavior.

## Current stack

- JavaScript, JSX, and CSS
- React 19 with functional components and hooks
- Vite 7
- React Router DOM 7
- Tailwind CSS 3 with PostCSS/autoprefixer
- React Context API for global client state
- Axios is installed but currently not used as a complete API layer
- `lucide-react` for icons
- `emoji-picker-react` for chat input
- ESLint 9

## Run and validate the client

```bash
npm install
npm run dev
npm run lint
npm run build
npm run preview
```

The Vite base path is `/BidTreasure/` in `vite.config.js`, because the client is configured for GitHub Pages deployment. Be careful when adding API URLs or changing routing: local development, GitHub Pages, and a future deployed frontend may have different origins.

## Repository map

```text
index.html                 HTML shell; mounts #root and loads src/main.jsx
src/main.jsx               React entry point; StrictMode and global CSS
src/App.jsx                Providers, top-level routes, demo user/auth state
src/contexts/
  AuctionContext.jsx        Mock auctions, bids, auto-bids, watchlist, notifications
  MessagingContext.jsx      Mock conversations, messages, unread state, notifications
src/pages/
  Homepage.jsx              Marketplace landing page
  SearchResults.jsx         Search/filter result experience
  AuctionDetails.jsx        Item detail page, seller info, Q&A, bidding UI
  SellPage.jsx              Six-step listing flow and local draft storage
  UserDashboard.jsx         Dashboard tabs, stats, bids, wins, listings, trust, settings
  UserProfile.jsx           Profile/account UI
  MessagesPage.jsx          Messaging page wrapper
src/components/auction/     Live bidding panel, bid history, auction notifications
src/components/auth/        Login, registration, auth container
src/components/dashboard/   Overview, bids, wins, listings, watchlist, settings, create listing
src/components/layout/      Navbar and footer
src/components/messaging/   Chat, conversations, seller contact, Q&A, notifications
src/components/sell/        Category/details/pricing/duration/shipping/review steps
src/components/              Trust, seller verification, badges, ratings, disputes
assets/                     README screenshots and design references
public/                     Static Vite assets
```

## Application wiring

`src/App.jsx` is the authoritative route and provider composition:

- `AuctionProvider` wraps the application and exposes auction state/actions.
- `MessagingProvider` wraps the router and exposes conversations/actions.
- `BrowserRouter` owns client navigation.
- `/`, `/search`, `/auction/:id`, `/sell`, `/messages`, `/dashboard`, `/profile`, `/seller-verification`, `/seller/:sellerId/reviews`, and `/disputes` are the current routes.
- `/messages`, `/dashboard`, and `/profile` are guarded only by the presence of the local `user` object. This is not real authorization.
- The initial user is hard-coded as `current_user` / John Doe in `App.jsx`; login and registration currently wait briefly and call callbacks rather than contacting a server.

When replacing mock behavior, preserve these route paths and component responsibilities unless a deliberate migration is documented.

## Existing client data contracts to preserve or formalize

### Auction/listing

The client expects auction-like objects with fields such as:

- `id`, `title`, `description`, `images`
- `currentBid`, `startingBid`, `reservePrice`, `reserveMet`, `bidIncrement`, `buyItNowPrice`
- `endDate`, `timeRemaining`, `isActive`, `bidCount`, `watchCount`, `viewCount`
- `category`, `condition`, `location`, `shipping`
- `seller` with display name, rating, feedback count, verification/top-rated flags
- `specifications`, `features`, and `bidHistory`

The sell flow collects a larger listing payload: category/subcategory/item type, title/description/condition, brand/model, images, listing type, starting/reserve/Buy It Now prices, duration/scheduled start, auto-relist, domestic/international shipping, location, specifications, custom attributes, return policy, warranty, authenticity, tags, and SEO fields.

### Bids and auction actions

`AuctionContext.jsx` exposes behavior that the backend must eventually make authoritative:

- `placeBid(auctionId, bidAmount)`
- `setAutoBid(auctionId, maxAmount)`
- `buyItNow(auctionId)`
- `toggleWatchAuction(auctionId)`
- `getAuction`, `getUserBidForAuction`, `isAuctionWatched`
- auction and notification retrieval/read operations

Do not trust the browser for bid amounts, auction status, reserve status, winner selection, auto-bid limits, or Buy It Now completion. Those must be checked transactionally on the server.

### Messaging

`MessagingContext.jsx` models conversations with:

- participant identity and avatar/rating
- related `itemId`, `itemTitle`, and `itemImage`
- `lastMessage`, `messages`, `unreadCount`
- `type`, `status`, `isStarred`, and `isArchived`

Messages support text and file metadata. Browser `URL.createObjectURL()` is currently used for attachments and must be replaced with real upload/storage URLs.

### Users, trust, and transactions

The UI references authentication, email verification, seller verification, seller badges, trust scores, reviews/ratings, disputes, payment status, shipping status, and newsletter subscription. Treat these as separate server-side concepts rather than trusting fields supplied by the client.

## Recommended backend boundary

Build the server as a separate application or clearly isolated server directory. Keep the frontend focused on presentation and API calls. Recommended initial modules:

1. **Auth and users**: registration, login/logout, refresh/session handling, email verification, password reset, profile updates, optional social login.
2. **Listings and media**: draft/publish/update/delete listing, image upload, validation, categories, shipping/return policy.
3. **Auctions**: auction lifecycle, bid history, minimum increment, reserve price, scheduled start/end, winner determination, Buy It Now.
4. **Auto-bidding**: server-side max limits and deterministic bid ordering; never implement this as a client timer.
5. **Watchlists and dashboard**: bids, wins, active listings, watchlist, activity, statistics.
6. **Messaging and Q&A**: conversations, messages, attachments, unread counts, moderation/reporting.
7. **Trust and disputes**: verification state, badges, ratings, reviews, dispute lifecycle.
8. **Orders/payments/shipping**: payment provider integration, payment webhooks, fulfillment and tracking state.
9. **Notifications**: in-app notifications plus email/push integration later.

Prefer versioned API routes such as `/api/v1/auth`, `/api/v1/listings`, `/api/v1/auctions`, `/api/v1/bids`, `/api/v1/messages`, `/api/v1/users`, `/api/v1/reviews`, `/api/v1/disputes`, `/api/v1/orders`, and `/api/v1/notifications`.

## Important server invariants

- A bid must be accepted only if the auction is open, the user is authorized, the amount meets the current minimum, and the request is processed atomically.
- Use database transactions and locking/serialization for competing bids. A client-reported `currentBid` is never authoritative.
- Store money as integer minor units (for example cents) plus an explicit currency; do not use floating-point values for financial calculations.
- Store timestamps in UTC and compute display countdowns in the client.
- Define the exact auction-ending rule, including whether bids in the final seconds extend the auction.
- Define deterministic tie-breaking for bids with equal timestamps/amounts.
- A Buy It Now operation must atomically verify availability, reserve the item, create the order, and end/cancel the auction.
- Auto-bid limits are private user data. Never return another bidder's maximum limit.
- Enforce seller ownership for listing edits, auction management, and uploaded media.
- Enforce buyer/seller permissions on conversations, Q&A, reviews, disputes, and order details.
- Do not mark payment as successful based on a frontend callback; use verified payment-provider webhooks.
- Make mutation endpoints idempotent where retries are possible, especially bids, Buy It Now, listing publish, payments, and message sends.
- Add rate limits and abuse protection for login, registration, password reset, bidding, messaging, uploads, and Q&A.

## Suggested API/client integration pattern

Create a small frontend API layer rather than calling Axios directly throughout JSX. For example:

```text
src/api/client.js          Axios instance, base URL, auth headers, error normalization
src/api/auth.js            login/register/logout/session/profile calls
src/api/auctions.js        listing/auction/bid/watchlist calls
src/api/messages.js        conversations/messages/upload calls
src/api/dashboard.js       dashboard summary and user activity calls
src/api/trust.js           verification/reviews/disputes calls
```

Then progressively replace mock actions in `AuctionContext`, `MessagingContext`, `SellPage`, `UserDashboard`, `AuctionDetails`, `Login`, and `Register`. Keep loading, empty, validation, unauthorized, conflict, and server-error states visible in the UI.

Use an environment variable for the API origin, for example `VITE_API_BASE_URL`; never commit credentials or secrets. Configure CORS, cookies/tokens, CSRF protection, and deployment origins explicitly.

## Real-time requirements

The README promises live bidding, real-time notifications, and messaging, but the current implementation simulates them with `setInterval`, `Math.random()`, and local state. Replace those simulations with:

- WebSocket or Server-Sent Events channels for auction updates and notifications.
- A server event for accepted bids, outbid events, auction ending, Buy It Now, and auto-bid activity.
- A real-time messaging channel or polling fallback for conversation updates.
- Reconnection, missed-event recovery, and REST refetch after reconnect.

The server must remain authoritative even when the client is offline or reconnecting.

## Known demo-only behavior and migration traps

- `AuctionContext.jsx` seeds two mock auctions and stores bids/watchlist/notifications in `localStorage`.
- `MessagingContext.jsx` seeds a mock conversation and stores conversations/notifications in `localStorage`.
- `AuctionDetails.jsx` and `LiveBiddingPanel.jsx` each contain their own mock auction and bidding logic; they are not a single source of truth.
- Some mock dates are fixed in the past, so demo countdowns can immediately show an ended auction.
- `SellPage.jsx` stores drafts under `bidtreasure_drafts` and simulates publishing with a timeout before navigating to `/dashboard?tab=my-listings&success=listing-created`.
- `CreateListingModal.jsx` previews uploads with object URLs and returns preview URLs, not persistent media.
- `ChatWindow.jsx` simulates incoming messages and uses object URLs for files.
- `UserDashboard.jsx` uses hard-coded statistics/activity/notifications.
- Login and registration only validate locally and call parent callbacks; they do not authenticate.
- `App.jsx` uses a hard-coded user and console logging for seller-verification completion.
- Some components use direct `alert`, `console.log`, and DOM-created notifications. Replace these with a consistent error/toast system as the API is integrated.
- `axios` is installed but there is no established request/response abstraction yet.
- README badges and text mention React 18, while `package.json` uses React 19. Treat `package.json` and lockfile as authoritative.

## Working rules for agents

- Read the relevant page, context, and component before changing an API contract.
- Preserve existing route names, query-tab names, and field names during the first backend integration unless a migration is intentional.
- Prefer small, vertical slices: one server endpoint, its validation/auth rules, one API client function, and the corresponding UI loading/error state.
- Keep server validation stricter than client validation. Client validation is for UX only.
- Never put secrets, payment credentials, JWT signing keys, database URLs, or private upload credentials in the frontend.
- Do not use mock/random timers to represent production auction behavior after a feature is connected to the server.
- Add tests for authorization, validation, bid concurrency, auction transitions, auto-bid behavior, Buy It Now races, and payment webhook idempotency.
- Update this file when the backend stack, API conventions, local setup, or authentication model changes.

## Skills the personal agent should have

Prioritize these skills for work on the server:

1. Node.js backend development with the chosen framework (Express, Fastify, NestJS, or equivalent).
2. REST API design, versioning, pagination, filtering, validation, and consistent error responses.
3. Relational database modeling and migrations for users, listings, auctions, bids, auto-bids, watchlists, messages, reviews, disputes, orders, payments, and notifications.
4. Transaction isolation, row locking, optimistic concurrency, idempotency keys, and race-condition testing for auctions.
5. Authentication and authorization: secure password hashing, sessions or short-lived access tokens with refresh tokens, email verification, password reset, RBAC/ownership checks, CSRF/CORS, and rate limiting.
6. WebSockets/SSE and reconnect-safe event delivery.
7. Object storage and secure image/file upload workflows with MIME/size validation and signed URLs.
8. Payment integration and webhook verification; never rely on client-side payment success.
9. Background jobs/queues for auction closing, notifications, email, image processing, and cleanup.
10. Automated testing: unit, integration, API, concurrency, security, and end-to-end tests.
11. Observability: structured logs, request IDs, metrics, error tracking, audit logs, and health/readiness endpoints.
12. React integration: Context migration, Axios interceptors, query caching, optimistic UI, loading/error states, and WebSocket subscription cleanup.
13. Deployment and operations: environment management, database backups, migrations in CI/CD, HTTPS, secrets management, CORS origins, and separate staging/production configuration.

## First implementation milestones

1. Choose and document the backend stack, database, deployment target, and authentication strategy.
2. Add environment configuration and a health endpoint.
3. Implement users/authentication and replace the hard-coded `App.jsx` user.
4. Implement listing read endpoints and connect `Homepage`, `SearchResults`, and `AuctionDetails`.
5. Implement listing creation/drafts/media upload and connect `SellPage`.
6. Implement transactional manual bidding and bid history.
7. Implement server-side auto-bidding, auction closing, and real-time auction events.
8. Connect dashboard tabs to server data, then messaging/Q&A.
9. Add payments/orders/shipping, verification, reviews, and disputes with explicit state machines.
10. Add CI tests, security checks, observability, and deployment documentation.
