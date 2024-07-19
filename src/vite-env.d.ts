/// <reference types="vite/client" />

interface Children {}

interface Descendant {
  children: {
    text: string;
    bold?: boolean;
    italic?: boolean;
    code?: boolean;
  }[];
  type: string;
}

interface BaseElement {
  children: Descendant[];
  type: string;
}
