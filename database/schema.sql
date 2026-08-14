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