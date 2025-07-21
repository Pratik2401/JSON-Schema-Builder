
# JSON Schema Builder


This project is a professional, dynamic JSON Schema Builder built entirely with React, Redux, and Ant Design. It is a frontend-only application (no backend/server code). Users can visually create, edit, and preview JSON schemas with support for nested fields, various data types, and real-time JSON output—all in the browser.

## Features

- Add, edit, and remove fields dynamically
- Support for String, Number, Boolean, Null, Array, and Nested types
- Recursively add nested fields for complex schemas
- Real-time JSON preview panel
- Responsive layout (desktop and mobile)
- Debounced updates for smooth editing
- Built with React, Redux, and Ant Design

## Getting Started

### Prerequisites
- Node.js (v18 or higher recommended)
- npm

### Installation
1. Clone the repository:
   ```sh
   git clone <your-repo-url>
   cd HROne
   ```
2. Install dependencies:
   ```sh
   npm install
   ```
3. Start the development server:
   ```sh
   npm run dev
   ```
4. Open [http://localhost:5173](http://localhost:5173) in your browser.

## Usage

- Use the **Builder** panel to add fields, select types, and nest fields as needed.
- The **JSON Output** panel updates in real time to reflect your schema.
- Use the Add, Delete, and Sibling buttons to manage your schema structure.

## Project Structure

- `src/components/FieldRow.jsx` - Component for each schema field (supports nesting)
- `src/components/SchemaBuilder.jsx` - Main builder and layout
- `src/redux/schemaSlice.js` - Redux logic for schema state
- `src/utils/schemaUtils.js` - Utility for building the output JSON
