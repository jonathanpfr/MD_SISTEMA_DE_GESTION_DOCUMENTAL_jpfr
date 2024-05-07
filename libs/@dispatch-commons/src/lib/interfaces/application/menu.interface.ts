export interface IMenu {
  id: any;
  parentId?: any;
  icon?: string;
  title: string;
  description?: string;
  link?: string;
  children?: IMenu[];

  // Auxiliares
  expanded?: boolean;
  checked?: boolean;
  edit?: boolean;
  loading?: boolean;
}
