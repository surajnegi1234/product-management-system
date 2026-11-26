CREATE DATABASE IF NOT EXISTS product_management
    CHARACTER SET utf8mb4
    COLLATE utf8mb4_unicode_ci;

USE product_management;

CREATE TABLE IF NOT EXISTS products (
    id          INT UNSIGNED  NOT NULL AUTO_INCREMENT,
    name        VARCHAR(150)  NOT NULL,
    description TEXT          NULL,
    price       DECIMAL(10,2) NOT NULL DEFAULT 0.00,
    quantity    INT           NOT NULL DEFAULT 0,
    category    VARCHAR(100)  NULL,
    created_at  TIMESTAMP     NOT NULL DEFAULT CURRENT_TIMESTAMP,

    PRIMARY KEY (id),
    CONSTRAINT chk_products_price_not_negative    CHECK (price >= 0),
    CONSTRAINT chk_products_quantity_not_negative CHECK (quantity >= 0),
    INDEX idx_products_name (name)
) ENGINE = InnoDB;
