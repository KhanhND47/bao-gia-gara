/*
  # Insert Comprehensive Pricing Data

  1. Car Part Pricing
    - Different prices for each car segment
    - Realistic Vietnamese pricing

  2. Service Pricing
    - Optional services pricing by segment

  3. Removable Parts Pricing
    - Pricing for removal/installation services

  4. Panel Painting Pricing
    - Fixed pricing for full panel painting by segment
*/

DO $$
DECLARE
    segment_record RECORD;
    part_record RECORD;
    service_record RECORD;
    removable_record RECORD;
BEGIN
    -- Insert Car Part Pricing
    FOR segment_record IN SELECT * FROM car_segments LOOP
        FOR part_record IN SELECT * FROM car_parts LOOP
            INSERT INTO pricing (car_segment_id, item_type, item_id, price) VALUES
            (segment_record.id, 'car_part', part_record.id, 
                CASE segment_record.name
                    WHEN 'hatchback' THEN 
                        CASE 
                            WHEN part_record.name LIKE '%can_%' THEN 800000
                            WHEN part_record.name LIKE '%cua_%' THEN 600000
                            WHEN part_record.name LIKE '%tai_ve_%' THEN 400000
                            WHEN part_record.name LIKE '%hong_%' THEN 500000
                            WHEN part_record.name LIKE '%cop_%' THEN 700000
                            WHEN part_record.name = 'nap_capo' THEN 650000
                            WHEN part_record.name = 'noc_xe' THEN 900000
                            WHEN part_record.name LIKE '%cot_%' THEN 300000
                            WHEN part_record.name LIKE '%luon_%' THEN 450000
                            ELSE 350000
                        END
                    WHEN 'sedan' THEN 
                        CASE 
                            WHEN part_record.name LIKE '%can_%' THEN 900000
                            WHEN part_record.name LIKE '%cua_%' THEN 700000
                            WHEN part_record.name LIKE '%tai_ve_%' THEN 500000
                            WHEN part_record.name LIKE '%hong_%' THEN 600000
                            WHEN part_record.name LIKE '%cop_%' THEN 800000
                            WHEN part_record.name = 'nap_capo' THEN 750000
                            WHEN part_record.name = 'noc_xe' THEN 1000000
                            WHEN part_record.name LIKE '%cot_%' THEN 350000
                            WHEN part_record.name LIKE '%luon_%' THEN 550000
                            ELSE 400000
                        END
                    WHEN 'suv_small' THEN 
                        CASE 
                            WHEN part_record.name LIKE '%can_%' THEN 1000000
                            WHEN part_record.name LIKE '%cua_%' THEN 800000
                            WHEN part_record.name LIKE '%tai_ve_%' THEN 600000
                            WHEN part_record.name LIKE '%hong_%' THEN 700000
                            WHEN part_record.name LIKE '%cop_%' THEN 900000
                            WHEN part_record.name = 'nap_capo' THEN 850000
                            WHEN part_record.name = 'noc_xe' THEN 1200000
                            WHEN part_record.name LIKE '%cot_%' THEN 400000
                            WHEN part_record.name LIKE '%luon_%' THEN 650000
                            ELSE 450000
                        END
                    WHEN 'suv_7_seats' THEN 
                        CASE 
                            WHEN part_record.name LIKE '%can_%' THEN 1200000
                            WHEN part_record.name LIKE '%cua_%' THEN 950000
                            WHEN part_record.name LIKE '%tai_ve_%' THEN 700000
                            WHEN part_record.name LIKE '%hong_%' THEN 800000
                            WHEN part_record.name LIKE '%cop_%' THEN 1000000
                            WHEN part_record.name = 'nap_capo' THEN 950000
                            WHEN part_record.name = 'noc_xe' THEN 1400000
                            WHEN part_record.name LIKE '%cot_%' THEN 450000
                            WHEN part_record.name LIKE '%luon_%' THEN 750000
                            ELSE 500000
                        END
                END
            )
            ON CONFLICT (car_segment_id, item_type, item_id) DO NOTHING;
        END LOOP;
    END LOOP;

    -- Insert Optional Service Pricing
    FOR segment_record IN SELECT * FROM car_segments LOOP
        FOR service_record IN SELECT * FROM services WHERE type = 'optional' LOOP
            INSERT INTO pricing (car_segment_id, item_type, item_id, price) VALUES
            (segment_record.id, 'service', service_record.id,
                CASE segment_record.name
                    WHEN 'hatchback' THEN 
                        CASE service_record.name
                            WHEN 'lot_bo_lop_son' THEN 200000
                            WHEN 'phuc_hoi_go_han' THEN 300000
                            WHEN 'va_muc' THEN 150000
                            WHEN 'danh_bong_chuyen_sau' THEN 250000
                            ELSE 100000
                        END
                    WHEN 'sedan' THEN 
                        CASE service_record.name
                            WHEN 'lot_bo_lop_son' THEN 250000
                            WHEN 'phuc_hoi_go_han' THEN 350000
                            WHEN 'va_muc' THEN 200000
                            WHEN 'danh_bong_chuyen_sau' THEN 300000
                            ELSE 120000
                        END
                    WHEN 'suv_small' THEN 
                        CASE service_record.name
                            WHEN 'lot_bo_lop_son' THEN 300000
                            WHEN 'phuc_hoi_go_han' THEN 400000
                            WHEN 'va_muc' THEN 250000
                            WHEN 'danh_bong_chuyen_sau' THEN 350000
                            ELSE 150000
                        END
                    WHEN 'suv_7_seats' THEN 
                        CASE service_record.name
                            WHEN 'lot_bo_lop_son' THEN 350000
                            WHEN 'phuc_hoi_go_han' THEN 450000
                            WHEN 'va_muc' THEN 300000
                            WHEN 'danh_bong_chuyen_sau' THEN 400000
                            ELSE 180000
                        END
                END
            )
            ON CONFLICT (car_segment_id, item_type, item_id) DO NOTHING;
        END LOOP;
    END LOOP;

    -- Insert Removable Parts Pricing
    FOR segment_record IN SELECT * FROM car_segments LOOP
        FOR removable_record IN SELECT * FROM removable_parts LOOP
            INSERT INTO pricing (car_segment_id, item_type, item_id, price) VALUES
            (segment_record.id, 'removable_part', removable_record.id,
                CASE segment_record.name
                    WHEN 'hatchback' THEN 
                        CASE removable_record.name
                            WHEN 'mat_galang' THEN 50000
                            WHEN 'op_can' THEN 30000
                            WHEN 'den' THEN 40000
                            WHEN 'bien_so' THEN 20000
                            WHEN 'cum_guong' THEN 60000
                            WHEN 'roang' THEN 80000
                            WHEN 'op_cua' THEN 40000
                            WHEN 'op_tay_nam' THEN 25000
                            WHEN 'tay_nam_cua' THEN 35000
                            WHEN 'op_tai_ve' THEN 30000
                            WHEN 'op_cua_lop' THEN 25000
                            WHEN 'op_hong' THEN 35000
                            ELSE 30000
                        END
                    WHEN 'sedan' THEN 
                        CASE removable_record.name
                            WHEN 'mat_galang' THEN 60000
                            WHEN 'op_can' THEN 35000
                            WHEN 'den' THEN 45000
                            WHEN 'bien_so' THEN 25000
                            WHEN 'cum_guong' THEN 70000
                            WHEN 'roang' THEN 90000
                            WHEN 'op_cua' THEN 45000
                            WHEN 'op_tay_nam' THEN 30000
                            WHEN 'tay_nam_cua' THEN 40000
                            WHEN 'op_tai_ve' THEN 35000
                            WHEN 'op_cua_lop' THEN 30000
                            WHEN 'op_hong' THEN 40000
                            ELSE 35000
                        END
                    WHEN 'suv_small' THEN 
                        CASE removable_record.name
                            WHEN 'mat_galang' THEN 70000
                            WHEN 'op_can' THEN 40000
                            WHEN 'den' THEN 50000
                            WHEN 'bien_so' THEN 30000
                            WHEN 'cum_guong' THEN 80000
                            WHEN 'roang' THEN 100000
                            WHEN 'op_cua' THEN 50000
                            WHEN 'op_tay_nam' THEN 35000
                            WHEN 'tay_nam_cua' THEN 45000
                            WHEN 'op_tai_ve' THEN 40000
                            WHEN 'op_cua_lop' THEN 35000
                            WHEN 'op_hong' THEN 45000
                            ELSE 40000
                        END
                    WHEN 'suv_7_seats' THEN 
                        CASE removable_record.name
                            WHEN 'mat_galang' THEN 80000
                            WHEN 'op_can' THEN 45000
                            WHEN 'den' THEN 55000
                            WHEN 'bien_so' THEN 35000
                            WHEN 'cum_guong' THEN 90000
                            WHEN 'roang' THEN 110000
                            WHEN 'op_cua' THEN 55000
                            WHEN 'op_tay_nam' THEN 40000
                            WHEN 'tay_nam_cua' THEN 50000
                            WHEN 'op_tai_ve' THEN 45000
                            WHEN 'op_cua_lop' THEN 40000
                            WHEN 'op_hong' THEN 50000
                            ELSE 45000
                        END
                END
            )
            ON CONFLICT (car_segment_id, item_type, item_id) DO NOTHING;
        END LOOP;
    END LOOP;

    -- Insert Panel Painting Pricing (fixed price for full car painting)
    FOR segment_record IN SELECT * FROM car_segments LOOP
        INSERT INTO pricing (car_segment_id, item_type, item_id, price) VALUES
        (segment_record.id, 'panel_painting', NULL,
            CASE segment_record.name
                WHEN 'hatchback' THEN 12000000
                WHEN 'sedan' THEN 15000000
                WHEN 'suv_small' THEN 18000000
                WHEN 'suv_7_seats' THEN 22000000
            END
        )
        ON CONFLICT (car_segment_id, item_type, item_id) DO NOTHING;
    END LOOP;

END $$;