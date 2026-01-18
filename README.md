# News Portal Frontend

This is the **frontend application** for the News Portal project, built with **Next.js** and focused on consuming the backend APIs to deliver a functional news reading and management experience.

The primary goal of this frontend was to ensure **correct functionality, API integration, and data flow** within a limited timeframe.

---

## Tech Stack

- **Framework:** Next.js `16.0.10`
- **UI Components:** shadcn/ui
- **State & Data Fetching:** TanStack Query (React Query)
- **Styling:** Tailwind CSS
- **HTTP Client:** Fetch API
- **Deployment:** Vercel

---

## Features

- View all published news articles
- View single news details
- Admin login
- Create, update, and delete news (admin only)
- Image upload support (handled via backend & Cloudinary)
- API state management using TanStack Query
- Client-side routing with Next.js App Router

---

## Live Demo

**Frontend Live URL:**
[https://news-portal-client-plum.vercel.app/](https://news-portal-client-plum.vercel.app/)

---

## Backend Integration

This frontend consumes APIs from the NestJS backend.

- **Backend Live URL:**
  [https://news-portal-server-murp.onrender.com](https://news-portal-server-murp.onrender.com)

- **Postman API Documentation:**
  [https://documenter.getpostman.com/view/39865293/2sBXVhErWy](https://documenter.getpostman.com/view/39865293/2sBXVhErWy)

---

## Project Structure

```txt
src/
├─ app/                # App Router pages
├─ components/         # Reusable UI components
├─ lib/                # Utilities and helpers
```

---

## Setup & Installation

### 1️⃣ Clone Repository

```bash
git clone <repository-url>
cd news_portal_client
```

### 2️⃣ Install Dependencies

```bash
npm install
```

### 3️⃣ Run Development Server

```bash
npm run dev
```

The app will run at `http://localhost:3000`.

---

## Notes

- The UI is intentionally kept **minimal** to prioritize **functionality and API integration**.
- With additional time, the design can be significantly enhanced while maintaining the same architecture.
- The project demonstrates **clean separation of concerns**, proper data fetching patterns, and real-world backend integration.

---

## Future Improvements

- Enhanced UI/UX design
- Better responsive layout
- Pagination and search
- Role-based UI rendering
- SEO optimization

---

## License

MIT © Sahed Rahman
