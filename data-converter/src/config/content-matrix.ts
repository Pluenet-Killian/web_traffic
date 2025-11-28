/**
 * Semantic Content Matrix
 * Unique, high-quality content for each conversion pair
 * Prevents thin content issues and improves SEO
 */

import type { Locale } from './i18n';

export interface ConversionContent {
  intro: string;
  useCases: string[];
  benefits: string[];
  technicalNote: string;
  faq: {
    question: string;
    answer: string;
  };
}

type ContentMatrix = Record<string, Record<Locale, ConversionContent>>;

// ============================================
// CONTENT FOR MAJOR CONVERSION PAIRS
// ============================================

export const CONTENT_MATRIX: ContentMatrix = {
  'json-to-csv': {
    en: {
      intro: 'JSON is the standard format for web APIs and modern applications, but it can be challenging to analyze in spreadsheet software. Converting JSON to CSV transforms your hierarchical data into a flat, tabular format that opens seamlessly in Excel, Google Sheets, or any data analysis tool.',
      useCases: [
        'Export API responses for Excel analysis',
        'Prepare data for Shopify/WooCommerce imports',
        'Convert MongoDB exports for reporting',
        'Transform webhook payloads for BI tools',
      ],
      benefits: [
        'Flatten nested objects automatically',
        'Preserve data types where possible',
        'Handle arrays with intelligent expansion',
        'Generate clean, RFC 4180 compliant CSV',
      ],
      technicalNote: 'Our converter uses PapaParse, an industry-standard library, to generate properly quoted and escaped CSV files. Nested JSON objects are flattened using dot notation (e.g., "user.address.city").',
      faq: {
        question: 'How are nested JSON objects handled in CSV conversion?',
        answer: 'Nested objects are flattened using dot notation. For example, {"user": {"name": "John"}} becomes a column "user.name" with value "John". Arrays of primitives are joined with commas, while arrays of objects are stringified to preserve the complete data structure.',
      },
    },
    fr: {
      intro: 'JSON est le format standard pour les API web et les applications modernes, mais il peut être difficile à analyser dans un tableur. Convertir JSON en CSV transforme vos données hiérarchiques en un format tabulaire plat qui s\'ouvre parfaitement dans Excel, Google Sheets ou tout outil d\'analyse.',
      useCases: [
        'Exporter les réponses API pour analyse Excel',
        'Préparer les données pour imports Shopify/WooCommerce',
        'Convertir les exports MongoDB pour le reporting',
        'Transformer les webhooks pour les outils BI',
      ],
      benefits: [
        'Aplatissement automatique des objets imbriqués',
        'Préservation des types de données',
        'Gestion intelligente des tableaux',
        'Génération de CSV conforme RFC 4180',
      ],
      technicalNote: 'Notre convertisseur utilise PapaParse, une librairie standard de l\'industrie, pour générer des fichiers CSV correctement formatés. Les objets JSON imbriqués sont aplatis avec la notation point (ex: "user.address.city").',
      faq: {
        question: 'Comment les objets JSON imbriqués sont-ils gérés en CSV ?',
        answer: 'Les objets imbriqués sont aplatis avec la notation point. Par exemple, {"user": {"name": "John"}} devient une colonne "user.name" avec la valeur "John". Les tableaux de primitives sont joints par des virgules, tandis que les tableaux d\'objets sont sérialisés pour préserver la structure complète.',
      },
    },
    es: {
      intro: 'JSON es el formato estándar para APIs web y aplicaciones modernas, pero puede ser difícil de analizar en hojas de cálculo. Convertir JSON a CSV transforma tus datos jerárquicos en un formato tabular plano que se abre perfectamente en Excel, Google Sheets o cualquier herramienta de análisis.',
      useCases: [
        'Exportar respuestas de API para análisis en Excel',
        'Preparar datos para importaciones de Shopify/WooCommerce',
        'Convertir exportaciones de MongoDB para reportes',
        'Transformar webhooks para herramientas BI',
      ],
      benefits: [
        'Aplanar objetos anidados automáticamente',
        'Preservar tipos de datos cuando es posible',
        'Manejar arrays con expansión inteligente',
        'Generar CSV limpio conforme a RFC 4180',
      ],
      technicalNote: 'Nuestro convertidor usa PapaParse, una librería estándar de la industria, para generar archivos CSV correctamente formateados. Los objetos JSON anidados se aplanan usando notación de punto.',
      faq: {
        question: '¿Cómo se manejan los objetos JSON anidados en la conversión a CSV?',
        answer: 'Los objetos anidados se aplanan usando notación de punto. Por ejemplo, {"user": {"name": "John"}} se convierte en una columna "user.name" con valor "John".',
      },
    },
    de: {
      intro: 'JSON ist das Standardformat für Web-APIs und moderne Anwendungen, aber es kann schwierig sein, es in Tabellenkalkulationen zu analysieren. Die Konvertierung von JSON zu CSV transformiert Ihre hierarchischen Daten in ein flaches, tabellarisches Format.',
      useCases: [
        'API-Antworten für Excel-Analyse exportieren',
        'Daten für Shopify/WooCommerce-Importe vorbereiten',
        'MongoDB-Exporte für Berichte konvertieren',
        'Webhooks für BI-Tools transformieren',
      ],
      benefits: [
        'Verschachtelte Objekte automatisch abflachen',
        'Datentypen wo möglich beibehalten',
        'Arrays intelligent verarbeiten',
        'Saubere RFC 4180-konforme CSV generieren',
      ],
      technicalNote: 'Unser Konverter verwendet PapaParse, eine Industriestandard-Bibliothek, um korrekt formatierte CSV-Dateien zu generieren.',
      faq: {
        question: 'Wie werden verschachtelte JSON-Objekte bei der CSV-Konvertierung behandelt?',
        answer: 'Verschachtelte Objekte werden mit Punkt-Notation abgeflacht. Zum Beispiel wird {"user": {"name": "John"}} zu einer Spalte "user.name" mit dem Wert "John".',
      },
    },
    pt: {
      intro: 'JSON é o formato padrão para APIs web e aplicações modernas, mas pode ser difícil de analisar em planilhas. Converter JSON para CSV transforma seus dados hierárquicos em um formato tabular plano que abre perfeitamente no Excel, Google Sheets ou qualquer ferramenta de análise.',
      useCases: [
        'Exportar respostas de API para análise no Excel',
        'Preparar dados para importações Shopify/WooCommerce',
        'Converter exportações do MongoDB para relatórios',
        'Transformar webhooks para ferramentas de BI',
      ],
      benefits: [
        'Achatar objetos aninhados automaticamente',
        'Preservar tipos de dados quando possível',
        'Manipular arrays com expansão inteligente',
        'Gerar CSV limpo conforme RFC 4180',
      ],
      technicalNote: 'Nosso conversor usa PapaParse, uma biblioteca padrão da indústria, para gerar arquivos CSV corretamente formatados.',
      faq: {
        question: 'Como objetos JSON aninhados são tratados na conversão para CSV?',
        answer: 'Objetos aninhados são achatados usando notação de ponto. Por exemplo, {"user": {"name": "John"}} se torna uma coluna "user.name" com valor "John".',
      },
    },
  },

  'csv-to-json': {
    en: {
      intro: 'CSV files are ubiquitous in data exchange, but modern applications often require JSON format. Converting CSV to JSON structures your tabular data into a hierarchical format ideal for APIs, databases, and web applications.',
      useCases: [
        'Import Excel data into React/Vue applications',
        'Prepare datasets for MongoDB or Firebase',
        'Transform spreadsheet exports for REST APIs',
        'Migrate legacy data to modern formats',
      ],
      benefits: [
        'Automatic data type detection (numbers, booleans)',
        'Clean JSON array output',
        'Proper Unicode handling',
        'Whitespace trimming and cleanup',
      ],
      technicalNote: 'Our parser uses PapaParse with automatic type inference. Headers become object keys, and each row becomes a JSON object in an array. Empty cells are preserved as empty strings.',
      faq: {
        question: 'Does the converter detect data types automatically?',
        answer: 'Yes! Numeric values are converted to numbers, "true"/"false" become booleans, and everything else remains as strings. This ensures your JSON is ready for immediate use in JavaScript applications without additional parsing.',
      },
    },
    fr: {
      intro: 'Les fichiers CSV sont omniprésents dans l\'échange de données, mais les applications modernes requièrent souvent le format JSON. Convertir CSV en JSON structure vos données tabulaires dans un format hiérarchique idéal pour les APIs, bases de données et applications web.',
      useCases: [
        'Importer des données Excel dans des applications React/Vue',
        'Préparer des jeux de données pour MongoDB ou Firebase',
        'Transformer des exports tableur pour les APIs REST',
        'Migrer des données legacy vers des formats modernes',
      ],
      benefits: [
        'Détection automatique des types (nombres, booléens)',
        'Sortie JSON tableau propre',
        'Gestion correcte de l\'Unicode',
        'Nettoyage des espaces blancs',
      ],
      technicalNote: 'Notre parser utilise PapaParse avec inférence de type automatique. Les en-têtes deviennent des clés d\'objet et chaque ligne devient un objet JSON.',
      faq: {
        question: 'Le convertisseur détecte-t-il les types de données automatiquement ?',
        answer: 'Oui ! Les valeurs numériques sont converties en nombres, "true"/"false" deviennent des booléens, et tout le reste reste en chaîne de caractères.',
      },
    },
    es: {
      intro: 'Los archivos CSV son ubicuos en el intercambio de datos, pero las aplicaciones modernas a menudo requieren formato JSON. Convertir CSV a JSON estructura tus datos tabulares en un formato jerárquico ideal para APIs y bases de datos.',
      useCases: [
        'Importar datos de Excel en aplicaciones React/Vue',
        'Preparar conjuntos de datos para MongoDB o Firebase',
        'Transformar exportaciones de hojas de cálculo para APIs REST',
        'Migrar datos legacy a formatos modernos',
      ],
      benefits: [
        'Detección automática de tipos de datos',
        'Salida JSON array limpia',
        'Manejo correcto de Unicode',
        'Limpieza de espacios en blanco',
      ],
      technicalNote: 'Nuestro parser usa PapaParse con inferencia de tipo automática.',
      faq: {
        question: '¿El convertidor detecta tipos de datos automáticamente?',
        answer: 'Sí. Los valores numéricos se convierten en números, "true"/"false" se convierten en booleanos, y todo lo demás permanece como cadenas.',
      },
    },
    de: {
      intro: 'CSV-Dateien sind im Datenaustausch allgegenwärtig, aber moderne Anwendungen erfordern oft JSON-Format. Die Konvertierung von CSV zu JSON strukturiert Ihre tabellarischen Daten in ein hierarchisches Format.',
      useCases: [
        'Excel-Daten in React/Vue-Anwendungen importieren',
        'Datensätze für MongoDB oder Firebase vorbereiten',
        'Tabellenexporte für REST-APIs transformieren',
        'Legacy-Daten zu modernen Formaten migrieren',
      ],
      benefits: [
        'Automatische Datentyperkennung',
        'Saubere JSON-Array-Ausgabe',
        'Korrekte Unicode-Behandlung',
        'Bereinigung von Leerzeichen',
      ],
      technicalNote: 'Unser Parser verwendet PapaParse mit automatischer Typinferenz.',
      faq: {
        question: 'Erkennt der Konverter Datentypen automatisch?',
        answer: 'Ja! Numerische Werte werden in Zahlen konvertiert, "true"/"false" werden zu Booleschen Werten.',
      },
    },
    pt: {
      intro: 'Arquivos CSV são onipresentes na troca de dados, mas aplicações modernas frequentemente requerem formato JSON. Converter CSV para JSON estrutura seus dados tabulares em um formato hierárquico ideal para APIs e bancos de dados.',
      useCases: [
        'Importar dados do Excel em aplicações React/Vue',
        'Preparar conjuntos de dados para MongoDB ou Firebase',
        'Transformar exportações de planilhas para APIs REST',
        'Migrar dados legados para formatos modernos',
      ],
      benefits: [
        'Detecção automática de tipos de dados',
        'Saída JSON array limpa',
        'Manipulação correta de Unicode',
        'Limpeza de espaços em branco',
      ],
      technicalNote: 'Nosso parser usa PapaParse com inferência de tipo automática.',
      faq: {
        question: 'O conversor detecta tipos de dados automaticamente?',
        answer: 'Sim! Valores numéricos são convertidos em números, "true"/"false" se tornam booleanos.',
      },
    },
  },

  'json-to-yaml': {
    en: {
      intro: 'YAML has become the de facto standard for configuration files in DevOps, Kubernetes, Docker Compose, and CI/CD pipelines. Converting JSON to YAML makes your configuration files more readable and maintainable for human operators.',
      useCases: [
        'Create Kubernetes deployment manifests',
        'Generate Docker Compose configurations',
        'Build CI/CD pipeline definitions (GitHub Actions, GitLab CI)',
        'Configure Ansible playbooks',
      ],
      benefits: [
        'Human-readable output without braces',
        'Proper indentation and formatting',
        'Comment-ready format for documentation',
        'Direct compatibility with kubectl, docker-compose',
      ],
      technicalNote: 'We use js-yaml with optimized settings for readable output. The converter handles complex nested structures while maintaining proper YAML indentation (2 spaces) and avoiding unnecessary quoting.',
      faq: {
        question: 'Will my YAML work with Kubernetes/Docker?',
        answer: 'Yes! The output is fully compliant with YAML 1.2 specification and works directly with kubectl, docker-compose, ansible-playbook, and other DevOps tools without any modifications.',
      },
    },
    fr: {
      intro: 'YAML est devenu le standard de facto pour les fichiers de configuration en DevOps, Kubernetes, Docker Compose et pipelines CI/CD. Convertir JSON en YAML rend vos fichiers de configuration plus lisibles et maintenables.',
      useCases: [
        'Créer des manifests de déploiement Kubernetes',
        'Générer des configurations Docker Compose',
        'Construire des définitions de pipeline CI/CD',
        'Configurer des playbooks Ansible',
      ],
      benefits: [
        'Sortie lisible sans accolades',
        'Indentation et formatage corrects',
        'Format prêt pour les commentaires',
        'Compatibilité directe avec kubectl, docker-compose',
      ],
      technicalNote: 'Nous utilisons js-yaml avec des paramètres optimisés pour une sortie lisible.',
      faq: {
        question: 'Mon YAML fonctionnera-t-il avec Kubernetes/Docker ?',
        answer: 'Oui ! La sortie est entièrement conforme à la spécification YAML 1.2 et fonctionne directement avec kubectl, docker-compose et autres outils DevOps.',
      },
    },
    es: {
      intro: 'YAML se ha convertido en el estándar de facto para archivos de configuración en DevOps, Kubernetes, Docker Compose y pipelines CI/CD. Convertir JSON a YAML hace que tus archivos de configuración sean más legibles.',
      useCases: [
        'Crear manifiestos de despliegue de Kubernetes',
        'Generar configuraciones de Docker Compose',
        'Construir definiciones de pipeline CI/CD',
        'Configurar playbooks de Ansible',
      ],
      benefits: [
        'Salida legible sin llaves',
        'Indentación y formato correctos',
        'Formato listo para comentarios',
        'Compatibilidad directa con kubectl, docker-compose',
      ],
      technicalNote: 'Usamos js-yaml con configuración optimizada para salida legible.',
      faq: {
        question: '¿Mi YAML funcionará con Kubernetes/Docker?',
        answer: 'Sí. La salida cumple completamente con la especificación YAML 1.2 y funciona directamente con kubectl y docker-compose.',
      },
    },
    de: {
      intro: 'YAML ist zum De-facto-Standard für Konfigurationsdateien in DevOps, Kubernetes, Docker Compose und CI/CD-Pipelines geworden. JSON zu YAML zu konvertieren macht Ihre Konfigurationsdateien lesbarer.',
      useCases: [
        'Kubernetes-Deployment-Manifeste erstellen',
        'Docker-Compose-Konfigurationen generieren',
        'CI/CD-Pipeline-Definitionen erstellen',
        'Ansible-Playbooks konfigurieren',
      ],
      benefits: [
        'Lesbare Ausgabe ohne Klammern',
        'Korrekte Einrückung und Formatierung',
        'Kommentarfähiges Format',
        'Direkte Kompatibilität mit kubectl, docker-compose',
      ],
      technicalNote: 'Wir verwenden js-yaml mit optimierten Einstellungen für lesbare Ausgabe.',
      faq: {
        question: 'Wird mein YAML mit Kubernetes/Docker funktionieren?',
        answer: 'Ja! Die Ausgabe entspricht vollständig der YAML 1.2-Spezifikation und funktioniert direkt mit kubectl und docker-compose.',
      },
    },
    pt: {
      intro: 'YAML tornou-se o padrão de facto para arquivos de configuração em DevOps, Kubernetes, Docker Compose e pipelines CI/CD. Converter JSON para YAML torna seus arquivos de configuração mais legíveis.',
      useCases: [
        'Criar manifestos de deployment do Kubernetes',
        'Gerar configurações do Docker Compose',
        'Construir definições de pipeline CI/CD',
        'Configurar playbooks do Ansible',
      ],
      benefits: [
        'Saída legível sem chaves',
        'Indentação e formatação corretas',
        'Formato pronto para comentários',
        'Compatibilidade direta com kubectl, docker-compose',
      ],
      technicalNote: 'Usamos js-yaml com configurações otimizadas para saída legível.',
      faq: {
        question: 'Meu YAML funcionará com Kubernetes/Docker?',
        answer: 'Sim! A saída é totalmente compatível com a especificação YAML 1.2 e funciona diretamente com kubectl e docker-compose.',
      },
    },
  },

  'csv-to-sql': {
    en: {
      intro: 'Transform your spreadsheet data directly into SQL INSERT statements ready for database import. Our converter generates complete SQL including CREATE TABLE with inferred column types, making database migrations seamless.',
      useCases: [
        'Migrate Excel data to MySQL/PostgreSQL',
        'Bulk import records from spreadsheets',
        'Seed development databases with test data',
        'Convert legacy CSV exports to SQL dumps',
      ],
      benefits: [
        'Automatic type inference (INTEGER, VARCHAR, DATE)',
        'Generated CREATE TABLE statement',
        'Properly escaped values (SQL injection safe)',
        'Compatible with MySQL, PostgreSQL, SQLite',
      ],
      technicalNote: 'The converter analyzes sample values to infer SQL types: integers, decimals, dates (ISO format), and strings. All string values are properly escaped with single quotes doubled to prevent SQL injection.',
      faq: {
        question: 'Is the generated SQL safe from injection attacks?',
        answer: 'Yes! All string values are properly escaped following SQL standards. Single quotes in data are doubled (\'\'), ensuring the output is safe to execute directly in any SQL database.',
      },
    },
    fr: {
      intro: 'Transformez vos données tableur directement en instructions SQL INSERT prêtes pour l\'import en base de données. Notre convertisseur génère du SQL complet incluant CREATE TABLE avec des types de colonnes inférés.',
      useCases: [
        'Migrer des données Excel vers MySQL/PostgreSQL',
        'Import massif depuis des tableurs',
        'Initialiser des bases de développement',
        'Convertir des exports CSV legacy en dumps SQL',
      ],
      benefits: [
        'Inférence automatique des types',
        'Génération de CREATE TABLE',
        'Valeurs correctement échappées',
        'Compatible MySQL, PostgreSQL, SQLite',
      ],
      technicalNote: 'Le convertisseur analyse les valeurs pour inférer les types SQL. Toutes les valeurs sont correctement échappées pour prévenir l\'injection SQL.',
      faq: {
        question: 'Le SQL généré est-il protégé contre les injections ?',
        answer: 'Oui ! Toutes les valeurs sont correctement échappées selon les standards SQL.',
      },
    },
    es: {
      intro: 'Transforma tus datos de hoja de cálculo directamente en instrucciones SQL INSERT listas para importar en base de datos.',
      useCases: [
        'Migrar datos de Excel a MySQL/PostgreSQL',
        'Importación masiva desde hojas de cálculo',
        'Poblar bases de datos de desarrollo',
        'Convertir exportaciones CSV a dumps SQL',
      ],
      benefits: [
        'Inferencia automática de tipos',
        'Generación de CREATE TABLE',
        'Valores escapados correctamente',
        'Compatible con MySQL, PostgreSQL, SQLite',
      ],
      technicalNote: 'El convertidor analiza valores para inferir tipos SQL.',
      faq: {
        question: '¿El SQL generado es seguro contra inyecciones?',
        answer: 'Sí. Todos los valores están correctamente escapados.',
      },
    },
    de: {
      intro: 'Transformieren Sie Ihre Tabellendaten direkt in SQL INSERT-Anweisungen, die für den Datenbankimport bereit sind.',
      useCases: [
        'Excel-Daten zu MySQL/PostgreSQL migrieren',
        'Massenimport aus Tabellenkalkulationen',
        'Entwicklungsdatenbanken mit Testdaten befüllen',
        'Legacy-CSV-Exporte in SQL-Dumps konvertieren',
      ],
      benefits: [
        'Automatische Typerkennung',
        'Generiertes CREATE TABLE',
        'Korrekt escapte Werte',
        'Kompatibel mit MySQL, PostgreSQL, SQLite',
      ],
      technicalNote: 'Der Konverter analysiert Werte, um SQL-Typen zu inferieren.',
      faq: {
        question: 'Ist das generierte SQL sicher vor Injection-Angriffen?',
        answer: 'Ja! Alle Werte sind korrekt escapt.',
      },
    },
    pt: {
      intro: 'Transforme seus dados de planilha diretamente em instruções SQL INSERT prontas para importação no banco de dados.',
      useCases: [
        'Migrar dados do Excel para MySQL/PostgreSQL',
        'Importação em massa de planilhas',
        'Popular bancos de desenvolvimento com dados de teste',
        'Converter exportações CSV para dumps SQL',
      ],
      benefits: [
        'Inferência automática de tipos',
        'Geração de CREATE TABLE',
        'Valores corretamente escapados',
        'Compatível com MySQL, PostgreSQL, SQLite',
      ],
      technicalNote: 'O conversor analisa valores para inferir tipos SQL.',
      faq: {
        question: 'O SQL gerado é seguro contra ataques de injeção?',
        answer: 'Sim! Todos os valores são corretamente escapados.',
      },
    },
  },

  'json-to-xml': {
    en: {
      intro: 'While JSON dominates modern web APIs, XML remains essential for enterprise integrations, SOAP services, and legacy systems. Our converter produces clean, well-formed XML from any JSON structure.',
      useCases: [
        'Integrate with SOAP web services',
        'Generate RSS/Atom feeds',
        'Create XML configurations for Java applications',
        'Interface with enterprise ERP/CRM systems',
      ],
      benefits: [
        'Valid, well-formed XML output',
        'UTF-8 encoding declaration included',
        'Smart array-to-element conversion',
        'Proper character escaping',
      ],
      technicalNote: 'The converter maps JSON objects to XML elements, arrays to repeated elements, and handles special characters with proper XML escaping. The output is valid XML 1.0 with UTF-8 encoding.',
      faq: {
        question: 'How are JSON arrays converted to XML?',
        answer: 'Arrays are converted to repeated XML elements. For example, {"users": [{"name": "John"}, {"name": "Jane"}]} becomes multiple <user> elements inside a <users> container. The singular form is automatically inferred from plural keys.',
      },
    },
    fr: {
      intro: 'Bien que JSON domine les APIs web modernes, XML reste essentiel pour les intégrations enterprise, services SOAP et systèmes legacy.',
      useCases: [
        'Intégrer avec des services web SOAP',
        'Générer des flux RSS/Atom',
        'Créer des configurations XML pour applications Java',
        'Interfacer avec des systèmes ERP/CRM',
      ],
      benefits: [
        'Sortie XML valide et bien formée',
        'Déclaration d\'encodage UTF-8 incluse',
        'Conversion intelligente tableau-vers-élément',
        'Échappement correct des caractères',
      ],
      technicalNote: 'Le convertisseur mappe les objets JSON vers des éléments XML avec un échappement approprié.',
      faq: {
        question: 'Comment les tableaux JSON sont-ils convertis en XML ?',
        answer: 'Les tableaux sont convertis en éléments XML répétés. La forme singulière est automatiquement inférée des clés plurielles.',
      },
    },
    es: {
      intro: 'Mientras JSON domina las APIs web modernas, XML sigue siendo esencial para integraciones empresariales y servicios SOAP.',
      useCases: [
        'Integrar con servicios web SOAP',
        'Generar feeds RSS/Atom',
        'Crear configuraciones XML para aplicaciones Java',
        'Interfaz con sistemas ERP/CRM',
      ],
      benefits: [
        'Salida XML válida y bien formada',
        'Declaración de codificación UTF-8 incluida',
        'Conversión inteligente de arrays a elementos',
        'Escape correcto de caracteres',
      ],
      technicalNote: 'El convertidor mapea objetos JSON a elementos XML con escape apropiado.',
      faq: {
        question: '¿Cómo se convierten los arrays JSON a XML?',
        answer: 'Los arrays se convierten en elementos XML repetidos.',
      },
    },
    de: {
      intro: 'Während JSON moderne Web-APIs dominiert, bleibt XML für Unternehmensintegrationen und SOAP-Dienste unerlässlich.',
      useCases: [
        'Mit SOAP-Webdiensten integrieren',
        'RSS/Atom-Feeds generieren',
        'XML-Konfigurationen für Java erstellen',
        'Mit ERP/CRM-Systemen verbinden',
      ],
      benefits: [
        'Gültige, wohlgeformte XML-Ausgabe',
        'UTF-8-Kodierungsdeklaration enthalten',
        'Intelligente Array-zu-Element-Konvertierung',
        'Korrektes Zeichen-Escaping',
      ],
      technicalNote: 'Der Konverter bildet JSON-Objekte auf XML-Elemente ab.',
      faq: {
        question: 'Wie werden JSON-Arrays in XML konvertiert?',
        answer: 'Arrays werden in wiederholte XML-Elemente konvertiert.',
      },
    },
    pt: {
      intro: 'Enquanto JSON domina APIs web modernas, XML permanece essencial para integrações empresariais e serviços SOAP.',
      useCases: [
        'Integrar com serviços web SOAP',
        'Gerar feeds RSS/Atom',
        'Criar configurações XML para aplicações Java',
        'Interface com sistemas ERP/CRM',
      ],
      benefits: [
        'Saída XML válida e bem formada',
        'Declaração de codificação UTF-8 incluída',
        'Conversão inteligente de arrays para elementos',
        'Escape correto de caracteres',
      ],
      technicalNote: 'O conversor mapeia objetos JSON para elementos XML.',
      faq: {
        question: 'Como arrays JSON são convertidos para XML?',
        answer: 'Arrays são convertidos em elementos XML repetidos.',
      },
    },
  },

  'json-to-markdown': {
    en: {
      intro: 'Transform JSON data into beautifully formatted Markdown tables, perfect for documentation, GitHub READMEs, and technical writing. Our converter creates aligned columns for maximum readability.',
      useCases: [
        'Generate documentation tables from API responses',
        'Create GitHub README data tables',
        'Build changelog entries from JSON data',
        'Produce technical specification tables',
      ],
      benefits: [
        'Automatically aligned columns',
        'Escaped pipe characters in content',
        'Clean, copy-paste ready output',
        'Compatible with GitHub, GitLab, Notion',
      ],
      technicalNote: 'The converter calculates optimal column widths based on content and generates properly aligned Markdown table syntax with pipes and dashes.',
      faq: {
        question: 'Are the table columns aligned properly?',
        answer: 'Yes! The converter calculates the maximum width of each column and pads cells accordingly, creating perfectly aligned tables that look professional in any Markdown renderer.',
      },
    },
    fr: {
      intro: 'Transformez vos données JSON en tableaux Markdown formatés, parfaits pour la documentation, les README GitHub et la rédaction technique.',
      useCases: [
        'Générer des tableaux de documentation depuis des APIs',
        'Créer des tableaux pour README GitHub',
        'Construire des entrées de changelog',
        'Produire des tableaux de spécifications techniques',
      ],
      benefits: [
        'Colonnes automatiquement alignées',
        'Caractères pipe échappés',
        'Sortie prête au copier-coller',
        'Compatible GitHub, GitLab, Notion',
      ],
      technicalNote: 'Le convertisseur calcule les largeurs optimales des colonnes.',
      faq: {
        question: 'Les colonnes du tableau sont-elles correctement alignées ?',
        answer: 'Oui ! Le convertisseur calcule la largeur maximale de chaque colonne pour créer des tableaux parfaitement alignés.',
      },
    },
    es: {
      intro: 'Transforma datos JSON en tablas Markdown bellamente formateadas, perfectas para documentación y READMEs de GitHub.',
      useCases: [
        'Generar tablas de documentación desde APIs',
        'Crear tablas para README de GitHub',
        'Construir entradas de changelog',
        'Producir tablas de especificaciones técnicas',
      ],
      benefits: [
        'Columnas alineadas automáticamente',
        'Caracteres pipe escapados',
        'Salida lista para copiar y pegar',
        'Compatible con GitHub, GitLab, Notion',
      ],
      technicalNote: 'El convertidor calcula anchos óptimos de columnas.',
      faq: {
        question: '¿Las columnas de la tabla están alineadas correctamente?',
        answer: 'Sí. El convertidor calcula el ancho máximo de cada columna.',
      },
    },
    de: {
      intro: 'Transformieren Sie JSON-Daten in schön formatierte Markdown-Tabellen, perfekt für Dokumentation und GitHub-READMEs.',
      useCases: [
        'Dokumentationstabellen aus API-Antworten generieren',
        'GitHub-README-Datentabellen erstellen',
        'Changelog-Einträge erstellen',
        'Technische Spezifikationstabellen produzieren',
      ],
      benefits: [
        'Automatisch ausgerichtete Spalten',
        'Escapte Pipe-Zeichen',
        'Kopier-fertige Ausgabe',
        'Kompatibel mit GitHub, GitLab, Notion',
      ],
      technicalNote: 'Der Konverter berechnet optimale Spaltenbreiten.',
      faq: {
        question: 'Sind die Tabellenspalten richtig ausgerichtet?',
        answer: 'Ja! Der Konverter berechnet die maximale Breite jeder Spalte.',
      },
    },
    pt: {
      intro: 'Transforme dados JSON em tabelas Markdown formatadas, perfeitas para documentação e READMEs do GitHub.',
      useCases: [
        'Gerar tabelas de documentação de respostas de API',
        'Criar tabelas para README do GitHub',
        'Construir entradas de changelog',
        'Produzir tabelas de especificações técnicas',
      ],
      benefits: [
        'Colunas alinhadas automaticamente',
        'Caracteres pipe escapados',
        'Saída pronta para copiar e colar',
        'Compatível com GitHub, GitLab, Notion',
      ],
      technicalNote: 'O conversor calcula larguras ótimas de colunas.',
      faq: {
        question: 'As colunas da tabela estão alinhadas corretamente?',
        answer: 'Sim! O conversor calcula a largura máxima de cada coluna.',
      },
    },
  },

  'csv-to-html': {
    en: {
      intro: 'Convert CSV spreadsheet data directly into HTML tables ready to embed in your website. Our converter generates semantic, accessible HTML5 markup with proper thead and tbody structure.',
      useCases: [
        'Embed data tables in web pages',
        'Create email-friendly table layouts',
        'Generate reports for web publishing',
        'Build static site data displays',
      ],
      benefits: [
        'Semantic HTML5 structure (thead/tbody)',
        'Properly escaped special characters',
        'Ready for CSS styling',
        'Accessible table markup',
      ],
      technicalNote: 'The output uses proper HTML5 table semantics with <thead> for headers and <tbody> for data rows. All content is HTML-escaped to prevent XSS issues.',
      faq: {
        question: 'Is the HTML output accessible for screen readers?',
        answer: 'Yes! The generated HTML uses proper semantic markup with thead and tbody elements, making tables accessible for screen readers and other assistive technologies.',
      },
    },
    fr: {
      intro: 'Convertissez vos données CSV en tableaux HTML prêts à intégrer dans votre site web. Notre convertisseur génère du HTML5 sémantique et accessible.',
      useCases: [
        'Intégrer des tableaux dans des pages web',
        'Créer des mises en page pour emails',
        'Générer des rapports pour le web',
        'Construire des affichages de données statiques',
      ],
      benefits: [
        'Structure HTML5 sémantique',
        'Caractères spéciaux échappés',
        'Prêt pour le stylage CSS',
        'Balisage accessible',
      ],
      technicalNote: 'La sortie utilise les sémantiques HTML5 avec thead et tbody.',
      faq: {
        question: 'Le HTML généré est-il accessible ?',
        answer: 'Oui ! Le HTML utilise un balisage sémantique approprié avec thead et tbody.',
      },
    },
    es: {
      intro: 'Convierte datos CSV directamente en tablas HTML listas para incrustar en tu sitio web.',
      useCases: [
        'Incrustar tablas de datos en páginas web',
        'Crear diseños de tabla para emails',
        'Generar reportes para publicación web',
        'Construir visualizaciones de datos estáticos',
      ],
      benefits: [
        'Estructura HTML5 semántica',
        'Caracteres especiales escapados',
        'Listo para estilos CSS',
        'Marcado accesible',
      ],
      technicalNote: 'La salida usa semántica HTML5 con thead y tbody.',
      faq: {
        question: '¿El HTML generado es accesible?',
        answer: 'Sí. El HTML usa marcado semántico apropiado.',
      },
    },
    de: {
      intro: 'Konvertieren Sie CSV-Daten direkt in HTML-Tabellen, die in Ihre Website eingebettet werden können.',
      useCases: [
        'Datentabellen in Webseiten einbetten',
        'E-Mail-freundliche Tabellenlayouts erstellen',
        'Berichte für Web-Publishing generieren',
        'Statische Datenanzeigen erstellen',
      ],
      benefits: [
        'Semantische HTML5-Struktur',
        'Korrekt escapte Sonderzeichen',
        'Bereit für CSS-Styling',
        'Barrierefreies Markup',
      ],
      technicalNote: 'Die Ausgabe verwendet HTML5-Tabellensemantik.',
      faq: {
        question: 'Ist die HTML-Ausgabe barrierefrei?',
        answer: 'Ja! Das HTML verwendet korrektes semantisches Markup.',
      },
    },
    pt: {
      intro: 'Converta dados CSV diretamente em tabelas HTML prontas para incorporar em seu site.',
      useCases: [
        'Incorporar tabelas de dados em páginas web',
        'Criar layouts de tabela para emails',
        'Gerar relatórios para publicação web',
        'Construir exibições de dados estáticos',
      ],
      benefits: [
        'Estrutura HTML5 semântica',
        'Caracteres especiais escapados',
        'Pronto para estilização CSS',
        'Marcação acessível',
      ],
      technicalNote: 'A saída usa semântica HTML5 com thead e tbody.',
      faq: {
        question: 'O HTML gerado é acessível?',
        answer: 'Sim! O HTML usa marcação semântica apropriada.',
      },
    },
  },
};

// ============================================
// FALLBACK CONTENT GENERATOR
// ============================================

const FALLBACK_TEMPLATES: Record<Locale, ConversionContent> = {
  en: {
    intro: 'Convert your {source} data to {target} format quickly and securely. Our online converter processes everything locally in your browser, ensuring complete privacy for your data.',
    useCases: [
      'Data format migration between systems',
      'File format standardization',
      'Cross-platform data exchange',
      'Development and testing workflows',
    ],
    benefits: [
      '100% client-side processing',
      'No file size limits',
      'Instant conversion',
      'Free and unlimited usage',
    ],
    technicalNote: 'This converter uses modern JavaScript libraries to parse {source} and generate valid {target} output. All processing happens in your browser - no data is uploaded to our servers.',
    faq: {
      question: 'Is my data safe during conversion?',
      answer: 'Absolutely. All conversion happens locally in your browser using JavaScript. Your {source} data never leaves your computer - it\'s never uploaded to any server. You can even use this tool offline once the page is loaded.',
    },
  },
  fr: {
    intro: 'Convertissez vos données {source} en format {target} rapidement et en toute sécurité. Notre convertisseur en ligne traite tout localement dans votre navigateur.',
    useCases: [
      'Migration de format de données entre systèmes',
      'Standardisation des formats de fichiers',
      'Échange de données multi-plateforme',
      'Workflows de développement et de test',
    ],
    benefits: [
      'Traitement 100% côté client',
      'Pas de limite de taille',
      'Conversion instantanée',
      'Gratuit et illimité',
    ],
    technicalNote: 'Ce convertisseur utilise des bibliothèques JavaScript modernes pour parser {source} et générer du {target} valide.',
    faq: {
      question: 'Mes données sont-elles sécurisées ?',
      answer: 'Absolument. Toute la conversion se fait localement dans votre navigateur. Vos données ne quittent jamais votre ordinateur.',
    },
  },
  es: {
    intro: 'Convierte tus datos {source} a formato {target} rápida y seguramente. Nuestro convertidor procesa todo localmente en tu navegador.',
    useCases: [
      'Migración de formato de datos entre sistemas',
      'Estandarización de formatos de archivo',
      'Intercambio de datos multiplataforma',
      'Flujos de trabajo de desarrollo y pruebas',
    ],
    benefits: [
      'Procesamiento 100% del lado del cliente',
      'Sin límites de tamaño',
      'Conversión instantánea',
      'Gratis e ilimitado',
    ],
    technicalNote: 'Este convertidor usa bibliotecas JavaScript modernas para parsear {source} y generar {target} válido.',
    faq: {
      question: '¿Mis datos están seguros?',
      answer: 'Absolutamente. Toda la conversión ocurre localmente en tu navegador.',
    },
  },
  de: {
    intro: 'Konvertieren Sie Ihre {source}-Daten schnell und sicher ins {target}-Format. Unser Konverter verarbeitet alles lokal in Ihrem Browser.',
    useCases: [
      'Datenformat-Migration zwischen Systemen',
      'Standardisierung von Dateiformaten',
      'Plattformübergreifender Datenaustausch',
      'Entwicklungs- und Test-Workflows',
    ],
    benefits: [
      '100% clientseitige Verarbeitung',
      'Keine Größenbeschränkungen',
      'Sofortige Konvertierung',
      'Kostenlos und unbegrenzt',
    ],
    technicalNote: 'Dieser Konverter verwendet moderne JavaScript-Bibliotheken zum Parsen von {source} und Generieren von gültigem {target}.',
    faq: {
      question: 'Sind meine Daten sicher?',
      answer: 'Absolut. Die gesamte Konvertierung erfolgt lokal in Ihrem Browser.',
    },
  },
  pt: {
    intro: 'Converta seus dados {source} para o formato {target} de forma rápida e segura. Nosso conversor processa tudo localmente no seu navegador.',
    useCases: [
      'Migração de formato de dados entre sistemas',
      'Padronização de formatos de arquivo',
      'Troca de dados multiplataforma',
      'Fluxos de trabalho de desenvolvimento e teste',
    ],
    benefits: [
      'Processamento 100% do lado do cliente',
      'Sem limites de tamanho',
      'Conversão instantânea',
      'Grátis e ilimitado',
    ],
    technicalNote: 'Este conversor usa bibliotecas JavaScript modernas para analisar {source} e gerar {target} válido.',
    faq: {
      question: 'Meus dados estão seguros?',
      answer: 'Absolutamente. Toda a conversão acontece localmente no seu navegador.',
    },
  },
};

// ============================================
// PUBLIC API
// ============================================

export function getConversionContent(
  source: string,
  target: string,
  locale: Locale,
  sourceLabel: string,
  targetLabel: string
): ConversionContent {
  const key = `${source}-to-${target}`;
  const content = CONTENT_MATRIX[key]?.[locale];

  if (content) {
    return content;
  }

  // Generate fallback content with placeholders replaced
  const fallback = FALLBACK_TEMPLATES[locale];

  return {
    intro: fallback.intro.replace(/{source}/g, sourceLabel).replace(/{target}/g, targetLabel),
    useCases: fallback.useCases,
    benefits: fallback.benefits,
    technicalNote: fallback.technicalNote.replace(/{source}/g, sourceLabel).replace(/{target}/g, targetLabel),
    faq: {
      question: fallback.faq.question.replace(/{source}/g, sourceLabel).replace(/{target}/g, targetLabel),
      answer: fallback.faq.answer.replace(/{source}/g, sourceLabel).replace(/{target}/g, targetLabel),
    },
  };
}

// Export sample data for the converter examples
export const SAMPLE_DATA: Record<string, string> = {
  json: `[
  {
    "id": 1,
    "name": "Alice Johnson",
    "email": "alice@example.com",
    "age": 28,
    "department": "Engineering",
    "salary": 75000
  },
  {
    "id": 2,
    "name": "Bob Smith",
    "email": "bob@example.com",
    "age": 34,
    "department": "Marketing",
    "salary": 65000
  },
  {
    "id": 3,
    "name": "Carol Williams",
    "email": "carol@example.com",
    "age": 31,
    "department": "Design",
    "salary": 70000
  }
]`,
  csv: `id,name,email,age,department,salary
1,Alice Johnson,alice@example.com,28,Engineering,75000
2,Bob Smith,bob@example.com,34,Marketing,65000
3,Carol Williams,carol@example.com,31,Design,70000`,
  xml: `<?xml version="1.0" encoding="UTF-8"?>
<employees>
  <employee>
    <id>1</id>
    <name>Alice Johnson</name>
    <email>alice@example.com</email>
    <age>28</age>
    <department>Engineering</department>
  </employee>
  <employee>
    <id>2</id>
    <name>Bob Smith</name>
    <email>bob@example.com</email>
    <age>34</age>
    <department>Marketing</department>
  </employee>
</employees>`,
  yaml: `employees:
  - id: 1
    name: Alice Johnson
    email: alice@example.com
    age: 28
    department: Engineering
  - id: 2
    name: Bob Smith
    email: bob@example.com
    age: 34
    department: Marketing`,
  sql: `INSERT INTO employees (id, name, email, age, department) VALUES
  (1, 'Alice Johnson', 'alice@example.com', 28, 'Engineering'),
  (2, 'Bob Smith', 'bob@example.com', 34, 'Marketing'),
  (3, 'Carol Williams', 'carol@example.com', 31, 'Design');`,
  markdown: `| id | name           | email              | age | department  |
|----|----------------|--------------------|-----|-------------|
| 1  | Alice Johnson  | alice@example.com  | 28  | Engineering |
| 2  | Bob Smith      | bob@example.com    | 34  | Marketing   |
| 3  | Carol Williams | carol@example.com  | 31  | Design      |`,
  html: `<table>
  <thead>
    <tr>
      <th>id</th>
      <th>name</th>
      <th>email</th>
      <th>department</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td>1</td>
      <td>Alice Johnson</td>
      <td>alice@example.com</td>
      <td>Engineering</td>
    </tr>
    <tr>
      <td>2</td>
      <td>Bob Smith</td>
      <td>bob@example.com</td>
      <td>Marketing</td>
    </tr>
  </tbody>
</table>`,
};
