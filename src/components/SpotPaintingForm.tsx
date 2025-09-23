import React, { useState, useEffect } from 'react';
import { ChevronDown, ChevronUp, Plus, Minus, Edit3 } from 'lucide-react';
import { useSupabaseData } from '../hooks/useSupabaseData';
import { Customer, QuotationItem } from '../lib/supabase';

interface SpotPaintingFormProps {
  customer: Customer;
  onComplete: (items: QuotationItem[], total: number) => void;
}

interface SelectedItem {
  car_part_id: string;
  optional_services: string[];
  removable_parts: string[];
  custom_price?: number;
}

export const SpotPaintingForm: React.FC<SpotPaintingFormProps> = ({ customer, onComplete }) => {
  const { 
    carParts, 
    pricing,
    getOptionalServices, 
    getRemovablePartsByCarPart, 
    getPrice,
    loading 
  } = useSupabaseData();
  
  const [selectedItems, setSelectedItems] = useState<Record<string, SelectedItem>>({});
  const [expandedParts, setExpandedParts] = useState<string[]>([]);
  const [editingPrice, setEditingPrice] = useState<string | null>(null);
  const [tempPrice, setTempPrice] = useState<string>('');

  const optionalServices = getOptionalServices();

  const togglePartExpansion = (partId: string) => {
    setExpandedParts(prev => 
      prev.includes(partId) 
        ? prev.filter(id => id !== partId)
        : [...prev, partId]
    );
  };

  const togglePartSelection = (partId: string) => {
    setSelectedItems(prev => {
      const newItems = { ...prev };
      if (newItems[partId]) {
        delete newItems[partId];
      } else {
        newItems[partId] = {
          car_part_id: partId,
          optional_services: [],
          removable_parts: [],
        };
      }
      return newItems;
    });
  };

  const toggleOptionalService = (partId: string, serviceId: string) => {
    setSelectedItems(prev => ({
      ...prev,
      [partId]: {
        ...prev[partId],
        optional_services: prev[partId].optional_services.includes(serviceId)
          ? prev[partId].optional_services.filter(id => id !== serviceId)
          : [...prev[partId].optional_services, serviceId]
      }
    }));
  };

  const toggleRemovablePart = (partId: string, removableId: string) => {
    setSelectedItems(prev => ({
      ...prev,
      [partId]: {
        ...prev[partId],
        removable_parts: prev[partId].removable_parts.includes(removableId)
          ? prev[partId].removable_parts.filter(id => id !== removableId)
          : [...prev[partId].removable_parts, removableId]
      }
    }));
  };

  const startPriceEdit = (partId: string) => {
    const currentPrice = calculatePartPrice(partId);
    setEditingPrice(partId);
    setTempPrice(currentPrice.toString());
  };

  const savePriceEdit = (partId: string) => {
    const newPrice = parseInt(tempPrice) || 0;
    setSelectedItems(prev => ({
      ...prev,
      [partId]: {
        ...prev[partId],
        custom_price: newPrice
      }
    }));
    setEditingPrice(null);
    setTempPrice('');
  };

  const cancelPriceEdit = () => {
    setEditingPrice(null);
    setTempPrice('');
  };

  const calculatePartPrice = (partId: string): number => {
    const item = selectedItems[partId];
    if (!item || !customer.car_segment_id) return 0;

    // Use custom price if set
    if (item.custom_price !== undefined) {
      return item.custom_price;
    }

    let total = 0;
    
    // Base price for the car part
    total += getPrice(customer.car_segment_id, 'car_part', partId);
    
    // Add optional services
    item.optional_services.forEach(serviceId => {
      total += getPrice(customer.car_segment_id, 'service', serviceId);
    });
    
    // Add removable parts
    item.removable_parts.forEach(removableId => {
      total += getPrice(customer.car_segment_id, 'removable_part', removableId);
    });
    
    return total;
  };

  const getBasePartPrice = (partId: string): number => {
    if (!customer.car_segment_id) return 0;
    return getPrice(customer.car_segment_id, 'car_part', partId);
  };
  const calculateTotalPrice = (): number => {
    return Object.keys(selectedItems).reduce((total, partId) => {
      return total + calculatePartPrice(partId);
    }, 0);
  };

  const handleComplete = () => {
    const items: QuotationItem[] = Object.entries(selectedItems).map(([partId, item]) => {
      const carPart = carParts.find(p => p.id === partId);
      return {
        car_part_id: partId,
        car_part_name: carPart?.display_name || '',
        selected_services: item.optional_services,
        selected_removable_parts: item.removable_parts,
        price: calculatePartPrice(partId)
      };
    });

    onComplete(items, calculateTotalPrice());
  };

  const formatPrice = (price: number): string => {
    return new Intl.NumberFormat('vi-VN').format(price);
  };

  // Debug function to check pricing data
  const debugPricing = () => {
    console.log('=== PRICING DEBUG ===');
    console.log('Customer car_segment_id:', customer.car_segment_id);
    console.log('Available car parts:', carParts.map(p => ({ id: p.id, name: p.name, display_name: p.display_name })));
    console.log('Available pricing data:', pricing.filter(p => p.car_segment_id === customer.car_segment_id));
    
    // Test specific part pricing
    const testPartId = carParts[0]?.id;
    if (testPartId) {
      const testPrice = getPrice(customer.car_segment_id, 'car_part', testPartId);
      console.log(`Test price for part ${testPartId}:`, testPrice);
    }
  };

  // Run debug on component mount
  React.useEffect(() => {
    if (!loading && customer.car_segment_id) {
      debugPricing();
    }
  }, [loading, customer.car_segment_id, carParts, pricing]);

  if (loading) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto">
      <h2 className="text-2xl font-bold text-gray-900 mb-6 text-center">
        Chọn Các Bộ Phận Cần Sơn
      </h2>

      <div className="space-y-4 mb-8">
        {carParts.map((part) => {
          const isSelected = !!selectedItems[part.id];
          const isExpanded = expandedParts.includes(part.id);
          const removableParts = getRemovablePartsByCarPart(part.id);
          const partPrice = calculatePartPrice(part.id);

          return (
            <div
              key={part.id}
              className={`border rounded-lg overflow-hidden transition-all duration-200 ${
                isSelected ? 'border-blue-500 bg-blue-50' : 'border-gray-200 bg-white'
              }`}
            >
              <div
                className="p-4 flex items-center justify-between cursor-pointer hover:bg-gray-50"
                onClick={() => togglePartSelection(part.id)}
              >
                <div className="flex items-center space-x-3">
                  <div className={`w-5 h-5 rounded border-2 flex items-center justify-center ${
                    isSelected ? 'bg-blue-500 border-blue-500' : 'border-gray-300'
                  }`}>
                    {isSelected && <div className="w-2 h-2 bg-white rounded-full"></div>}
                  </div>
                  <div>
                    <span className="font-medium text-gray-900">{part.display_name}</span>
                    <div className="text-sm text-blue-600 font-medium">
                      Giá cơ bản: {formatPrice(getBasePartPrice(part.id))}đ
                    </div>
                  </div>
                </div>
                
                <div className="flex items-center space-x-4">
                  {isSelected && (
                    <div className="flex items-center space-x-2">
                      {editingPrice === part.id ? (
                        <div className="flex items-center space-x-2">
                          <input
                            type="number"
                            value={tempPrice}
                            onChange={(e) => setTempPrice(e.target.value)}
                            className="w-24 px-2 py-1 text-sm border border-gray-300 rounded"
                            onClick={(e) => e.stopPropagation()}
                          />
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              savePriceEdit(part.id);
                            }}
                            className="text-green-600 hover:text-green-700 p-1"
                          >
                            ✓
                          </button>
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              cancelPriceEdit();
                            }}
                            className="text-red-600 hover:text-red-700 p-1"
                          >
                            ✕
                          </button>
                        </div>
                      ) : (
                        <div className="flex items-center space-x-2">
                          <span className="font-semibold text-blue-600">
                            {formatPrice(partPrice)}đ
                          </span>
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              startPriceEdit(part.id);
                            }}
                            className="text-gray-400 hover:text-gray-600 p-1"
                          >
                            <Edit3 size={14} />
                          </button>
                        </div>
                      )}
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          togglePartExpansion(part.id);
                        }}
                        className="text-gray-400 hover:text-gray-600"
                      >
                        {isExpanded ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
                      </button>
                    </div>
                  )}
                </div>
              </div>

              {isSelected && isExpanded && (
                <div className="border-t bg-gray-50 p-4 space-y-4">
                  {/* Default Painting Process - Always Selected */}
                  <div>
                    <h4 className="font-medium text-gray-900 mb-2">Quy trình sơn chuẩn (luôn được thực hiện):</h4>
                    <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-sm text-blue-800">
                        <div className="flex items-center space-x-2">
                          <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                          <span>Xử lý bề mặt</span>
                        </div>
                        <div className="flex items-center space-x-2">
                          <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                          <span>Pha sơn đồng màu</span>
                        </div>
                        <div className="flex items-center space-x-2">
                          <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                          <span>Sơn lót chống gỉ</span>
                        </div>
                        <div className="flex items-center space-x-2">
                          <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                          <span>Sơn lót</span>
                        </div>
                        <div className="flex items-center space-x-2">
                          <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                          <span>Tra bả matic, chờ khô, đánh nhám tạo form</span>
                        </div>
                        <div className="flex items-center space-x-2">
                          <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                          <span>Sơn màu</span>
                        </div>
                        <div className="flex items-center space-x-2">
                          <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                          <span>Sơn bóng</span>
                        </div>
                        <div className="flex items-center space-x-2">
                          <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                          <span>Đánh bóng</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Optional Services */}
                  {optionalServices.length > 0 && (
                    <div>
                      <h4 className="font-medium text-gray-900 mb-2">Dịch vụ đi kèm:</h4>
                      <div className="space-y-2">
                        {optionalServices.map((service) => (
                          <label key={service.id} className="flex items-center space-x-3 cursor-pointer">
                            <input
                              type="checkbox"
                              checked={selectedItems[part.id]?.optional_services.includes(service.id) || false}
                              onChange={() => toggleOptionalService(part.id, service.id)}
                              className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                            />
                            <span className="text-sm text-gray-700">{service.display_name}</span>
                            <span className="text-sm text-blue-600 font-medium">
                              +{formatPrice(getPrice(customer.car_segment_id, 'service', service.id))}đ
                            </span>
                          </label>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Removable Parts */}
                  {removableParts.length > 0 && (
                    <div>
                      <h4 className="font-medium text-gray-900 mb-2">Yêu cầu tháo lắp:</h4>
                      <div className="space-y-2">
                        {removableParts.map((removable) => (
                          <label key={removable.id} className="flex items-center space-x-3 cursor-pointer">
                            <input
                              type="checkbox"
                              checked={selectedItems[part.id]?.removable_parts.includes(removable.id) || false}
                              onChange={() => toggleRemovablePart(part.id, removable.id)}
                              className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                            />
                            <span className="text-sm text-gray-700">{removable.display_name}</span>
                            <span className="text-sm text-blue-600 font-medium">
                              +{formatPrice(getPrice(customer.car_segment_id, 'removable_part', removable.id))}đ
                            </span>
                          </label>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>
          );
        })}
      </div>

      {Object.keys(selectedItems).length > 0 && (
        <div className="bg-white rounded-lg shadow-lg p-6">
          <div className="flex items-center justify-between mb-4">
            <span className="text-lg font-semibold text-gray-900">Tổng cộng:</span>
            <span className="text-2xl font-bold text-blue-600">
              {formatPrice(calculateTotalPrice())}đ
            </span>
          </div>
          
          <button
            onClick={handleComplete}
            className="w-full bg-gradient-to-r from-blue-600 to-blue-700 text-white py-3 px-6 rounded-md font-semibold hover:from-blue-700 hover:to-blue-800 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-all duration-200"
          >
            Hoàn Tất Báo Giá
          </button>
        </div>
      )}
    </div>
  );
};