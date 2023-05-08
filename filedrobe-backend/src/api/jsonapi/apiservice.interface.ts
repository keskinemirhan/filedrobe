export interface ApiService {
  getAll?(included: string[]);
  get?(id: string, included: string[], fields: string[]);
  type: string;
  include: string[];
  fields: string[];
}
