import { create } from 'zustand';
import type { Agent, Project, Software, NewAgent, NewProject, NewSoftware } from '@/types/entities';
import * as Agents from '@/services/agents';
import * as Projects from '@/services/projects';
import * as SoftwareSvc from '@/services/software';
import { initializeDatabase } from '@/lib/db';

type LoadingState = {
  initializing: boolean;
  loading: boolean;
  error?: string | null;
};

type DataState = LoadingState & {
  agents: Agent[];
  software: Software[];
  projects: Project[];
  init: () => Promise<void>;
  refreshAll: () => Promise<void>;
  createAgent: (input: NewAgent) => Promise<void>;
  updateAgent: (id: number, input: Partial<NewAgent>) => Promise<void>;
  deleteAgent: (id: number) => Promise<void>;
  createSoftware: (input: NewSoftware) => Promise<void>;
  updateSoftware: (id: number, input: Partial<NewSoftware>) => Promise<void>;
  deleteSoftware: (id: number) => Promise<void>;
  createProject: (input: NewProject) => Promise<void>;
  updateProject: (id: number, input: Partial<NewProject>) => Promise<void>;
  deleteProject: (id: number) => Promise<void>;
};

export const useDataStore = create<DataState>((set, get) => ({
  initializing: true,
  loading: false,
  error: null,
  agents: [],
  software: [],
  projects: [],

  init: async () => {
    try {
      set({ initializing: true, error: null });
      await initializeDatabase();
      await get().refreshAll();
    } catch (e: any) {
      set({ error: e?.message ?? 'Initialization failed' });
    } finally {
      set({ initializing: false });
    }
  },

  refreshAll: async () => {
    try {
      set({ loading: true, error: null });
      const [agents, software, projects] = await Promise.all([
        Agents.listAgents(),
        SoftwareSvc.listSoftware(),
        Projects.listProjects(),
      ]);
      set({ agents, software, projects });
    } catch (e: any) {
      set({ error: e?.message ?? 'Failed to load data' });
    } finally {
      set({ loading: false });
    }
  },

  createAgent: async (input) => {
    await Agents.createAgent(input);
    await get().refreshAll();
  },
  updateAgent: async (id, input) => {
    await Agents.updateAgent(id, input);
    await get().refreshAll();
  },
  deleteAgent: async (id) => {
    await Agents.deleteAgent(id);
    await get().refreshAll();
  },

  createSoftware: async (input) => {
    await SoftwareSvc.createSoftware(input);
    await get().refreshAll();
  },
  updateSoftware: async (id, input) => {
    await SoftwareSvc.updateSoftware(id, input);
    await get().refreshAll();
  },
  deleteSoftware: async (id) => {
    await SoftwareSvc.deleteSoftware(id);
    await get().refreshAll();
  },

  createProject: async (input) => {
    await Projects.createProject(input);
    await get().refreshAll();
  },
  updateProject: async (id, input) => {
    await Projects.updateProject(id, input);
    await get().refreshAll();
  },
  deleteProject: async (id) => {
    await Projects.deleteProject(id);
    await get().refreshAll();
  },
}));