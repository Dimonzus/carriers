export interface Carrier {
  id: string;
  name: string;
  phone: string;
  capacity: string;
  volume: string;
  description: string;
  tags: string[];
  notes: string;
  vehicleType: string;
  rating: number | null;
}
