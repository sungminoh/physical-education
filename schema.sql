DROP TABLE IF EXISTS app1;
DROP TABLE IF EXISTS app2;

CREATE TABLE app1(
    id              INT PRIMARY KEY AUTO_INCREMENT,
    test_id         INT NOT NULL,
    target_x        DECIMAL(10, 4) NOT NULL,
    target_y        DECIMAL(10, 4) NOT NULL,
    target_r        DECIMAL(10, 4) NOT NULL,
    touch_x         DECIMAL(10, 4) NOT NULL,
    touch_y         DECIMAL(10, 4) NOT NULL,
    touch_s         DECIMAL(10, 4) NOT NULL,
    touch_d         DECIMAL(10, 4) NOT NULL,
    accuracy        DECIMAL(10, 4) NOT NULL,
    delay           DECIMAL(10, 6) NOT NULL,
    ts              TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE app2(
    id              INT PRIMARY KEY AUTO_INCREMENT,
    test_id         INT NOT NULL,
    phone_number    CHAR(13),
    touch_s         DECIMAL(10, 4) NOT NULL,
    touch_d         DECIMAL(10, 4) NOT NULL,
    accuracy        DECIMAL(10, 4) NOT NULL,
    delay           DECIMAL(10, 6) NOT NULL,
    button_w        DECIMAL(10, 4) NOT NULL,
    button_h        DECIMAL(10, 4) NOT NULL,
    ts              TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
