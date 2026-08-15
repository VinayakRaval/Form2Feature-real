CREATE DATABASE IF NOT EXISTS form2feature;

USE form2feature;

-- =========================================
-- USERS TABLE
-- =========================================

CREATE TABLE users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    full_name VARCHAR(100) NOT NULL,
    email VARCHAR(150) UNIQUE NOT NULL,
    mobile VARCHAR(15) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    role ENUM('admin', 'farmer', 'buyer', 'transporter') DEFAULT 'farmer',
    is_verified BOOLEAN DEFAULT FALSE,
    profile_photo VARCHAR(255) DEFAULT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        ON UPDATE CURRENT_TIMESTAMP
);

-- =========================================
-- FARMERS TABLE
-- =========================================

CREATE TABLE farmers (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    address VARCHAR(255),
    village VARCHAR(100),
    district VARCHAR(100),
    state VARCHAR(100),
    pincode VARCHAR(10),
    farm_size DECIMAL(10,2),
    farm_size_unit VARCHAR(20) DEFAULT 'acres',
    farming_type VARCHAR(100),
    crops_grown TEXT,
    latitude DECIMAL(10,7),
    longitude DECIMAL(10,7),

    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        ON UPDATE CURRENT_TIMESTAMP,

    FOREIGN KEY (user_id)
        REFERENCES users(id)
        ON DELETE CASCADE
);

-- =========================================
-- CROPS TABLE
-- =========================================

CREATE TABLE crops (
    id INT AUTO_INCREMENT PRIMARY KEY,
    farmer_id INT NOT NULL,
    crop_name VARCHAR(100) NOT NULL,
    crop_variety VARCHAR(100),
    quantity DECIMAL(12,2) NOT NULL,
    quantity_unit VARCHAR(20) DEFAULT 'kg',
    quality VARCHAR(50),
    description TEXT,
    image VARCHAR(255),
    expected_price DECIMAL(12,2),
    harvest_date DATE,
    status ENUM('available', 'sold', 'inactive') DEFAULT 'available',

    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        ON UPDATE CURRENT_TIMESTAMP,

    FOREIGN KEY (farmer_id)
        REFERENCES farmers(id)
        ON DELETE CASCADE
);

-- =========================================
-- MANDI TABLE
-- =========================================

CREATE TABLE mandis (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(150) NOT NULL,
    address VARCHAR(255),
    district VARCHAR(100),
    state VARCHAR(100),
    latitude DECIMAL(10,7),
    longitude DECIMAL(10,7),
    contact_number VARCHAR(20),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- =========================================
-- MARKET PRICES TABLE
-- =========================================

CREATE TABLE market_prices (
    id INT AUTO_INCREMENT PRIMARY KEY,
    mandi_id INT NOT NULL,
    crop_name VARCHAR(100) NOT NULL,
    min_price DECIMAL(12,2),
    max_price DECIMAL(12,2),
    modal_price DECIMAL(12,2),
    price_unit VARCHAR(20) DEFAULT 'quintal',
    price_date DATE NOT NULL,

    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

    FOREIGN KEY (mandi_id)
        REFERENCES mandis(id)
        ON DELETE CASCADE
);

-- =========================================
-- SALES TABLE
-- =========================================

CREATE TABLE sales (
    id INT AUTO_INCREMENT PRIMARY KEY,
    farmer_id INT NOT NULL,
    crop_id INT,
    mandi_id INT,
    quantity DECIMAL(12,2),
    price_per_unit DECIMAL(12,2),
    total_amount DECIMAL(15,2),
    transportation_cost DECIMAL(12,2) DEFAULT 0,
    other_cost DECIMAL(12,2) DEFAULT 0,
    net_profit DECIMAL(15,2),
    sale_date DATE,

    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

    FOREIGN KEY (farmer_id)
        REFERENCES farmers(id)
        ON DELETE CASCADE,

    FOREIGN KEY (crop_id)
        REFERENCES crops(id)
        ON DELETE SET NULL,

    FOREIGN KEY (mandi_id)
        REFERENCES mandis(id)
        ON DELETE SET NULL
);

-- =========================================
-- PAYMENTS TABLE
-- =========================================

CREATE TABLE payments (
    id INT AUTO_INCREMENT PRIMARY KEY,
    farmer_id INT NOT NULL,
    sale_id INT,
    transaction_id VARCHAR(150),
    payment_method VARCHAR(50),
    amount DECIMAL(15,2),
    status ENUM('pending', 'success', 'failed') DEFAULT 'pending',
    payment_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

    FOREIGN KEY (farmer_id)
        REFERENCES farmers(id)
        ON DELETE CASCADE,

    FOREIGN KEY (sale_id)
        REFERENCES sales(id)
        ON DELETE SET NULL
);

-- =========================================
-- NOTIFICATIONS TABLE
-- =========================================

CREATE TABLE notifications (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    title VARCHAR(200),
    message TEXT,
    type VARCHAR(50),
    is_read BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

    FOREIGN KEY (user_id)
        REFERENCES users(id)
        ON DELETE CASCADE
);

-- =========================================
-- GOVERNMENT SCHEMES
-- =========================================

CREATE TABLE government_schemes (
    id INT AUTO_INCREMENT PRIMARY KEY,
    scheme_name VARCHAR(200) NOT NULL,
    description TEXT,
    eligibility TEXT,
    benefits TEXT,
    official_link VARCHAR(500),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);


USE form2feature;

CREATE TABLE IF NOT EXISTS farmer_profiles (
    id INT AUTO_INCREMENT PRIMARY KEY,

    farmer_id INT NOT NULL UNIQUE,

    village VARCHAR(100),
    district VARCHAR(100),
    state VARCHAR(100) DEFAULT 'Karnataka',

    farm_size DECIMAL(10,2),
    farm_size_unit VARCHAR(20) DEFAULT 'acre',

    farming_type VARCHAR(100),

    crops_grown TEXT,

    latitude DECIMAL(10,7),
    longitude DECIMAL(10,7),

    profile_photo VARCHAR(500),

    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        ON UPDATE CURRENT_TIMESTAMP,

    CONSTRAINT fk_farmer_profile
        FOREIGN KEY (farmer_id)
        REFERENCES farmers(id)
        ON DELETE CASCADE
);



USE form2feature;

CREATE TABLE IF NOT EXISTS crops (
    id INT AUTO_INCREMENT PRIMARY KEY,

    farmer_id INT NOT NULL,

    crop_name VARCHAR(100) NOT NULL,

    quantity DECIMAL(12,2) NOT NULL,

    quantity_unit VARCHAR(30) DEFAULT 'kg',

    quality VARCHAR(50),

    expected_price DECIMAL(12,2),

    harvest_date DATE,

    description TEXT,

    crop_image VARCHAR(500),

    status ENUM(
        'available',
        'sold',
        'inactive'
    ) DEFAULT 'available',

    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        ON UPDATE CURRENT_TIMESTAMP,

    CONSTRAINT fk_crop_farmer
        FOREIGN KEY (farmer_id)
        REFERENCES users(id)
        ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS mandis (
    id INT AUTO_INCREMENT PRIMARY KEY,

    mandi_name VARCHAR(150) NOT NULL,

    address TEXT,

    village VARCHAR(100),

    district VARCHAR(100),

    state VARCHAR(100),

    pincode VARCHAR(10),

    latitude DECIMAL(10, 7) NOT NULL,

    longitude DECIMAL(10, 7) NOT NULL,

    contact_number VARCHAR(20),

    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        ON UPDATE CURRENT_TIMESTAMP
);



INSERT INTO mandis
(
    name,
    address,
    district,
    state,
    latitude,
    longitude,
    contact_number
)
VALUES
(
    'Nearby Test Mandi',
    'Main Agricultural Market',
    'Mysore',
    'Karnataka',
    11.9300000,
    76.9400000,
    '9999999999'
);

INSERT INTO mandis
(
    name,
    address,
    district,
    state,
    latitude,
    longitude,
    contact_number
)
VALUES
(
    'Agricultural Market',
    'Address unavailable',
    '',
    '',
    11.9163006,
    76.9340000,
    NULL
),
(
    'Agricultural Market',
    'Address unavailable',
    '',
    '',
    11.9148440,
    76.9409787,
    NULL
),
(
    'Bal Mandir',
    'Address unavailable',
    'Mysore',
    'Karnataka',
    11.9500000,
    76.9500000,
    NULL
),
(
    'Gundlupet APMC',
    'Gundlupet APMC',
    'Chamarajanagar',
    'Karnataka',
    11.8100000,
    76.6900000,
    NULL
),
(
    'APMC yard',
    'APMC yard',
    '',
    'Karnataka',
    11.6000000,
    76.7000000,
    NULL
);

INSERT INTO market_prices
(
    mandi_id,
    crop_name,
    min_price,
    max_price,
    modal_price,
    price_unit,
    price_date
)
VALUES
(5, 'Tomato', 1800, 2500, 2200, 'quintal', CURDATE()),
(6, 'Tomato', 1700, 2600, 2300, 'quintal', CURDATE()),
(7, 'Tomato', 1900, 2700, 2450, 'quintal', CURDATE()),
(8, 'Tomato', 2000, 2800, 2500, 'quintal', CURDATE()),
(9, 'Tomato', 1850, 2550, 2250, 'quintal', CURDATE());


INSERT INTO market_prices
(
    mandi_id,
    crop_name,
    min_price,
    max_price,
    modal_price,
    price_unit,
    price_date
)
VALUES
(5, 'Onion', 2000, 2800, 2400, 'quintal', CURDATE()),
(6, 'Onion', 1900, 2700, 2350, 'quintal', CURDATE()),
(7, 'Onion', 2100, 2900, 2500, 'quintal', CURDATE()),
(8, 'Onion', 2200, 3000, 2600, 'quintal', CURDATE()),
(9, 'Onion', 1950, 2750, 2300, 'quintal', CURDATE());




CREATE TABLE IF NOT EXISTS saved_mandis (
    id INT NOT NULL AUTO_INCREMENT,
    farmer_id INT NOT NULL,

    mandi_id VARCHAR(100) NOT NULL,
    name VARCHAR(150) NOT NULL,

    address VARCHAR(255) DEFAULT NULL,
    district VARCHAR(100) DEFAULT NULL,
    state VARCHAR(100) DEFAULT NULL,

    pincode VARCHAR(20) DEFAULT NULL,
    contact_number VARCHAR(30) DEFAULT NULL,
    website VARCHAR(255) DEFAULT NULL,
    opening_hours VARCHAR(255) DEFAULT NULL,

    latitude DECIMAL(10,7) DEFAULT NULL,
    longitude DECIMAL(10,7) DEFAULT NULL,

    distance_km DECIMAL(10,2) DEFAULT NULL,

    source VARCHAR(100) DEFAULT 'Form2Feature Database',

    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

    PRIMARY KEY (id),

    UNIQUE KEY unique_farmer_mandi (
        farmer_id,
        mandi_id
    )
);


CREATE TABLE IF NOT EXISTS saved_mandis (
    id INT AUTO_INCREMENT PRIMARY KEY,

    user_id INT NOT NULL,

    mandi_id VARCHAR(100) NOT NULL,

    name VARCHAR(255) NOT NULL,

    address TEXT NULL,

    district VARCHAR(150) NULL,

    state VARCHAR(150) NULL,

    latitude DECIMAL(10,7) NULL,

    longitude DECIMAL(10,7) NULL,

    distance_km DECIMAL(10,2) NULL,

    contact_number VARCHAR(100) NULL,

    google_maps TEXT NULL,

    source VARCHAR(100) NULL,

    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

    UNIQUE KEY unique_user_mandi (
        user_id,
        mandi_id
    ),

    INDEX idx_saved_user (
        user_id
    )
);

CREATE TABLE IF NOT EXISTS saved_mandis (
    id INT AUTO_INCREMENT PRIMARY KEY,

    user_id INT NOT NULL,

    mandi_id VARCHAR(100) NOT NULL,
    mandi_name VARCHAR(255) NOT NULL,

    address VARCHAR(500) DEFAULT NULL,
    district VARCHAR(150) DEFAULT NULL,
    state VARCHAR(150) DEFAULT NULL,

    latitude DECIMAL(10, 7) DEFAULT NULL,
    longitude DECIMAL(10, 7) DEFAULT NULL,

    contact_number VARCHAR(50) DEFAULT NULL,

    google_maps TEXT DEFAULT NULL,

    source VARCHAR(100) DEFAULT NULL,

    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

    UNIQUE KEY unique_saved_mandi (
        user_id,
        mandi_id
    ),

    INDEX idx_saved_mandis_user (
        user_id
    )
);


CREATE TABLE IF NOT EXISTS saved_mandis (
    id INT AUTO_INCREMENT PRIMARY KEY,

    user_id INT NOT NULL,

    mandi_id VARCHAR(255) NOT NULL,

    mandi_name VARCHAR(255) NOT NULL,

    address TEXT NULL,

    district VARCHAR(255) NULL,

    state VARCHAR(255) NULL,

    contact_number VARCHAR(100) NULL,

    latitude DECIMAL(10,7) NULL,

    longitude DECIMAL(10,7) NULL,

    google_maps TEXT NULL,

    source VARCHAR(100) DEFAULT 'Form2Feature Database',

    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

    UNIQUE KEY unique_user_mandi (user_id, mandi_id)
);

ALTER TABLE saved_mandis
MODIFY mandi_id VARCHAR(255) NOT NULL;




CREATE TABLE IF NOT EXISTS profit_calculations (
    id INT NOT NULL AUTO_INCREMENT,
    farmer_id INT NOT NULL,

    crop VARCHAR(100) NOT NULL,

    quantity DECIMAL(12,2) NOT NULL DEFAULT 0,
    selling_price DECIMAL(12,2) NOT NULL DEFAULT 0,

    production_cost DECIMAL(12,2) NOT NULL DEFAULT 0,
    transport_cost DECIMAL(12,2) NOT NULL DEFAULT 0,
    other_expenses DECIMAL(12,2) NOT NULL DEFAULT 0,

    expected_revenue DECIMAL(14,2) NOT NULL DEFAULT 0,
    total_expense DECIMAL(14,2) NOT NULL DEFAULT 0,
    expected_profit DECIMAL(14,2) NOT NULL DEFAULT 0,
    profit_percentage DECIMAL(10,2) NOT NULL DEFAULT 0,

    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,

    PRIMARY KEY (id),

    INDEX idx_profit_farmer (farmer_id),
    INDEX idx_profit_crop (crop)

) ENGINE=InnoDB
DEFAULT CHARSET=utf8mb4;