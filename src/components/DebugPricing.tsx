import React from 'react';
import { useSupabaseData } from '../hooks/useSupabaseData';

export const DebugPricing: React.FC = () => {
  const { pricing, carSegments, carParts, services, removableParts, loading } = useSupabaseData();

  if (loading) {
    return <div>Loading...</div>;
  }

  const groupedPricing = pricing.reduce((acc, price) => {
    const segmentName = carSegments.find(s => s.id === price.car_segment_id)?.display_name || 'Unknown';
    if (!acc[segmentName]) {
      acc[segmentName] = {
        car_part: [],
        service: [],
        removable_part: [],
        panel_painting: []
      };
    }
    acc[segmentName][price.item_type as keyof typeof acc[string]].push(price);
    return acc;
  }, {} as Record<string, Record<string, any[]>>);

  return (
    <div className="max-w-6xl mx-auto p-6 bg-white rounded-lg shadow-lg">
      <h2 className="text-2xl font-bold mb-6">Debug Pricing Data</h2>
      
      <div className="mb-6">
        <h3 className="text-lg font-semibold mb-2">Total Records: {pricing.length}</h3>
        <div className="grid grid-cols-4 gap-4 text-sm">
          <div>Car Parts: {carParts.length}</div>
          <div>Services: {services.length}</div>
          <div>Removable Parts: {removableParts.length}</div>
          <div>Car Segments: {carSegments.length}</div>
        </div>
      </div>

      {Object.entries(groupedPricing).map(([segmentName, prices]) => (
        <div key={segmentName} className="mb-8 border rounded-lg p-4">
          <h3 className="text-xl font-semibold mb-4 text-blue-600">{segmentName}</h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <div>
              <h4 className="font-medium text-gray-900 mb-2">Car Parts ({prices.car_part.length})</h4>
              <div className="space-y-1 text-sm">
                {prices.car_part.map((price, idx) => {
                  const partName = carParts.find(p => p.id === price.item_id)?.display_name || price.item_id;
                  return (
                    <div key={idx} className="flex justify-between">
                      <span>{partName}</span>
                      <span className="font-medium">{Number(price.price).toLocaleString()}đ</span>
                    </div>
                  );
                })}
              </div>
            </div>

            <div>
              <h4 className="font-medium text-gray-900 mb-2">Services ({prices.service.length})</h4>
              <div className="space-y-1 text-sm">
                {prices.service.map((price, idx) => {
                  const serviceName = services.find(s => s.id === price.item_id)?.display_name || price.item_id;
                  return (
                    <div key={idx} className="flex justify-between">
                      <span>{serviceName}</span>
                      <span className="font-medium">{Number(price.price).toLocaleString()}đ</span>
                    </div>
                  );
                })}
              </div>
            </div>

            <div>
              <h4 className="font-medium text-gray-900 mb-2">Removable Parts ({prices.removable_part.length})</h4>
              <div className="space-y-1 text-sm">
                {prices.removable_part.map((price, idx) => {
                  const partName = removableParts.find(p => p.id === price.item_id)?.display_name || price.item_id;
                  return (
                    <div key={idx} className="flex justify-between">
                      <span>{partName}</span>
                      <span className="font-medium">{Number(price.price).toLocaleString()}đ</span>
                    </div>
                  );
                })}
              </div>
            </div>

            <div>
              <h4 className="font-medium text-gray-900 mb-2">Panel Painting ({prices.panel_painting.length})</h4>
              <div className="space-y-1 text-sm">
                {prices.panel_painting.map((price, idx) => (
                  <div key={idx} className="flex justify-between">
                    <span>Base Price</span>
                    <span className="font-medium">{Number(price.price).toLocaleString()}đ</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      ))}

      {pricing.length === 0 && (
        <div className="text-center py-8">
          <div className="text-red-600 text-lg font-semibold">No pricing data found!</div>
          <p className="text-gray-600 mt-2">
            The pricing table appears to be empty. Please add pricing data to the database.
          </p>
        </div>
      )}
    </div>
  );
};