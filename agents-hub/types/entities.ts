export type EntityBase = {
  id: number;
  name: string;
  description?: string | null;
  createdAt: number; // epoch ms
};

export type Agent = EntityBase & {
  status?: string | null;
};

export type Software = EntityBase & {
  repoUrl?: string | null;
};

export type Project = EntityBase & {
  status?: string | null;
};

export type NewAgent = Omit<Agent, 'id' | 'createdAt'>;
export type NewSoftware = Omit<Software, 'id' | 'createdAt'>;
export type NewProject = Omit<Project, 'id' | 'createdAt'>;