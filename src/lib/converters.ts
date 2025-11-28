/**
 * Data Conversion Engine
 * Professional-grade converters using industry-standard libraries
 *
 * Supported formats: JSON, CSV, XML, YAML, SQL, Markdown, HTML
 */

import Papa from 'papaparse';
import yaml from 'js-yaml';

// ============================================
// TYPES
// ============================================

export type ConversionResult =
  | { success: true; data: string; rowCount?: number }
  | { success: false; error: string; details?: string };

type DataRow = Record<string, unknown>;
type DataArray = DataRow[];

// ============================================
// VALIDATION & UTILITIES
// ============================================

function validateInput(input: string, format: string): void {
  if (!input || !input.trim()) {
    throw new ConversionError(`Empty input. Please provide valid ${format.toUpperCase()} data.`);
  }
}

function sanitizeString(str: unknown): string {
  if (str === null || str === undefined) return '';
  if (typeof str === 'object') return JSON.stringify(str);
  return String(str);
}

function flattenObject(obj: Record<string, unknown>, prefix = ''): Record<string, unknown> {
  const result: Record<string, unknown> = {};

  for (const [key, value] of Object.entries(obj)) {
    const newKey = prefix ? `${prefix}.${key}` : key;

    if (value && typeof value === 'object' && !Array.isArray(value)) {
      Object.assign(result, flattenObject(value as Record<string, unknown>, newKey));
    } else if (Array.isArray(value)) {
      // For arrays of primitives, join them; for objects, stringify
      if (value.every(v => typeof v !== 'object' || v === null)) {
        result[newKey] = value.join(', ');
      } else {
        result[newKey] = JSON.stringify(value);
      }
    } else {
      result[newKey] = value;
    }
  }

  return result;
}

function normalizeToArray(data: unknown): DataArray {
  if (Array.isArray(data)) {
    return data.map(item => {
      if (typeof item === 'object' && item !== null) {
        return flattenObject(item as Record<string, unknown>);
      }
      return { value: item };
    });
  }

  if (typeof data === 'object' && data !== null) {
    // Check if it's an object with array values
    const values = Object.values(data);
    for (const value of values) {
      if (Array.isArray(value)) {
        return normalizeToArray(value);
      }
    }
    // Single object
    return [flattenObject(data as Record<string, unknown>)];
  }

  return [{ value: data }];
}

function collectAllKeys(data: DataArray): string[] {
  const keysSet = new Set<string>();
  data.forEach(row => {
    if (typeof row === 'object' && row !== null) {
      Object.keys(row).forEach(key => keysSet.add(key));
    }
  });
  return Array.from(keysSet);
}

function inferSqlType(value: unknown): string {
  if (value === null || value === undefined) return 'TEXT';
  if (typeof value === 'number') {
    return Number.isInteger(value) ? 'INTEGER' : 'DECIMAL(10,2)';
  }
  if (typeof value === 'boolean') return 'BOOLEAN';
  if (typeof value === 'string') {
    if (value.length > 255) return 'TEXT';
    // Check for date patterns
    if (/^\d{4}-\d{2}-\d{2}/.test(value)) return 'DATE';
    return 'VARCHAR(255)';
  }
  return 'TEXT';
}

// ============================================
// CUSTOM ERROR
// ============================================

class ConversionError extends Error {
  constructor(message: string, public details?: string) {
    super(message);
    this.name = 'ConversionError';
  }
}

// ============================================
// PARSERS
// ============================================

function parseJSON(input: string): unknown {
  validateInput(input, 'JSON');
  try {
    return JSON.parse(input.trim());
  } catch (e) {
    const error = e as Error;
    // Try to provide helpful error message
    const match = error.message.match(/position (\d+)/);
    if (match) {
      const pos = parseInt(match[1]);
      const context = input.slice(Math.max(0, pos - 20), pos + 20);
      throw new ConversionError(
        'Invalid JSON syntax',
        `Error near: "...${context}..."`
      );
    }
    throw new ConversionError('Invalid JSON format', error.message);
  }
}

function parseCSV(input: string): DataArray {
  validateInput(input, 'CSV');

  const result = Papa.parse<DataRow>(input.trim(), {
    header: true,
    skipEmptyLines: true,
    transformHeader: (header) => header.trim(),
    transform: (value) => value.trim(),
  });

  if (result.errors.length > 0) {
    const firstError = result.errors[0];
    throw new ConversionError(
      `CSV parsing error at row ${firstError.row || 'unknown'}`,
      firstError.message
    );
  }

  if (result.data.length === 0) {
    throw new ConversionError('CSV file is empty or contains only headers');
  }

  return result.data;
}

function parseXML(input: string): unknown {
  validateInput(input, 'XML');

  if (typeof DOMParser === 'undefined') {
    throw new ConversionError('XML parsing not available in this environment');
  }

  const parser = new DOMParser();
  const doc = parser.parseFromString(input.trim(), 'application/xml');

  const errorNode = doc.querySelector('parsererror');
  if (errorNode) {
    const errorText = errorNode.textContent || 'Unknown XML error';
    throw new ConversionError('Invalid XML syntax', errorText.slice(0, 200));
  }

  return xmlNodeToObject(doc.documentElement);
}

function xmlNodeToObject(node: Element): unknown {
  const result: Record<string, unknown> = {};

  // Handle attributes
  if (node.attributes.length > 0) {
    const attrs: Record<string, string> = {};
    for (let i = 0; i < node.attributes.length; i++) {
      const attr = node.attributes[i];
      attrs[`@${attr.name}`] = attr.value;
    }
    Object.assign(result, attrs);
  }

  // Get child elements
  const children = Array.from(node.childNodes);
  const elementChildren = children.filter(c => c.nodeType === Node.ELEMENT_NODE) as Element[];
  const textContent = children
    .filter(c => c.nodeType === Node.TEXT_NODE)
    .map(c => c.textContent?.trim())
    .filter(Boolean)
    .join('');

  // If only text content
  if (elementChildren.length === 0 && textContent) {
    if (Object.keys(result).length === 0) {
      // Try to parse as number or boolean
      if (/^-?\d+(\.\d+)?$/.test(textContent)) {
        return parseFloat(textContent);
      }
      if (textContent === 'true') return true;
      if (textContent === 'false') return false;
      return textContent;
    }
    result['#text'] = textContent;
    return result;
  }

  // Process child elements
  for (const child of elementChildren) {
    const childName = child.nodeName;
    const childValue = xmlNodeToObject(child);

    if (childName in result) {
      // Convert to array if multiple same-named children
      const existing = result[childName];
      if (Array.isArray(existing)) {
        existing.push(childValue);
      } else {
        result[childName] = [existing, childValue];
      }
    } else {
      result[childName] = childValue;
    }
  }

  return Object.keys(result).length === 0 ? '' : result;
}

function parseYAML(input: string): unknown {
  validateInput(input, 'YAML');
  try {
    const result = yaml.load(input.trim());
    if (result === undefined || result === null) {
      throw new ConversionError('YAML file is empty or invalid');
    }
    return result;
  } catch (e) {
    const error = e as Error;
    if (error.name === 'YAMLException') {
      throw new ConversionError('Invalid YAML syntax', error.message);
    }
    throw new ConversionError('Failed to parse YAML', error.message);
  }
}

function parseSQL(input: string): DataArray {
  validateInput(input, 'SQL');

  // Match INSERT INTO statements
  const insertMatch = input.match(/INSERT\s+INTO\s+\w+\s*\(([^)]+)\)\s*VALUES/i);
  if (!insertMatch) {
    throw new ConversionError(
      'Invalid SQL format',
      'Expected INSERT INTO table (columns) VALUES (...) statement'
    );
  }

  const columns = insertMatch[1].split(',').map(c => c.trim().replace(/["`[\]]/g, ''));
  const result: DataArray = [];

  // Match all value tuples
  const valuesSection = input.slice(input.toUpperCase().indexOf('VALUES') + 6);
  const tupleRegex = /\(([^)]+)\)/g;
  let match;

  while ((match = tupleRegex.exec(valuesSection)) !== null) {
    const values = parseSQLValueTuple(match[1]);
    const row: DataRow = {};
    columns.forEach((col, i) => {
      row[col] = values[i] ?? null;
    });
    result.push(row);
  }

  if (result.length === 0) {
    throw new ConversionError('No data found in SQL statement');
  }

  return result;
}

function parseSQLValueTuple(tupleStr: string): unknown[] {
  const values: unknown[] = [];
  let current = '';
  let inString = false;
  let stringChar = '';

  for (let i = 0; i < tupleStr.length; i++) {
    const char = tupleStr[i];

    if ((char === "'" || char === '"') && !inString) {
      inString = true;
      stringChar = char;
    } else if (char === stringChar && inString) {
      if (tupleStr[i + 1] === stringChar) {
        current += char;
        i++;
      } else {
        inString = false;
        stringChar = '';
      }
    } else if (char === ',' && !inString) {
      values.push(parseSQLValue(current.trim()));
      current = '';
    } else {
      current += char;
    }
  }

  if (current.trim()) {
    values.push(parseSQLValue(current.trim()));
  }

  return values;
}

function parseSQLValue(value: string): unknown {
  const upper = value.toUpperCase();
  if (upper === 'NULL') return null;
  if (upper === 'TRUE') return true;
  if (upper === 'FALSE') return false;
  if (/^-?\d+$/.test(value)) return parseInt(value, 10);
  if (/^-?\d*\.\d+$/.test(value)) return parseFloat(value);
  // Remove quotes
  if ((value.startsWith("'") && value.endsWith("'")) ||
      (value.startsWith('"') && value.endsWith('"'))) {
    return value.slice(1, -1).replace(/''/g, "'").replace(/""/g, '"');
  }
  return value;
}

function parseMarkdown(input: string): DataArray {
  validateInput(input, 'Markdown');

  const lines = input.trim().split('\n').filter(l => l.trim());

  if (lines.length < 2) {
    throw new ConversionError(
      'Invalid Markdown table',
      'Table must have at least a header row and separator row'
    );
  }

  // Parse header
  const headerLine = lines[0];
  if (!headerLine.includes('|')) {
    throw new ConversionError('Invalid Markdown table format', 'Missing pipe separators');
  }

  const headers = headerLine
    .split('|')
    .map(h => h.trim())
    .filter(Boolean);

  // Validate separator line
  const separatorLine = lines[1];
  if (!/^[\s|:-]+$/.test(separatorLine)) {
    throw new ConversionError('Invalid Markdown table', 'Missing or invalid separator row');
  }

  // Parse data rows
  const result: DataArray = [];
  for (let i = 2; i < lines.length; i++) {
    const cells = lines[i].split('|').map(c => c.trim()).filter(Boolean);
    const row: DataRow = {};
    headers.forEach((header, j) => {
      row[header] = cells[j] || '';
    });
    result.push(row);
  }

  if (result.length === 0) {
    throw new ConversionError('Markdown table has no data rows');
  }

  return result;
}

function parseHTML(input: string): DataArray {
  validateInput(input, 'HTML');

  if (typeof DOMParser === 'undefined') {
    throw new ConversionError('HTML parsing not available in this environment');
  }

  const parser = new DOMParser();
  const doc = parser.parseFromString(input, 'text/html');
  const table = doc.querySelector('table');

  if (!table) {
    throw new ConversionError('No table found in HTML', 'Input must contain a <table> element');
  }

  // Get headers
  const headers: string[] = [];
  const headerRow = table.querySelector('thead tr') || table.querySelector('tr');
  if (headerRow) {
    headerRow.querySelectorAll('th, td').forEach(cell => {
      headers.push(cell.textContent?.trim() || '');
    });
  }

  if (headers.length === 0) {
    throw new ConversionError('No table headers found');
  }

  // Get data rows
  const result: DataArray = [];
  const tbody = table.querySelector('tbody') || table;
  const rows = tbody.querySelectorAll('tr');

  rows.forEach((row, idx) => {
    // Skip header row if no thead
    if (idx === 0 && !table.querySelector('thead')) return;

    const cells = row.querySelectorAll('td');
    if (cells.length === 0) return;

    const rowData: DataRow = {};
    cells.forEach((cell, i) => {
      const header = headers[i] || `column_${i + 1}`;
      rowData[header] = cell.textContent?.trim() || '';
    });
    result.push(rowData);
  });

  if (result.length === 0) {
    throw new ConversionError('HTML table has no data rows');
  }

  return result;
}

// ============================================
// SERIALIZERS
// ============================================

function toJSON(data: unknown): string {
  return JSON.stringify(data, null, 2);
}

function toCSV(data: unknown): string {
  const array = normalizeToArray(data);
  const keys = collectAllKeys(array);

  const csvData = array.map(row => {
    const newRow: DataRow = {};
    keys.forEach(key => {
      newRow[key] = sanitizeString(row[key]);
    });
    return newRow;
  });

  return Papa.unparse(csvData, {
    header: true,
    quotes: true,
    quoteChar: '"',
    escapeChar: '"',
    newline: '\n',
  });
}

function toXML(data: unknown, rootName = 'root'): string {
  const lines: string[] = ['<?xml version="1.0" encoding="UTF-8"?>'];
  lines.push(objectToXML(data, rootName, 0));
  return lines.join('\n');
}

function objectToXML(data: unknown, tagName: string, indent: number): string {
  const spaces = '  '.repeat(indent);
  const safeTagName = tagName.replace(/[^a-zA-Z0-9_-]/g, '_');

  if (data === null || data === undefined) {
    return `${spaces}<${safeTagName}/>`;
  }

  if (typeof data !== 'object') {
    return `${spaces}<${safeTagName}>${escapeXML(String(data))}</${safeTagName}>`;
  }

  if (Array.isArray(data)) {
    const itemName = safeTagName.endsWith('s') ? safeTagName.slice(0, -1) : 'item';
    return data.map(item => objectToXML(item, itemName, indent)).join('\n');
  }

  const obj = data as Record<string, unknown>;
  const entries = Object.entries(obj).filter(([key]) => !key.startsWith('@'));

  if (entries.length === 0) {
    return `${spaces}<${safeTagName}/>`;
  }

  const children = entries
    .map(([key, value]) => objectToXML(value, key, indent + 1))
    .join('\n');

  return `${spaces}<${safeTagName}>\n${children}\n${spaces}</${safeTagName}>`;
}

function escapeXML(str: string): string {
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;');
}

function toYAML(data: unknown): string {
  return yaml.dump(data, {
    indent: 2,
    lineWidth: 120,
    noRefs: true,
    sortKeys: false,
    quotingType: '"',
    forceQuotes: false,
  });
}

function toSQL(data: unknown, tableName = 'data_table'): string {
  const array = normalizeToArray(data);
  const keys = collectAllKeys(array);

  if (keys.length === 0 || array.length === 0) {
    return '-- No data to convert';
  }

  const lines: string[] = [];

  // Generate CREATE TABLE statement
  lines.push(`-- Generated SQL for ${array.length} row(s)`);
  lines.push(`-- Table structure`);
  lines.push(`CREATE TABLE IF NOT EXISTS ${tableName} (`);

  const columnDefs = keys.map((key, idx) => {
    // Infer type from first non-null value
    const sampleValue = array.find(row => row[key] !== null && row[key] !== undefined)?.[key];
    const sqlType = inferSqlType(sampleValue);
    const safeKey = key.replace(/[^a-zA-Z0-9_]/g, '_');
    const comma = idx < keys.length - 1 ? ',' : '';
    return `  ${safeKey} ${sqlType}${comma}`;
  });

  lines.push(...columnDefs);
  lines.push(');');
  lines.push('');
  lines.push('-- Data insertion');

  const safeKeys = keys.map(k => k.replace(/[^a-zA-Z0-9_]/g, '_'));
  lines.push(`INSERT INTO ${tableName} (${safeKeys.join(', ')}) VALUES`);

  const valueRows = array.map((row, idx) => {
    const values = keys.map(key => formatSQLValue(row[key]));
    const isLast = idx === array.length - 1;
    return `  (${values.join(', ')})${isLast ? ';' : ','}`;
  });

  lines.push(...valueRows);

  return lines.join('\n');
}

function formatSQLValue(value: unknown): string {
  if (value === null || value === undefined) return 'NULL';
  if (typeof value === 'number') return String(value);
  if (typeof value === 'boolean') return value ? 'TRUE' : 'FALSE';
  const str = String(value).replace(/'/g, "''");
  return `'${str}'`;
}

function toMarkdown(data: unknown): string {
  const array = normalizeToArray(data);
  const keys = collectAllKeys(array);

  if (keys.length === 0) return '';

  // Calculate column widths for alignment
  const widths: number[] = keys.map(key => {
    const headerWidth = key.length;
    const maxDataWidth = Math.max(
      ...array.map(row => sanitizeString(row[key]).length)
    );
    return Math.max(headerWidth, maxDataWidth, 3);
  });

  const lines: string[] = [];

  // Header row
  const header = keys.map((key, i) => key.padEnd(widths[i])).join(' | ');
  lines.push(`| ${header} |`);

  // Separator row
  const separator = widths.map(w => '-'.repeat(w)).join(' | ');
  lines.push(`| ${separator} |`);

  // Data rows
  array.forEach(row => {
    const cells = keys.map((key, i) => {
      const value = sanitizeString(row[key]).replace(/\|/g, '\\|');
      return value.padEnd(widths[i]);
    });
    lines.push(`| ${cells.join(' | ')} |`);
  });

  return lines.join('\n');
}

function toHTML(data: unknown): string {
  const array = normalizeToArray(data);
  const keys = collectAllKeys(array);

  if (keys.length === 0) return '<table></table>';

  const lines: string[] = [
    '<table class="data-table">',
    '  <thead>',
    '    <tr>',
  ];

  keys.forEach(key => {
    lines.push(`      <th>${escapeHTML(key)}</th>`);
  });

  lines.push('    </tr>', '  </thead>', '  <tbody>');

  array.forEach(row => {
    lines.push('    <tr>');
    keys.forEach(key => {
      const value = sanitizeString(row[key]);
      lines.push(`      <td>${escapeHTML(value)}</td>`);
    });
    lines.push('    </tr>');
  });

  lines.push('  </tbody>', '</table>');

  return lines.join('\n');
}

function escapeHTML(str: string): string {
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}

// ============================================
// CONVERTER MATRIX
// ============================================

type ParserFn = (input: string) => unknown;
type SerializerFn = (data: unknown) => string;

const PARSERS: Record<string, ParserFn> = {
  json: parseJSON,
  csv: parseCSV,
  xml: parseXML,
  yaml: parseYAML,
  sql: parseSQL,
  markdown: parseMarkdown,
  html: parseHTML,
};

const SERIALIZERS: Record<string, SerializerFn> = {
  json: toJSON,
  csv: toCSV,
  xml: (data) => toXML(data, 'data'),
  yaml: toYAML,
  sql: toSQL,
  markdown: toMarkdown,
  html: toHTML,
};

// ============================================
// PUBLIC API
// ============================================

export function convert(source: string, target: string, input: string): ConversionResult {
  try {
    const parser = PARSERS[source];
    const serializer = SERIALIZERS[target];

    if (!parser) {
      return {
        success: false,
        error: `Unsupported source format: ${source}`,
      };
    }

    if (!serializer) {
      return {
        success: false,
        error: `Unsupported target format: ${target}`,
      };
    }

    // Parse source data
    const parsed = parser(input);

    // Serialize to target format
    const result = serializer(parsed);

    // Calculate row count for feedback
    const array = normalizeToArray(parsed);

    return {
      success: true,
      data: result,
      rowCount: array.length,
    };
  } catch (error) {
    if (error instanceof ConversionError) {
      return {
        success: false,
        error: error.message,
        details: error.details,
      };
    }

    const e = error as Error;
    return {
      success: false,
      error: 'Conversion failed',
      details: e.message,
    };
  }
}

// Export for testing
export const __testing = {
  parseJSON,
  parseCSV,
  parseXML,
  parseYAML,
  parseSQL,
  parseMarkdown,
  parseHTML,
  toJSON,
  toCSV,
  toXML,
  toYAML,
  toSQL,
  toMarkdown,
  toHTML,
};
