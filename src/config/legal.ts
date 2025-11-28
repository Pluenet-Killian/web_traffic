// Legal Content Configuration
// All legal pages content for i18n support

export interface LegalContent {
  privacy: {
    title: string;
    lastUpdated: string;
    sections: {
      title: string;
      content: string;
    }[];
  };
  terms: {
    title: string;
    lastUpdated: string;
    sections: {
      title: string;
      content: string;
    }[];
  };
  cookies: {
    title: string;
    lastUpdated: string;
    sections: {
      title: string;
      content: string;
    }[];
  };
}

export const LEGAL_CONTENT: Record<string, LegalContent> = {
  en: {
    privacy: {
      title: 'Privacy Policy',
      lastUpdated: 'November 2024',
      sections: [
        {
          title: 'Introduction',
          content: `Welcome to Data Converter ("we," "our," or "us"). We are committed to protecting your privacy and being transparent about how we handle your information. This Privacy Policy explains our practices regarding the collection, use, and disclosure of information when you use our website and services.`,
        },
        {
          title: 'Information We Do NOT Collect',
          content: `**Your Files and Data Stay Private**

Our core service operates entirely in your web browser using client-side JavaScript. This means:

• **No file uploads to our servers** - All file conversions (JSON, CSV, XML, PDF, images, etc.) happen locally in your browser
• **No data transmission** - Your files never leave your device
• **No storage** - We do not store, access, or have any visibility into the content of your files
• **No user accounts** - We don't require registration or collect personal account information

This architecture ensures complete privacy for your sensitive data.`,
        },
        {
          title: 'Information We Collect',
          content: `While we don't collect your file data, we do collect limited information for analytics and advertising purposes:

**Automatically Collected Information:**
• IP address (anonymized where possible)
• Browser type and version
• Device type and operating system
• Pages visited and time spent
• Referral source
• Country/region (derived from IP)

**Cookies and Similar Technologies:**
• Essential cookies for website functionality
• Analytics cookies (Google Analytics)
• Advertising cookies (Google AdSense)

For more details about cookies, please see our Cookie Policy.`,
        },
        {
          title: 'How We Use Information',
          content: `We use the collected information to:

• **Improve our services** - Understand which tools are most useful
• **Analyze website performance** - Monitor load times and errors
• **Display relevant advertising** - Serve ads through Google AdSense
• **Comply with legal obligations** - Respond to legal requests when required

We do NOT:
• Sell your personal information
• Share your information with third parties for their marketing purposes
• Use your information for profiling or automated decision-making`,
        },
        {
          title: 'Third-Party Services',
          content: `We use the following third-party services:

**Google Analytics**
We use Google Analytics to understand how visitors use our site. Google Analytics collects information anonymously and reports website trends without identifying individual visitors. Learn more: https://policies.google.com/privacy

**Google AdSense**
We display advertisements through Google AdSense. Google may use cookies to serve ads based on your prior visits to our website or other websites. You can opt out of personalized advertising at: https://www.google.com/settings/ads

These services have their own privacy policies and data collection practices.`,
        },
        {
          title: 'Your Rights (GDPR/CCPA)',
          content: `Depending on your location, you may have the following rights:

**For EU/EEA Residents (GDPR):**
• Right to access your data
• Right to rectification
• Right to erasure ("right to be forgotten")
• Right to restrict processing
• Right to data portability
• Right to object to processing
• Right to withdraw consent

**For California Residents (CCPA):**
• Right to know what personal information is collected
• Right to delete personal information
• Right to opt-out of the sale of personal information
• Right to non-discrimination

To exercise these rights, please contact us using the information below.`,
        },
        {
          title: 'Data Retention',
          content: `Since we don't collect or store your file data, there is no file data to retain.

Analytics data is retained according to our analytics provider's policies (typically 26 months for Google Analytics).

You can request deletion of any data we may have about you by contacting us.`,
        },
        {
          title: 'Children\'s Privacy',
          content: `Our service is not directed to children under 13 (or 16 in some jurisdictions). We do not knowingly collect personal information from children. If you believe we have inadvertently collected information about a child, please contact us immediately.`,
        },
        {
          title: 'Changes to This Policy',
          content: `We may update this Privacy Policy from time to time. We will notify you of any changes by posting the new Privacy Policy on this page and updating the "Last Updated" date.

We encourage you to review this Privacy Policy periodically for any changes.`,
        },
        {
          title: 'Contact Us',
          content: `If you have any questions about this Privacy Policy or our privacy practices, please contact us at:

Email: privacy@data-converter.com

We will respond to your inquiry within 30 days.`,
        },
      ],
    },
    terms: {
      title: 'Terms of Service',
      lastUpdated: 'November 2024',
      sections: [
        {
          title: 'Acceptance of Terms',
          content: `By accessing or using Data Converter ("Service"), you agree to be bound by these Terms of Service ("Terms"). If you do not agree to these Terms, please do not use our Service.

We reserve the right to update these Terms at any time. Your continued use of the Service after changes constitutes acceptance of the modified Terms.`,
        },
        {
          title: 'Description of Service',
          content: `Data Converter provides free online tools for:
• Converting data between formats (JSON, CSV, XML, YAML, SQL, Markdown, HTML)
• Processing PDF files (dark mode conversion, flattening, metadata removal)
• Adding watermarks to images

All processing occurs entirely in your web browser. We do not upload, store, or have access to your files.`,
        },
        {
          title: 'Use of Service',
          content: `You agree to use the Service only for lawful purposes and in accordance with these Terms. You agree NOT to:

• Use the Service for any illegal or unauthorized purpose
• Attempt to probe, scan, or test the vulnerability of the Service
• Interfere with or disrupt the Service or servers
• Use automated scripts to collect information from the Service
• Attempt to bypass any measures we use to restrict access
• Reproduce, duplicate, copy, sell, or exploit any portion of the Service without permission`,
        },
        {
          title: 'Intellectual Property',
          content: `The Service and its original content, features, and functionality are owned by Data Converter and are protected by international copyright, trademark, and other intellectual property laws.

You may use the Service for personal and commercial purposes, but you may not:
• Copy or modify the Service's source code
• Remove any copyright or proprietary notices
• Create derivative works based on the Service`,
        },
        {
          title: 'Disclaimer of Warranties',
          content: `**THE SERVICE IS PROVIDED "AS IS" AND "AS AVAILABLE" WITHOUT WARRANTIES OF ANY KIND, EITHER EXPRESS OR IMPLIED.**

We do not warrant that:
• The Service will be uninterrupted or error-free
• The results obtained from using the Service will be accurate or reliable
• Any errors in the Service will be corrected

You understand and agree that you use the Service at your own risk. We are not responsible for any data loss, corruption, or other damages resulting from the use of our tools.`,
        },
        {
          title: 'Limitation of Liability',
          content: `**TO THE MAXIMUM EXTENT PERMITTED BY LAW, DATA CONVERTER SHALL NOT BE LIABLE FOR ANY INDIRECT, INCIDENTAL, SPECIAL, CONSEQUENTIAL, OR PUNITIVE DAMAGES, INCLUDING BUT NOT LIMITED TO:**

• Loss of profits, data, use, or goodwill
• Service interruption
• Computer damage or system failure
• The cost of substitute services

Our total liability for any claims arising from your use of the Service shall not exceed the amount you paid us in the past twelve months (which is $0 for our free service).`,
        },
        {
          title: 'Indemnification',
          content: `You agree to defend, indemnify, and hold harmless Data Converter and its officers, directors, employees, and agents from any claims, damages, obligations, losses, liabilities, costs, or debt arising from:

• Your use of the Service
• Your violation of these Terms
• Your violation of any third-party right, including intellectual property rights
• Any content you process through the Service`,
        },
        {
          title: 'Third-Party Links and Services',
          content: `Our Service may contain links to third-party websites or services that are not owned or controlled by Data Converter.

We have no control over, and assume no responsibility for, the content, privacy policies, or practices of any third-party websites or services.`,
        },
        {
          title: 'Termination',
          content: `We may terminate or suspend your access to the Service immediately, without prior notice or liability, for any reason, including breach of these Terms.

All provisions of the Terms which by their nature should survive termination shall survive, including ownership provisions, warranty disclaimers, indemnity, and limitations of liability.`,
        },
        {
          title: 'Governing Law',
          content: `These Terms shall be governed by and construed in accordance with the laws of the European Union, without regard to its conflict of law provisions.

Any disputes arising from these Terms shall be resolved in the competent courts of the European Union.`,
        },
        {
          title: 'Contact Us',
          content: `If you have any questions about these Terms of Service, please contact us at:

Email: legal@data-converter.com`,
        },
      ],
    },
    cookies: {
      title: 'Cookie Policy',
      lastUpdated: 'November 2024',
      sections: [
        {
          title: 'What Are Cookies',
          content: `Cookies are small text files that are stored on your computer or mobile device when you visit a website. They are widely used to make websites work more efficiently and to provide information to website owners.

Cookies can be "persistent" (remain on your device until deleted) or "session" (deleted when you close your browser).`,
        },
        {
          title: 'How We Use Cookies',
          content: `We use cookies for the following purposes:

**Essential Cookies**
These cookies are necessary for the website to function properly. They enable basic functions like page navigation and access to secure areas. The website cannot function properly without these cookies.

**Analytics Cookies**
We use Google Analytics to collect information about how visitors use our website. This helps us improve our services. These cookies collect information anonymously.

**Advertising Cookies**
We use Google AdSense to display advertisements. These cookies may track your browsing habits to show you relevant ads across different websites.`,
        },
        {
          title: 'Types of Cookies We Use',
          content: `| Cookie Type | Provider | Purpose | Duration |
|-------------|----------|---------|----------|
| Essential | Data Converter | Store consent preferences | 1 year |
| Analytics | Google Analytics | Website usage statistics | 2 years |
| Advertising | Google AdSense | Personalized advertising | Varies |
| Advertising | DoubleClick | Ad serving and tracking | 2 years |`,
        },
        {
          title: 'Third-Party Cookies',
          content: `Some cookies are placed by third-party services that appear on our pages:

**Google Analytics (_ga, _gid, _gat)**
Used to distinguish users and throttle request rate. More info: https://policies.google.com/technologies/cookies

**Google AdSense (IDE, DSID, FLC, AID, TAID)**
Used for advertising purposes and to measure ad effectiveness. More info: https://policies.google.com/technologies/ads

These third parties have their own privacy and cookie policies.`,
        },
        {
          title: 'Managing Cookies',
          content: `You can control and manage cookies in several ways:

**Through Our Cookie Banner**
When you first visit our site, you can choose to accept or refuse non-essential cookies.

**Through Your Browser**
Most browsers allow you to:
• View what cookies are stored and delete them individually
• Block third-party cookies
• Block all cookies
• Clear all cookies when you close the browser

Note: Blocking cookies may impact your experience on our website and other sites.

**Browser-Specific Instructions:**
• Chrome: Settings > Privacy and Security > Cookies
• Firefox: Options > Privacy & Security > Cookies
• Safari: Preferences > Privacy > Cookies
• Edge: Settings > Privacy & Services > Cookies`,
        },
        {
          title: 'Opt-Out Options',
          content: `You can opt out of specific cookie types:

**Google Analytics Opt-Out**
Install the Google Analytics Opt-out Browser Add-on: https://tools.google.com/dlpage/gaoptout

**Google Ads Personalization**
Manage your ad settings at: https://www.google.com/settings/ads

**Industry Opt-Out Tools**
• Your Online Choices (EU): https://www.youronlinechoices.com
• Network Advertising Initiative (US): https://optout.networkadvertising.org
• Digital Advertising Alliance (US): https://optout.aboutads.info`,
        },
        {
          title: 'Do Not Track',
          content: `Some browsers have a "Do Not Track" feature that signals to websites that you do not want to be tracked.

Currently, there is no industry standard for how websites should respond to Do Not Track signals. Our website does not currently respond to Do Not Track signals, but you can use the cookie management options described above.`,
        },
        {
          title: 'Changes to This Policy',
          content: `We may update this Cookie Policy from time to time to reflect changes in technology, legislation, or our data practices.

Any changes will be posted on this page with an updated "Last Updated" date. We encourage you to check this page periodically.`,
        },
        {
          title: 'Contact Us',
          content: `If you have any questions about our use of cookies, please contact us at:

Email: privacy@data-converter.com`,
        },
      ],
    },
  },
  fr: {
    privacy: {
      title: 'Politique de Confidentialité',
      lastUpdated: 'Novembre 2024',
      sections: [
        {
          title: 'Introduction',
          content: `Bienvenue sur Data Converter ("nous", "notre"). Nous nous engageons à protéger votre vie privée et à être transparents sur la façon dont nous traitons vos informations. Cette Politique de Confidentialité explique nos pratiques concernant la collecte, l'utilisation et la divulgation d'informations lorsque vous utilisez notre site web et nos services.`,
        },
        {
          title: 'Informations que nous NE collectons PAS',
          content: `**Vos fichiers et données restent privés**

Notre service fonctionne entièrement dans votre navigateur web via JavaScript côté client. Cela signifie :

• **Aucun téléchargement de fichiers vers nos serveurs** - Toutes les conversions (JSON, CSV, XML, PDF, images, etc.) se font localement dans votre navigateur
• **Aucune transmission de données** - Vos fichiers ne quittent jamais votre appareil
• **Aucun stockage** - Nous ne stockons pas, n'accédons pas et n'avons aucune visibilité sur le contenu de vos fichiers
• **Aucun compte utilisateur** - Nous n'exigeons pas d'inscription

Cette architecture garantit une confidentialité totale pour vos données sensibles.`,
        },
        {
          title: 'Informations que nous collectons',
          content: `Bien que nous ne collections pas vos données de fichiers, nous collectons des informations limitées à des fins d'analyse et de publicité :

**Informations collectées automatiquement :**
• Adresse IP (anonymisée si possible)
• Type et version du navigateur
• Type d'appareil et système d'exploitation
• Pages visitées et temps passé
• Source de référence
• Pays/région (dérivé de l'IP)

**Cookies et technologies similaires :**
• Cookies essentiels pour le fonctionnement du site
• Cookies d'analyse (Google Analytics)
• Cookies publicitaires (Google AdSense)

Pour plus de détails sur les cookies, veuillez consulter notre Politique des Cookies.`,
        },
        {
          title: 'Comment nous utilisons les informations',
          content: `Nous utilisons les informations collectées pour :

• **Améliorer nos services** - Comprendre quels outils sont les plus utiles
• **Analyser les performances du site** - Surveiller les temps de chargement et les erreurs
• **Afficher des publicités pertinentes** - Diffuser des annonces via Google AdSense
• **Respecter les obligations légales** - Répondre aux demandes légales si nécessaire

Nous NE faisons PAS :
• Vendre vos informations personnelles
• Partager vos informations avec des tiers à des fins marketing
• Utiliser vos informations pour le profilage ou la prise de décision automatisée`,
        },
        {
          title: 'Vos droits (RGPD)',
          content: `En tant que résident de l'UE/EEE, vous disposez des droits suivants :

• Droit d'accès à vos données
• Droit de rectification
• Droit à l'effacement ("droit à l'oubli")
• Droit à la limitation du traitement
• Droit à la portabilité des données
• Droit d'opposition au traitement
• Droit de retirer votre consentement

Pour exercer ces droits, veuillez nous contacter à : privacy@data-converter.com`,
        },
        {
          title: 'Nous contacter',
          content: `Si vous avez des questions sur cette Politique de Confidentialité, contactez-nous à :

Email: privacy@data-converter.com

Nous répondrons à votre demande dans les 30 jours.`,
        },
      ],
    },
    terms: {
      title: 'Conditions d\'Utilisation',
      lastUpdated: 'Novembre 2024',
      sections: [
        {
          title: 'Acceptation des conditions',
          content: `En accédant ou en utilisant Data Converter ("Service"), vous acceptez d'être lié par ces Conditions d'Utilisation. Si vous n'acceptez pas ces Conditions, veuillez ne pas utiliser notre Service.`,
        },
        {
          title: 'Description du service',
          content: `Data Converter fournit des outils en ligne gratuits pour :
• Convertir des données entre formats (JSON, CSV, XML, YAML, SQL, Markdown, HTML)
• Traiter des fichiers PDF (mode sombre, aplatissement, suppression des métadonnées)
• Ajouter des filigranes aux images

Tout le traitement se fait entièrement dans votre navigateur. Nous ne téléchargeons, ne stockons et n'avons pas accès à vos fichiers.`,
        },
        {
          title: 'Exclusion de garanties',
          content: `**LE SERVICE EST FOURNI "TEL QUEL" ET "SELON DISPONIBILITÉ" SANS GARANTIE D'AUCUNE SORTE.**

Nous ne garantissons pas que :
• Le Service sera ininterrompu ou sans erreur
• Les résultats obtenus seront précis ou fiables
• Les erreurs seront corrigées

Vous comprenez et acceptez que vous utilisez le Service à vos propres risques.`,
        },
        {
          title: 'Limitation de responsabilité',
          content: `**DANS TOUTE LA MESURE PERMISE PAR LA LOI, DATA CONVERTER NE SERA PAS RESPONSABLE DES DOMMAGES INDIRECTS, ACCESSOIRES, SPÉCIAUX OU CONSÉCUTIFS.**

Notre responsabilité totale ne dépassera pas le montant que vous nous avez payé au cours des douze derniers mois (soit 0€ pour notre service gratuit).`,
        },
        {
          title: 'Nous contacter',
          content: `Si vous avez des questions sur ces Conditions d'Utilisation, contactez-nous à :

Email: legal@data-converter.com`,
        },
      ],
    },
    cookies: {
      title: 'Politique des Cookies',
      lastUpdated: 'Novembre 2024',
      sections: [
        {
          title: 'Que sont les cookies',
          content: `Les cookies sont de petits fichiers texte stockés sur votre ordinateur ou appareil mobile lorsque vous visitez un site web. Ils sont largement utilisés pour faire fonctionner les sites web plus efficacement et fournir des informations aux propriétaires de sites.`,
        },
        {
          title: 'Comment nous utilisons les cookies',
          content: `Nous utilisons les cookies aux fins suivantes :

**Cookies essentiels**
Nécessaires au fonctionnement du site. Le site ne peut pas fonctionner correctement sans ces cookies.

**Cookies d'analyse**
Nous utilisons Google Analytics pour collecter des informations sur l'utilisation de notre site.

**Cookies publicitaires**
Nous utilisons Google AdSense pour afficher des publicités. Ces cookies peuvent suivre vos habitudes de navigation.`,
        },
        {
          title: 'Gérer les cookies',
          content: `Vous pouvez contrôler et gérer les cookies de plusieurs façons :

**Via notre bannière de cookies**
Lors de votre première visite, vous pouvez choisir d'accepter ou de refuser les cookies non essentiels.

**Via votre navigateur**
La plupart des navigateurs vous permettent de voir, supprimer ou bloquer les cookies.

Note : Le blocage des cookies peut affecter votre expérience sur notre site.`,
        },
        {
          title: 'Nous contacter',
          content: `Si vous avez des questions sur notre utilisation des cookies, contactez-nous à :

Email: privacy@data-converter.com`,
        },
      ],
    },
  },
};

export function getLegalContent(lang: string): LegalContent {
  return LEGAL_CONTENT[lang] || LEGAL_CONTENT['en'];
}
