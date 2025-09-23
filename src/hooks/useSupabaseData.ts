import { useState, useEffect } from 'react';
import { supabase, CarSegment, CarPart, Service, RemovablePart, Pricing } from '../lib/supabase';

export const useSupabaseData = () => {
  const [carSegments, setCarSegments] = useState<CarSegment[]>([]);
  const [carParts, setCarParts] = useState<CarPart[]>([]);
  const [services, setServices] = useState<Service[]>([]);
  const [removableParts, setRemovableParts] = useState<RemovablePart[]>([]);
  const [pricing, setPricing] = useState<Pricing[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        
        const [segmentsRes, partsRes, servicesRes, removableRes, pricingRes] = await Promise.all([
          supabase.from('car_segments').select('*').order('display_name'),
          supabase.from('car_parts').select('*').order('display_name'),
          supabase.from('services').select('*').order('display_name'),
          supabase.from('removable_parts').select('*').order('display_name'),
          supabase.from('pricing').select('*')
        ]);

        if (segmentsRes.error) throw segmentsRes.error;
        if (partsRes.error) throw partsRes.error;
        if (servicesRes.error) throw servicesRes.error;
        if (removableRes.error) throw removableRes.error;
        if (pricingRes.error) throw pricingRes.error;

        setCarSegments(segmentsRes.data || []);
        setCarParts(partsRes.data || []);
        setServices(servicesRes.data || []);
        setRemovableParts(removableRes.data || []);
        setPricing(pricingRes.data || []);
      } catch (err) {
        console.error('Error fetching data:', err);
        setError(err instanceof Error ? err.message : 'An error occurred');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const getPrice = (carSegmentId: string, itemType: string, itemId?: string): number => {
    const priceItem = pricing.find(p => 
      p.car_segment_id === carSegmentId && 
      p.item_type === itemType && 
      (itemId ? p.item_id === itemId : !p.item_id)
    );
    const price = priceItem ? Number(priceItem.price) : 0;
    
    // Debug logging to help identify missing prices
    if (price === 0 && itemType === 'car_part') {
      console.log(`❌ No price found for car_part:`, {
        carSegmentId,
        itemType,
        itemId,
        availablePricing: pricing.filter(p => p.car_segment_id === carSegmentId && p.item_type === itemType)
      });
    } else if (itemType === 'car_part') {
      console.log(`✅ Found price for car_part:`, {
        carSegmentId,
        itemType,
        itemId,
        price
      });
    }
    
    return price;
  };

  const getRemovablePartsByCarPart = (carPartId: string): RemovablePart[] => {
    return removableParts.filter(rp => rp.car_part_id === carPartId);
  };

  const getRequiredServices = (): Service[] => {
    return services.filter(s => s.type === 'required');
  };

  const getOptionalServices = (): Service[] => {
    return services.filter(s => s.type === 'optional');
  };

  return {
    carSegments,
    carParts,
    services,
    removableParts,
    pricing,
    loading,
    error,
    getPrice,
    getRemovablePartsByCarPart,
    getRequiredServices,
    getOptionalServices
  };
};