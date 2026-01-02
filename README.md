# Betalift

Betalift is a collaborative platform designed to connect users, manage projects, and facilitate feedback and communication. 

- User authentication and profile management
- Project creation, membership, and requests
- Feedback system with comments and votes
- Messaging between users
- Notifications
- Modern UI with reusable components

## Project Structure

- `mobile/` — React Native app (Expo)
- `server/` — Node.js/Express backend
- `docs/` — Documentation and project notes

## Getting Started

### Prerequisites
- Node.js (v18+ recommended)
- npm or yarn
- Expo CLI (for mobile)

### Setup

1. **Clone the repository:**
   ```sh
   git clone https://github.com/nyambogahezron/betalift.git
   cd betalift
   ```
2. **Install dependencies:**
   - For mobile:
     ```sh
     cd mobile && npm install
     # or yarn install
     ```
   - For server:
     ```sh
     cd ../server && npm install
     # or yarn install
     ```
3. **Start the development servers:**
   - Mobile: `npm start` (in `mobile/`)
   - Server: `npm run dev` (in `server/`)

## Contributing

See [CONTRIBUTING.md](CONTRIBUTING.md) for guidelines.

## License

This project is licensed under the MIT License. See [LICENSE](LICENSE) for details.
