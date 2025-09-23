import React, { useState } from 'react';
import { Home, FileText, List, Menu, X } from 'lucide-react';
import { StepIndicator } from './components/StepIndicator';
import { CustomerForm } from './components/CustomerForm';
import { ServiceSelection } from './components/ServiceSelection';
import { SpotPaintingForm } from './components/SpotPaintingForm';
import { PanelPaintingForm } from './components/PanelPaintingForm';
import { ColorChangeForm } from './components/ColorChangeForm';
import { QuotationDisplay } from './components/QuotationDisplay';
import { QuotationList } from './components/QuotationList';
import { QuotationViewer } from './components/QuotationViewer';
import { supabase, Customer, QuotationItem, Quotation } from './lib/supabase';

type View = 'home' | 'create' | 'list' | 'view';
type Step = 'customer' | 'service' | 'details' | 'quotation';

function App() {
  const [currentView, setCurrentView] = useState<View>('home');
  const [currentStep, setCurrentStep] = useState<Step>('customer');
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [customer, setCustomer] = useState<Customer | null>(null);
  const [serviceType, setServiceType] = useState<string>('');
  const [quotationItems, setQuotationItems] = useState<QuotationItem[]>([]);
  const [totalAmount, setTotalAmount] = useState<number>(0);
  const [selectedQuotation, setSelectedQuotation] = useState<Quotation | null>(null);

  const steps = ['Thông tin KH', 'Chọn dịch vụ', 'Chi tiết', 'Báo giá'];
  const stepMap: Record<Step, number> = {
    customer: 0,
    service: 1,
    details: 2,
    quotation: 3
  };

  const handleCustomerSubmit = (customerData: Customer) => {
    setCustomer(customerData);
    setCurrentStep('service');
  };

  const handleServiceSelect = (service: string) => {
    setServiceType(service);
    setCurrentStep('details');
  };

  const handleDetailsComplete = (items: QuotationItem[], total: number) => {
    setQuotationItems(items);
    setTotalAmount(total);
    setCurrentStep('quotation');
  };

  const handleBack = () => {
    switch (currentStep) {
      case 'service':
        setCurrentStep('customer');
        break;
      case 'details':
        setCurrentStep('service');
        break;
      case 'quotation':
        setCurrentStep('details');
        break;
    }
  };

  const handleCreateNew = () => {
    // Reset all form data
    setCustomer(null);
    setServiceType('');
    setQuotationItems([]);
    setTotalAmount(0);
    setCurrentStep('customer');
    setCurrentView('create');
    setSidebarOpen(false);
  };

  const handleViewQuotation = (quotation: Quotation) => {
    setSelectedQuotation(quotation);
    setCurrentView('view');
    setSidebarOpen(false);
  };

  const handleBackToList = () => {
    setSelectedQuotation(null);
    setCurrentView('list');
    setSidebarOpen(false);
  };

  const handleBackToHome = () => {
    setCurrentView('home');
    setSidebarOpen(false);
  };

  const handleSaveQuotation = async () => {
    if (!customer) return;

    try {
      // First save customer
      const { data: customerData, error: customerError } = await supabase
        .from('customers')
        .insert([customer])
        .select()
        .single();

      if (customerError) throw customerError;

      // Then save quotation
      const quotationData = {
        customer_id: customerData.id,
        service_type: serviceType,
        total_amount: totalAmount,
        quotation_data: {
          items: quotationItems,
          customer: customer,
          service_type: serviceType,
          created_at: new Date().toISOString()
        },
        status: 'draft'
      };

      const { error: quotationError } = await supabase
        .from('quotations')
        .insert([quotationData]);

      if (quotationError) throw quotationError;

      alert('Báo giá đã được lưu thành công!');
      setCurrentView('list');
    } catch (error) {
      console.error('Error saving quotation:', error);
      alert('Có lỗi xảy ra khi lưu báo giá. Vui lòng thử lại!');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      {/* Mobile Menu Button */}
      <div className="lg:hidden fixed top-4 left-4 z-50 print:hidden">
        <button
          onClick={() => setSidebarOpen(!sidebarOpen)}
          className="bg-white p-2 rounded-md shadow-lg border border-gray-200 hover:bg-gray-50 transition-colors"
        >
          {sidebarOpen ? <X size={20} /> : <Menu size={20} />}
        </button>
      </div>

      {/* Desktop Header */}
      <div className="hidden lg:block fixed top-0 left-0 right-0 bg-white shadow-sm border-b border-gray-200 z-30 print:hidden">
        <div className="px-6 py-4">
          <div className="flex items-center justify-between">
            <h1 className="text-xl font-bold text-gray-900">
              Hệ Thống Báo Giá Sơn Xe Ô Tô
            </h1>
            
            {/* Desktop Navigation */}
            <nav className="flex items-center space-x-6">
              <button
                onClick={() => {
                  setCurrentView('home');
                  setSidebarOpen(false);
                }}
                className={`flex items-center space-x-2 px-4 py-2 rounded-lg font-medium transition-colors ${
                  currentView === 'home' 
                    ? 'bg-blue-100 text-blue-700' 
                    : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
                }`}
              >
                <Home size={18} />
                <span>Trang chủ</span>
              </button>
              
              <button
                onClick={handleCreateNew}
                className={`flex items-center space-x-2 px-4 py-2 rounded-lg font-medium transition-colors ${
                  currentView === 'create' 
                    ? 'bg-blue-100 text-blue-700' 
                    : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
                }`}
              >
                <FileText size={18} />
                <span>Tạo báo giá</span>
              </button>
              
              <button
                onClick={() => {
                  setCurrentView('list');
                  setSidebarOpen(false);
                }}
                className={`flex items-center space-x-2 px-4 py-2 rounded-lg font-medium transition-colors ${
                  currentView === 'list' 
                    ? 'bg-blue-100 text-blue-700' 
                    : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
                }`}
              >
                <List size={18} />
                <span>Danh sách báo giá</span>
              </button>
            </nav>
          </div>
        </div>
      </div>

      {/* Sidebar Overlay */}
      {sidebarOpen && (
        <div 
          className="lg:hidden fixed inset-0 bg-black bg-opacity-50 z-40 print:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Mobile Sidebar */}
      <div className={`
        lg:hidden fixed top-0 left-0 h-full w-64 bg-white shadow-lg transform transition-transform duration-300 ease-in-out z-40 print:hidden
        ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}
      `}>
        <div className="p-6">
          <h1 className="text-lg font-bold text-gray-900 mb-8">
            Hệ Thống Báo Giá<br />
            Sơn Xe Ô Tô
          </h1>
          
          {/* Mobile Navigation */}
          <nav className="space-y-2">
            <button
              onClick={() => {
                setCurrentView('home');
                setSidebarOpen(false);
              }}
              className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg font-medium transition-colors text-left ${
                currentView === 'home' 
                  ? 'bg-blue-100 text-blue-700' 
                  : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
              }`}
            >
              <Home size={20} />
              <span>Trang chủ</span>
            </button>
            
            <button
              onClick={handleCreateNew}
              className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg font-medium transition-colors text-left ${
                currentView === 'create' 
                  ? 'bg-blue-100 text-blue-700' 
                  : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
              }`}
            >
              <FileText size={20} />
              <span>Tạo báo giá</span>
            </button>
            
            <button
              onClick={() => {
                setCurrentView('list');
                setSidebarOpen(false);
              }}
              className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg font-medium transition-colors text-left ${
                currentView === 'list' 
                  ? 'bg-blue-100 text-blue-700' 
                  : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
              }`}
            >
              <List size={20} />
              <span>Danh sách báo giá</span>
            </button>
          </nav>
        </div>
      </div>

      {/* Main Content */}
      <div className="lg:pt-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 lg:py-8">
          {/* Home View */}
          {currentView === 'home' && (
            <div className="text-center">
              <div className="max-w-3xl mx-auto px-4">
                <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-4 lg:hidden">
                  Chào mừng đến với hệ thống báo giá sơn xe
                </h2>
                <p className="text-base sm:text-lg text-gray-600 mb-8">
                  Tạo báo giá chuyên nghiệp cho khách hàng một cách nhanh chóng và chính xác
                </p>
                
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6 mt-8 sm:mt-12">
                  <div 
                    onClick={handleCreateNew}
                    className="bg-white rounded-lg shadow-lg p-6 sm:p-8 cursor-pointer hover:shadow-xl transition-shadow duration-200"
                  >
                    <div className="text-blue-600 mb-4">
                      <FileText size={40} className="mx-auto sm:w-12 sm:h-12" />
                    </div>
                    <h3 className="text-lg sm:text-xl font-semibold text-gray-900 mb-2">
                      Tạo Báo Giá Mới
                    </h3>
                    <p className="text-sm sm:text-base text-gray-600">
                      Bắt đầu tạo báo giá mới cho khách hàng với quy trình đơn giản
                    </p>
                  </div>
                  
                  <div 
                    onClick={() => setCurrentView('list')}
                    className="bg-white rounded-lg shadow-lg p-6 sm:p-8 cursor-pointer hover:shadow-xl transition-shadow duration-200"
                  >
                    <div className="text-green-600 mb-4">
                      <List size={40} className="mx-auto sm:w-12 sm:h-12" />
                    </div>
                    <h3 className="text-lg sm:text-xl font-semibold text-gray-900 mb-2">
                      Danh Sách Báo Giá
                    </h3>
                    <p className="text-sm sm:text-base text-gray-600">
                      Xem và quản lý tất cả các báo giá đã tạo
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Create Quotation View */}
          {currentView === 'create' && (
            <>
              {/* Step Indicator */}
              <StepIndicator currentStep={stepMap[currentStep]} steps={steps} />

              {/* Content */}
              <div className="mt-8">
                {currentStep === 'customer' && (
                  <CustomerForm onSubmit={handleCustomerSubmit} />
                )}

                {currentStep === 'service' && (
                  <ServiceSelection onServiceSelect={handleServiceSelect} />
                )}

                {currentStep === 'details' && customer && (
                  <>
                    {serviceType === 'spot_painting' && (
                      <SpotPaintingForm
                        customer={customer}
                        onComplete={handleDetailsComplete}
                      />
                    )}
                    {serviceType === 'panel_painting' && (
                      <PanelPaintingForm
                        customer={customer}
                        onComplete={handleDetailsComplete}
                      />
                    )}
                    {serviceType === 'color_change' && (
                      <ColorChangeForm
                        customer={customer}
                        onComplete={handleDetailsComplete}
                      />
                    )}
                    {serviceType === 'touch_up' && (
                      <div className="max-w-2xl mx-auto bg-white rounded-lg shadow-lg p-8 text-center">
                        <h2 className="text-2xl font-bold text-gray-900 mb-4">
                          Tính năng đang phát triển
                        </h2>
                        <p className="text-gray-600 mb-6">
                          Dịch vụ này đang được phát triển và sẽ sớm có mặt.
                        </p>
                        <button
                          onClick={handleBack}
                          className="bg-gradient-to-r from-blue-600 to-blue-700 text-white py-2 px-6 rounded-md font-semibold hover:from-blue-700 hover:to-blue-800"
                        >
                          Quay lại chọn dịch vụ khác
                        </button>
                      </div>
                    )}
                  </>
                )}

                {currentStep === 'quotation' && customer && (
                  <QuotationDisplay
                    customer={customer}
                    serviceType={serviceType}
                    items={quotationItems}
                    totalAmount={totalAmount}
                    onBack={handleBack}
                    onSave={handleSaveQuotation}
                  />
                )}
              </div>
            </>
          )}

          {/* Quotation List View */}
          {currentView === 'list' && (
            <QuotationList 
              onCreateNew={handleCreateNew}
              onViewQuotation={handleViewQuotation}
            />
          )}

          {/* Quotation Viewer */}
          {currentView === 'view' && selectedQuotation && (
            <QuotationViewer 
              quotation={selectedQuotation}
              onBack={handleBackToList}
            />
          )}
        </div>
      </div>
    </div>
  );
}

export default App;