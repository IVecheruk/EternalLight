/* ============================================================================
   V1__init_gorsvet.sql
   Инициализация схемы gorsvet и базовых таблиц (Flyway)
   ============================================================================ */

CREATE SCHEMA IF NOT EXISTS gorsvet;
SET search_path TO gorsvet, public;

/* ============================================================================
   1) Базовые справочники / сущности без внешних ключей
   ============================================================================ */

CREATE TABLE IF NOT EXISTS organization (
    -- PK: идентификатор организации (исполнитель/заказчик и т.п.)
                                            organization_id BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,

    -- Полное наименование организации (шапка акта: "Организация-исполнитель")
                                            full_name TEXT NOT NULL,

    -- Город/населенный пункт (шапка акта: "город")
                                            city TEXT NULL
);

CREATE TABLE IF NOT EXISTS administrative_district (
    -- PK: идентификатор административного округа/района
                                                       administrative_district_id BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,

    -- Наименование административного округа (района) (Раздел 1)
                                                       name TEXT NOT NULL UNIQUE
);

CREATE TABLE IF NOT EXISTS street (
    -- PK: идентификатор улицы
                                      street_id BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,

    -- Наименование улицы (Раздел 1)
                                      name TEXT NOT NULL UNIQUE
);

CREATE TABLE IF NOT EXISTS unit_of_measure (
    -- PK: идентификатор единицы измерения
                                               uom_id BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,

    -- Наименование/обозначение единицы измерения (например: "шт.", "м", "час") (Разделы 6/7)
                                               name TEXT NOT NULL UNIQUE
);

CREATE TABLE IF NOT EXISTS work_basis_type (
    -- PK: идентификатор типа основания
                                               work_basis_type_id BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,

    -- Код типа (для стабильных значений в справочнике)
                                               code TEXT NOT NULL UNIQUE,

    -- Наименование типа основания (как в документе)
                                               name TEXT NOT NULL
);

CREATE TABLE IF NOT EXISTS brigade_role (
    -- PK: идентификатор роли в бригаде
                                            brigade_role_id BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,

    -- Код роли (MASTER/FOREMAN/CREW_MEMBER и т.п.)
                                            code TEXT NOT NULL UNIQUE,

    -- Наименование роли (как в документе)
                                            name TEXT NOT NULL
);

CREATE TABLE IF NOT EXISTS fault_type (
    -- PK: идентификатор типа неисправности
                                          fault_type_id BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,

    -- Код типа неисправности (для стабильных значений)
                                          code TEXT NOT NULL UNIQUE,

    -- Наименование (как в документе)
                                          name TEXT NOT NULL,

    -- Признак "Другое" (если выбран — допускаем текстовое уточнение)
                                          is_other BOOLEAN NOT NULL DEFAULT FALSE
);

CREATE TABLE IF NOT EXISTS equipment_condition (
    -- PK: идентификатор состояния оборудования
                                                   equipment_condition_id BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,

    -- Код состояния (WORKING/FAULTY/DISPOSAL)
                                                   code TEXT NOT NULL UNIQUE,

    -- Наименование состояния (как в документе)
                                                   name TEXT NOT NULL
);

CREATE TABLE IF NOT EXISTS yes_no_value (
    -- PK: идентификатор значения да/нет
                                            yes_no_value_id BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,

    -- Код (YES/NO)
                                            code TEXT NOT NULL UNIQUE,

    -- Наименование ("Да"/"Нет")
                                            name TEXT NOT NULL
);

CREATE TABLE IF NOT EXISTS brightness_level (
    -- PK: идентификатор уровня яркости
                                                brightness_level_id BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,

    -- Код (NORMAL/LOW/HIGH)
                                                code TEXT NOT NULL UNIQUE,

    -- Наименование (как в документе)
                                                name TEXT NOT NULL
);

CREATE TABLE IF NOT EXISTS stability_level (
    -- PK: идентификатор стабильности работы
                                               stability_level_id BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,

    -- Код (STABLE/UNSTABLE)
                                               code TEXT NOT NULL UNIQUE,

    -- Наименование (как в документе)
                                               name TEXT NOT NULL
);

CREATE TABLE IF NOT EXISTS light_flow_direction (
    -- PK: идентификатор направления светового потока
                                                    light_flow_direction_id BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,

    -- Код (OK/NEEDS_ADJUSTMENT)
                                                    code TEXT NOT NULL UNIQUE,

    -- Наименование (как в документе)
                                                    name TEXT NOT NULL
);

CREATE TABLE IF NOT EXISTS quality_grade (
    -- PK: идентификатор оценки качества
                                             quality_grade_id BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,

    -- Код (EXCELLENT/GOOD/SATISFACTORY/UNSATISFACTORY)
                                             code TEXT NOT NULL UNIQUE,

    -- Короткое наименование оценки
                                             name TEXT NOT NULL,

    -- Расшифровка/описание (как формулировка в документе)
                                             description TEXT NULL
);

CREATE TABLE IF NOT EXISTS photo_kind (
    -- PK: идентификатор типа фото
                                          photo_kind_id BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,

    -- Код типа фото (BEFORE/DURING/AFTER/DEFECTS)
                                          code TEXT NOT NULL UNIQUE,

    -- Наименование типа фото (как в документе)
                                          name TEXT NOT NULL
);

CREATE TABLE IF NOT EXISTS attachment_kind (
    -- PK: идентификатор типа приложения
                                               attachment_kind_id BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,

    -- Код типа приложения (SCHEME_PLAN/MEASUREMENT_PROTOCOL/OTHER и т.п.)
                                               code TEXT NOT NULL UNIQUE,

    -- Наименование типа приложения (как в документе)
                                               name TEXT NOT NULL,

    -- Признак "Другое" (если выбран — допускаем уточнение в тексте)
                                               is_other BOOLEAN NOT NULL DEFAULT FALSE
);

CREATE TABLE IF NOT EXISTS signatory_role (
    -- PK: идентификатор роли подписанта
                                              signatory_role_id BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,

    -- Код роли (FOREMAN/MASTER/CUSTOMER_REP и т.п.)
                                              code TEXT NOT NULL UNIQUE,

    -- Наименование роли (как в документе)
                                              name TEXT NOT NULL
);

/* ============================================================================
   2) Сущности, зависящие от справочников
   ============================================================================ */

CREATE TABLE IF NOT EXISTS lighting_object (
    -- PK: идентификатор объекта наружного освещения (карточка объекта из Раздела 1)
                                               lighting_object_id BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,

    -- FK: административный округ/район -> administrative_district (Раздел 1)
                                               administrative_district_id BIGINT NULL
                                               REFERENCES administrative_district(administrative_district_id),

    -- FK: улица -> street (Раздел 1)
    street_id BIGINT NULL
    REFERENCES street(street_id),

    -- Дом (ориентир) (Раздел 1)
    house_landmark TEXT NULL,

    -- Координаты GPS: широта (если применимо) (Раздел 1)
    gps_latitude NUMERIC(9,6) NULL,

    -- Координаты GPS: долгота (если применимо) (Раздел 1)
    gps_longitude NUMERIC(9,6) NULL,

    -- Номер линии наружного освещения (Раздел 1)
    outdoor_line_number TEXT NULL,

    -- Номер шкафа управления (ШУНО) (Раздел 1)
    control_cabinet_number TEXT NULL,

    -- Номер опоры освещения (Раздел 1)
    pole_number TEXT NULL,

    -- Номер светильника (Раздел 1)
    luminaire_number TEXT NULL,

    -- Инвентарный номер оборудования (Раздел 1)
    equipment_inventory_number TEXT NULL
    );

CREATE TABLE IF NOT EXISTS employee (
    -- PK: идентификатор сотрудника
                                        employee_id BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,

    -- ФИО сотрудника (Раздел 3 / подписи)
                                        full_name TEXT NOT NULL,

    -- Должность сотрудника (Раздел 3 / подписи)
                                        position TEXT NULL,

    -- Табельный номер (если используется) — уникален
                                        employee_number TEXT NULL UNIQUE,

    -- Группа по электробезопасности (если указывается)
                                        electrical_safety_group TEXT NULL,

    -- FK: организация (если нужно хранить принадлежность сотрудника)
                                        organization_id BIGINT NULL
                                        REFERENCES organization(organization_id)
    );

/* ============================================================================
   3) Главная сущность: акт работ и связанные 1:1/1:N
   ============================================================================ */

CREATE TABLE IF NOT EXISTS work_act (
    -- PK: идентификатор акта
                                        work_act_id BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,

    -- Номер акта (поле "АКТ №") (шапка)
                                        act_number TEXT NULL,

    -- Дата составления акта (поле "Акт составлен:") (шапка)
                                        act_compiled_on DATE NULL,

    -- Место составления акта (поле "Место составления:") (шапка)
                                        act_place TEXT NULL,

    -- FK: организация-исполнитель -> organization (шапка)
                                        executor_org_id BIGINT NOT NULL
                                        REFERENCES organization(organization_id),

    -- Структурное подразделение (поле "Структурное подразделение:") (шапка)
    structural_unit TEXT NULL,

    -- FK: объект наружного освещения -> lighting_object (Раздел 1)
    lighting_object_id BIGINT NULL
    REFERENCES lighting_object(lighting_object_id),

    -- Дата/время начала работ (Раздел 2)
    work_started_at TIMESTAMPTZ NULL,

    -- Дата/время окончания работ (Раздел 2)
    work_finished_at TIMESTAMPTZ NULL,

    -- Общая продолжительность работ, минут (Раздел 2)
    total_duration_minutes INTEGER NULL CHECK (total_duration_minutes IS NULL OR total_duration_minutes >= 0),

    -- Фактическое время выполнения без перерывов, минут (Раздел 2)
    actual_work_minutes INTEGER NULL CHECK (actual_work_minutes IS NULL OR actual_work_minutes >= 0),

    -- Время простоя, минут (Раздел 2)
    downtime_minutes INTEGER NULL CHECK (downtime_minutes IS NULL OR downtime_minutes >= 0),

    -- Причина простоя (Раздел 2)
    downtime_reason TEXT NULL,

    -- Подробное описание обнаруженной неисправности (Раздел 4)
    fault_details TEXT NULL,

    -- Установленная причина неисправности (Раздел 4)
    fault_cause TEXT NULL,

    -- Замечания по качеству выполненных работ (раздел/блок качества)
    quality_remarks TEXT NULL,

    -- Прочие расходы (Раздел 13)
    other_expenses_amount NUMERIC(14,2) NULL CHECK (other_expenses_amount IS NULL OR other_expenses_amount >= 0),

    -- Стоимость материалов и комплектующих (Раздел 13)
    materials_total_amount NUMERIC(14,2) NULL CHECK (materials_total_amount IS NULL OR materials_total_amount >= 0),

    -- Стоимость работ (трудозатраты) (Раздел 13)
    works_total_amount NUMERIC(14,2) NULL CHECK (works_total_amount IS NULL OR works_total_amount >= 0),

    -- Стоимость использования техники и транспорта (Раздел 13)
    transport_total_amount NUMERIC(14,2) NULL CHECK (transport_total_amount IS NULL OR transport_total_amount >= 0),

    -- ИТОГО общая сумма (Раздел 13)
    grand_total_amount NUMERIC(14,2) NULL CHECK (grand_total_amount IS NULL OR grand_total_amount >= 0),

    -- ИТОГО прописью (Раздел 13)
    grand_total_in_words TEXT NULL,

    -- Гарантийный срок на выполненные работы, месяцев (Раздел 14)
    warranty_work_months INTEGER NULL CHECK (warranty_work_months IS NULL OR warranty_work_months >= 0),

    -- Дата начала гарантийного срока на работы (Раздел 14)
    warranty_work_start DATE NULL,

    -- Дата окончания гарантийного срока на работы (Раздел 14)
    warranty_work_end DATE NULL,

    -- Гарантийный срок на установленное оборудование, месяцев (Раздел 14)
    warranty_equipment_months INTEGER NULL CHECK (warranty_equipment_months IS NULL OR warranty_equipment_months >= 0),

    -- Условия гарантии (Раздел 14)
    warranty_terms TEXT NULL,

    -- Количество экземпляров акта (Раздел 15)
    copies_count INTEGER NULL CHECK (copies_count IS NULL OR copies_count >= 0),

    -- Принято без замечаний (true) / с замечаниями (false) (Раздел 15)
    accepted_without_remarks BOOLEAN NULL
    );

CREATE TABLE IF NOT EXISTS work_act_approval (
    -- PK/FK: идентификатор акта -> work_act (один-к-одному)
                                                 work_act_id BIGINT PRIMARY KEY
                                                 REFERENCES work_act(work_act_id) ON DELETE CASCADE,

    -- Должность утверждающего (блок "УТВЕРЖДАЮ")
    approver_position TEXT NULL,

    -- ФИО утверждающего (блок "УТВЕРЖДАЮ")
    approver_full_name TEXT NULL,

    -- Дата утверждения (блок "УТВЕРЖДАЮ")
    approval_date DATE NULL,

    -- Наличие места печати "М.П." (блок "УТВЕРЖДАЮ")
    stamp_present BOOLEAN NULL
    );

CREATE TABLE IF NOT EXISTS work_act_basis (
    -- PK: идентификатор записи "основание акта"
                                              work_act_basis_id BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,

    -- FK: акт -> work_act
                                              work_act_id BIGINT NOT NULL
                                              REFERENCES work_act(work_act_id) ON DELETE CASCADE,

    -- FK: тип основания -> work_basis_type
    work_basis_type_id BIGINT NOT NULL
    REFERENCES work_basis_type(work_basis_type_id),

    -- Признак выбора (галочка)
    is_selected BOOLEAN NOT NULL DEFAULT TRUE,

    -- Номер документа-основания (если предусмотрено)
    document_number TEXT NULL,

    -- Дата документа-основания (если предусмотрено)
    document_date DATE NULL,

    -- Ограничение: один тип основания не должен повторяться в рамках одного акта
    UNIQUE (work_act_id, work_basis_type_id)
    );

CREATE TABLE IF NOT EXISTS work_act_brigade_member (
    -- PK: идентификатор назначения сотрудника в акт
                                                       work_act_brigade_member_id BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,

    -- FK: акт -> work_act
                                                       work_act_id BIGINT NOT NULL
                                                       REFERENCES work_act(work_act_id) ON DELETE CASCADE,

    -- FK: сотрудник -> employee
    employee_id BIGINT NOT NULL
    REFERENCES employee(employee_id),

    -- FK: роль в бригаде -> brigade_role
    brigade_role_id BIGINT NOT NULL
    REFERENCES brigade_role(brigade_role_id),

    -- Порядковый номер в списке бригады (для сохранения порядка)
    seq INTEGER NULL CHECK (seq IS NULL OR seq >= 1)
    );

CREATE TABLE IF NOT EXISTS work_act_fault (
    -- PK: идентификатор записи "неисправность в акте"
                                              work_act_fault_id BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,

    -- FK: акт -> work_act
                                              work_act_id BIGINT NOT NULL
                                              REFERENCES work_act(work_act_id) ON DELETE CASCADE,

    -- FK: тип неисправности -> fault_type
    fault_type_id BIGINT NOT NULL
    REFERENCES fault_type(fault_type_id),

    -- Признак выбора (галочка)
    is_selected BOOLEAN NOT NULL DEFAULT TRUE,

    -- Текст "Другое: ..." (заполняется при соответствующем типе)
    other_text TEXT NULL,

    -- Ограничение: один тип неисправности не должен повторяться в рамках одного акта
    UNIQUE (work_act_id, fault_type_id)
    );

CREATE TABLE IF NOT EXISTS work_act_performed_work (
    -- PK: идентификатор строки выполненной работы
                                                       performed_work_id BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,

    -- FK: акт -> work_act
                                                       work_act_id BIGINT NOT NULL
                                                       REFERENCES work_act(work_act_id) ON DELETE CASCADE,

    -- Номер строки (порядок по документу)
    seq INTEGER NOT NULL CHECK (seq >= 1),

    -- Описание выполненной работы
    description TEXT NOT NULL,

    -- Ограничение: в одном акте не должно быть двух одинаковых seq
    UNIQUE (work_act_id, seq)
    );

CREATE TABLE IF NOT EXISTS work_act_material (
    -- PK: идентификатор строки материала
                                                 material_line_id BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,

    -- FK: акт -> work_act
                                                 work_act_id BIGINT NOT NULL
                                                 REFERENCES work_act(work_act_id) ON DELETE CASCADE,

    -- Номер строки (порядок по документу)
    seq INTEGER NULL CHECK (seq IS NULL OR seq >= 1),

    -- Наименование материала/комплектующего
    name TEXT NOT NULL,

    -- Тип/модель/артикул
    model_or_article TEXT NULL,

    -- FK: единица измерения -> unit_of_measure
    uom_id BIGINT NULL
    REFERENCES unit_of_measure(uom_id),

    -- Количество
    quantity NUMERIC(14,3) NULL CHECK (quantity IS NULL OR quantity >= 0),

    -- Цена за единицу (руб.)
    unit_price NUMERIC(14,2) NULL CHECK (unit_price IS NULL OR unit_price >= 0),

    -- Сумма по строке (руб.)
    line_total NUMERIC(14,2) NULL CHECK (line_total IS NULL OR line_total >= 0)
    );

CREATE TABLE IF NOT EXISTS work_act_labor_item (
    -- PK: идентификатор строки нормирования
                                                   labor_item_id BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,

    -- FK: акт -> work_act
                                                   work_act_id BIGINT NOT NULL
                                                   REFERENCES work_act(work_act_id) ON DELETE CASCADE,

    -- Номер строки (порядок по документу)
    seq INTEGER NULL CHECK (seq IS NULL OR seq >= 1),

    -- Наименование вида работ
    work_type_name TEXT NOT NULL,

    -- FK: единица измерения -> unit_of_measure
    uom_id BIGINT NULL
    REFERENCES unit_of_measure(uom_id),

    -- Объем работ
    work_volume NUMERIC(14,3) NULL CHECK (work_volume IS NULL OR work_volume >= 0),

    -- Норма времени (час)
    norm_hours NUMERIC(10,2) NULL CHECK (norm_hours IS NULL OR norm_hours >= 0),

    -- Фактическое время (час)
    actual_hours NUMERIC(10,2) NULL CHECK (actual_hours IS NULL OR actual_hours >= 0),

    -- Расценка (руб.)
    rate_amount NUMERIC(14,2) NULL CHECK (rate_amount IS NULL OR rate_amount >= 0),

    -- Стоимость (руб.)
    cost_amount NUMERIC(14,2) NULL CHECK (cost_amount IS NULL OR cost_amount >= 0)
    );

CREATE TABLE IF NOT EXISTS work_act_equipment_usage (
    -- PK: идентификатор строки использования техники/транспорта
                                                        equipment_usage_id BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,

    -- FK: акт -> work_act
                                                        work_act_id BIGINT NOT NULL
                                                        REFERENCES work_act(work_act_id) ON DELETE CASCADE,

    -- Номер строки (порядок по документу)
    seq INTEGER NULL CHECK (seq IS NULL OR seq >= 1),

    -- Наименование техники/транспорта
    equipment_name TEXT NOT NULL,

    -- Регистрационный/инвентарный номер
    registration_or_inventory_number TEXT NULL,

    -- Время использования (час)
    used_hours NUMERIC(10,2) NULL CHECK (used_hours IS NULL OR used_hours >= 0),

    -- Стоимость машино-часа (руб.)
    machine_hour_cost NUMERIC(14,2) NULL CHECK (machine_hour_cost IS NULL OR machine_hour_cost >= 0),

    -- Сумма по строке (руб.)
    line_total NUMERIC(14,2) NULL CHECK (line_total IS NULL OR line_total >= 0)
    );

CREATE TABLE IF NOT EXISTS work_act_dismantled_equipment (
    -- PK: идентификатор строки демонтированного оборудования
                                                             dismantled_equipment_id BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,

    -- FK: акт -> work_act
                                                             work_act_id BIGINT NOT NULL
                                                             REFERENCES work_act(work_act_id) ON DELETE CASCADE,

    -- Номер строки (порядок по документу)
    seq INTEGER NULL CHECK (seq IS NULL OR seq >= 1),

    -- Наименование оборудования
    name TEXT NOT NULL,

    -- Тип/модель оборудования
    model TEXT NULL,

    -- Серийный номер
    serial_number TEXT NULL,

    -- Год выпуска
    manufacture_year INTEGER NULL,

    -- Количество
    quantity NUMERIC(14,3) NULL CHECK (quantity IS NULL OR quantity >= 0),

    -- FK: техническое состояние -> equipment_condition
    equipment_condition_id BIGINT NULL
    REFERENCES equipment_condition(equipment_condition_id),

    -- Место хранения/передачи
    storage_or_transfer_place TEXT NULL
    );

CREATE TABLE IF NOT EXISTS work_act_installed_equipment (
    -- PK: идентификатор строки установленного оборудования
                                                            installed_equipment_id BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,

    -- FK: акт -> work_act
                                                            work_act_id BIGINT NOT NULL
                                                            REFERENCES work_act(work_act_id) ON DELETE CASCADE,

    -- Номер строки (порядок по документу)
    seq INTEGER NULL CHECK (seq IS NULL OR seq >= 1),

    -- Наименование оборудования
    name TEXT NOT NULL,

    -- Тип/модель оборудования
    model TEXT NULL,

    -- Серийный номер
    serial_number TEXT NULL,

    -- Год выпуска
    manufacture_year INTEGER NULL,

    -- Количество
    quantity NUMERIC(14,3) NULL CHECK (quantity IS NULL OR quantity >= 0),

    -- Дата установки
    installed_on DATE NULL,

    -- Гарантийный срок (месяцев) по строке оборудования
    warranty_months INTEGER NULL CHECK (warranty_months IS NULL OR warranty_months >= 0),

    -- Гарантия до (дата) по строке оборудования
    warranty_until DATE NULL,

    -- Паспорт/сертификат № по строке оборудования
    passport_or_certificate_number TEXT NULL
    );

CREATE TABLE IF NOT EXISTS work_act_test_result (
    -- PK/FK: идентификатор акта -> work_act (один-к-одному)
                                                    work_act_id BIGINT PRIMARY KEY
                                                    REFERENCES work_act(work_act_id) ON DELETE CASCADE,

    -- FK: светильник функционирует (Да/Нет) -> yes_no_value
    luminaire_operational_id BIGINT NULL
    REFERENCES yes_no_value(yes_no_value_id),

    -- FK: яркость свечения -> brightness_level
    brightness_level_id BIGINT NULL
    REFERENCES brightness_level(brightness_level_id),

    -- FK: стабильность работы -> stability_level
    stability_level_id BIGINT NULL
    REFERENCES stability_level(stability_level_id),

    -- FK: направление светового потока -> light_flow_direction
    light_flow_direction_id BIGINT NULL
    REFERENCES light_flow_direction(light_flow_direction_id),

    -- FK: оценка качества выполненных работ -> quality_grade
    quality_grade_id BIGINT NULL
    REFERENCES quality_grade(quality_grade_id),

    -- Напряжение на вводе (В) (Раздел 11)
    voltage_input_v NUMERIC(14,3) NULL,

    -- Напряжение на светильнике (В) (Раздел 11)
    voltage_luminaire_v NUMERIC(14,3) NULL,

    -- Сила тока (А) (Раздел 11)
    current_a NUMERIC(14,3) NULL,

    -- Потребляемая мощность (Вт) (Раздел 11)
    power_w NUMERIC(14,3) NULL,

    -- Сопротивление изоляции (МОм) (Раздел 11)
    insulation_resistance_mohm NUMERIC(14,3) NULL,

    -- Сопротивление заземления (Ом) (Раздел 11)
    grounding_resistance_ohm NUMERIC(14,3) NULL
    );

CREATE TABLE IF NOT EXISTS work_act_photo (
    -- PK: идентификатор записи "тип фото в акте"
                                              work_act_photo_id BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,

    -- FK: акт -> work_act
                                              work_act_id BIGINT NOT NULL
                                              REFERENCES work_act(work_act_id) ON DELETE CASCADE,

    -- FK: тип фото -> photo_kind
    photo_kind_id BIGINT NOT NULL
    REFERENCES photo_kind(photo_kind_id),

    -- Признак выбора (галочка)
    is_selected BOOLEAN NOT NULL DEFAULT TRUE,

    -- Количество фотографий данного типа (шт.)
    photo_count INTEGER NULL CHECK (photo_count IS NULL OR photo_count >= 0),

    -- Ограничение: один тип фото не повторяется в рамках акта
    UNIQUE (work_act_id, photo_kind_id)
    );

CREATE TABLE IF NOT EXISTS work_act_attachment (
    -- PK: идентификатор записи "приложение в акте"
                                                   work_act_attachment_id BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,

    -- FK: акт -> work_act
                                                   work_act_id BIGINT NOT NULL
                                                   REFERENCES work_act(work_act_id) ON DELETE CASCADE,

    -- FK: тип приложения -> attachment_kind
    attachment_kind_id BIGINT NOT NULL
    REFERENCES attachment_kind(attachment_kind_id),

    -- Признак выбора (галочка)
    is_selected BOOLEAN NOT NULL DEFAULT TRUE,

    -- Текст "Другое: ..." (если выбран тип с is_other=true)
    other_text TEXT NULL,

    -- Ограничение: один тип приложения не повторяется в рамках акта
    UNIQUE (work_act_id, attachment_kind_id)
    );

CREATE TABLE IF NOT EXISTS work_act_signatory (
    -- PK: идентификатор подписи
                                                  work_act_signatory_id BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,

    -- FK: акт -> work_act
                                                  work_act_id BIGINT NOT NULL
                                                  REFERENCES work_act(work_act_id) ON DELETE CASCADE,

    -- FK: роль подписанта -> signatory_role
    signatory_role_id BIGINT NOT NULL
    REFERENCES signatory_role(signatory_role_id),

    -- FK: сотрудник -> employee (кто подписывает)
    employee_id BIGINT NOT NULL
    REFERENCES employee(employee_id),

    -- Дата подписи (в строке подписи)
    signed_on DATE NULL,

    -- Признак наличия подписи (если нужно фиксировать факт подписания)
    is_signed BOOLEAN NULL,

    -- Ограничение: в одном акте одна роль подписанта не должна повторяться
    UNIQUE (work_act_id, signatory_role_id)
    );
