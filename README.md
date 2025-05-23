# React TypeScript Note App

A modern note-taking application built with React and TypeScript that supports Markdown formatting for enhanced text editing and organization.

## Features

- Create, edit, and delete notes
- Rich text formatting using Markdown
- Real-time preview of Markdown content
- Responsive design that works on all devices
- Automatic note saving
- UUID-based note identification
- Clean and modern UI using Tailwind CSS
- Lucide icons for better visual feedback

## Tech Stack

- **Frontend Framework**: React 18
- **Type Safety**: TypeScript
- **Build Tool**: Vite
- **Styling**: Tailwind CSS
- **Markdown Rendering**: React-Markdown
- **Icon Library**: Lucide React
- **UUID Generation**: UUID

## Getting Started

### Prerequisites

- Node.js (v14 or higher)
- npm or yarn package manager

### Installation

1. Clone the repository:
```bash
git clone https://github.com/kumarohan0115/Mark-Down-Note-App.git
cd Mark-Down-Note-App
```

2. Install dependencies:
```bash
npm install
# or
yarn install
```

3. Start the development server:
```bash
npm run dev
# or
yarn dev
```

The application will be available at `http://localhost:5173`

### Building for Production

To create a production build:
```bash
npm run build
# or
yarn build
```

To preview the production build:
```bash
npm run preview
# or
yarn preview
```

## Project Structure

```
src/
├── components/     # Reusable UI components
├── contexts/       # React Contexts for state management
├── services/       # Service layer for business logic
├── types/          # TypeScript type definitions
├── App.tsx         # Main application component
└── main.tsx        # Entry point
```

## Usage

1. **Create Notes**:
   - Click the "+" button to create a new note
   - Each note is automatically assigned a unique UUID

2. **Edit Notes**:
   - Use Markdown syntax to format your text
   - Changes are saved automatically as you type
   - View real-time preview of your Markdown content

3. **Delete Notes**:
   - Click the trash icon to delete a note
   - Deleted notes cannot be recovered

## License

This project is licensed under the MIT License - see the LICENSE file for details

## Contact

Name: Rohan Kumar
Email: rohankr350@gmail.com

Project Link: [https://github.com/kumarohan0115/Mark-Down-Note-App](https://github.com/kumarohan0115/Mark-Down-Note-App)