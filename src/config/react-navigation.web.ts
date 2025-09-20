// src/config/react-navigation.web.ts
// Веб-заглушки для React Navigation модулей

// Заглушка для useBackButton
export const useBackButton = () => {
  // В веб-версии кнопка "назад" браузера работает автоматически
  return;
};

// Заглушка для useDocumentTitle  
export const useDocumentTitle = (title?: string) => {
  if (title && typeof document !== 'undefined') {
    document.title = title;
  }
};

// Заглушка для useLinking
export const useLinking = () => {
  return {
    getInitialState: () => null,
    subscribe: () => () => {},
    getStateFromPath: () => null,
    getPathFromState: () => '',
  };
};

// Заглушка для MaskedView
export const MaskedView = ({ children }: { children: any }) => children;

// Заглушка для GestureHandler
export const GestureHandler = ({ children }: { children: any }) => children;

export default {
  useBackButton,
  useDocumentTitle,
  useLinking,
  MaskedView,
  GestureHandler,
};