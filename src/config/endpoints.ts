export const BASE_URL = 'https://dev.syntx-system.com';

export interface Endpoint {
  path: string;
  method: 'GET' | 'POST';
  category: string;
  name: string;
  description: string;
}

export const endpoints: Endpoint[] = [
  // Kern-System
  { path: '/health', method: 'GET', category: 'kern', name: 'Health', description: 'System Herzschlag' },
  { path: '/monitoring/live-queue', method: 'GET', category: 'kern', name: 'Live Queue', description: 'Real-time Queue Monitor' },
  
  // Prompts
  { path: '/prompts/all', method: 'GET', category: 'prompts', name: 'All Prompts', description: 'Liste aller Prompts' },
  { path: '/prompts/best', method: 'GET', category: 'prompts', name: 'Best Prompts', description: 'Nur Score 100' },
  { path: '/prompts/table-view', method: 'GET', category: 'prompts', name: 'Table View', description: 'Tabellen-Format' },
  { path: '/prompts/complete-export', method: 'GET', category: 'prompts', name: 'Complete Export', description: 'Vollständiger Export' },
  { path: '/prompts/search', method: 'GET', category: 'prompts', name: 'Search', description: 'Keyword-Suche' },
  { path: '/prompts/fields/breakdown', method: 'GET', category: 'prompts', name: 'Fields Breakdown', description: 'Field Detection Analysis' },
  { path: '/prompts/costs/total', method: 'GET', category: 'prompts', name: 'Costs', description: 'Token Costs' },
  
  // Advanced
  { path: '/prompts/advanced/predict-score', method: 'POST', category: 'advanced', name: 'Predict Score', description: 'Score Vorhersage' },
  { path: '/prompts/advanced/fields-missing-analysis', method: 'GET', category: 'advanced', name: 'Fields Missing', description: 'Fehlende Felder' },
  { path: '/prompts/advanced/keyword-combinations', method: 'GET', category: 'advanced', name: 'Keyword Combos', description: 'Beste Kombinationen' },
  { path: '/prompts/advanced/optimal-wrapper-for-topic', method: 'GET', category: 'advanced', name: 'Optimal Wrapper', description: 'Wrapper pro Topic' },
  { path: '/prompts/advanced/templates-by-score', method: 'GET', category: 'advanced', name: 'Templates', description: 'Nach Score sortiert' },
  { path: '/prompts/advanced/evolution-learning-curve', method: 'GET', category: 'advanced', name: 'Learning Curve', description: 'Evolution Kurve' },
  
  // Analytics
  { path: '/analytics/complete-dashboard', method: 'GET', category: 'analytics', name: 'Dashboard', description: 'Komplett-Übersicht' },
  { path: '/analytics/scores/distribution', method: 'GET', category: 'analytics', name: 'Score Distribution', description: 'Verteilung' },
  
  // Evolution
  { path: '/evolution/syntx-vs-normal', method: 'GET', category: 'evolution', name: 'SYNTX vs Normal', description: 'Der Beweis' },
  { path: '/evolution/keywords/power', method: 'GET', category: 'evolution', name: 'Keyword Power', description: 'Stärkste Keywords' },
  { path: '/evolution/topics/resonance', method: 'GET', category: 'evolution', name: 'Topic Resonance', description: 'Topic-Analyse' },
  
  // Compare
  { path: '/compare/wrapper-performance', method: 'GET', category: 'compare', name: 'Wrapper Performance', description: 'Wrapper Vergleich' },
  
  // Feld
  { path: '/feld/drift', method: 'GET', category: 'feld', name: 'Drift', description: 'Drift Detection' },
  { path: '/feld/topics', method: 'GET', category: 'feld', name: 'Topics', description: 'Active Topics' },
  { path: '/feld/prompts', method: 'GET', category: 'feld', name: 'Prompts', description: 'Raw Prompt Data' },
  
  // Resonanz
  { path: '/resonanz/queue', method: 'GET', category: 'resonanz', name: 'Queue Resonanz', description: 'Queue Flow Rate' },
  { path: '/resonanz/system', method: 'GET', category: 'resonanz', name: 'System Resonanz', description: 'Overall Status' },
  
  // Generation
  { path: '/generation/progress', method: 'GET', category: 'generation', name: 'Progress', description: 'Evolution Progress' },
  
  // Strom
  { path: '/strom/health', method: 'GET', category: 'strom', name: 'Strom Health', description: 'Infrastructure' },
  { path: '/strom/queue/status', method: 'GET', category: 'strom', name: 'Queue Status', description: 'Queue Details' },
];

export const categories = [
  { id: 'kern', name: 'Kern-System', icon: '🏥' },
  { id: 'prompts', name: 'Prompts', icon: '📋' },
  { id: 'advanced', name: 'Advanced', icon: '🧬' },
  { id: 'analytics', name: 'Analytics', icon: '📊' },
  { id: 'evolution', name: 'Evolution', icon: '🔬' },
  { id: 'compare', name: 'Compare', icon: '⚖️' },
  { id: 'feld', name: 'Feld', icon: '🌊' },
  { id: 'resonanz', name: 'Resonanz', icon: '🌀' },
  { id: 'generation', name: 'Generation', icon: '🧬' },
  { id: 'strom', name: 'Strom', icon: '⚡' },
];
