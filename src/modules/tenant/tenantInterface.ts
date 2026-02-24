export interface ITenant {
  name: string;
  subDomain:string,
  isActive?: boolean;
  status?: "active" | "suspended";
  plan?: "free"|"pro"|"enterprise";
}
