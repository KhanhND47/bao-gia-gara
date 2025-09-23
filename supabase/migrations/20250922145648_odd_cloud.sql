/*
  # Xóa và tạo lại toàn bộ database với danh sách bộ phận mới

  1. Xóa toàn bộ tables và data
  2. Tạo lại schema hoàn chỉnh
  3. Thêm 31 bộ phận theo danh sách yêu cầu
  4. Thêm removable parts tương ứng
  5. Thêm pricing data đầy đủ
  6. Thiết lập RLS và policies
*/

-- Drop all existing tables
DROP TABLE IF EXISTS quotations CASCADE;
DROP TABLE IF EXISTS customers CASCADE;
DROP TABLE IF EXISTS pricing CASCADE;
DROP TABLE IF EXISTS removable_parts CASCADE;
DROP TABLE IF EXISTS services CASCADE;
DROP TABLE IF EXISTS car_parts CASCADE;
DROP TABLE IF EXISTS car_segments CASCADE;

-- Create car_segments table
CREATE TABLE car_segments (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text UNIQUE NOT NULL,
  display_name text NOT NULL,
  created_at timestamptz DEFAULT now()
);

-- Create car_parts table
CREATE TABLE car_parts (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text UNIQUE NOT NULL,
  display_name text NOT NULL,
  category text DEFAULT 'main',
  created_at timestamptz DEFAULT now()
);

-- Create services table
CREATE TABLE services (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text UNIQUE NOT NULL,
  display_name text NOT NULL,
  type text NOT NULL CHECK (type IN ('required', 'optional')),
  created_at timestamptz DEFAULT now()
);

-- Create removable_parts table
CREATE TABLE removable_parts (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  car_part_id uuid NOT NULL REFERENCES car_parts(id),
  name text NOT NULL,
  display_name text NOT NULL,
  created_at timestamptz DEFAULT now()
);

-- Create pricing table
CREATE TABLE pricing (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  car_segment_id uuid NOT NULL REFERENCES car_segments(id),
  item_type text NOT NULL CHECK (item_type IN ('car_part', 'service', 'removable_part', 'panel_painting')),
  item_id uuid,
  price numeric(10,0) NOT NULL DEFAULT 0,
  created_at timestamptz DEFAULT now(),
  UNIQUE(car_segment_id, item_type, item_id)
);

-- Create customers table
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

-- Create quotations table
CREATE TABLE quotations (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  customer_id uuid NOT NULL REFERENCES customers(id),
  service_type text NOT NULL CHECK (service_type IN ('spot_painting', 'panel_painting', 'color_change', 'touch_up')),
  total_amount numeric(12,0) NOT NULL DEFAULT 0,
  quotation_data jsonb NOT NULL DEFAULT '{}',
  status text DEFAULT 'draft' CHECK (status IN ('draft', 'sent', 'approved', 'rejected')),
  created_at timestamptz DEFAULT now()
);

-- Enable RLS on all tables
ALTER TABLE car_segments ENABLE ROW LEVEL SECURITY;
ALTER TABLE car_parts ENABLE ROW LEVEL SECURITY;
ALTER TABLE services ENABLE ROW LEVEL SECURITY;
ALTER TABLE removable_parts ENABLE ROW LEVEL SECURITY;
ALTER TABLE pricing ENABLE ROW LEVEL SECURITY;
ALTER TABLE customers ENABLE ROW LEVEL SECURITY;
ALTER TABLE quotations ENABLE ROW LEVEL SECURITY;

-- Create policies for public access (adjust as needed)
CREATE POLICY "Allow all operations on car_segments" ON car_segments FOR ALL TO anon, authenticated USING (true) WITH CHECK (true);
CREATE POLICY "Allow all operations on car_parts" ON car_parts FOR ALL TO anon, authenticated USING (true) WITH CHECK (true);
CREATE POLICY "Allow all operations on services" ON services FOR ALL TO anon, authenticated USING (true) WITH CHECK (true);
CREATE POLICY "Allow all operations on removable_parts" ON removable_parts FOR ALL TO anon, authenticated USING (true) WITH CHECK (true);
CREATE POLICY "Allow all operations on pricing" ON pricing FOR ALL TO anon, authenticated USING (true) WITH CHECK (true);
CREATE POLICY "Allow all operations on customers" ON customers FOR ALL TO anon, authenticated USING (true) WITH CHECK (true);
CREATE POLICY "Allow all operations on quotations" ON quotations FOR ALL TO anon, authenticated USING (true) WITH CHECK (true);

-- Insert car segments
INSERT INTO car_segments (name, display_name) VALUES
('hatchback', 'Hatchback'),
('sedan', 'Sedan'),
('suv_nho', 'SUV Nhỏ'),
('suv_7_cho', 'SUV 7 Chỗ');

-- Insert car parts (31 parts as requested)
INSERT INTO car_parts (name, display_name, category) VALUES
('can_truoc_tai', 'Cản trước Tài', 'main'),
('can_truoc_phu', 'Cản trước Phụ', 'main'),
('nguyen_can_truoc', 'Nguyên cản trước', 'main'),
('can_sau_tai', 'Cản sau Tài', 'main'),
('can_sau_phu', 'Cản sau Phụ', 'main'),
('nguyen_can_sau', 'Nguyên cản sau', 'main'),
('cua_truoc_tai', 'Cửa trước Tài', 'main'),
('cua_sau_tai', 'Cửa sau Tài', 'main'),
('cua_truoc_phu', 'Cửa trước Phụ', 'main'),
('cua_sau_phu', 'Cửa sau Phụ', 'main'),
('tai_ve_tai', 'Tai vè Tài', 'main'),
('tai_ve_phu', 'Tai vè Phụ', 'main'),
('hong_ben_tai', 'Hông bên Tài', 'main'),
('hong_ben_phu', 'Hông bên Phụ', 'main'),
('luron_tren', 'Lườn Trên', 'main'),
('luron_duoi', 'Lườn Dưới', 'main'),
('cot_a', 'Cột A', 'main'),
('cot_b', 'Cột B', 'main'),
('cot_c', 'Cột C', 'main'),
('cop_tren', 'Cốp Trên', 'main'),
('cop_duoi', 'Cốp Dưới', 'main'),
('nguyen_cop', 'Nguyên Cốp', 'main'),
('nap_capo', 'Nắp Capo', 'main'),
('op_can_truoc_sau', 'Ốp cản Trước - Sau', 'accessory'),
('op_guong_chieu_hau', 'Ốp gương chiếu hậu Tài - Phụ', 'accessory'),
('op_tay_nam_cua', 'Ốp tay nắm cửa', 'accessory'),
('op_cua_lop_truoc', 'Ốp cua lốp trước Tài - Phụ', 'accessory'),
('op_cua_lop_sau', 'Ốp cua lốp sau Tài - Phụ', 'accessory'),
('mam_xe', 'Mâm xe', 'accessory'),
('noc_xe', 'Nóc xe', 'main'),
('nap_binh_xang', 'Nắp bình xăng', 'accessory');

-- Insert services
INSERT INTO services (name, display_name, type) VALUES
('cat_son_cu', 'Cắt sơn cũ', 'optional'),
('sua_chua_be_mat', 'Sửa chữa bề mặt', 'optional'),
('son_lot_dac_biet', 'Sơn lót đặc biệt', 'optional'),
('bao_ve_dac_biet', 'Bảo vệ đặc biệt', 'optional');

-- Insert removable parts for each car part
DO $$
DECLARE
    part_record RECORD;
    part_id uuid;
BEGIN
    -- Cản trước Tài
    SELECT id INTO part_id FROM car_parts WHERE name = 'can_truoc_tai';
    INSERT INTO removable_parts (car_part_id, name, display_name) VALUES
    (part_id, 'mat_galang', 'Mặt galang'),
    (part_id, 'op_can', 'Ốp cản'),
    (part_id, 'den', 'Đèn'),
    (part_id, 'bien_so', 'Biển số');

    -- Cản trước Phụ
    SELECT id INTO part_id FROM car_parts WHERE name = 'can_truoc_phu';
    INSERT INTO removable_parts (car_part_id, name, display_name) VALUES
    (part_id, 'mat_galang', 'Mặt galang'),
    (part_id, 'op_can', 'Ốp cản'),
    (part_id, 'den', 'Đèn');

    -- Nguyên cản trước
    SELECT id INTO part_id FROM car_parts WHERE name = 'nguyen_can_truoc';
    INSERT INTO removable_parts (car_part_id, name, display_name) VALUES
    (part_id, 'mat_galang', 'Mặt galang'),
    (part_id, 'op_can', 'Ốp cản'),
    (part_id, 'den', 'Đèn');

    -- Cửa trước Tài
    SELECT id INTO part_id FROM car_parts WHERE name = 'cua_truoc_tai';
    INSERT INTO removable_parts (car_part_id, name, display_name) VALUES
    (part_id, 'cum_guong', 'Cùm gương chiếu hậu'),
    (part_id, 'roang', 'Roăng'),
    (part_id, 'op_cua', 'Ốp cửa'),
    (part_id, 'op_tay_nam', 'Ốp tay nắm cửa'),
    (part_id, 'tay_nam_cua', 'Tay nắm cửa');

    -- Cửa trước Phụ
    SELECT id INTO part_id FROM car_parts WHERE name = 'cua_truoc_phu';
    INSERT INTO removable_parts (car_part_id, name, display_name) VALUES
    (part_id, 'cum_guong', 'Cùm gương chiếu hậu'),
    (part_id, 'roang', 'Roăng'),
    (part_id, 'op_cua', 'Ốp cửa'),
    (part_id, 'op_tay_nam', 'Ốp tay nắm cửa'),
    (part_id, 'tay_nam_cua', 'Tay nắm cửa');

    -- Cửa sau Tài
    SELECT id INTO part_id FROM car_parts WHERE name = 'cua_sau_tai';
    INSERT INTO removable_parts (car_part_id, name, display_name) VALUES
    (part_id, 'roang', 'Roăng'),
    (part_id, 'op_cua', 'Ốp cửa'),
    (part_id, 'op_tay_nam', 'Ốp tay nắm cửa'),
    (part_id, 'tay_nam_cua', 'Tay nắm cửa');

    -- Cửa sau Phụ
    SELECT id INTO part_id FROM car_parts WHERE name = 'cua_sau_phu';
    INSERT INTO removable_parts (car_part_id, name, display_name) VALUES
    (part_id, 'roang', 'Roăng'),
    (part_id, 'op_cua', 'Ốp cửa'),
    (part_id, 'op_tay_nam', 'Ốp tay nắm cửa'),
    (part_id, 'tay_nam_cua', 'Tay nắm cửa');

    -- Tai vè Tài
    SELECT id INTO part_id FROM car_parts WHERE name = 'tai_ve_tai';
    INSERT INTO removable_parts (car_part_id, name, display_name) VALUES
    (part_id, 'op_tai_ve', 'Ốp tai vè'),
    (part_id, 'op_cua_lop', 'Ốp cua lốp');

    -- Tai vè Phụ
    SELECT id INTO part_id FROM car_parts WHERE name = 'tai_ve_phu';
    INSERT INTO removable_parts (car_part_id, name, display_name) VALUES
    (part_id, 'op_tai_ve', 'Ốp tai vè'),
    (part_id, 'op_cua_lop', 'Ốp cua lốp');

    -- Hông bên Tài
    SELECT id INTO part_id FROM car_parts WHERE name = 'hong_ben_tai';
    INSERT INTO removable_parts (car_part_id, name, display_name) VALUES
    (part_id, 'op_hong', 'Ốp hông');

    -- Hông bên Phụ
    SELECT id INTO part_id FROM car_parts WHERE name = 'hong_ben_phu';
    INSERT INTO removable_parts (car_part_id, name, display_name) VALUES
    (part_id, 'op_hong', 'Ốp hông');

    -- Cốp Trên
    SELECT id INTO part_id FROM car_parts WHERE name = 'cop_tren';
    INSERT INTO removable_parts (car_part_id, name, display_name) VALUES
    (part_id, 'den', 'Đèn');

    -- Cốp Dưới
    SELECT id INTO part_id FROM car_parts WHERE name = 'cop_duoi';
    INSERT INTO removable_parts (car_part_id, name, display_name) VALUES
    (part_id, 'den', 'Đèn');

    -- Nguyên Cốp
    SELECT id INTO part_id FROM car_parts WHERE name = 'nguyen_cop';
    INSERT INTO removable_parts (car_part_id, name, display_name) VALUES
    (part_id, 'den', 'Đèn');
END $$;

-- Insert pricing for car parts (31 parts × 4 segments = 124 records)
DO $$
DECLARE
    segment_record RECORD;
    part_record RECORD;
    base_price INTEGER;
BEGIN
    FOR segment_record IN SELECT * FROM car_segments LOOP
        FOR part_record IN SELECT * FROM car_parts LOOP
            -- Set base price based on part type and segment
            CASE 
                WHEN part_record.name IN ('noc_xe') THEN
                    CASE segment_record.name
                        WHEN 'hatchback' THEN base_price := 1200000;
                        WHEN 'sedan' THEN base_price := 1400000;
                        WHEN 'suv_nho' THEN base_price := 1500000;
                        WHEN 'suv_7_cho' THEN base_price := 1700000;
                    END CASE;
                WHEN part_record.name IN ('nap_capo') THEN
                    CASE segment_record.name
                        WHEN 'hatchback' THEN base_price := 900000;
                        WHEN 'sedan' THEN base_price := 1100000;
                        WHEN 'suv_nho' THEN base_price := 1200000;
                        WHEN 'suv_7_cho' THEN base_price := 1400000;
                    END CASE;
                WHEN part_record.name IN ('nguyen_cop', 'nguyen_can_truoc', 'nguyen_can_sau') THEN
                    CASE segment_record.name
                        WHEN 'hatchback' THEN base_price := 800000;
                        WHEN 'sedan' THEN base_price := 1000000;
                        WHEN 'suv_nho' THEN base_price := 1100000;
                        WHEN 'suv_7_cho' THEN base_price := 1300000;
                    END CASE;
                WHEN part_record.name LIKE 'cua_%' THEN
                    CASE segment_record.name
                        WHEN 'hatchback' THEN base_price := 500000;
                        WHEN 'sedan' THEN base_price := 600000;
                        WHEN 'suv_nho' THEN base_price := 650000;
                        WHEN 'suv_7_cho' THEN base_price := 750000;
                    END CASE;
                WHEN part_record.name LIKE 'can_%' AND part_record.name NOT LIKE 'nguyen_%' THEN
                    CASE segment_record.name
                        WHEN 'hatchback' THEN base_price := 400000;
                        WHEN 'sedan' THEN base_price := 450000;
                        WHEN 'suv_nho' THEN base_price := 500000;
                        WHEN 'suv_7_cho' THEN base_price := 550000;
                    END CASE;
                WHEN part_record.name LIKE 'tai_ve_%' OR part_record.name LIKE 'hong_%' THEN
                    CASE segment_record.name
                        WHEN 'hatchback' THEN base_price := 300000;
                        WHEN 'sedan' THEN base_price := 350000;
                        WHEN 'suv_nho' THEN base_price := 400000;
                        WHEN 'suv_7_cho' THEN base_price := 450000;
                    END CASE;
                WHEN part_record.name LIKE 'luron_%' OR part_record.name LIKE 'cot_%' THEN
                    CASE segment_record.name
                        WHEN 'hatchback' THEN base_price := 350000;
                        WHEN 'sedan' THEN base_price := 400000;
                        WHEN 'suv_nho' THEN base_price := 450000;
                        WHEN 'suv_7_cho' THEN base_price := 500000;
                    END CASE;
                WHEN part_record.name LIKE 'cop_%' THEN
                    CASE segment_record.name
                        WHEN 'hatchback' THEN base_price := 350000;
                        WHEN 'sedan' THEN base_price := 400000;
                        WHEN 'suv_nho' THEN base_price := 450000;
                        WHEN 'suv_7_cho' THEN base_price := 500000;
                    END CASE;
                WHEN part_record.name = 'mam_xe' THEN
                    CASE segment_record.name
                        WHEN 'hatchback' THEN base_price := 200000;
                        WHEN 'sedan' THEN base_price := 250000;
                        WHEN 'suv_nho' THEN base_price := 300000;
                        WHEN 'suv_7_cho' THEN base_price := 350000;
                    END CASE;
                WHEN part_record.name LIKE 'op_%' THEN
                    CASE segment_record.name
                        WHEN 'hatchback' THEN base_price := 60000;
                        WHEN 'sedan' THEN base_price := 80000;
                        WHEN 'suv_nho' THEN base_price := 100000;
                        WHEN 'suv_7_cho' THEN base_price := 120000;
                    END CASE;
                ELSE
                    CASE segment_record.name
                        WHEN 'hatchback' THEN base_price := 150000;
                        WHEN 'sedan' THEN base_price := 180000;
                        WHEN 'suv_nho' THEN base_price := 200000;
                        WHEN 'suv_7_cho' THEN base_price := 250000;
                    END CASE;
            END CASE;

            INSERT INTO pricing (car_segment_id, item_type, item_id, price)
            VALUES (segment_record.id, 'car_part', part_record.id, base_price);
        END LOOP;
    END LOOP;
END $$;

-- Insert pricing for services (4 services × 4 segments = 16 records)
DO $$
DECLARE
    segment_record RECORD;
    service_record RECORD;
    service_price INTEGER;
BEGIN
    FOR segment_record IN SELECT * FROM car_segments LOOP
        FOR service_record IN SELECT * FROM services LOOP
            CASE service_record.name
                WHEN 'cat_son_cu' THEN
                    CASE segment_record.name
                        WHEN 'hatchback' THEN service_price := 100000;
                        WHEN 'sedan' THEN service_price := 120000;
                        WHEN 'suv_nho' THEN service_price := 140000;
                        WHEN 'suv_7_cho' THEN service_price := 160000;
                    END CASE;
                WHEN 'sua_chua_be_mat' THEN
                    CASE segment_record.name
                        WHEN 'hatchback' THEN service_price := 80000;
                        WHEN 'sedan' THEN service_price := 100000;
                        WHEN 'suv_nho' THEN service_price := 120000;
                        WHEN 'suv_7_cho' THEN service_price := 140000;
                    END CASE;
                WHEN 'son_lot_dac_biet' THEN
                    CASE segment_record.name
                        WHEN 'hatchback' THEN service_price := 150000;
                        WHEN 'sedan' THEN service_price := 180000;
                        WHEN 'suv_nho' THEN service_price := 200000;
                        WHEN 'suv_7_cho' THEN service_price := 220000;
                    END CASE;
                WHEN 'bao_ve_dac_biet' THEN
                    CASE segment_record.name
                        WHEN 'hatchback' THEN service_price := 120000;
                        WHEN 'sedan' THEN service_price := 150000;
                        WHEN 'suv_nho' THEN service_price := 180000;
                        WHEN 'suv_7_cho' THEN service_price := 200000;
                    END CASE;
            END CASE;

            INSERT INTO pricing (car_segment_id, item_type, item_id, price)
            VALUES (segment_record.id, 'service', service_record.id, service_price);
        END LOOP;
    END LOOP;
END $$;

-- Insert pricing for removable parts
DO $$
DECLARE
    segment_record RECORD;
    removable_record RECORD;
    removable_price INTEGER;
BEGIN
    FOR segment_record IN SELECT * FROM car_segments LOOP
        FOR removable_record IN SELECT * FROM removable_parts LOOP
            CASE removable_record.name
                WHEN 'den' THEN
                    CASE segment_record.name
                        WHEN 'hatchback' THEN removable_price := 80000;
                        WHEN 'sedan' THEN removable_price := 90000;
                        WHEN 'suv_nho' THEN removable_price := 100000;
                        WHEN 'suv_7_cho' THEN removable_price := 110000;
                    END CASE;
                WHEN 'roang' THEN
                    CASE segment_record.name
                        WHEN 'hatchback' THEN removable_price := 60000;
                        WHEN 'sedan' THEN removable_price := 70000;
                        WHEN 'suv_nho' THEN removable_price := 80000;
                        WHEN 'suv_7_cho' THEN removable_price := 90000;
                    END CASE;
                WHEN 'mat_galang' THEN
                    CASE segment_record.name
                        WHEN 'hatchback' THEN removable_price := 50000;
                        WHEN 'sedan' THEN removable_price := 60000;
                        WHEN 'suv_nho' THEN removable_price := 70000;
                        WHEN 'suv_7_cho' THEN removable_price := 80000;
                    END CASE;
                WHEN 'op_hong' THEN
                    CASE segment_record.name
                        WHEN 'hatchback' THEN removable_price := 45000;
                        WHEN 'sedan' THEN removable_price := 50000;
                        WHEN 'suv_nho' THEN removable_price := 55000;
                        WHEN 'suv_7_cho' THEN removable_price := 60000;
                    END CASE;
                WHEN 'cum_guong' THEN
                    CASE segment_record.name
                        WHEN 'hatchback' THEN removable_price := 40000;
                        WHEN 'sedan' THEN removable_price := 45000;
                        WHEN 'suv_nho' THEN removable_price := 50000;
                        WHEN 'suv_7_cho' THEN removable_price := 55000;
                    END CASE;
                WHEN 'op_can' THEN
                    CASE segment_record.name
                        WHEN 'hatchback' THEN removable_price := 35000;
                        WHEN 'sedan' THEN removable_price := 40000;
                        WHEN 'suv_nho' THEN removable_price := 45000;
                        WHEN 'suv_7_cho' THEN removable_price := 50000;
                    END CASE;
                WHEN 'op_cua', 'op_tai_ve' THEN
                    CASE segment_record.name
                        WHEN 'hatchback' THEN removable_price := 30000;
                        WHEN 'sedan' THEN removable_price := 35000;
                        WHEN 'suv_nho' THEN removable_price := 40000;
                        WHEN 'suv_7_cho' THEN removable_price := 45000;
                    END CASE;
                WHEN 'op_cua_lop', 'tay_nam_cua', 'op_tay_nam' THEN
                    CASE segment_record.name
                        WHEN 'hatchback' THEN removable_price := 25000;
                        WHEN 'sedan' THEN removable_price := 30000;
                        WHEN 'suv_nho' THEN removable_price := 35000;
                        WHEN 'suv_7_cho' THEN removable_price := 40000;
                    END CASE;
                WHEN 'bien_so' THEN
                    CASE segment_record.name
                        WHEN 'hatchback' THEN removable_price := 20000;
                        WHEN 'sedan' THEN removable_price := 20000;
                        WHEN 'suv_nho' THEN removable_price := 25000;
                        WHEN 'suv_7_cho' THEN removable_price := 25000;
                    END CASE;
                ELSE
                    CASE segment_record.name
                        WHEN 'hatchback' THEN removable_price := 30000;
                        WHEN 'sedan' THEN removable_price := 35000;
                        WHEN 'suv_nho' THEN removable_price := 40000;
                        WHEN 'suv_7_cho' THEN removable_price := 45000;
                    END CASE;
            END CASE;

            INSERT INTO pricing (car_segment_id, item_type, item_id, price)
            VALUES (segment_record.id, 'removable_part', removable_record.id, removable_price);
        END LOOP;
    END LOOP;
END $$;

-- Insert pricing for panel painting (4 segments)
DO $$
DECLARE
    segment_record RECORD;
    panel_price INTEGER;
BEGIN
    FOR segment_record IN SELECT * FROM car_segments LOOP
        CASE segment_record.name
            WHEN 'hatchback' THEN panel_price := 8000000;
            WHEN 'sedan' THEN panel_price := 10000000;
            WHEN 'suv_nho' THEN panel_price := 12000000;
            WHEN 'suv_7_cho' THEN panel_price := 15000000;
        END CASE;

        INSERT INTO pricing (car_segment_id, item_type, item_id, price)
        VALUES (segment_record.id, 'panel_painting', NULL, panel_price);
    END LOOP;
END $$;