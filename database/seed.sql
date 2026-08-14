USE form2feature;

-- =========================================
-- SAMPLE MANDIS
-- =========================================

INSERT INTO mandis
(name, address, district, state, latitude, longitude, contact_number)
VALUES
(
    'Hubballi APMC',
    'APMC Yard, Hubballi',
    'Dharwad',
    'Karnataka',
    15.3647,
    75.1240,
    '0836-1234567'
),
(
    'Haveri APMC',
    'APMC Market Yard, Haveri',
    'Haveri',
    'Karnataka',
    14.7951,
    75.3991,
    '08375-123456'
),
(
    'Dharwad APMC',
    'APMC Yard, Dharwad',
    'Dharwad',
    'Karnataka',
    15.4589,
    75.0078,
    '0836-2345678'
);

-- =========================================
-- SAMPLE MARKET PRICES
-- =========================================

INSERT INTO market_prices
(mandi_id, crop_name, min_price, max_price, modal_price, price_unit, price_date)
VALUES
(1, 'Tomato', 1800, 2500, 2200, 'quintal', CURDATE()),
(1, 'Onion', 2000, 2800, 2400, 'quintal', CURDATE()),
(1, 'Maize', 2100, 2600, 2350, 'quintal', CURDATE()),
(2, 'Tomato', 1700, 2600, 2300, 'quintal', CURDATE()),
(2, 'Maize', 2200, 2700, 2450, 'quintal', CURDATE()),
(3, 'Onion', 1900, 2900, 2500, 'quintal', CURDATE());

-- =========================================
-- SAMPLE GOVERNMENT SCHEME
-- =========================================

INSERT INTO government_schemes
(scheme_name, description, eligibility, benefits)
VALUES
(
    'PM-KISAN',
    'Income support scheme for eligible farmer families.',
    'Eligible landholding farmer families according to scheme rules.',
    'Financial assistance through eligible installments.'
),
(
    'Pradhan Mantri Fasal Bima Yojana',
    'Crop insurance scheme for farmers.',
    'Farmers meeting the applicable crop and area conditions.',
    'Crop insurance protection against specified risks.'
);