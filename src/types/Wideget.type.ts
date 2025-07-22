export type WidgetItem = {
  key: string;
  visible: boolean;
  order: number;
};

export type ManageWidgetsDrawerProps = {
  isOpen: boolean;
  setIsOpen: (open: boolean) => void;
};
