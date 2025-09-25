import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_DATABASE_URL; 
const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

export const supabase = createClient(supabaseUrl, supabaseKey);

// Types
export interface Customer {
  id?: string;
  full_name: string;
  phone: string;
  car_name: string;
  car_year: string;
  car_segment_id: string;
  license_plate?: string;
  customer_source?: string;
  created_at?: string;
}

export interface CarSegment {
  id: string;
  name: string;
  display_name: string;
  created_at?: string;
}

export interface CarPart {
  id: string;
  name: string;
  display_name: string;
  category: string;
  created_at?: string;
}

export interface Service {
  id: string;
  name: string;
  display_name: string;
  type: 'required' | 'optional';
  created_at?: string;
}

export interface RemovablePart {
  id: string;
  car_part_id: string;
  name: string;
  display_name: string;
  created_at?: string;
}

export interface Pricing {
  id: string;
  car_segment_id: string;
  item_type: 'car_part' | 'service' | 'removable_part' | 'panel_painting';
  item_id?: string;
  price: number;
  created_at?: string;
}

export interface Quotation {
  id?: string;
  customer_id: string;
  service_type: 'spot_painting' | 'panel_painting' | 'color_change' | 'touch_up';
  total_amount: number;
  quotation_data: any;
  status: 'draft' | 'sent' | 'approved' | 'rejected';
  created_at?: string;
}

export interface QuotationItem {
  car_part_id: string;
  car_part_name: string;
  selected_services: string[];
  selected_removable_parts: string[];
  price: number;
}
