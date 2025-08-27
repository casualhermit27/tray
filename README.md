# Trayyy - Simple File Processing Tools

A clean, minimal file processing platform with a focus on simplicity and user experience.

## Features

- **5 Tray Categories**: Documents, Data, Media, Web, and AI Assist
- **Consistent UX**: Every tool follows the same pattern (upload → process → result)
- **Minimal Design**: Clean, centered layouts with subtle animations
- **File Support**: PDF, images, CSV, Excel, JSON, HTML, and text files
- **Real-time Processing**: Progress tracking and status updates

## Tech Stack

- **Framework**: Next.js 14 with App Router
- **Styling**: Tailwind CSS with custom design system
- **UI Components**: shadcn/ui + Radix UI primitives
- **Animations**: Framer Motion
- **State Management**: Zustand
- **File Handling**: React Dropzone
- **Icons**: Lucide React

## Design System

### Typography
- **Headings**: Satoshi (semi-bold, modern)
- **Body**: Inter (regular, airy spacing)
- **Line-height**: 1.6+ for readability

### Colors
- **Background**: Warm white (#fafafa) / Dark (#111111)
- **Text**: Deep gray (#111111) / Light (#f5f5f5)
- **Borders**: Subtle gray (#e5e5e5)
- **Hover**: Light tint (#f9f9f9)

### Components
- **Buttons**: Ghost style with border radius 12px
- **Cards**: Soft shadows, 16px rounded corners, generous padding
- **Spacing**: Whitespace-driven design with breathing room

## Getting Started

### Prerequisites
- Node.js 18+ 
- npm or yarn

### Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd trayyy
```

2. Install dependencies:
```bash
npm install
```

3. Run the development server:
```bash
npm run dev
```

4. Open [http://localhost:3000](http://localhost:3000) in your browser.

### Build for Production

```bash
npm run build
npm start
```

## Project Structure

```
trayyy/
├── app/                    # Next.js App Router
│   ├── dashboard/         # Dashboard page
│   ├── tool/             # Tool processing page
│   ├── globals.css       # Global styles and design tokens
│   ├── layout.tsx        # Root layout
│   ├── main.tsx          # Main app component
│   └── page.tsx          # Landing page
├── components/            # Reusable UI components
├── data/                  # Static data (trays, tools)
├── lib/                   # Utility functions
├── store/                 # Zustand state management
├── types/                 # TypeScript type definitions
└── public/                # Static assets
```

## Usage Flow

1. **Landing Page**: View tray categories and click "Start Free"
2. **Dashboard**: Select a tray to see available tools
3. **Tool Page**: Upload files, configure options, and process
4. **Results**: Download processed files and view metadata

## Tray Categories

### 📄 Documents
- Merge PDFs
- Compress PDFs
- Extract pages

### 📊 Data
- Excel to CSV conversion
- CSV to JSON conversion
- JSON formatting

### 🖼️ Media
- Image compression
- Format conversion
- OCR text extraction

### 🌐 Web
- HTML to Markdown
- Text extraction
- URL screenshots

### 🤖 AI Assist
- Text summarization
- Content cleaning
- Smart information extraction

## Customization

### Adding New Tools
1. Update `data/trays.ts` with new tool definitions
2. Add tool options and configuration
3. Implement processing logic in the tool page

### Styling
- Modify `app/globals.css` for design tokens
- Update `tailwind.config.js` for custom utilities
- Use the existing component classes for consistency

### State Management
- Extend the Zustand store in `store/index.ts`
- Add new actions and state properties as needed

## Performance Features

- **Code Splitting**: Automatic with Next.js
- **Image Optimization**: Built-in Next.js image handling
- **Lazy Loading**: Components load on demand
- **Efficient Animations**: Framer Motion with proper cleanup

## Browser Support

- Chrome 90+
- Firefox 88+
- Safari 14+
- Edge 90+

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## License

MIT License - see LICENSE file for details

## Support

For questions or issues, please open a GitHub issue or contact the development team.
