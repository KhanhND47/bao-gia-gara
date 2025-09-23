import React from 'react';
import { Printer, Download, ArrowLeft } from 'lucide-react';
import { Customer, QuotationItem } from '../lib/supabase';
import { useSupabaseData } from '../hooks/useSupabaseData';

interface QuotationDisplayProps {
  customer: Customer;
  serviceType: string;
  items: QuotationItem[];
  totalAmount: number;
  onBack: () => void;
  onSave: () => void;
}

export const QuotationDisplay: React.FC<QuotationDisplayProps> = ({
  customer,
  serviceType,
  items,
  totalAmount,
  onBack,
  onSave
}) => {
  const { services, removableParts } = useSupabaseData();

  const serviceTypeNames = {
    spot_painting: 'Sơn Món',
    panel_painting: 'Sơn Quây',
    color_change: 'Sơn Đổi Màu',
    touch_up: 'Sơn Dặm'
  };

  const handlePrint = () => {
    window.print();
  };

  const formatPrice = (price: number): string => {
    return new Intl.NumberFormat('vi-VN').format(price);
  };

  const formatDate = (date: Date): string => {
    return new Intl.DateTimeFormat('vi-VN', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    }).format(date);
  };

  const getServiceName = (serviceId: string): string => {
    const service = services.find(s => s.id === serviceId);
    return service?.display_name || serviceId;
  };

  const getRemovablePartName = (removablePartId: string): string => {
    const removablePart = removableParts.find(rp => rp.id === removablePartId);
    return removablePart?.display_name || removablePartId;
  };
  return (
    <div className="max-w-4xl mx-auto">
      {/* Action Buttons - Hidden when printing */}
      <div className="mb-6 flex items-center justify-between print:hidden">
        <button
          onClick={onBack}
          className="flex items-center space-x-2 px-4 py-2 text-gray-600 bg-gray-100 rounded-md hover:bg-gray-200 transition-colors"
        >
          <ArrowLeft size={16} />
          <span>Quay lại</span>
        </button>
        
        <div className="flex space-x-4">
          <button
            onClick={handlePrint}
            className="flex items-center space-x-2 px-4 py-2 text-blue-600 bg-blue-100 rounded-md hover:bg-blue-200 transition-colors"
          >
            <Printer size={16} />
            <span>In báo giá</span>
          </button>
          
          <button
            onClick={onSave}
            className="flex items-center space-x-2 px-4 py-2 text-white bg-blue-600 rounded-md hover:bg-blue-700 transition-colors"
          >
            <Download size={16} />
            <span>Lưu báo giá</span>
          </button>
        </div>
      </div>

      {/* Quotation Document */}
      <div className="bg-white shadow-lg print:shadow-none quotation-document">
        {/* Header */}
        <div className="border-b-2 border-blue-600 p-8 print:p-6">
          <div className="text-center">
            <h1 className="text-3xl font-bold text-blue-600 mb-2">BÁO GIÁ DỊCH VỤ SƠN XE</h1>
            <div className="text-lg text-gray-600">
              DANA365 GARAGE
            </div>
            <div className="text-sm text-gray-500 mt-2">
              Địa chỉ: 88 Lê Đại Hành, Đà Nẵng
            </div>
            <div className="text-sm text-gray-500">
              Điện thoại: 0962.777.779 | Email: ketoan@toancauvang.com
            </div>
          </div>
        </div>

        {/* Customer Information */}
        <div className="p-8 print:p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-4 border-b border-gray-200 pb-2">
                THÔNG TIN KHÁCH HÀNG
              </h3>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="font-medium text-gray-600">Họ và tên:</span>
                  <span className="text-gray-900">{customer.full_name}</span>
                </div>
                <div className="flex justify-between">
                  <span className="font-medium text-gray-600">Số điện thoại:</span>
                  <span className="text-gray-900">{customer.phone}</span>
                </div>
                {customer.license_plate && (
                  <div className="flex justify-between">
                    <span className="font-medium text-gray-600">Biển số xe:</span>
                    <span className="text-gray-900">{customer.license_plate}</span>
                  </div>
                )}
              </div>
            </div>

            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-4 border-b border-gray-200 pb-2">
                THÔNG TIN XE
              </h3>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="font-medium text-gray-600">Tên xe:</span>
                  <span className="text-gray-900">{customer.car_name}</span>
                </div>
                <div className="flex justify-between">
                  <span className="font-medium text-gray-600">Đời xe:</span>
                  <span className="text-gray-900">{customer.car_year}</span>
                </div>
                <div className="flex justify-between">
                  <span className="font-medium text-gray-600">Loại dịch vụ:</span>
                  <span className="text-gray-900">{serviceTypeNames[serviceType as keyof typeof serviceTypeNames]}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Quotation Details */}
          <div className="mb-8">
            <h3 className="text-lg font-semibold text-gray-900 mb-4 border-b border-gray-200 pb-2">
              CHI TIẾT BÁNG GIÁ
            </h3>
            
            <div className="overflow-x-auto">
              <table className="w-full border-collapse border border-gray-300">
                <thead>
                  <tr className="bg-blue-50">
                    <th className="border border-gray-300 px-4 py-3 text-left font-semibold text-gray-900">
                      STT
                    </th>
                    <th className="border border-gray-300 px-4 py-3 text-left font-semibold text-gray-900">
                      Tên hạng mục
                    </th>
                    <th className="border border-gray-300 px-4 py-3 text-right font-semibold text-gray-900">
                      Đơn giá (VNĐ)
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {items.map((item, index) => (
                    <tr key={index} className="hover:bg-gray-50">
                      <td className="border border-gray-300 px-4 py-3 text-center">
                        {index + 1}
                      </td>
                      <td className="border border-gray-300 px-4 py-3">
                        <div>
                          <div className="font-medium text-gray-900">
                            {item.car_part_name}
                          </div>
                          {/* Default Painting Process */}
                          <div className="text-sm text-gray-600 mt-1">
                            <div className="font-medium text-green-700 mb-1">Quy trình sơn chuẩn:</div>
                            <div className="ml-2 text-xs">
                              • Xử lý bề mặt • Sơn lót chống gỉ • Tra bả matic, chờ khô, đánh nhám tạo form • Pha sơn đồng màu • Sơn lót • Sơn màu • Sơn bóng • Đánh bóng
                            </div>
                          </div>
                          {item.selected_services.length > 0 && (
                            <div className="text-sm text-gray-600 mt-1">
                              <div className="font-medium text-blue-700 mb-1">Dịch vụ bổ sung:</div>
                              {item.selected_services.map((serviceId, idx) => (
                                <div key={idx} className="ml-2">• {getServiceName(serviceId)}</div>
                              ))}
                            </div>
                          )}
                          {item.selected_removable_parts.length > 0 && (
                            <div className="text-sm text-gray-600 mt-1">
                              <div className="font-medium text-green-700 mb-1">Tháo lắp bộ phận:</div>
                              {item.selected_removable_parts.map((partId, idx) => (
                                <div key={idx} className="ml-2">• {getRemovablePartName(partId)}</div>
                              ))}
                            </div>
                          )}
                        </div>
                      </td>
                      <td className="border border-gray-300 px-4 py-3 text-right font-medium">
                        {formatPrice(item.price)}
                      </td>
                    </tr>
                  ))}
                </tbody>
                <tfoot>
                  <tr className="bg-blue-50">
                    <td colSpan={2} className="border border-gray-300 px-4 py-3 text-center font-bold text-gray-900">
                      TỔNG CỘNG
                    </td>
                    <td className="border border-gray-300 px-4 py-3 text-right font-bold text-blue-600 text-lg">
                      {formatPrice(totalAmount)}
                    </td>
                  </tr>
                </tfoot>
              </table>
            </div>
          </div>

          {/* Terms and Conditions */}
          <div className="mb-8">
            <h3 className="text-lg font-semibold text-gray-900 mb-4 border-b border-gray-200 pb-2">
              ĐIỀU KHOẢN & GHI CHÚ
            </h3>
            <ul className="text-sm text-gray-600 space-y-2">
              <li>• Báo giá có hiệu lực trong 15 ngày kể từ ngày lập</li>
              <li>• Giá đã bao gồm VAT 10%</li>
              <li>• Thời gian thực hiện: 3-5 ngày làm việc (tùy theo khối lượng công việc)</li>
              <li>• Bảo hành sơn: 6 tháng đối với lỗi kỹ thuật</li>
              <li>• Khách hàng vui lòng thanh toán 50% trước khi bắt đầu công việc</li>
              <li>• Garage không chịu trách nhiệm đối với đồ dùng cá nhân để trong xe</li>
            </ul>
          </div>

          {/* Footer */}
          <div className="flex justify-between items-end pt-8 border-t border-gray-200">
            <div className="text-center">
              <div className="text-sm text-gray-600 mb-16">Ngày lập: {formatDate(new Date())}</div>
              <div className="border-t border-gray-400 pt-2">
                <div className="font-semibold text-gray-900">KHÁCH HÀNG</div>
                <div className="text-sm text-gray-600">(Ký và ghi rõ họ tên)</div>
              </div>
            </div>

            <div className="text-center">
              <div className="text-sm text-gray-600 mb-16">Người lập báo giá</div>
              <div className="border-t border-gray-400 pt-2">
                <div className="font-semibold text-gray-900">NHÂN VIÊN TƯ VẤN</div>
                <div className="text-sm text-gray-600">(Ký và ghi rõ họ tên)</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};