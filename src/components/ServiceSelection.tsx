import React, { useState } from 'react';
import { Palette, Car, Brush, Wrench } from 'lucide-react';

interface ServiceSelectionProps {
  onServiceSelect: (serviceType: string) => void;
}

export const ServiceSelection: React.FC<ServiceSelectionProps> = ({ onServiceSelect }) => {
  const [selectedService, setSelectedService] = useState<string>('');

  const services = [
    {
      id: 'spot_painting',
      name: 'Sơn Món',
      description: 'Sơn từng bộ phận riêng lẻ theo nhu cầu',
      icon: Palette,
      color: 'from-blue-500 to-blue-600'
    },
    {
      id: 'panel_painting',
      name: 'Sơn Quây',
      description: 'Sơn toàn bộ xe với giá cố định',
      icon: Car,
      color: 'from-green-500 to-green-600'
    },
    {
      id: 'color_change',
      name: 'Sơn Đổi Màu',
      description: 'Thay đổi màu sắc hoàn toàn cho xe',
      icon: Brush,
      color: 'from-purple-500 to-purple-600'
    },
    {
      id: 'touch_up',
      name: 'Sơn Dặm',
      description: 'Chữa các vết xước nhỏ',
      icon: Wrench,
      color: 'from-orange-500 to-orange-600'
    }
  ];

  const handleServiceSelect = (serviceId: string) => {
    setSelectedService(serviceId);
  };

  const handleContinue = () => {
    if (selectedService) {
      onServiceSelect(selectedService);
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4">
      <h2 className="text-xl sm:text-2xl font-bold text-gray-900 mb-6 sm:mb-8 text-center">
        Chọn Loại Dịch Vụ Sơn
      </h2>
      
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6 mb-6 sm:mb-8">
        {services.map((service) => {
          const IconComponent = service.icon;
          return (
            <div
              key={service.id}
              onClick={() => handleServiceSelect(service.id)}
              className={`
                relative cursor-pointer rounded-lg p-4 sm:p-6 border-2 transition-all duration-200
                ${selectedService === service.id
                  ? 'border-blue-500 bg-blue-50 shadow-lg scale-105'
                  : 'border-gray-200 hover:border-gray-300 hover:shadow-md'
                }
              `}
            >
              <div className={`inline-flex items-center justify-center w-10 h-10 sm:w-12 sm:h-12 rounded-lg bg-gradient-to-r ${service.color} text-white mb-3 sm:mb-4`}>
                <IconComponent size={20} className="sm:w-6 sm:h-6" />
              </div>
              
              <h3 className="text-base sm:text-lg font-semibold text-gray-900 mb-2">
                {service.name}
              </h3>
              
              <p className="text-gray-600 text-xs sm:text-sm">
                {service.description}
              </p>
              
              {selectedService === service.id && (
                <div className="absolute top-4 right-4">
                  <div className="w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center">
                    <div className="w-2 h-2 bg-white rounded-full"></div>
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>
      
      {selectedService && (
        <div className="text-center">
          <button
            onClick={handleContinue}
            className="bg-gradient-to-r from-blue-600 to-blue-700 text-white py-2 sm:py-3 px-6 sm:px-8 rounded-md font-semibold hover:from-blue-700 hover:to-blue-800 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-all duration-200 text-sm sm:text-base"
          >
            Tiếp Tục
          </button>
        </div>
      )}
    </div>
  );
};