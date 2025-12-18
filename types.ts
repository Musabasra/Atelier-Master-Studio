
export interface Project {
  id: string;
  title: string;
  imageUrl: string;
  lastSynced: string;
  status: 'Draft' | 'Ready for Polish' | 'Polished';
  layers: Layer[];
}

export interface Layer {
  id: string;
  name: string;
  visible: boolean;
  type: 'sketch' | 'ai-polish' | 'reference';
}

export interface Annotation {
  id: string;
  label: string;
  instruction: string;
  points: { x: number; y: number }[];
}

export enum Tool {
  SELECT = 'SELECT',
  COMMENT = 'COMMENT',
  LIGHTING = 'LIGHTING',
  POSE = 'POSE'
}
