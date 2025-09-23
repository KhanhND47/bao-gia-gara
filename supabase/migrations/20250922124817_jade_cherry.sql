/*
  # Update Spot Painting Pricing Data

  1. Pricing Updates
    - Update pricing for all car parts across 4 car segments
    - Xe hatchback: Base pricing tier
    - Xe Sedan: Mid-tier pricing 
    - SUV cỡ nhỏ: Higher pricing tier
    - Xe hạng SUV 7: Premium pricing tier

  2. Car Parts Covered
    - All main car parts with specific pricing per segment
    - Prices range from 150,000đ to 1,700,000đ depending on part and segment

  3. Data Structure
    - Uses car_segment_id and car_part mapping
    - item_type = 'car_part' for spot painting services
    - Prices stored as numeric values
*/

-- First, let's get the car segment IDs and car part IDs for reference
-- We'll use DO blocks to handle the updates dynamically

DO $$
DECLARE
    hatchback_id uuid;
    sedan_id uuid;
    suv_small_id uuid;
    suv_7_id uuid;
    
    -- Car part variables
    cang_truoc_id uuid;
    capo_id uuid;
    tai_ve_t_id uuid;
    tai_ve_p_id uuid;
    cua_truoc_t_id uuid;
    cua_truoc_p_id uuid;
    cot_abc_t_id uuid;
    cot_abc_p_id uuid;
    noc_xe_id uuid;
    cua_sau_t_id uuid;
    cua_sau_p_id uuid;
    hong_sau_t_id uuid;
    hong_sau_p_id uuid;
    cang_sau_id uuid;
    cop_cua_hau_id uuid;
    nap_binh_xang_id uuid;
    luon_xe_id uuid;
BEGIN
    -- Get car segment IDs
    SELECT id INTO hatchback_id FROM car_segments WHERE name = 'hatchback';
    SELECT id INTO sedan_id FROM car_segments WHERE name = 'sedan';
    SELECT id INTO suv_small_id FROM car_segments WHERE name = 'suv_small';
    SELECT id INTO suv_7_id FROM car_segments WHERE name = 'suv_7';
    
    -- Get car part IDs
    SELECT id INTO cang_truoc_id FROM car_parts WHERE name = 'cang_truoc';
    SELECT id INTO capo_id FROM car_parts WHERE name = 'capo';
    SELECT id INTO tai_ve_t_id FROM car_parts WHERE name = 'tai_ve_t';
    SELECT id INTO tai_ve_p_id FROM car_parts WHERE name = 'tai_ve_p';
    SELECT id INTO cua_truoc_t_id FROM car_parts WHERE name = 'cua_truoc_t';
    SELECT id INTO cua_truoc_p_id FROM car_parts WHERE name = 'cua_truoc_p';
    SELECT id INTO cot_abc_t_id FROM car_parts WHERE name = 'cot_abc_t';
    SELECT id INTO cot_abc_p_id FROM car_parts WHERE name = 'cot_abc_p';
    SELECT id INTO noc_xe_id FROM car_parts WHERE name = 'noc_xe';
    SELECT id INTO cua_sau_t_id FROM car_parts WHERE name = 'cua_sau_t';
    SELECT id INTO cua_sau_p_id FROM car_parts WHERE name = 'cua_sau_p';
    SELECT id INTO hong_sau_t_id FROM car_parts WHERE name = 'hong_sau_t';
    SELECT id INTO hong_sau_p_id FROM car_parts WHERE name = 'hong_sau_p';
    SELECT id INTO cang_sau_id FROM car_parts WHERE name = 'cang_sau';
    SELECT id INTO cop_cua_hau_id FROM car_parts WHERE name = 'cop_cua_hau';
    SELECT id INTO nap_binh_xang_id FROM car_parts WHERE name = 'nap_binh_xang';
    SELECT id INTO luon_xe_id FROM car_parts WHERE name = 'luon_xe';
    
    -- Delete existing pricing data for car_part type to avoid conflicts
    DELETE FROM pricing WHERE item_type = 'car_part';
    
    -- Insert pricing for Xe hatchback
    IF hatchback_id IS NOT NULL THEN
        INSERT INTO pricing (car_segment_id, item_type, item_id, price) VALUES
        (hatchback_id, 'car_part', cang_truoc_id, 700000),
        (hatchback_id, 'car_part', capo_id, 900000),
        (hatchback_id, 'car_part', tai_ve_t_id, 500000),
        (hatchback_id, 'car_part', tai_ve_p_id, 500000),
        (hatchback_id, 'car_part', cua_truoc_t_id, 600000),
        (hatchback_id, 'car_part', cua_truoc_p_id, 600000),
        (hatchback_id, 'car_part', cot_abc_t_id, 500000),
        (hatchback_id, 'car_part', cot_abc_p_id, 500000),
        (hatchback_id, 'car_part', noc_xe_id, 1200000),
        (hatchback_id, 'car_part', cua_sau_t_id, 600000),
        (hatchback_id, 'car_part', cua_sau_p_id, 600000),
        (hatchback_id, 'car_part', hong_sau_t_id, 500000),
        (hatchback_id, 'car_part', hong_sau_p_id, 500000),
        (hatchback_id, 'car_part', cang_sau_id, 700000),
        (hatchback_id, 'car_part', cop_cua_hau_id, 900000),
        (hatchback_id, 'car_part', nap_binh_xang_id, 150000),
        (hatchback_id, 'car_part', luon_xe_id, 500000);
    END IF;
    
    -- Insert pricing for Xe Sedan
    IF sedan_id IS NOT NULL THEN
        INSERT INTO pricing (car_segment_id, item_type, item_id, price) VALUES
        (sedan_id, 'car_part', cang_truoc_id, 800000),
        (sedan_id, 'car_part', capo_id, 1000000),
        (sedan_id, 'car_part', tai_ve_t_id, 600000),
        (sedan_id, 'car_part', tai_ve_p_id, 600000),
        (sedan_id, 'car_part', cua_truoc_t_id, 700000),
        (sedan_id, 'car_part', cua_truoc_p_id, 700000),
        (sedan_id, 'car_part', cot_abc_t_id, 500000),
        (sedan_id, 'car_part', cot_abc_p_id, 500000),
        (sedan_id, 'car_part', noc_xe_id, 1300000),
        (sedan_id, 'car_part', cua_sau_t_id, 700000),
        (sedan_id, 'car_part', cua_sau_p_id, 700000),
        (sedan_id, 'car_part', hong_sau_t_id, 600000),
        (sedan_id, 'car_part', hong_sau_p_id, 600000),
        (sedan_id, 'car_part', cang_sau_id, 800000),
        (sedan_id, 'car_part', cop_cua_hau_id, 1000000),
        (sedan_id, 'car_part', nap_binh_xang_id, 150000),
        (sedan_id, 'car_part', luon_xe_id, 600000);
    END IF;
    
    -- Insert pricing for SUV cỡ nhỏ
    IF suv_small_id IS NOT NULL THEN
        INSERT INTO pricing (car_segment_id, item_type, item_id, price) VALUES
        (suv_small_id, 'car_part', cang_truoc_id, 900000),
        (suv_small_id, 'car_part', capo_id, 1200000),
        (suv_small_id, 'car_part', tai_ve_t_id, 700000),
        (suv_small_id, 'car_part', tai_ve_p_id, 700000),
        (suv_small_id, 'car_part', cua_truoc_t_id, 800000),
        (suv_small_id, 'car_part', cua_truoc_p_id, 800000),
        (suv_small_id, 'car_part', cot_abc_t_id, 600000),
        (suv_small_id, 'car_part', cot_abc_p_id, 600000),
        (suv_small_id, 'car_part', noc_xe_id, 1500000),
        (suv_small_id, 'car_part', cua_sau_t_id, 800000),
        (suv_small_id, 'car_part', cua_sau_p_id, 800000),
        (suv_small_id, 'car_part', hong_sau_t_id, 700000),
        (suv_small_id, 'car_part', hong_sau_p_id, 700000),
        (suv_small_id, 'car_part', cang_sau_id, 900000),
        (suv_small_id, 'car_part', cop_cua_hau_id, 1200000),
        (suv_small_id, 'car_part', nap_binh_xang_id, 200000),
        (suv_small_id, 'car_part', luon_xe_id, 700000);
    END IF;
    
    -- Insert pricing for Xe hạng SUV 7
    IF suv_7_id IS NOT NULL THEN
        INSERT INTO pricing (car_segment_id, item_type, item_id, price) VALUES
        (suv_7_id, 'car_part', cang_truoc_id, 1000000),
        (suv_7_id, 'car_part', capo_id, 1400000),
        (suv_7_id, 'car_part', tai_ve_t_id, 800000),
        (suv_7_id, 'car_part', tai_ve_p_id, 800000),
        (suv_7_id, 'car_part', cua_truoc_t_id, 900000),
        (suv_7_id, 'car_part', cua_truoc_p_id, 900000),
        (suv_7_id, 'car_part', cot_abc_t_id, 700000),
        (suv_7_id, 'car_part', cot_abc_p_id, 700000),
        (suv_7_id, 'car_part', noc_xe_id, 1700000),
        (suv_7_id, 'car_part', cua_sau_t_id, 900000),
        (suv_7_id, 'car_part', cua_sau_p_id, 900000),
        (suv_7_id, 'car_part', hong_sau_t_id, 800000),
        (suv_7_id, 'car_part', hong_sau_p_id, 800000),
        (suv_7_id, 'car_part', cang_sau_id, 1000000),
        (suv_7_id, 'car_part', cop_cua_hau_id, 1400000),
        (suv_7_id, 'car_part', nap_binh_xang_id, 250000),
        (suv_7_id, 'car_part', luon_xe_id, 800000);
    END IF;
    
    RAISE NOTICE 'Successfully updated spot painting pricing for all car segments';
END $$;