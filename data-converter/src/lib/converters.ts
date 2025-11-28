// Fonctions de conversion pures - Aucune dépendance externe
// Toutes les transformations sont effectuées côté client

export type ConversionResult = {
  success: true;
  data: string;
} | {
  success: false;
  error: string;
};

// ============================================
// PARSERS - Convertissent string -> objet JS
// ============================================

function parseJson(input: string): unknown {
  return JSON.parse(input.trim());
}

function parseCsv(input: string): Array<Record<string, string>> {
  const lines = input.trim().split('\n');
  if (lines.length < 2) {
    throw new Error('Le CSV doit contenir au moins un en-tête et une ligne de données');
  }

  const headers = parseCsvLine(lines[0]);
  const result: Array<Record<string, string>> = [];

  for (let i = 1; i < lines.length; i++) {
    const values = parseCsvLine(lines[i]);
    const row: Record<string, string> = {};

    headers.forEach((header, index) => {
      row[header] = values[index] || '';
    });

    result.push(row);
  }

  return result;
}

function parseCsvLine(line: string): string[] {
  const result: string[] = [];
  let current = '';
  let inQuotes = false;

  for (let i = 0; i < line.length; i++) {
    const char = line[i];

    if (char === '"') {
      if (inQuotes && line[i + 1] === '"') {
        current += '"';
        i++;
      } else {
        inQuotes = !inQuotes;
      }
    } else if (char === ',' && !inQuotes) {
      result.push(current.trim());
      current = '';
    } else {
      current += char;
    }
  }

  result.push(current.trim());
  return result;
}

function parseXml(input: string): unknown {
  const parser = new DOMParser();
  const doc = parser.parseFromString(input.trim(), 'application/xml');

  const errorNode = doc.querySelector('parsererror');
  if (errorNode) {
    throw new Error('XML invalide: ' + errorNode.textContent);
  }

  return xmlToObject(doc.documentElement);
}

function xmlToObject(node: Element): unknown {
  const result: Record<string, unknown> = {};

  // Attributs
  if (node.attributes.length > 0) {
    result['@attributes'] = {};
    for (let i = 0; i < node.attributes.length; i++) {
      const attr = node.attributes[i];
      (result['@attributes'] as Record<string, string>)[attr.name] = attr.value;
    }
  }

  // Enfants
  const children = Array.from(node.childNodes);
  const textContent = children
    .filter((child) => child.nodeType === Node.TEXT_NODE)
    .map((child) => child.textContent?.trim())
    .filter(Boolean)
    .join('');

  if (textContent && children.filter((c) => c.nodeType === Node.ELEMENT_NODE).length === 0) {
    // Noeud texte uniquement
    if (Object.keys(result).length === 0) {
      return textContent;
    }
    result['#text'] = textContent;
    return result;
  }

  // Noeuds enfants
  const elementChildren = children.filter((child) => child.nodeType === Node.ELEMENT_NODE) as Element[];

  for (const child of elementChildren) {
    const childName = child.nodeName;
    const childValue = xmlToObject(child);

    if (childName in result) {
      // Convertir en tableau si plusieurs éléments du même nom
      if (!Array.isArray(result[childName])) {
        result[childName] = [result[childName]];
      }
      (result[childName] as unknown[]).push(childValue);
    } else {
      result[childName] = childValue;
    }
  }

  return Object.keys(result).length === 0 ? '' : result;
}

function parseYaml(input: string): unknown {
  // Parser YAML simplifié (supporte les structures basiques)
  const lines = input.trim().split('\n');
  return parseYamlLines(lines, 0).value;
}

function parseYamlLines(lines: string[], startIndent: number): { value: unknown; endIndex: number } {
  const result: Record<string, unknown> = {};
  let currentArray: unknown[] | null = null;
  let currentKey = '';
  let i = 0;

  while (i < lines.length) {
    const line = lines[i];
    const trimmed = line.trim();

    // Ligne vide ou commentaire
    if (!trimmed || trimmed.startsWith('#')) {
      i++;
      continue;
    }

    const indent = line.search(/\S/);

    // Fin du bloc courant
    if (indent < startIndent && startIndent > 0) {
      break;
    }

    // Élément de liste
    if (trimmed.startsWith('- ')) {
      if (!currentArray) {
        currentArray = [];
      }
      const value = trimmed.substring(2).trim();

      if (value.includes(':')) {
        // Objet inline dans la liste
        const obj: Record<string, unknown> = {};
        const pairs = value.split(',').map((p) => p.trim());
        for (const pair of pairs) {
          const [k, v] = pair.split(':').map((s) => s.trim());
          obj[k] = parseYamlValue(v);
        }
        currentArray.push(obj);
      } else if (value) {
        currentArray.push(parseYamlValue(value));
      } else {
        // Bloc nested après le tiret
        const nested = parseYamlLines(lines.slice(i + 1), indent + 2);
        currentArray.push(nested.value);
        i += nested.endIndex;
      }
      i++;
      continue;
    }

    // Paire clé:valeur
    const colonIndex = trimmed.indexOf(':');
    if (colonIndex > 0) {
      if (currentArray && currentKey) {
        result[currentKey] = currentArray;
        currentArray = null;
      }

      const key = trimmed.substring(0, colonIndex).trim();
      const value = trimmed.substring(colonIndex + 1).trim();

      if (value) {
        result[key] = parseYamlValue(value);
      } else {
        // Bloc nested
        currentKey = key;
        const nested = parseYamlLines(lines.slice(i + 1), indent + 2);
        result[key] = nested.value;
        i += nested.endIndex;
      }
    }

    i++;
  }

  if (currentArray && currentKey) {
    result[currentKey] = currentArray;
  } else if (currentArray) {
    return { value: currentArray, endIndex: i };
  }

  return { value: result, endIndex: i };
}

function parseYamlValue(value: string): unknown {
  if (value === 'true') return true;
  if (value === 'false') return false;
  if (value === 'null' || value === '~') return null;
  if (/^-?\d+$/.test(value)) return parseInt(value, 10);
  if (/^-?\d*\.\d+$/.test(value)) return parseFloat(value);
  // Retirer les guillemets
  if ((value.startsWith('"') && value.endsWith('"')) || (value.startsWith("'") && value.endsWith("'"))) {
    return value.slice(1, -1);
  }
  return value;
}

// ============================================
// SERIALIZERS - Convertissent objet JS -> string
// ============================================

function toJson(data: unknown): string {
  return JSON.stringify(data, null, 2);
}

function toCsv(data: unknown): string {
  const array = normalizeToArray(data);
  if (array.length === 0) return '';

  // Collecter toutes les clés uniques
  const allKeys = new Set<string>();
  array.forEach((item) => {
    if (typeof item === 'object' && item !== null) {
      Object.keys(item).forEach((key) => allKeys.add(key));
    }
  });

  const headers = Array.from(allKeys);
  const lines: string[] = [headers.join(',')];

  array.forEach((item) => {
    const values = headers.map((header) => {
      const value = (item as Record<string, unknown>)[header];
      return escapeCsvValue(value);
    });
    lines.push(values.join(','));
  });

  return lines.join('\n');
}

function escapeCsvValue(value: unknown): string {
  if (value === null || value === undefined) return '';
  const str = String(value);
  if (str.includes(',') || str.includes('"') || str.includes('\n')) {
    return `"${str.replace(/"/g, '""')}"`;
  }
  return str;
}

function toXml(data: unknown, rootName = 'root'): string {
  const lines: string[] = ['<?xml version="1.0" encoding="UTF-8"?>'];
  lines.push(objectToXml(data, rootName, 0));
  return lines.join('\n');
}

function objectToXml(data: unknown, tagName: string, indent: number): string {
  const spaces = '  '.repeat(indent);

  if (data === null || data === undefined) {
    return `${spaces}<${tagName}/>`;
  }

  if (typeof data !== 'object') {
    return `${spaces}<${tagName}>${escapeXml(String(data))}</${tagName}>`;
  }

  if (Array.isArray(data)) {
    const singularName = tagName.endsWith('s') ? tagName.slice(0, -1) : 'item';
    return data.map((item) => objectToXml(item, singularName, indent)).join('\n');
  }

  const obj = data as Record<string, unknown>;
  const children = Object.entries(obj)
    .filter(([key]) => !key.startsWith('@'))
    .map(([key, value]) => objectToXml(value, key, indent + 1))
    .join('\n');

  if (!children) {
    return `${spaces}<${tagName}/>`;
  }

  return `${spaces}<${tagName}>\n${children}\n${spaces}</${tagName}>`;
}

function escapeXml(str: string): string {
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;');
}

function toYaml(data: unknown, indent = 0): string {
  const spaces = '  '.repeat(indent);

  if (data === null || data === undefined) {
    return 'null';
  }

  if (typeof data === 'boolean') {
    return data ? 'true' : 'false';
  }

  if (typeof data === 'number') {
    return String(data);
  }

  if (typeof data === 'string') {
    if (data.includes('\n') || data.includes(':') || data.includes('#')) {
      return `"${data.replace(/"/g, '\\"')}"`;
    }
    return data;
  }

  if (Array.isArray(data)) {
    if (data.length === 0) return '[]';
    return data
      .map((item) => {
        if (typeof item === 'object' && item !== null && !Array.isArray(item)) {
          const objLines = Object.entries(item)
            .map(([k, v], i) => {
              const prefix = i === 0 ? '- ' : '  ';
              return `${spaces}${prefix}${k}: ${toYaml(v, 0)}`;
            })
            .join('\n');
          return objLines;
        }
        return `${spaces}- ${toYaml(item, indent + 1)}`;
      })
      .join('\n');
  }

  if (typeof data === 'object') {
    const obj = data as Record<string, unknown>;
    const entries = Object.entries(obj);
    if (entries.length === 0) return '{}';

    return entries
      .map(([key, value]) => {
        if (typeof value === 'object' && value !== null) {
          return `${spaces}${key}:\n${toYaml(value, indent + 1)}`;
        }
        return `${spaces}${key}: ${toYaml(value, 0)}`;
      })
      .join('\n');
  }

  return String(data);
}

function toSql(data: unknown, tableName = 'data'): string {
  const array = normalizeToArray(data);
  if (array.length === 0) return `-- Aucune donnée à convertir`;

  // Collecter toutes les clés
  const allKeys = new Set<string>();
  array.forEach((item) => {
    if (typeof item === 'object' && item !== null) {
      Object.keys(item).forEach((key) => allKeys.add(key));
    }
  });

  const columns = Array.from(allKeys);
  const lines: string[] = [`INSERT INTO ${tableName} (${columns.join(', ')}) VALUES`];

  const values = array.map((item, index) => {
    const obj = item as Record<string, unknown>;
    const vals = columns.map((col) => formatSqlValue(obj[col]));
    const isLast = index === array.length - 1;
    return `  (${vals.join(', ')})${isLast ? ';' : ','}`;
  });

  return lines.concat(values).join('\n');
}

function formatSqlValue(value: unknown): string {
  if (value === null || value === undefined) return 'NULL';
  if (typeof value === 'number') return String(value);
  if (typeof value === 'boolean') return value ? '1' : '0';
  // Escape quotes pour SQL
  const str = String(value).replace(/'/g, "''");
  return `'${str}'`;
}

// ============================================
// UTILITAIRES
// ============================================

function normalizeToArray(data: unknown): unknown[] {
  if (Array.isArray(data)) return data;
  if (typeof data === 'object' && data !== null) {
    // Chercher un tableau nested (ex: { users: [...] })
    const values = Object.values(data);
    for (const value of values) {
      if (Array.isArray(value)) return value;
    }
    // Sinon, retourner l'objet comme élément unique
    return [data];
  }
  return [data];
}

// ============================================
// CONVERTISSEUR PRINCIPAL
// ============================================

type ConverterFn = (input: string) => string;

const CONVERTERS: Record<string, Record<string, ConverterFn>> = {
  json: {
    csv: (input) => toCsv(parseJson(input)),
    xml: (input) => toXml(parseJson(input)),
    yaml: (input) => toYaml(parseJson(input)),
    sql: (input) => toSql(parseJson(input)),
  },
  csv: {
    json: (input) => toJson(parseCsv(input)),
    xml: (input) => toXml({ items: parseCsv(input) }, 'data'),
    yaml: (input) => toYaml(parseCsv(input)),
    sql: (input) => toSql(parseCsv(input)),
  },
  xml: {
    json: (input) => toJson(parseXml(input)),
    csv: (input) => toCsv(parseXml(input)),
    yaml: (input) => toYaml(parseXml(input)),
    sql: (input) => toSql(parseXml(input)),
  },
  yaml: {
    json: (input) => toJson(parseYaml(input)),
    csv: (input) => toCsv(parseYaml(input)),
    xml: (input) => toXml(parseYaml(input)),
    sql: (input) => toSql(parseYaml(input)),
  },
  sql: {
    // SQL vers autres formats - parse les INSERT statements
    json: (input) => toJson(parseSqlInsert(input)),
    csv: (input) => toCsv(parseSqlInsert(input)),
    xml: (input) => toXml({ records: parseSqlInsert(input) }, 'data'),
    yaml: (input) => toYaml(parseSqlInsert(input)),
  },
};

function parseSqlInsert(input: string): Array<Record<string, unknown>> {
  const result: Array<Record<string, unknown>> = [];

  // Regex pour extraire les colonnes
  const columnsMatch = input.match(/INSERT INTO \w+\s*\(([^)]+)\)/i);
  if (!columnsMatch) {
    throw new Error('Format SQL INSERT invalide');
  }

  const columns = columnsMatch[1].split(',').map((c) => c.trim());

  // Regex pour extraire les valeurs
  const valuesRegex = /\(([^)]+)\)/g;
  let match;

  // Ignorer la première correspondance (colonnes)
  const valuesSection = input.substring(input.indexOf('VALUES') + 6);

  while ((match = valuesRegex.exec(valuesSection)) !== null) {
    const values = parseSqlValues(match[1]);
    const row: Record<string, unknown> = {};

    columns.forEach((col, i) => {
      row[col] = values[i];
    });

    result.push(row);
  }

  return result;
}

function parseSqlValues(valuesStr: string): unknown[] {
  const values: unknown[] = [];
  let current = '';
  let inString = false;
  let stringChar = '';

  for (let i = 0; i < valuesStr.length; i++) {
    const char = valuesStr[i];

    if ((char === "'" || char === '"') && !inString) {
      inString = true;
      stringChar = char;
    } else if (char === stringChar && inString) {
      if (valuesStr[i + 1] === stringChar) {
        current += char;
        i++;
      } else {
        inString = false;
        stringChar = '';
      }
    } else if (char === ',' && !inString) {
      values.push(parseSqlValue(current.trim()));
      current = '';
    } else {
      current += char;
    }
  }

  if (current.trim()) {
    values.push(parseSqlValue(current.trim()));
  }

  return values;
}

function parseSqlValue(value: string): unknown {
  if (value.toUpperCase() === 'NULL') return null;
  if (/^-?\d+$/.test(value)) return parseInt(value, 10);
  if (/^-?\d*\.\d+$/.test(value)) return parseFloat(value);
  // Retirer les guillemets
  if ((value.startsWith("'") && value.endsWith("'")) || (value.startsWith('"') && value.endsWith('"'))) {
    return value.slice(1, -1).replace(/''/g, "'").replace(/""/g, '"');
  }
  return value;
}

// ============================================
// API PUBLIQUE
// ============================================

export function convert(source: string, target: string, input: string): ConversionResult {
  try {
    const converter = CONVERTERS[source]?.[target];

    if (!converter) {
      return {
        success: false,
        error: `Conversion ${source} vers ${target} non supportée`,
      };
    }

    if (!input.trim()) {
      return {
        success: false,
        error: 'Veuillez entrer des données à convertir',
      };
    }

    const result = converter(input);

    return {
      success: true,
      data: result,
    };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Erreur de conversion inconnue',
    };
  }
}
