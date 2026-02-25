export class ApiResponse<T> {
  public succes: boolean;
  public message: string;
  public data?: T;

  constructor(message: string, data?: T) {
    this.succes = true;
    this.message = message, 
    this.data = data;
  }
}
