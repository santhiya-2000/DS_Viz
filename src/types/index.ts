export interface DSOperation {
  name: string;
  description: string;
  complexity: string;
}

export interface DataStructure {
  id: string;
  name: string;
  description: string;
  operations: DSOperation[];
}

export interface DSComponentProps {
  data: DataStructure;
}
