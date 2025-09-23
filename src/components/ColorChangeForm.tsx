import React, { useState } from 'react';
import { ChevronDown, ChevronUp, Edit3 } from 'lucide-react';
import { useSupabaseData } from '../hooks/useSupabaseData';
import { Customer, QuotationItem } from '../lib/supabase';

interface ColorChangeFormProps {
  customer: Customer;
  onComplete: (items: QuotationItem[], total: number) => void;
}

interface AdditionalItem {
  optional_services: string[];
  removable_parts: string[];
}

interface ExtraService {
  id: string;
  name: string;
  display_name: string;
  price: number;
  required_services?: string[];
  selected: boolean;
}

export const ColorChangeForm: React.FC<ColorChangeFormProps> = ({ customer, onComplete }) => {
  const { 
    carParts, 
    getOptionalServices, 
    getRemovablePartsByCarPart, 
    getPrice,
    loading 
  } = useSupabaseData();
  
  const [additionalItems, setAdditionalItems] = useState<Record<string, AdditionalItem>>({});
  const [expandedParts, setExpandedParts] = useState<string[]>([]);
  const [customBasePriceEdit, setCustomBasePriceEdit] = useState<boolean>(false);
  const [tempBasePrice, setTempBasePrice] = useState<string>('');
  const [customBasePrice, setCustomBasePrice] = useState<number | null>(null);
  
  // Extra services specific to color change
  const [extraServices, setExtraServices] = useState<ExtraService[]>([
    {
      id: 'engine_bay_painting',
      name: 'engine_bay_painting',
      display_name: 'Sơn khoang máy',
      price: 2000000,
      required_services: ['cau_ha_may'],
      selected: false
    },
    {
      id: 'interior_disassembly',
      name: 'interior_disassembly', 
      display_name: 'Tháo lắp chi tiết nội thất',
      price: 2000000,
      selected: false
    }
  ]);

  const optionalServices = getOptionalServices();

  // Filter out specific parts that shouldn't be shown for color change
  const filteredCarParts = carParts.filter(part => 
    !['can_sau_phu', 'can_sau_tai', 'can_truoc_phu', 'can_truoc_tai', 'cop_tren', 'cop_duoi'].includes(part.name)
  );

  const togglePartExpansion = (partId: string) => {
    setExpandedParts(prev => 
      prev.includes(partId) 
        ? prev.filter(id => id !== partId)
        : [...prev, partId]
    );
    
    // Initialize additional items for this part if not exists
    if (!additionalItems[partId]) {
      setAdditionalItems(prev => ({
        ...prev,
        [partId]: {
          optional_services: [],
          removable_parts: []
        }
      }));
    }
  };

  const toggleOptionalService = (partId: string, serviceId: string) => {
    setAdditionalItems(prev => ({
      ...prev,
      [partId]: {
        ...prev[partId],
        optional_services: prev[partId]?.optional_services.includes(serviceId)
          ? prev[partId].optional_services.filter(id => id !== serviceId)
          : [...(prev[partId]?.optional_services || []), serviceId]
      }
    }));
  };

  const toggleRemovablePart = (partId: string, removableId: string) => {
    setAdditionalItems(prev => ({
      ...prev,
      [partId]: {
        ...prev[partId],
        removable_parts: prev[partId]?.removable_parts.includes(removableId)
          ? prev[partId].removable_parts.filter(id => id !== removableId)
          : [...(prev[partId]?.removable_parts || []), removableId]
      }
    }));
  };

  const toggleExtraService = (serviceId: string) => {
    setExtraServices(prev => 
      prev.map(service => 
        service.id === serviceId 
          ? { ...service, selected: !service.selected }
          : service
      )
    );
  };

  const startBasePriceEdit = () => {
    const currentPrice = getBasePanelPrice();
    setCustomBasePriceEdit(true);
    setTempBasePrice(currentPrice.toString());
  };

  const saveBasePriceEdit = () => {
    const newPrice = parseInt(tempBasePrice) || 0;
    setCustomBasePrice(newPrice);
    setCustomBasePriceEdit(false);
    setTempBasePrice('');
  };

  const cancelBasePriceEdit = () => {
    setCustomBasePriceEdit(false);
    setTempBasePrice('');
  };

  const getBasePanelPrice = (): number => {
    if (customBasePrice !== null) {
      return customBasePrice;
    }
    // For color change, we get the base price from pricing table
    return getPrice(customer.car_segment_id, 'panel_painting', null);
  };

  const calculateAdditionalPrice = (): number => {
    if (!customer.car_segment_id) return 0;

    let total = 0;
    
    Object.entries(additionalItems).forEach(([partId, item]) => {
      // Add optional services
      item.optional_services.forEach(serviceId => {
        total += getPrice(customer.car_segment_id, 'service', serviceId);
      });
      
      // Add removable parts
      item.removable_parts.forEach(removableId => {
        total += getPrice(customer.car_segment_id, 'removable_part', removableId);
      });
    });
    
    return total;
  };

  const calculateExtraServicesPrice = (): number => {
    return extraServices
      .filter(service => service.selected)
      .reduce((total, service) => total + service.price, 0);
  };

  const calculateTotalPrice = (): number => {
    return getBasePanelPrice() + calculateAdditionalPrice() + calculateExtraServicesPrice();
  };

  const handleComplete = () => {
    const items: QuotationItem[] = [
      // Base color change item
      {
        car_part_id: 'color_change',
        car_part_name: 'Sơn Đổi Màu Toàn Bộ',
        selected_services: [],
        selected_removable_parts: [],
        price: getBasePanelPrice()
      },
      // Additional services and removable parts
      ...Object.entries(additionalItems)
        .filter(([_, item]) => item.optional_services.length > 0 || item.removable_parts.length > 0)
        .map(([partId, item]) => {
          const carPart = carParts.find(p => p.id === partId);
          let partPrice = 0;
          
          item.optional_services.forEach(serviceId => {
            partPrice += getPrice(customer.car_segment_id, 'service', serviceId);
          });
          
          item.removable_parts.forEach(removableId => {
            partPrice += getPrice(customer.car_segment_id, 'removable_part', removableId);
          });

          return {
            car_part_id: partId,
            car_part_name: `${carPart?.display_name || ''} - Dịch vụ thêm`,
            selected_services: item.optional_services,
            selected_removable_parts: item.removable_parts,
            price: partPrice
          };
        }),
      // Extra services for color change
      ...extraServices
        .filter(service => service.selected)
        .map(service => ({
          car_part_id: service.id,
          car_part_name: service.display_name,
          selected_services: service.required_services || [],
          selected_removable_parts: [],
          price: service.price
        }))
    ];

    onComplete(items, calculateTotalPrice());
  };

  const formatPrice = (price: number): string => {
    return new Intl.NumberFormat('vi-VN').format(price);
  };

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
        Sơn Đổi Màu Toàn Bộ
      </h2>

      {/* Base Color Change Price */}
      <div className="bg-purple-50 border border-purple-200 rounded-lg p-6 mb-6">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-lg font-semibold text-gray-900">Giá sơn đổi màu cơ bản</h3>
            <p className="text-sm text-gray-600">Bao gồm sơn đổi màu toàn bộ các bộ phận xe</p>
          </div>
          <div className="flex items-center space-x-2">
            {customBasePriceEdit ? (
              <div className="flex items-center space-x-2">
                <input
                  type="number"
                  value={tempBasePrice}
                  onChange={(e) => setTempBasePrice(e.target.value)}
                  className="w-32 px-2 py-1 text-sm border border-gray-300 rounded"
                />
                <button
                  onClick={saveBasePriceEdit}
                  className="text-green-600 hover:text-green-700 p-1"
                >
                  ✓
                </button>
                <button
                  onClick={cancelBasePriceEdit}
                  className="text-red-600 hover:text-red-700 p-1"
                >
                  ✕
                </button>
              </div>
            ) : (
              <div className="flex items-center space-x-2">
                <span className="text-xl font-bold text-purple-600">
                  {formatPrice(getBasePanelPrice())}đ
                </span>
                <button
                  onClick={startBasePriceEdit}
                  className="text-gray-400 hover:text-gray-600 p-1"
                >
                  <Edit3 size={14} />
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Extra Services for Color Change */}
      <div className="mb-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">
          Dịch vụ bổ sung cho sơn đổi màu
        </h3>
        
        <div className="space-y-3">
          {extraServices.map((service) => (
            <div
              key={service.id}
              className={`border rounded-lg p-4 cursor-pointer transition-all duration-200 ${
                service.selected 
                  ? 'border-purple-500 bg-purple-50' 
                  : 'border-gray-200 bg-white hover:border-gray-300'
              }`}
              onClick={() => toggleExtraService(service.id)}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className={`w-5 h-5 rounded border-2 flex items-center justify-center ${
                    service.selected ? 'bg-purple-500 border-purple-500' : 'border-gray-300'
                  }`}>
                    {service.selected && <div className="w-2 h-2 bg-white rounded-full"></div>}
                  </div>
                  <div>
                    <span className="font-medium text-gray-900">{service.display_name}</span>
                    {service.required_services && (
                      <div className="text-sm text-gray-600 mt-1">
                        Bao gồm: Cẩu hạ máy
                      </div>
                    )}
                  </div>
                </div>
                <span className="font-semibold text-purple-600">
                  {formatPrice(service.price)}đ
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Additional Services */}
      <div className="mb-8">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">
          Dịch vụ và tháo lắp bổ sung cho từng bộ phận
        </h3>
        <p className="text-sm text-gray-600 mb-4">
          Click vào từng bộ phận để chọn dịch vụ đi kèm hoặc yêu cầu tháo lắp
        </p>

        <div className="space-y-4">
          {filteredCarParts.map((part) => {
            const isExpanded = expandedParts.includes(part.id);
            const removableParts = getRemovablePartsByCarPart(part.id);
            const hasAdditionalItems = additionalItems[part.id]?.optional_services.length > 0 || 
                                     additionalItems[part.id]?.removable_parts.length > 0;

            return (
              <div
                key={part.id}
                className="border rounded-lg overflow-hidden bg-white"
              >
                <div
                  className="p-4 flex items-center justify-between cursor-pointer hover:bg-gray-50"
                  onClick={() => togglePartExpansion(part.id)}
                >
                  <div className="flex items-center space-x-3">
                    <span className="font-medium text-gray-900">{part.display_name}</span>
                    {hasAdditionalItems && (
                      <span className="text-xs bg-purple-100 text-purple-800 px-2 py-1 rounded">
                        Có dịch vụ thêm
                      </span>
                    )}
                  </div>
                  
                  <ChevronDown 
                    className={`transform transition-transform ${isExpanded ? 'rotate-180' : ''}`}
                    size={20}
                  />
                </div>

                {isExpanded && (
                  <div className="border-t bg-gray-50 p-4 space-y-4">
                    {/* Optional Services */}
                    {optionalServices.length > 0 && (
                      <div>
                        <h4 className="font-medium text-gray-900 mb-2">Dịch vụ đi kèm:</h4>
                        <div className="space-y-2">
                          {optionalServices.map((service) => (
                            <label key={service.id} className="flex items-center space-x-3 cursor-pointer">
                              <input
                                type="checkbox"
                                checked={additionalItems[part.id]?.optional_services.includes(service.id) || false}
                                onChange={() => toggleOptionalService(part.id, service.id)}
                                className="w-4 h-4 text-purple-600 border-gray-300 rounded focus:ring-purple-500"
                              />
                              <span className="text-sm text-gray-700">{service.display_name}</span>
                              <span className="text-sm text-purple-600 font-medium">
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
                                checked={additionalItems[part.id]?.removable_parts.includes(removable.id) || false}
                                onChange={() => toggleRemovablePart(part.id, removable.id)}
                                className="w-4 h-4 text-purple-600 border-gray-300 rounded focus:ring-purple-500"
                              />
                              <span className="text-sm text-gray-700">{removable.display_name}</span>
                              <span className="text-sm text-purple-600 font-medium">
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
      </div>

      {/* Total and Complete */}
      <div className="bg-white rounded-lg shadow-lg p-6">
        <div className="space-y-3 mb-4">
          <div className="flex items-center justify-between text-lg">
            <span className="text-gray-600">Giá sơn đổi màu cơ bản:</span>
            <span className="font-semibold text-gray-900">
              {formatPrice(getBasePanelPrice())}đ
            </span>
          </div>
          
          {calculateExtraServicesPrice() > 0 && (
            <div className="flex items-center justify-between text-lg">
              <span className="text-gray-600">Dịch vụ bổ sung sơn đổi màu:</span>
              <span className="font-semibold text-gray-900">
                {formatPrice(calculateExtraServicesPrice())}đ
              </span>
            </div>
          )}
          
          {calculateAdditionalPrice() > 0 && (
            <div className="flex items-center justify-between text-lg">
              <span className="text-gray-600">Dịch vụ bổ sung khác:</span>
              <span className="font-semibold text-gray-900">
                {formatPrice(calculateAdditionalPrice())}đ
              </span>
            </div>
          )}
          
          <hr />
          
          <div className="flex items-center justify-between">
            <span className="text-xl font-semibold text-gray-900">Tổng cộng:</span>
            <span className="text-2xl font-bold text-purple-600">
              {formatPrice(calculateTotalPrice())}đ
            </span>
          </div>
        </div>
        
        <button
          onClick={handleComplete}
          className="w-full bg-gradient-to-r from-purple-600 to-purple-700 text-white py-3 px-6 rounded-md font-semibold hover:from-purple-700 hover:to-purple-800 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 transition-all duration-200"
        >
          Hoàn Tất Báo Giá
        </button>
      </div>
    </div>
  );
};