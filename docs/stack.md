# CarPool Technology Stack

This document outlines the current libraries, frameworks, and technologies utilized in the CarPool project, based directly on `package.json` configurations and repository structure.

## Frontend Stack
Located in the `/frontend` directory.

### Core
- **Framework:** React 19 (`react`, `react-dom`)
- **Build Tool / Bundler:** Vite (`vite`, `@vitejs/plugin-react`)
- **Routing:** React Router v7 (`react-router-dom`)
- **HTTP Client:** Axios (`axios`)

### Styling & UI
- **CSS Framework:** Tailwind CSS (`tailwindcss`, `postcss`, `autoprefixer`)
- **Animations:** Framer Motion (`framer-motion`)
- **Icons:** Lucide React (`lucide-react`)
- **Notifications:** React Hot Toast (`react-hot-toast`)

### Mapping & Geolocation
- **Map Rendering:** Leaflet (`leaflet`)
- **React Bindings:** React Leaflet (`react-leaflet`)
- **Routing Engine API:** OSRM (Open Source Routing Machine)
- **Search / Geocoding API:** Nominatim

### Real-Time Client
- **WebSockets:** Socket.io Client (`socket.io-client`)

---

## Backend Stack
Located in the `/backend` directory.

### Core
- **Runtime:** Node.js
- **Web Framework:** Express.js 5.2.x (`express`)
- **Environment Variables:** Dotenv (`dotenv`)
- **CORS Middleware:** CORS (`cors`)
- **Development Monitor:** Nodemon (`nodemon`)

### Database & ORM
- **Database:** MongoDB
- **Object Data Modeling:** Mongoose 9.6.x (`mongoose`)

### Security & Authentication
- **Password Hashing:** Bcrypt.js (`bcryptjs`)
- **Token Generation/Validation:** JSON Web Tokens (`jsonwebtoken`)

### Real-Time Server
- **WebSockets:** Socket.io Server (`socket.io`)

### API Communication (Server-Side)
- **HTTP Client:** Axios (`axios`) — used in backend controllers (e.g., fetching pricing data or geocoding if necessary).
