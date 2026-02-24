export interface ITenant {
  name: string;
  subDomain:string,
  status?: "active" | "suspended";
  plan?: "free"|"pro"|"enterprise";
}
