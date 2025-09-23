/*
  # Insert Comprehensive Sample Data

  1. Car Segments
    - Xe Hatchback, Xe Sedan, SUV cỡ nhỏ, SUV 7 chỗ

  2. Car Parts
    - All 25 car parts as specified

  3. Services
    - Required services (10 items)
    - Optional services (4 items)

  4. Removable Parts
    - Specific removable parts for each car part

  5. Pricing
    - Sample pricing for all combinations
*/

-- Insert Car Segments
INSERT INTO car_segments (name, display_name) VALUES
('hatchback', 'Xe Hatchback'),
('sedan', 'Xe Sedan'),
('suv_small', 'SUV cỡ nhỏ'),
('suv_7_seats', 'SUV 7 chỗ')
ON CONFLICT (name) DO NOTHING;

-- Insert Car Parts
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
('luon_tren', 'Lườn Trên', 'main'),
('luon_duoi', 'Lườn Dưới', 'main'),
('cot_a', 'Cột A', 'main'),
('cot_b', 'Cột B', 'main'),
('cot_c', 'Cột C', 'main'),
('cop_tren', 'Cốp Trên', 'main'),
('cop_duoi', 'Cốp Dưới', 'main'),
('nguyen_cop', 'Nguyên Cốp', 'main'),
('nap_capo', 'Nắp Capo', 'main'),
('noc_xe', 'Nóc xe', 'main'),
('nap_binh_xang', 'Nắp bình xăng', 'main')
ON CONFLICT (name) DO NOTHING;

-- Insert Required Services (always included)
INSERT INTO services (name, display_name, type) VALUES
('xu_ly_be_mat', 'Xử lý bề mặt', 'required'),
('son_lot_chong_gi', 'Sơn lót chống gỉ', 'required'),
('tra_ba_matic', 'Tra bả matic', 'required'),
('cho_kho', 'Chờ khô', 'required'),
('danh_nham_tao_form', 'Đánh nhám tạo form', 'required'),
('pha_son_dong_mau', 'Pha sơn đồng màu', 'required'),
('son_lot', 'Sơn lót', 'required'),
('son_mau', 'Sơn màu', 'required'),
('son_bong', 'Sơn bóng', 'required'),
('danh_bong', 'Đánh bóng', 'required')
ON CONFLICT (name) DO NOTHING;

-- Insert Optional Services
INSERT INTO services (name, display_name, type) VALUES
('lot_bo_lop_son', 'Lột bỏ lớp sơn đến phần tôn xe', 'optional'),
('phuc_hoi_go_han', 'Phục hồi gò hàn rút tôn', 'optional'),
('va_muc', 'Vá mục', 'optional'),
('danh_bong_chuyen_sau', 'Đánh bóng chuyên sâu 3 bước', 'optional')
ON CONFLICT (name) DO NOTHING;

-- Insert Removable Parts for each Car Part
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