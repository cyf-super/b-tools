import { create } from 'zustand';

interface State {
  files: File[];
  splitImage: string;
  descendant: any[];
  setFiles: (files: File[]) => void;
  setSplitImage: (src: string) => void;
  setDescendant: (descendant: any[]) => void;
}

export const globalStore = create<State>()(set => ({
  files: [],
  setFiles: (files: File[]) => {
    set({ files });
  },
  splitImage: '',
  setSplitImage: (src: string) => {
    set({
      splitImage: src
    });
  },
  descendant: [
    {
      children: [{ text: '' }],
      operations: [],
      selection: {
        anchor: { offset: 0, path: [0, 0] },
        focus: { offset: 0, path: [0, 0] }
      },
      marks: null,
      history: { undos: [], redos: [] }
    }
  ],
  setDescendant: (descendant: Descendant[]) => {
    set({
      descendant
    });
  }
}));
