export interface IEnvelopeData<T> {
  data: T;
  message: string;
  statusCode: number;
  url: string;
}

export interface IEnvelopeArrayData<T> {
  data: T[];
  pagination: {
    currentPage: number;
    pageSize: number;
    totalItems: number;
    totalPages: number;
  };
  message: string;
  statusCode: number;
  url: string;
}
