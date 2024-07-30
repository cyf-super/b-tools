import { create } from 'zustand';

interface State {
  files: File[];
  splitImage: string;
  setFiles: (files: File[]) => void;
  setSplitImage: (src: string) => void;
}

export const folderStore = create<State>()(set => ({
  files: [],
  setFiles: (files: File[]) => {
    set({ files });
  },
  splitImage: '',
  setSplitImage: (src: string) => {
    set({
      splitImage: src
    });
  }
}));
