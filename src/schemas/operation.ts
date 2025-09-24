export enum OperationStatus {
  fail = 'failure',
  run = 'running',
  success = 'success',
  unknown = 'unknown',
  wait = 'waiting',
}

interface SubOperation {
  status: OperationStatus;
  error?: string;
}

export interface Operation {
  id: string;
  status: OperationStatus;
  fork?: SubOperation & {
    destination: string;
  };
  content?: SubOperation;
  commit?: SubOperation & {
    id: string;
  };
  pr?: SubOperation & {
    id: string;
  };
  merge?: SubOperation;
}
