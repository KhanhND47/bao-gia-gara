/*
  # Tạo lại toàn bộ database schema cho hệ thống báo giá sơn xe

  1. Xóa toàn bộ tables cũ
  2. Tạo lại các tables:
     - car_segments (phân khúc xe)
     - car_parts (bộ phận xe)
     - services (dịch vụ)
     - removable_parts (bộ phận tháo lắp)
     - pricing (bảng giá)
     - customers (khách hàng)
     - quotations (báo giá)
  3. Thêm dữ liệu mẫu đầy đủ
  4. Thiết lập RLS và policies
*/

-- Xóa toàn bộ tables cũ (nếu có)
DROP TABLE IF EXISTS quotations CASCADE;
DROP TABLE IF EXISTS customers CASCADE;
DROP TABLE IF EXISTS pricing CASCADE;
DROP TABLE IF EXISTS removable_parts CASCADE;
DROP TABLE IF EXISTS services CASCADE;
DROP TABLE IF EXISTS car_parts CASCADE;
DROP TABLE IF EXISTS car_segments CASCADE;

-- 1. Tạo bảng car_segments (phân khúc xe)
CREATE TABLE car_segments (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text UNIQUE NOT NULL,
  display_name text NOT NULL,
  created_at timestamptz DEFAULT now()
);

-- 2. Tạo bảng car_parts (bộ phận xe)
CREATE TABLE car_parts (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text UNIQUE NOT NULL,
  display_name text NOT NULL,
  category text DEFAULT 'main',
  created_at timestamptz DEFAULT now()
);

-- 3. Tạo bảng services (dịch vụ)
CREATE TABLE services (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text UNIQUE NOT NULL,
  display_name text NOT NULL,
  type text NOT NULL CHECK (type IN ('required', 'optional')),
  created_at timestamptz DEFAULT now()
);

-- 4. Tạo bảng removable_parts (bộ phận tháo lắp)
CREATE TABLE removable_parts (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  car_part_id uuid NOT NULL REFERENCES car_parts(id),
  name text NOT NULL,
  display_name text NOT NULL,
  created_at timestamptz DEFAULT now()
);

-- 5. Tạo bảng pricing (bảng giá)
CREATE TABLE pricing (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  car_segment_id uuid NOT NULL REFERENCES car_segments(id),
  item_type text NOT NULL CHECK (item_type IN ('car_part', 'service', 'removable_part', 'panel_painting')),
  item_id uuid,
  price numeric(10,0) NOT NULL DEFAULT 0,
  created_at timestamptz DEFAULT now(),
  UNIQUE(car_segment_id, item_type, item_id)
);

-- 6. Tạo bảng customers (khách hàng)
CREATE TABLE customers (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  full_name text NOT NULL,
  phone text NOT NULL,
  car_name text NOT NULL,
  car_year text NOT NULL,
  car_segment_id uuid NOT NULL REFERENCES car_segments(id),
  license_plate text,
  customer_source text,
  created_at timestamptz DEFAULT now()
);

-- 7. Tạo bảng quotations (báo giá)
CREATE TABLE quotations (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  customer_id uuid NOT NULL REFERENCES customers(id),
  service_type text NOT NULL CHECK (service_type IN ('spot_painting', 'panel_painting', 'color_change', 'touch_up')),
  total_amount numeric(12,0) NOT NULL DEFAULT 0,
  quotation_data jsonb NOT NULL DEFAULT '{}',
  status text DEFAULT 'draft' CHECK (status IN ('draft', 'sent', 'approved', 'rejected')),
  created_at timestamptz DEFAULT now()
);

-- Thiết lập RLS cho tất cả tables
ALTER TABLE car_segments ENABLE ROW LEVEL SECURITY;
ALTER TABLE car_parts ENABLE ROW LEVEL SECURITY;
ALTER TABLE services ENABLE ROW LEVEL SECURITY;
ALTER TABLE removable_parts ENABLE ROW LEVEL SECURITY;
ALTER TABLE pricing ENABLE ROW LEVEL SECURITY;
ALTER TABLE customers ENABLE ROW LEVEL SECURITY;
ALTER TABLE quotations ENABLE ROW LEVEL SECURITY;

-- Tạo policies cho phép tất cả operations (cho demo)
CREATE POLICY "Allow all operations on car_segments" ON car_segments FOR ALL TO anon, authenticated USING (true) WITH CHECK (true);
CREATE POLICY "Allow all operations on car_parts" ON car_parts FOR ALL TO anon, authenticated USING (true) WITH CHECK (true);
CREATE POLICY "Allow all operations on services" ON services FOR ALL TO anon, authenticated USING (true) WITH CHECK (true);
CREATE POLICY "Allow all operations on removable_parts" ON removable_parts FOR ALL TO anon, authenticated USING (true) WITH CHECK (true);
CREATE POLICY "Allow all operations on pricing" ON pricing FOR ALL TO anon, authenticated USING (true) WITH CHECK (true);
CREATE POLICY "Allow all operations on customers" ON customers FOR ALL TO anon, authenticated USING (true) WITH CHECK (true);
CREATE POLICY "Allow all operations on quotations" ON quotations FOR ALL TO anon, authenticated USING (true) WITH CHECK (true);

-- Thêm dữ liệu car_segments
INSERT INTO car_segments (name, display_name) VALUES
('hatchback', 'Xe Hatchback'),
('sedan', 'Xe Sedan'),
('suv_small', 'SUV cỡ nhỏ'),
('suv_7_seats', 'SUV 7 chỗ');

-- Thêm dữ liệu car_parts
INSERT INTO car_parts (name, display_name, category) VALUES
('can_truoc', 'Cản trước', 'main'),
('can_truoc_tai', 'Cản trước Tài', 'main'),
('can_truoc_phu', 'Cản trước Phụ', 'main'),
('nap_capo', 'Nắp Capo', 'main'),
('tai_ve_tai', 'Tai vè Tài', 'main'),
('tai_ve_phu', 'Tai vè Phụ', 'main'),
('cua_truoc_tai', 'Cửa trước Tài', 'main'),
('cua_truoc_phu', 'Cửa trước Phụ', 'main'),
('cot_a', 'Cột A', 'main'),
('cot_b', 'Cột B', 'main'),
('cot_c', 'Cột C', 'main'),
('noc_xe', 'Nóc xe', 'main'),
('cua_sau_tai', 'Cửa sau Tài', 'main'),
('cua_sau_phu', 'Cửa sau Phụ', 'main'),
('hong_ben_tai', 'Hông bên Tài', 'main'),
('hong_ben_phu', 'Hông bên Phụ', 'main'),
('can_sau', 'Cản sau', 'main'),
('can_sau_tai', 'Cản sau Tài', 'main'),
('can_sau_phu', 'Cản sau Phụ', 'main'),
('nguyen_cop', 'Nguyên Cốp', 'main'),
('nap_binh_xang', 'Nắp bình xăng', 'main'),
('luon_duoi', 'Lườn Dưới', 'main'),
('luon_tren', 'Lườn Trên', 'main');

-- Thêm dữ liệu services
INSERT INTO services (name, display_name, type) VALUES
('danh_bong_chuyen_sau_3_buoc', 'Đánh bóng chuyên sâu 3 bước', 'optional'),
('lot_bo_lop_son_den_phan_ton', 'Lót bộ lớp sơn đến phần tôn', 'optional'),
('phuc_hoi_go_han_rut_ton', 'Phục hồi gõ hàn rút tôn', 'optional'),
('va_muc', 'Và mực', 'optional');

-- Thêm dữ liệu removable_parts cho một số car_parts
INSERT INTO removable_parts (car_part_id, name, display_name)
SELECT cp.id, 'den_pha', 'Đèn pha'
FROM car_parts cp WHERE cp.name = 'can_truoc';

INSERT INTO removable_parts (car_part_id, name, display_name)
SELECT cp.id, 'den_hau', 'Đèn hậu'
FROM car_parts cp WHERE cp.name = 'can_sau';

INSERT INTO removable_parts (car_part_id, name, display_name)
SELECT cp.id, 'kinh_cua', 'Kính cửa'
FROM car_parts cp WHERE cp.name IN ('cua_truoc_tai', 'cua_truoc_phu', 'cua_sau_tai', 'cua_sau_phu');

INSERT INTO removable_parts (car_part_id, name, display_name)
SELECT cp.id, 'tay_nam_cua', 'Tay nắm cửa'
FROM car_parts cp WHERE cp.name IN ('cua_truoc_tai', 'cua_truoc_phu', 'cua_sau_tai', 'cua_sau_phu');

-- Thêm pricing cho car_parts theo từng phân khúc xe

-- Hatchback pricing
INSERT INTO pricing (car_segment_id, item_type, item_id, price)
SELECT cs.id, 'car_part', cp.id, 
  CASE cp.name
    WHEN 'can_truoc' THEN 700000
    WHEN 'can_truoc_tai' THEN 400000
    WHEN 'can_truoc_phu' THEN 400000
    WHEN 'nap_capo' THEN 900000
    WHEN 'tai_ve_tai' THEN 500000
    WHEN 'tai_ve_phu' THEN 500000
    WHEN 'cua_truoc_tai' THEN 600000
    WHEN 'cua_truoc_phu' THEN 600000
    WHEN 'cot_a' THEN 500000
    WHEN 'cot_b' THEN 500000
    WHEN 'cot_c' THEN 500000
    WHEN 'noc_xe' THEN 1200000
    WHEN 'cua_sau_tai' THEN 600000
    WHEN 'cua_sau_phu' THEN 600000
    WHEN 'hong_ben_tai' THEN 500000
    WHEN 'hong_ben_phu' THEN 500000
    WHEN 'can_sau' THEN 700000
    WHEN 'can_sau_tai' THEN 400000
    WHEN 'can_sau_phu' THEN 400000
    WHEN 'nguyen_cop' THEN 900000
    WHEN 'nap_binh_xang' THEN 150000
    WHEN 'luon_duoi' THEN 500000
    WHEN 'luon_tren' THEN 500000
    ELSE 0
  END
FROM car_segments cs, car_parts cp
WHERE cs.name = 'hatchback';

-- Sedan pricing
INSERT INTO pricing (car_segment_id, item_type, item_id, price)
SELECT cs.id, 'car_part', cp.id, 
  CASE cp.name
    WHEN 'can_truoc' THEN 800000
    WHEN 'can_truoc_tai' THEN 450000
    WHEN 'can_truoc_phu' THEN 450000
    WHEN 'nap_capo' THEN 1000000
    WHEN 'tai_ve_tai' THEN 600000
    WHEN 'tai_ve_phu' THEN 600000
    WHEN 'cua_truoc_tai' THEN 700000
    WHEN 'cua_truoc_phu' THEN 700000
    WHEN 'cot_a' THEN 500000
    WHEN 'cot_b' THEN 500000
    WHEN 'cot_c' THEN 500000
    WHEN 'noc_xe' THEN 1300000
    WHEN 'cua_sau_tai' THEN 700000
    WHEN 'cua_sau_phu' THEN 700000
    WHEN 'hong_ben_tai' THEN 600000
    WHEN 'hong_ben_phu' THEN 600000
    WHEN 'can_sau' THEN 800000
    WHEN 'can_sau_tai' THEN 450000
    WHEN 'can_sau_phu' THEN 450000
    WHEN 'nguyen_cop' THEN 1000000
    WHEN 'nap_binh_xang' THEN 150000
    WHEN 'luon_duoi' THEN 600000
    WHEN 'luon_tren' THEN 600000
    ELSE 0
  END
FROM car_segments cs, car_parts cp
WHERE cs.name = 'sedan';

-- SUV cỠ nhỏ pricing
INSERT INTO pricing (car_segment_id, item_type, item_id, price)
SELECT cs.id, 'car_part', cp.id, 
  CASE cp.name
    WHEN 'can_truoc' THEN 900000
    WHEN 'can_truoc_tai' THEN 500000
    WHEN 'can_truoc_phu' THEN 500000
    WHEN 'nap_capo' THEN 1200000
    WHEN 'tai_ve_tai' THEN 700000
    WHEN 'tai_ve_phu' THEN 700000
    WHEN 'cua_truoc_tai' THEN 800000
    WHEN 'cua_truoc_phu' THEN 800000
    WHEN 'cot_a' THEN 600000
    WHEN 'cot_b' THEN 600000
    WHEN 'cot_c' THEN 600000
    WHEN 'noc_xe' THEN 1500000
    WHEN 'cua_sau_tai' THEN 800000
    WHEN 'cua_sau_phu' THEN 800000
    WHEN 'hong_ben_tai' THEN 700000
    WHEN 'hong_ben_phu' THEN 700000
    WHEN 'can_sau' THEN 900000
    WHEN 'can_sau_tai' THEN 500000
    WHEN 'can_sau_phu' THEN 500000
    WHEN 'nguyen_cop' THEN 1200000
    WHEN 'nap_binh_xang' THEN 200000
    WHEN 'luon_duoi' THEN 700000
    WHEN 'luon_tren' THEN 700000
    ELSE 0
  END
FROM car_segments cs, car_parts cp
WHERE cs.name = 'suv_small';

-- SUV 7 chỗ pricing
INSERT INTO pricing (car_segment_id, item_type, item_id, price)
SELECT cs.id, 'car_part', cp.id, 
  CASE cp.name
    WHEN 'can_truoc' THEN 1000000
    WHEN 'can_truoc_tai' THEN 550000
    WHEN 'can_truoc_phu' THEN 550000
    WHEN 'nap_capo' THEN 1400000
    WHEN 'tai_ve_tai' THEN 800000
    WHEN 'tai_ve_phu' THEN 800000
    WHEN 'cua_truoc_tai' THEN 900000
    WHEN 'cua_truoc_phu' THEN 900000
    WHEN 'cot_a' THEN 700000
    WHEN 'cot_b' THEN 700000
    WHEN 'cot_c' THEN 700000
    WHEN 'noc_xe' THEN 1700000
    WHEN 'cua_sau_tai' THEN 900000
    WHEN 'cua_sau_phu' THEN 900000
    WHEN 'hong_ben_tai' THEN 800000
    WHEN 'hong_ben_phu' THEN 800000
    WHEN 'can_sau' THEN 1000000
    WHEN 'can_sau_tai' THEN 550000
    WHEN 'can_sau_phu' THEN 550000
    WHEN 'nguyen_cop' THEN 1400000
    WHEN 'nap_binh_xang' THEN 250000
    WHEN 'luon_duoi' THEN 800000
    WHEN 'luon_tren' THEN 800000
    ELSE 0
  END
FROM car_segments cs, car_parts cp
WHERE cs.name = 'suv_7_seats';

-- Thêm pricing cho services (giống nhau cho tất cả phân khúc xe)
INSERT INTO pricing (car_segment_id, item_type, item_id, price)
SELECT cs.id, 'service', s.id, 
  CASE s.name
    WHEN 'danh_bong_chuyen_sau_3_buoc' THEN 400000
    WHEN 'lot_bo_lop_son_den_phan_ton' THEN 350000
    WHEN 'phuc_hoi_go_han_rut_ton' THEN 450000
    WHEN 'va_muc' THEN 300000
    ELSE 0
  END
FROM car_segments cs, services s;

-- Thêm pricing cho removable_parts (giống nhau cho tất cả phân khúc xe)
INSERT INTO pricing (car_segment_id, item_type, item_id, price)
SELECT cs.id, 'removable_part', rp.id, 
  CASE rp.name
    WHEN 'den_pha' THEN 100000
    WHEN 'den_hau' THEN 100000
    WHEN 'kinh_cua' THEN 50000
    WHEN 'tay_nam_cua' THEN 30000
    ELSE 0
  END
FROM car_segments cs, removable_parts rp;

-- Thêm pricing cho panel_painting (sơn quây)
INSERT INTO pricing (car_segment_id, item_type, item_id, price)
SELECT cs.id, 'panel_painting', NULL,
  CASE cs.name
    WHEN 'hatchback' THEN 8000000
    WHEN 'sedan' THEN 9000000
    WHEN 'suv_small' THEN 10000000
    WHEN 'suv_7_seats' THEN 12000000
    ELSE 0
  END
FROM car_segments cs;