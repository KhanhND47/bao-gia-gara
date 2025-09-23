import React, { useState, useEffect } from 'react';
import { Eye, Edit, Trash2, Plus, Search, Filter, Calendar } from 'lucide-react';
import { supabase, Quotation } from '../lib/supabase';

interface QuotationListProps {
  onCreateNew: () => void;
  onViewQuotation: (quotation: Quotation) => void;
}

export const QuotationList: React.FC<QuotationListProps> = ({ onCreateNew, onViewQuotation }) => {
  const [quotations, setQuotations] = useState<Quotation[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [serviceFilter, setServiceFilter] = useState<string>('all');

  useEffect(() => {
    fetchQuotations();
  }, []);

  const fetchQuotations = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('quotations')
        .select(`
          *,
          customers (
            full_name,
            phone,
            car_name,
            car_year,
            license_plate
          )
        `)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setQuotations(data || []);
    } catch (error) {
      console.error('Error fetching quotations:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteQuotation = async (id: string) => {
    if (!confirm('Bạn có chắc chắn muốn xóa báo giá này?')) return;

    try {
      const { error } = await supabase
        .from('quotations')
        .delete()
        .eq('id', id);

      if (error) throw error;
      
      setQuotations(prev => prev.filter(q => q.id !== id));
      alert('Đã xóa báo giá thành công!');
    } catch (error) {
      console.error('Error deleting quotation:', error);
      alert('Có lỗi xảy ra khi xóa báo giá!');
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'draft': return 'bg-gray-100 text-gray-800';
      case 'sent': return 'bg-blue-100 text-blue-800';
      case 'approved': return 'bg-green-100 text-green-800';
      case 'rejected': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'draft': return 'Nháp';
      case 'sent': return 'Đã gửi';
      case 'approved': return 'Đã duyệt';
      case 'rejected': return 'Từ chối';
      default: return 'Không xác định';
    }
  };

  const getServiceTypeText = (serviceType: string) => {
    switch (serviceType) {
      case 'spot_painting': return 'Sơn Món';
      case 'panel_painting': return 'Sơn Quây';
      case 'color_change': return 'Sơn Đổi Màu';
      case 'touch_up': return 'Sơn Dặm';
      default: return serviceType;
    }
  };

  const formatPrice = (price: number): string => {
    return new Intl.NumberFormat('vi-VN').format(price);
  };

  const formatDate = (dateString: string): string => {
    return new Intl.DateTimeFormat('vi-VN', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    }).format(new Date(dateString));
  };

  const filteredQuotations = quotations.filter(quotation => {
    const customer = quotation.customers as any;
    const matchesSearch = !searchTerm || 
      customer?.full_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      customer?.phone?.includes(searchTerm) ||
      customer?.car_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      customer?.license_plate?.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = statusFilter === 'all' || quotation.status === statusFilter;
    const matchesService = serviceFilter === 'all' || quotation.service_type === serviceFilter;
    
    return matchesSearch && matchesStatus && matchesService;
  });

  if (loading) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-4 sm:mb-6 space-y-3 sm:space-y-0">
        <h1 className="text-xl sm:text-2xl font-bold text-gray-900 text-center sm:text-left">Danh Sách Báo Giá</h1>
        <button
          onClick={onCreateNew}
          className="flex items-center justify-center space-x-2 bg-gradient-to-r from-blue-600 to-blue-700 text-white px-3 sm:px-4 py-2 rounded-md font-semibold hover:from-blue-700 hover:to-blue-800 transition-all duration-200 text-sm sm:text-base"
        >
          <Plus size={14} className="sm:w-4 sm:h-4" />
          <span>Tạo Báo Giá Mới</span>
        </button>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-lg shadow-sm p-3 sm:p-4 mb-4 sm:mb-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={14} />
            <input
              type="text"
              placeholder="Tìm kiếm..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-9 pr-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm"
            />
          </div>

          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm"
          >
            <option value="all">Tất cả trạng thái</option>
            <option value="draft">Nháp</option>
            <option value="sent">Đã gửi</option>
            <option value="approved">Đã duyệt</option>
            <option value="rejected">Từ chối</option>
          </select>

          <select
            value={serviceFilter}
            onChange={(e) => setServiceFilter(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm"
          >
            <option value="all">Tất cả dịch vụ</option>
            <option value="spot_painting">Sơn Món</option>
            <option value="panel_painting">Sơn Quây</option>
            <option value="color_change">Sơn Đổi Màu</option>
            <option value="touch_up">Sơn Dặm</option>
          </select>

          <div className="flex items-center text-xs sm:text-sm text-gray-600 justify-center sm:justify-start">
            <Calendar size={14} className="mr-2" />
            <span>Tổng: {filteredQuotations.length} báo giá</span>
          </div>
        </div>
      </div>

      {/* Quotations Table */}
      <div className="bg-white rounded-lg shadow-sm overflow-hidden">
        {filteredQuotations.length === 0 ? (
          <div className="text-center py-8 sm:py-12 px-4">
            <div className="text-gray-400 mb-4">
              <Calendar size={40} className="mx-auto sm:w-12 sm:h-12" />
            </div>
            <h3 className="text-base sm:text-lg font-medium text-gray-900 mb-2">Chưa có báo giá nào</h3>
            <p className="text-sm sm:text-base text-gray-600 mb-4">Bắt đầu tạo báo giá đầu tiên cho khách hàng</p>
            <button
              onClick={onCreateNew}
              className="bg-gradient-to-r from-blue-600 to-blue-700 text-white px-3 sm:px-4 py-2 rounded-md font-semibold hover:from-blue-700 hover:to-blue-800 transition-all duration-200 text-sm sm:text-base"
            >
              Tạo Báo Giá Mới
            </button>
          </div>
        ) : (
          <div className="overflow-x-auto -mx-4 sm:mx-0">
            <table className="w-full">
              <thead className="bg-gray-50 hidden sm:table-header-group">
                <tr>
                  <th className="px-3 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Khách hàng
                  </th>
                  <th className="px-3 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Thông tin xe
                  </th>
                  <th className="px-3 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Dịch vụ
                  </th>
                  <th className="px-3 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Tổng tiền
                  </th>
                  <th className="px-3 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Trạng thái
                  </th>
                  <th className="px-3 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Ngày tạo
                  </th>
                  <th className="px-3 sm:px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Thao tác
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredQuotations.map((quotation) => {
                  const customer = quotation.customers as any;
                  return (
                    <tr key={quotation.id} className="hover:bg-gray-50 sm:table-row flex flex-col sm:flex-row border-b sm:border-b-0 py-4 sm:py-0">
                      <td className="px-3 sm:px-6 py-2 sm:py-4 whitespace-nowrap">
                        <div className="sm:hidden text-xs font-medium text-gray-500 uppercase mb-1">Khách hàng</div>
                        <div>
                          <div className="text-sm font-medium text-gray-900">
                            {customer?.full_name}
                          </div>
                          <div className="text-xs sm:text-sm text-gray-500">
                            {customer?.phone}
                          </div>
                        </div>
                      </td>
                      <td className="px-3 sm:px-6 py-2 sm:py-4 whitespace-nowrap">
                        <div className="sm:hidden text-xs font-medium text-gray-500 uppercase mb-1">Thông tin xe</div>
                        <div>
                          <div className="text-sm font-medium text-gray-900">
                            {customer?.car_name} {customer?.car_year}
                          </div>
                          {customer?.license_plate && (
                            <div className="text-xs sm:text-sm text-gray-500">
                              {customer.license_plate}
                            </div>
                          )}
                        </div>
                      </td>
                      <td className="px-3 sm:px-6 py-2 sm:py-4 whitespace-nowrap">
                        <div className="sm:hidden text-xs font-medium text-gray-500 uppercase mb-1">Dịch vụ</div>
                        <span className="text-sm text-gray-900">
                          {getServiceTypeText(quotation.service_type)}
                        </span>
                      </td>
                      <td className="px-3 sm:px-6 py-2 sm:py-4 whitespace-nowrap">
                        <div className="sm:hidden text-xs font-medium text-gray-500 uppercase mb-1">Tổng tiền</div>
                        <span className="text-sm font-medium text-blue-600">
                          {formatPrice(quotation.total_amount)}đ
                        </span>
                      </td>
                      <td className="px-3 sm:px-6 py-2 sm:py-4 whitespace-nowrap">
                        <div className="sm:hidden text-xs font-medium text-gray-500 uppercase mb-1">Trạng thái</div>
                        <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(quotation.status || 'draft')}`}>
                          {getStatusText(quotation.status || 'draft')}
                        </span>
                      </td>
                      <td className="px-3 sm:px-6 py-2 sm:py-4 whitespace-nowrap text-xs sm:text-sm text-gray-500">
                        <div className="sm:hidden text-xs font-medium text-gray-500 uppercase mb-1">Ngày tạo</div>
                        {formatDate(quotation.created_at || '')}
                      </td>
                      <td className="px-3 sm:px-6 py-2 sm:py-4 whitespace-nowrap text-right text-sm font-medium">
                        <div className="sm:hidden text-xs font-medium text-gray-500 uppercase mb-1">Thao tác</div>
                        <div className="flex items-center justify-end space-x-2">
                          <button
                            onClick={() => onViewQuotation(quotation)}
                            className="text-blue-600 hover:text-blue-900 p-1 sm:p-2"
                            title="Xem báo giá"
                          >
                            <Eye size={14} className="sm:w-4 sm:h-4" />
                          </button>
                          <button
                            onClick={() => handleDeleteQuotation(quotation.id!)}
                            className="text-red-600 hover:text-red-900 p-1 sm:p-2"
                            title="Xóa báo giá"
                          >
                            <Trash2 size={14} className="sm:w-4 sm:h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};