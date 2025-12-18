
export const COLORS = {
  charcoal: '#121212',
  burgundy: '#800020',
  gold: '#D4AF37',
  offWhite: '#F5F5F5',
};

export const SAMPLE_PROJECTS = [
  {
    id: '1',
    title: 'Autumn Gala Gown',
    imageUrl: 'https://picsum.photos/seed/fashion1/800/1200',
    lastSynced: '2 mins ago',
    status: 'Ready for Polish',
    layers: [
      { id: 'l1', name: 'Original Sketch', visible: true, type: 'sketch' },
      { id: 'l2', name: 'AI Polish Preview', visible: false, type: 'ai-polish' }
    ]
  },
  {
    id: '2',
    title: 'Avant-Garde Structure',
    imageUrl: 'https://picsum.photos/seed/fashion2/800/1200',
    lastSynced: '1 hour ago',
    status: 'Ready for Polish',
    layers: [
      { id: 'l1', name: 'Structural Sketch', visible: true, type: 'sketch' }
    ]
  },
  {
    id: '3',
    title: 'Minimalist Silk Set',
    imageUrl: 'https://picsum.photos/seed/fashion3/800/1200',
    lastSynced: 'Yesterday',
    status: 'Polished',
    layers: [
      { id: 'l1', name: 'Base Sketch', visible: true, type: 'sketch' },
      { id: 'l2', name: 'Silk Rendering', visible: true, type: 'ai-polish' }
    ]
  }
];
