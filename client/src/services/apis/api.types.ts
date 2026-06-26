export interface ResponseDTO<TStatus extends number, TData> {
  status: TStatus;
  data: TData;
}
