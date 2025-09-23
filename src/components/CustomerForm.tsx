import React, { useState } from 'react';
import { User, Phone, Car, Calendar, Tag, CreditCard, Users } from 'lucide-react';
import { useSupabaseData } from '../hooks/useSupabaseData';
import { Customer } from '../lib/supabase';

interface CustomerFormProps {
  onSubmit: (customer: Customer) => void;
  initialData?: Partial<Customer>;
}

export const CustomerForm: React.FC<CustomerFormProps> = ({ onSubmit, initialData = {} }) => {
  const { carSegments, loading } = useSupabaseData();
  const [formData, setFormData] = useState<Customer>({
    full_name: initialData.full_name || '',
    phone: initialData.phone || '',
    car_name: initialData.car_name || '',
    car_year: initialData.car_year || '',
    car_segment_id: initialData.car_segment_id || '',
    license_plate: initialData.license_plate || '',
    customer_source: initialData.customer_source || '',
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto bg-white rounded-lg shadow-lg p-8">
      <h2 className="text-2xl font-bold text-gray-900 mb-6 text-center">
        Thông Tin Khách Hàng
      </h2>
      
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label htmlFor="full_name" className="flex items-center text-sm font-medium text-gray-700 mb-2">
              <User className="w-4 h-4 mr-2" />
              Họ và Tên *
            </label>
            <input
              type="text"
              id="full_name"
              name="full_name"
              value={formData.full_name}
              onChange={handleChange}
              required
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              placeholder="Nhập họ và tên"
            />
          </div>

          <div>
            <label htmlFor="phone" className="flex items-center text-sm font-medium text-gray-700 mb-2">
              <Phone className="w-4 h-4 mr-2" />
              Số Điện Thoại *
            </label>
            <input
              type="tel"
              id="phone"
              name="phone"
              value={formData.phone}
              onChange={handleChange}
              required
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              placeholder="Nhập số điện thoại"
            />
          </div>

          <div>
            <label htmlFor="car_name" className="flex items-center text-sm font-medium text-gray-700 mb-2">
              <Car className="w-4 h-4 mr-2" />
              Tên Xe *
            </label>
            <input
              type="text"
              id="car_name"
              name="car_name"
              value={formData.car_name}
              onChange={handleChange}
              required
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              placeholder="VD: Honda City, Toyota Vios"
            />
          </div>

          <div>
            <label htmlFor="car_year" className="flex items-center text-sm font-medium text-gray-700 mb-2">
              <Calendar className="w-4 h-4 mr-2" />
              Đời Xe *
            </label>
            <input
              type="text"
              id="car_year"
              name="car_year"
              value={formData.car_year}
              onChange={handleChange}
              required
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              placeholder="VD: 2020, 2021"
            />
          </div>

          <div>
            <label htmlFor="car_segment_id" className="flex items-center text-sm font-medium text-gray-700 mb-2">
              <Tag className="w-4 h-4 mr-2" />
              Phân Khúc Xe *
            </label>
            <select
              id="car_segment_id"
              name="car_segment_id"
              value={formData.car_segment_id}
              onChange={handleChange}
              required
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="">Chọn phân khúc xe</option>
              {carSegments.map((segment) => (
                <option key={segment.id} value={segment.id}>
                  {segment.display_name}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label htmlFor="license_plate" className="flex items-center text-sm font-medium text-gray-700 mb-2">
              <CreditCard className="w-4 h-4 mr-2" />
              Biển Số Xe
            </label>
            <input
              type="text"
              id="license_plate"
              name="license_plate"
              value={formData.license_plate}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              placeholder="VD: 30A-12345"
            />
          </div>
        </div>

        <div>
          <label htmlFor="customer_source" className="flex items-center text-sm font-medium text-gray-700 mb-2">
            <Users className="w-4 h-4 mr-2" />
            Nguồn Khách Hàng
          </label>
          <select
            id="customer_source"
            name="customer_source"
            value={formData.customer_source}
            onChange={handleChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          >
            <option value="">Chọn nguồn khách hàng</option>
            <option value="facebook">Facebook</option>
            <option value="google">Google</option>
            <option value="gioi_thieu">Giới thiệu</option>
            <option value="walk_in">Khách bước vào</option>
            <option value="khac">Khác</option>
          </select>
          {formData.car_segment_id && (
            <p className="text-xs text-blue-600 mt-1">
              Giá sẽ được tính theo phân khúc xe đã chọn
            </p>
          )}
        </div>

        <button
          type="submit"
          className="w-full bg-gradient-to-r from-blue-600 to-blue-700 text-white py-3 px-6 rounded-md font-semibold hover:from-blue-700 hover:to-blue-800 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-all duration-200"
        >
          Tiếp Tục
        </button>
      </form>
    </div>
  );
};