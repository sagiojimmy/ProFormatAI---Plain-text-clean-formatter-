export enum Tone {
  PROFESSIONAL = 'Professional',
  ACADEMIC = 'Academic',
  CASUAL = 'Casual',
  EXECUTIVE = 'Executive Summary',
  PERSUASIVE = 'Persuasive'
}

export enum FormatOption {
  MARKDOWN = 'Markdown',
  HTML = 'HTML',
  TXT = 'Plain Text',
  PDF = 'PDF',
  DOC = 'Word Document'
}

export interface FormattingOptions {
  tone: Tone;
  includeSummary: boolean;
  fixGrammar: boolean;
}

export interface GeneratedContent {
  original: string;
  formatted: string;
  timestamp: number;
}