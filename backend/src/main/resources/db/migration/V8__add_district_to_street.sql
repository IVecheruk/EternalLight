ALTER TABLE street
    ADD COLUMN administrative_district_id BIGINT NULL;

ALTER TABLE street
    ADD CONSTRAINT fk_street_administrative_district
    FOREIGN KEY (administrative_district_id)
    REFERENCES administrative_district(administrative_district_id);
