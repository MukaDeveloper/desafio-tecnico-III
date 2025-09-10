export interface BaseDialogData {
  title?: string;
  message: string;
  panelClass?: string;
  actions?: {
    label: string;
    value: any;
    color?: 'primary' | 'accent' | 'warn';
    focus?: boolean;
  }[];
}
