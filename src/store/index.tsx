import { create } from 'zustand';

interface State {
  files: File[];
  setFiles: (files: File[]) => void;
}

export const folderStore = create<State>()(set => ({
  files: [],
  setFiles: (files: File[]) => {
    set({ files });
  }
}));
