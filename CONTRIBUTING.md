# Contributing to ScreenForge 🎬

First off, thank you for considering contributing to ScreenForge! It's people like you that make open source such a great community.

## Code of Conduct

Be respectful, constructive, and inclusive. We follow the [Contributor Covenant](https://www.contributor-covenant.org/) Code of Conduct.

## Getting Started

### Prerequisites

- Node.js >= 18.0.0
- npm >= 9.0.0
- FFmpeg (for video export functionality)

### Development Setup

```bash
# Clone the repository
git clone https://github.com/gitstq/ScreenForge.git
cd ScreenForge

# Install dependencies
npm install

# Start development server
npm run dev
```

## How to Contribute

### Reporting Bugs

1. Check if the bug has already been reported in [Issues](https://github.com/gitstq/ScreenForge/issues)
2. If not, create a new issue with:
   - Clear title and description
   - Steps to reproduce
   - Expected vs actual behavior
   - Screenshots if applicable
   - Your OS and app version

### Suggesting Features

1. Open an issue with the `[Feature Request]` label
2. Describe the feature and its use case
3. Explain why it would benefit most users

### Submitting Pull Requests

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/your-feature-name`
3. Make your changes
4. Write/update tests if applicable
5. Ensure all checks pass: `npm run typecheck && npm run lint`
6. Commit with conventional commit messages:
   - `feat: add new feature`
   - `fix: fix a bug`
   - `docs: update documentation`
   - `refactor: code refactoring`
   - `style: formatting changes`
   - `test: add/update tests`
7. Push to your fork: `git push origin feature/your-feature-name`
8. Open a Pull Request

### Commit Message Format

We follow the [Conventional Commits](https://www.conventionalcommits.org/) specification:

```
<type>(<scope>): <description>

[optional body]

[optional footer]
```

Types: `feat`, `fix`, `docs`, `style`, `refactor`, `perf`, `test`, `build`, `ci`, `chore`, `revert`

## Project Structure

```
ScreenForge/
├── src/
│   ├── main/          # Electron main process
│   │   ├── main.ts    # Main entry point
│   │   ├── recorder.ts # Recording engine
│   │   ├── exporter.ts # Video export engine
│   │   ├── ai-zoom.ts  # AI zoom analyzer
│   │   └── settings.ts # Settings manager
│   ├── preload/       # Preload scripts
│   │   └── preload.ts
│   ├── renderer/      # React frontend
│   │   ├── components/ # UI components
│   │   ├── hooks/     # Custom hooks
│   │   ├── context/   # React context
│   │   └── utils/     # Utility functions
│   └── types/         # TypeScript types
├── resources/         # App resources (icons, etc.)
├── package.json
└── README.md
```

## Coding Standards

- TypeScript strict mode
- React functional components with hooks
- Tailwind CSS for styling
- Clear, descriptive variable and function names
- Comments in English
- No `any` type unless absolutely necessary

## Questions?

Feel free to open an issue with the `[Question]` label. We're happy to help!

Thank you for your contributions! 🙌
