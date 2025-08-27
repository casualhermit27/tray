import { Tray } from '@/types'

export const trays: Tray[] = [
  {
    id: 'documents',
    name: 'Documents',
    description: 'Merge, compress, and extract files',
    icon: '📂',
    color: 'blue',
    tools: [
      {
        id: 'pdf-to-other',
        name: 'PDF to Other Formats',
        description: 'Convert PDFs to various formats',
        icon: '📄',
        trayId: 'documents',
        planRequired: 'free',
        options: [
          {
            id: 'target-format',
            name: 'Target Format',
            type: 'select',
            defaultValue: 'docx',
            options: ['docx', 'xlsx', 'txt', 'html', 'markdown', 'images']
          },
          {
            id: 'ocr-enabled',
            name: 'OCR Enabled',
            type: 'toggle',
            defaultValue: false
          },
          {
            id: 'preserve-formatting',
            name: 'Preserve Formatting',
            type: 'toggle',
            defaultValue: true
          }
        ]
      },
      {
        id: 'other-to-pdf',
        name: 'Other Formats to PDF',
        description: 'Convert various formats to PDF',
        icon: '📄',
        trayId: 'documents',
        planRequired: 'free',
        options: [
          {
            id: 'source-format',
            name: 'Source Format',
            type: 'select',
            defaultValue: 'docx',
            options: ['docx', 'xlsx', 'txt', 'html', 'markdown', 'images']
          },
          {
            id: 'page-size',
            name: 'Page Size',
            type: 'select',
            defaultValue: 'a4',
            options: ['a4', 'letter', 'legal', 'a3']
          },
          {
            id: 'orientation',
            name: 'Orientation',
            type: 'select',
            defaultValue: 'portrait',
            options: ['portrait', 'landscape']
          }
        ]
      },
      {
        id: 'pdf-merge',
        name: 'PDF Merge',
        description: 'Combine multiple PDFs into one file',
        icon: '🔗',
        trayId: 'documents',
        planRequired: 'free',
        options: [
          {
            id: 'reorder-mode',
            name: 'Reorder Mode',
            type: 'select',
            defaultValue: 'drag',
            options: ['drag', 'name', 'date']
          },
          {
            id: 'insert-blank-pages',
            name: 'Insert Blank Pages',
            type: 'toggle',
            defaultValue: false
          },
          {
            id: 'output-mode',
            name: 'Output Mode',
            type: 'select',
            defaultValue: 'single',
            options: ['single', 'sections']
          }
        ]
      },
      {
        id: 'pdf-split',
        name: 'PDF Split',
        description: 'Split PDFs by pages or ranges',
        icon: '✂️',
        trayId: 'documents',
        planRequired: 'free',
        options: [
          {
            id: 'split-mode',
            name: 'Split Mode',
            type: 'select',
            defaultValue: 'page-range',
            options: ['page-range', 'odd-even', 'custom-intervals']
          },
          {
            id: 'page-range',
            name: 'Page Range',
            type: 'input',
            defaultValue: '',
            placeholder: 'e.g., 1-3, 5, 7-9'
          },
          {
            id: 'output-format',
            name: 'Output Format',
            type: 'select',
            defaultValue: 'pdf',
            options: ['pdf', 'images']
          }
        ]
      },
      {
        id: 'pdf-compress',
        name: 'PDF Compress',
        description: 'Reduce PDF file size',
        icon: '🗜️',
        trayId: 'documents',
        planRequired: 'free',
        options: [
          {
            id: 'compression-level',
            name: 'Compression Level',
            type: 'select',
            defaultValue: 'balanced',
            options: ['high-quality', 'balanced', 'max-compression']
          },
          {
            id: 'batch-mode',
            name: 'Batch Compression',
            type: 'toggle',
            defaultValue: false
          }
        ]
      },
      {
        id: 'pdf-unlock',
        name: 'PDF Unlock',
        description: 'Remove PDF password protection',
        icon: '🔓',
        trayId: 'documents',
        planRequired: 'pro',
        options: [
          {
            id: 'password-input',
            name: 'Password (if known)',
            type: 'input',
            defaultValue: '',
            placeholder: 'Enter password if you know it'
          },
          {
            id: 'brute-force',
            name: 'Brute Force (if unknown)',
            type: 'toggle',
            defaultValue: false
          },
          {
            id: 'output-format',
            name: 'Output Format',
            type: 'select',
            defaultValue: 'pdf',
            options: ['pdf', 'docx']
          }
        ]
      },
      {
        id: 'pdf-protect',
        name: 'PDF Protect',
        description: 'Add password protection to PDFs',
        icon: '🔐',
        trayId: 'documents',
        planRequired: 'pro',
        options: [
          {
            id: 'password',
            name: 'Password',
            type: 'input',
            defaultValue: '',
            placeholder: 'Enter password'
          },
          {
            id: 'permissions',
            name: 'Permissions',
            type: 'select',
            defaultValue: 'print-copy',
            options: ['print-copy', 'print-only', 'no-print', 'full-access']
          },
          {
            id: 'encryption-level',
            name: 'Encryption Level',
            type: 'select',
            defaultValue: '128-bit',
            options: ['128-bit', '256-bit']
          }
        ]
      },
      {
        id: 'pdf-rotate',
        name: 'PDF Rotate',
        description: 'Rotate PDF pages',
        icon: '🔄',
        trayId: 'documents',
        planRequired: 'free',
        options: [
          {
            id: 'rotation-angle',
            name: 'Rotation Angle',
            type: 'select',
            defaultValue: '90',
            options: ['90', '180', '270']
          },
          {
            id: 'apply-to-all',
            name: 'Apply to All Pages',
            type: 'toggle',
            defaultValue: false
          },
          {
            id: 'preview-changes',
            name: 'Preview Changes',
            type: 'toggle',
            defaultValue: true
          }
        ]
      },
      {
        id: 'pdf-reorder',
        name: 'PDF Reorder Pages',
        description: 'Reorder PDF page sequence',
        icon: '📋',
        trayId: 'documents',
        planRequired: 'free',
        options: [
          {
            id: 'thumbnail-size',
            name: 'Thumbnail Size',
            type: 'select',
            defaultValue: 'medium',
            options: ['small', 'medium', 'large']
          },
          {
            id: 'show-page-numbers',
            name: 'Show Page Numbers',
            type: 'toggle',
            defaultValue: true
          },
          {
            id: 'undo-redo',
            name: 'Undo/Redo Support',
            type: 'toggle',
            defaultValue: true
          }
        ]
      },
      {
        id: 'pdf-extract',
        name: 'PDF Extract Pages',
        description: 'Extract specific pages from PDFs',
        icon: '✂️',
        trayId: 'documents',
        planRequired: 'free',
        options: [
          {
            id: 'page-range',
            name: 'Page Range',
            type: 'input',
            defaultValue: '1-3',
            placeholder: 'e.g., 1-3, 5, 7-9'
          },
          {
            id: 'extract-format',
            name: 'Extract Format',
            type: 'select',
            defaultValue: 'pdf',
            options: ['pdf', 'images']
          },
          {
            id: 'delete-mode',
            name: 'Delete Instead of Extract',
            type: 'toggle',
            defaultValue: false
          }
        ]
      },
      {
        id: 'pdf-watermark',
        name: 'PDF Watermark',
        description: 'Add watermarks to PDFs',
        icon: '💧',
        trayId: 'documents',
        planRequired: 'pro',
        options: [
          {
            id: 'watermark-type',
            name: 'Watermark Type',
            type: 'select',
            defaultValue: 'text',
            options: ['text', 'image']
          },
          {
            id: 'watermark-text',
            name: 'Watermark Text',
            type: 'input',
            defaultValue: 'DRAFT',
            placeholder: 'Enter watermark text'
          },
          {
            id: 'watermark-opacity',
            name: 'Opacity',
            type: 'slider',
            defaultValue: 50,
            min: 10,
            max: 100,
            step: 5
          },
          {
            id: 'watermark-position',
            name: 'Position',
            type: 'select',
            defaultValue: 'center',
            options: ['top-left', 'top-center', 'top-right', 'center', 'bottom-left', 'bottom-center', 'bottom-right']
          }
        ]
      },
      {
        id: 'pdf-edit',
        name: 'PDF Edit (Basic)',
        description: 'Basic PDF editing tools',
        icon: '✏️',
        trayId: 'documents',
        planRequired: 'pro',
        options: [
          {
            id: 'edit-tools',
            name: 'Edit Tools',
            type: 'select',
            defaultValue: 'all',
            options: ['text', 'highlight', 'draw', 'shapes', 'all']
          },
          {
            id: 'preserve-original',
            name: 'Preserve Original',
            type: 'toggle',
            defaultValue: true
          },
          {
            id: 'auto-save',
            name: 'Auto Save',
            type: 'toggle',
            defaultValue: true
          }
        ]
      },
      {
        id: 'pdf-e-sign',
        name: 'PDF E-Sign',
        description: 'Add electronic signatures to PDFs',
        icon: '✍️',
        trayId: 'documents',
        planRequired: 'pro',
        options: [
          {
            id: 'signature-type',
            name: 'Signature Type',
            type: 'select',
            defaultValue: 'typed',
            options: ['typed', 'drawn', 'uploaded']
          },
          {
            id: 'signature-position',
            name: 'Signature Position',
            type: 'select',
            defaultValue: 'auto',
            options: ['auto', 'custom', 'multiple']
          },
          {
            id: 'certificate-verification',
            name: 'Certificate Verification',
            type: 'toggle',
            defaultValue: true
          }
        ]
      },




    ]
  },
  {
    id: 'data',
    name: 'Data',
    description: 'Convert and format data files',
    icon: '📊',
    color: 'green',
    tools: [
      {
        id: 'excel-to-csv',
        name: 'Excel to CSV',
        description: 'Convert Excel files to CSV format',
        icon: '📊',
        trayId: 'data',
        planRequired: 'free',
        options: [
          {
            id: 'sheet-selection',
            name: 'Sheet Selection',
            type: 'select',
            defaultValue: 'first',
            options: ['first', 'all', 'custom']
          },
          {
            id: 'delimiter',
            name: 'Delimiter',
            type: 'select',
            defaultValue: 'comma',
            options: ['comma', 'tab', 'semicolon']
          },
          {
            id: 'formula-mode',
            name: 'Formula Mode',
            type: 'select',
            defaultValue: 'values',
            options: ['formulas', 'values']
          }
        ]
      },
      {
        id: 'csv-to-excel',
        name: 'CSV to Excel',
        description: 'Convert CSV files to Excel format',
        icon: '📊',
        trayId: 'data',
        planRequired: 'free',
        options: [
          {
            id: 'auto-detect-delimiter',
            name: 'Auto-detect Delimiter',
            type: 'toggle',
            defaultValue: true
          },
          {
            id: 'encoding',
            name: 'Encoding',
            type: 'select',
            defaultValue: 'utf-8',
            options: ['utf-8', 'iso-8859-1']
          },
          {
            id: 'single-sheet',
            name: 'Single Sheet Output',
            type: 'toggle',
            defaultValue: true
          }
        ]
      },
      {
        id: 'json-formatter',
        name: 'JSON Formatter',
        description: 'Format and validate JSON data',
        icon: '📝',
        trayId: 'data',
        planRequired: 'free',
        options: [
          {
            id: 'format-mode',
            name: 'Format Mode',
            type: 'select',
            defaultValue: 'beautify',
            options: ['beautify', 'minify']
          },
          {
            id: 'error-highlighting',
            name: 'Error Highlighting',
            type: 'toggle',
            defaultValue: true
          },
          {
            id: 'convert-to-csv',
            name: 'Convert to CSV',
            type: 'toggle',
            defaultValue: false
          }
        ]
      },
      {
        id: 'excel-cleaner',
        name: 'Excel Cleaner',
        description: 'Clean and normalize Excel data',
        icon: '🧹',
        trayId: 'data',
        planRequired: 'pro',
        options: [
          {
            id: 'remove-duplicates',
            name: 'Remove Duplicates',
            type: 'toggle',
            defaultValue: true
          },
          {
            id: 'normalize-columns',
            name: 'Normalize Columns',
            type: 'toggle',
            defaultValue: true
          },
          {
            id: 'fix-data-types',
            name: 'Fix Data Types',
            type: 'toggle',
            defaultValue: true
          },
          {
            id: 'remove-empty-rows',
            name: 'Remove Empty Rows',
            type: 'toggle',
            defaultValue: true
          },
          {
            id: 'trim-whitespace',
            name: 'Trim Whitespace',
            type: 'toggle',
            defaultValue: true
          }
        ]
      },
      {
        id: 'sql-formatter',
        name: 'SQL Formatter',
        description: 'Format and beautify SQL queries',
        icon: '💻',
        trayId: 'data',
        planRequired: 'pro',
        options: [
          {
            id: 'indentation',
            name: 'Indentation',
            type: 'select',
            defaultValue: '2spaces',
            options: ['2spaces', '4spaces', 'tabs']
          },
          {
            id: 'caseStyle',
            name: 'Case Style',
            type: 'select',
            defaultValue: 'capitalize',
            options: ['lowercase', 'uppercase', 'capitalize']
          },
          {
            id: 'alignKeywords',
            name: 'Align Keywords',
            type: 'toggle',
            defaultValue: true
          },
          {
            id: 'alignOperators',
            name: 'Align Operators',
            type: 'toggle',
            defaultValue: true
          },
          {
            id: 'removeComments',
            name: 'Remove Comments',
            type: 'toggle',
            defaultValue: false
          }
        ]
      }
    ]
  },
  {
    id: 'media',
    name: 'Media',
    description: 'Process images and media files',
    icon: '🎨',
    color: 'purple',
    tools: [
      {
        id: 'image-compression',
        name: 'Image Compression',
        description: 'Compress images to reduce file size',
        icon: '🗜️',
        trayId: 'media',
        planRequired: 'free',
        options: [
          {
            id: 'quality-level',
            name: 'Quality Level',
            type: 'select',
            defaultValue: 'balanced',
            options: ['high-quality', 'balanced', 'smallest-size']
          },
          {
            id: 'batch-mode',
            name: 'Batch Compression',
            type: 'toggle',
            defaultValue: false
          },
          {
            id: 'show-comparison',
            name: 'Show Before/After',
            type: 'toggle',
            defaultValue: true
          }
        ]
      },
      {
        id: 'format-conversion',
        name: 'Format Conversion',
        description: 'Convert images between formats',
        icon: '🔄',
        trayId: 'media',
        planRequired: 'free',
        options: [
          {
            id: 'target-format',
            name: 'Target Format',
            type: 'select',
            defaultValue: 'webp',
            options: ['jpg', 'png', 'webp', 'svg', 'pdf']
          },
          {
            id: 'batch-convert',
            name: 'Batch Convert',
            type: 'toggle',
            defaultValue: false
          },
          {
            id: 'resize-dimensions',
            name: 'Resize Dimensions',
            type: 'input',
            defaultValue: ''
          },
          {
            id: 'background-removal',
            name: 'Background Removal',
            type: 'toggle',
            defaultValue: false
          }
        ]
      },
      {
        id: 'ocr-extraction',
        name: 'OCR (Text Extraction)',
        description: 'Extract text from images and PDFs',
        icon: '📝',
        trayId: 'media',
        planRequired: 'pro',
        options: [
          {
            id: 'language',
            name: 'Language',
            type: 'select',
            defaultValue: 'eng',
            options: ['eng', 'fra', 'deu', 'spa', 'chi', 'jpn']
          },
          {
            id: 'output-format',
            name: 'Output Format',
            type: 'select',
            defaultValue: 'txt',
            options: ['txt', 'word', 'pdf']
          },
          {
            id: 'side-by-side',
            name: 'Side-by-side View',
            type: 'toggle',
            defaultValue: true
          }
        ]
      },
      {
        id: 'background-removal',
        name: 'Background Removal',
        description: 'Remove backgrounds from images',
        icon: '🎭',
        trayId: 'media',
        planRequired: 'pro',
        options: [
          {
            id: 'tolerance',
            name: 'Detection Tolerance',
            type: 'slider',
            defaultValue: 50,
            min: 0,
            max: 100,
            step: 5
          },
          {
            id: 'featherEdges',
            name: 'Feather Edges',
            type: 'toggle',
            defaultValue: true
          },
          {
            id: 'outputFormat',
            name: 'Output Format',
            type: 'select',
            defaultValue: 'png',
            options: ['png', 'jpg', 'webp']
          },
          {
            id: 'quality',
            name: 'Quality',
            type: 'slider',
            defaultValue: 90,
            min: 1,
            max: 100,
            step: 1
          },
          {
            id: 'preserveShadows',
            name: 'Preserve Shadows',
            type: 'toggle',
            defaultValue: false
          }
        ]
      }
    ]
  },
  {
    id: 'web',
    name: 'Web',
    description: 'Web development and content tools',
    icon: '🌐',
    color: 'orange',
    tools: [
      {
        id: 'html-to-markdown',
        name: 'HTML to Markdown',
        description: 'Convert HTML to Markdown format',
        icon: '📝',
        trayId: 'web',
        planRequired: 'free',
        options: [
          {
            id: 'keep-images',
            name: 'Keep Images',
            type: 'toggle',
            defaultValue: true
          },
          {
            id: 'preserve-styles',
            name: 'Preserve Inline Styles',
            type: 'toggle',
            defaultValue: false
          }
        ]
      },
      {
        id: 'text-extraction',
        name: 'Text Extraction',
        description: 'Extract clean text from web pages',
        icon: '🧹',
        trayId: 'web',
        planRequired: 'free',
        options: [
          {
            id: 'extract-mode',
            name: 'Extract Mode',
            type: 'select',
            defaultValue: 'main-content',
            options: ['full-article', 'main-content', 'metadata']
          },
          {
            id: 'export-format',
            name: 'Export Format',
            type: 'select',
            defaultValue: 'txt',
            options: ['txt', 'markdown', 'pdf']
          }
        ]
      },
      {
        id: 'screenshot-tool',
        name: 'Screenshot Tool',
        description: 'Capture screenshots of web pages',
        icon: '📸',
        trayId: 'web',
        planRequired: 'pro',
        options: [
          {
            id: 'screenshot-type',
            name: 'Screenshot Type',
            type: 'select',
            defaultValue: 'full-page',
            options: ['full-page', 'visible-area', 'custom-size']
          },
          {
            id: 'output-format',
            name: 'Output Format',
            type: 'select',
            defaultValue: 'png',
            options: ['png', 'jpg', 'webp']
          },
          {
            id: 'delay-capture',
            name: 'Delay Capture (seconds)',
            type: 'slider',
            defaultValue: 0,
            min: 0,
            max: 10,
            step: 1
          }
        ]
      }
    ]
  },
  {
    id: 'ai',
    name: 'AI Assist',
    description: 'AI-powered text and content tools',
    icon: '🤖',
    color: 'pink',
    tools: [
      {
        id: 'text-summarization',
        name: 'Text Summarization',
        description: 'Create AI-powered text summaries',
        icon: '📋',
        trayId: 'ai',
        planRequired: 'free',
        options: [
          {
            id: 'summary-length',
            name: 'Summary Length',
            type: 'select',
            defaultValue: 'medium',
            options: ['short', 'medium', 'detailed']
          },
          {
            id: 'highlight-key-points',
            name: 'Highlight Key Points',
            type: 'toggle',
            defaultValue: true
          },
          {
            id: 'export-format',
            name: 'Export Format',
            type: 'select',
            defaultValue: 'txt',
            options: ['txt', 'pdf']
          }
        ]
      },
      {
        id: 'content-cleaning',
        name: 'Content Cleaning',
        description: 'Clean and format messy text content',
        icon: '🧹',
        trayId: 'ai',
        planRequired: 'free',
        options: [
          {
            id: 'remove-line-breaks',
            name: 'Remove Line Breaks',
            type: 'toggle',
            defaultValue: false
          },
          {
            id: 'fix-spacing',
            name: 'Fix Spacing/Punctuation',
            type: 'toggle',
            defaultValue: true
          },
          {
            id: 'remove-html-tags',
            name: 'Remove HTML Tags',
            type: 'toggle',
            defaultValue: true
          },
          {
            id: 'normalize-formatting',
            name: 'Normalize Formatting',
            type: 'toggle',
            defaultValue: false
          },
          {
            id: 'target-format',
            name: 'Target Format',
            type: 'select',
            defaultValue: 'plain',
            options: ['plain', 'academic', 'business', 'casual']
          }
        ]
      },
      {
        id: 'smart-processing',
        name: 'Smart Processing',
        description: 'AI-powered document processing suggestions',
        icon: '🧠',
        trayId: 'ai',
        planRequired: 'pro',
        options: [
          {
            id: 'suggestion-mode',
            name: 'Suggestion Mode',
            type: 'select',
            defaultValue: 'auto',
            options: ['auto', 'manual']
          },
          {
            id: 'pipeline-mode',
            name: 'Custom Pipeline',
            type: 'toggle',
            defaultValue: false
          },
          {
            id: 'save-workflow',
            name: 'Save & Reuse Workflow',
            type: 'toggle',
            defaultValue: false
          }
        ]
      }
    ]
  },
  {
    id: 'security',
    name: 'Security',
    description: 'PDF protection and security tools',
    icon: '🔒',
    color: 'red',
    tools: [
      {
        id: 'pdf-password-remove',
        name: 'Remove PDF Password',
        description: 'Remove password protection from PDFs',
        icon: '🔓',
        trayId: 'security',
        planRequired: 'pro',
        options: [
          {
            id: 'password-input',
            name: 'Password (if known)',
            type: 'input',
            defaultValue: '',
            placeholder: 'Enter password if you know it'
          },
          {
            id: 'brute-force',
            name: 'Brute Force (if unknown)',
            type: 'toggle',
            defaultValue: false
          },
          {
            id: 'output-format',
            name: 'Output Format',
            type: 'select',
            defaultValue: 'pdf',
            options: ['pdf', 'docx']
          }
        ]
      },
      {
        id: 'pdf-password-protect',
        name: 'Add PDF Password',
        description: 'Add password protection to PDFs',
        icon: '🔐',
        trayId: 'security',
        planRequired: 'pro',
        options: [
          {
            id: 'password',
            name: 'Password',
            type: 'input',
            defaultValue: '',
            placeholder: 'Enter password'
          },
          {
            id: 'permissions',
            name: 'Permissions',
            type: 'select',
            defaultValue: 'print-copy',
            options: ['print-copy', 'print-only', 'no-print', 'full-access']
          },
          {
            id: 'encryption-level',
            name: 'Encryption Level',
            type: 'select',
            defaultValue: '128-bit',
            options: ['128-bit', '256-bit']
          }
        ]
      },
      {
        id: 'pdf-encrypt',
        name: 'Advanced PDF Encryption',
        description: 'Advanced PDF encryption and security',
        icon: '🛡️',
        trayId: 'security',
        planRequired: 'pro',
        options: [
          {
            id: 'encryption-algorithm',
            name: 'Encryption Algorithm',
            type: 'select',
            defaultValue: 'AES-256',
            options: ['AES-128', 'AES-256', 'RC4-128']
          },
          {
            id: 'user-permissions',
            name: 'User Permissions',
            type: 'select',
            defaultValue: 'standard',
            options: ['standard', 'restricted', 'custom']
          },
          {
            id: 'expiry-date',
            name: 'Set Expiry Date',
            type: 'input',
            defaultValue: '',
            placeholder: 'YYYY-MM-DD'
          }
        ]
      }
    ]
  },
  {
    id: 'e-signature',
    name: 'E-Signature',
    description: 'Digital signatures and form filling',
    icon: '✍️',
    color: 'indigo',
    tools: [
      {
        id: 'digital-signature',
        name: 'Digital Signature',
        description: 'Add digital signatures to PDFs',
        icon: '✍️',
        trayId: 'e-signature',
        planRequired: 'pro',
        options: [
          {
            id: 'signature-type',
            name: 'Signature Type',
            type: 'select',
            defaultValue: 'typed',
            options: ['typed', 'drawn', 'uploaded', 'certificate']
          },
          {
            id: 'signature-position',
            name: 'Signature Position',
            type: 'select',
            defaultValue: 'auto',
            options: ['auto', 'custom', 'multiple']
          },
          {
            id: 'certificate-verification',
            name: 'Certificate Verification',
            type: 'toggle',
            defaultValue: true
          }
        ]
      },
      {
        id: 'form-filling',
        name: 'PDF Form Filling',
        description: 'Fill out PDF forms automatically',
        icon: '📝',
        trayId: 'e-signature',
        planRequired: 'pro',
        options: [
          {
            id: 'auto-detect-fields',
            name: 'Auto-detect Form Fields',
            type: 'toggle',
            defaultValue: true
          },
          {
            id: 'save-template',
            name: 'Save as Template',
            type: 'toggle',
            defaultValue: false
          },
          {
            id: 'batch-fill',
            name: 'Batch Form Filling',
            type: 'toggle',
            defaultValue: false
          }
        ]
      },
      {
        id: 'signature-verification',
        name: 'Signature Verification',
        description: 'Verify digital signatures on PDFs',
        icon: '✅',
        trayId: 'e-signature',
        planRequired: 'pro',
        options: [
          {
            id: 'verification-level',
            name: 'Verification Level',
            type: 'select',
            defaultValue: 'standard',
            options: ['basic', 'standard', 'comprehensive']
          },
          {
            id: 'certificate-chain',
            name: 'Certificate Chain Validation',
            type: 'toggle',
            defaultValue: true
          },
          {
            id: 'audit-trail',
            name: 'Generate Audit Trail',
            type: 'toggle',
            defaultValue: true
          }
        ]
      }
    ]
  },
  {
    id: 'advanced',
    name: 'Advanced',
    description: 'Advanced processing and automation',
    icon: '⚡',
    color: 'yellow',
    tools: [
      {
        id: 'folder-processing',
        name: 'Folder Processing',
        description: 'Process entire folders of files',
        icon: '📁',
        trayId: 'advanced',
        planRequired: 'pro',
        options: [
          {
            id: 'recursive-processing',
            name: 'Recursive Processing',
            type: 'toggle',
            defaultValue: false
          },
          {
            id: 'file-filters',
            name: 'File Filters',
            type: 'input',
            defaultValue: '',
            placeholder: '*.pdf, *.docx, *.jpg'
          },
          {
            id: 'output-structure',
            name: 'Output Structure',
            type: 'select',
            defaultValue: 'flat',
            options: ['flat', 'maintain-folders', 'custom']
          }
        ]
      },
      {
        id: 'workflow-automation',
        name: 'Workflow Automation',
        description: 'Create automated processing workflows',
        icon: '🔄',
        trayId: 'advanced',
        planRequired: 'pro',
        options: [
          {
            id: 'workflow-steps',
            name: 'Workflow Steps',
            type: 'select',
            defaultValue: '3',
            options: ['2', '3', '5', '10', 'unlimited']
          },
          {
            id: 'conditional-logic',
            name: 'Conditional Logic',
            type: 'toggle',
            defaultValue: false
          },
          {
            id: 'api-integration',
            name: 'API Integration',
            type: 'toggle',
            defaultValue: false
          },
          {
            id: 'scheduling',
            name: 'Schedule Processing',
            type: 'toggle',
            defaultValue: false
          }
        ]
      },
      {
        id: 'batch-conversion',
        name: 'Batch Conversion',
        description: 'Convert multiple files at once',
        icon: '📦',
        trayId: 'advanced',
        planRequired: 'pro',
        options: [
          {
            id: 'target-formats',
            name: 'Target Formats',
            type: 'input',
            defaultValue: '',
            placeholder: 'pdf, docx, jpg, png'
          },
          {
            id: 'parallel-processing',
            name: 'Parallel Processing',
            type: 'toggle',
            defaultValue: true
          },
          {
            id: 'quality-preservation',
            name: 'Quality Preservation',
            type: 'toggle',
            defaultValue: true
          }
        ]
      }
    ]
  }
]

export function getTrayById(id: string): Tray | undefined {
  return trays.find(tray => tray.id === id)
}

export function getToolById(trayId: string, toolId: string) {
  const tray = getTrayById(trayId)
  return tray?.tools.find(tool => tool.id === toolId)
}

