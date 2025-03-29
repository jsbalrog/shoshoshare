# ShoshoShare

An AI-powered social media scheduler SaaS platform built with Remix, React, and Tailwind CSS.

## Features

- 📅 Interactive calendar interface for post scheduling
- 🤖 AI-powered content suggestions
- 📱 Multi-platform support (Twitter, Facebook, Instagram, LinkedIn)
- 🎨 Modern, responsive UI with dark mode support
- 📊 Analytics dashboard (coming soon)
- 🔒 Secure user authentication (coming soon)
- 💳 Subscription management (coming soon)

## Tech Stack

- **Framework**: Remix
- **UI**: React + Tailwind CSS
- **Animations**: Framer Motion
- **Database**: SQLite with Prisma ORM
- **Deployment**: Fly.io
- **CI/CD**: GitHub Actions

## Getting Started

### Prerequisites

- Node.js 18 or later
- npm or yarn

### Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/jsbalrog/shoshoshare.git
   cd shoshoshare
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Start the development server:
   ```bash
   npm run dev
   ```

4. Open [http://localhost:5173](http://localhost:5173) in your browser.

## Project Structure

```
app/
├── components/         # Reusable UI components
│   ├── calendar/      # Calendar-related components
│   └── ui/           # Base UI components
├── lib/              # Utility functions and shared code
├── routes/           # Application routes
└── styles/           # Global styles
```

## Development

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm start` - Start production server
- `npm run typecheck` - Run TypeScript type checking
- `npm run lint` - Run ESLint

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Acknowledgments

- [Remix](https://remix.run/) - Full stack web framework
- [Tailwind CSS](https://tailwindcss.com/) - Utility-first CSS framework
- [Framer Motion](https://www.framer.com/motion/) - Animation library
- [Prisma](https://www.prisma.io/) - Database ORM
