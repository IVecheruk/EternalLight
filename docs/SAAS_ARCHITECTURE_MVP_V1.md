# EternalLight SaaS Architecture Plan (MVP → v1)

## 1) Поэтапный план работ (приоритеты)

## Phase 0 — Stabilization (P0)
1. Нормализовать контракты API между backend/frontend (district/street/act/map).
2. Закрыть auth-flow (`/auth/login`, `/auth/me`) и защиту маршрутов на фронте.
3. Включить единый формат ошибок + глобальный `@ControllerAdvice`.
4. Добавить базовые миграции tenant-aware таблиц (organization_id).

## Phase 1 — MVP SaaS Core (P0)
1. RBAC: `SUPER_ADMIN`, `ORG_ADMIN`, `DISPATCHER`, `TECHNICIAN`, `VIEWER`.
2. CRUD: Organizations, Users/Membership, Districts, Streets, LightingObjects, Acts.
3. Tenant-aware фильтрация в сервисах и репозиториях.
4. Admin-раздел на фронте (`/admin/organizations`, `/admin/users`) только для SUPER_ADMIN.

## Phase 2 — Operational UX (P1)
1. Поиск/фильтры/пагинация на всех реестрах.
2. Улучшение карты: backend endpoint `/map/points` по данным БД.
3. Аудит действий пользователей + журнал изменений.
4. Тостеры, optimistic UI, retry-логика.

## Phase 3 — v1 Hardening (P1)
1. Refresh-token в httpOnly cookie, logout + revoke.
2. Инвайты пользователей в организацию.
3. Интеграционные тесты (Testcontainers), e2e (Playwright).
4. Docker Compose + CI pipeline + профили dev/prod.

---

## 2) Backend структура (рекомендуемая)

```text
backend/src/main/java/com/eternallight/backend
  api/
    controller/
    dto/request/
    dto/response/
    mapper/
    advice/ (GlobalExceptionHandler)
  application/
    service/
    usecase/
  domain/
    model/
    exception/
    policy/
  infrastructure/
    persistence/
      entity/
      repository/
    security/
    web/
```

### Multi-tenancy (MVP): Variant A (`organization_id` FK)
- Все tenant entities содержат `organization_id`.
- В `JwtPrincipal` хранится `orgId` + роли.
- Каждый сервис читает только данные текущей организации (кроме SUPER_ADMIN).
- Проверки делаются централизованно через `TenantAccessService`.

---

## 3) Endpoint каталог (MVP)

| Method | Path | Roles | Notes |
|---|---|---|---|
| POST | `/api/v1/auth/login` | PUBLIC | returns access (+refresh later) |
| GET | `/api/v1/auth/me` | AUTH | профиль + org + roles |
| POST | `/api/v1/auth/logout` | AUTH | revoke refresh |
| GET | `/api/v1/organizations` | SUPER_ADMIN | tenants list |
| POST | `/api/v1/organizations` | SUPER_ADMIN | create tenant |
| PUT | `/api/v1/organizations/{id}` | SUPER_ADMIN | update tenant |
| DELETE | `/api/v1/organizations/{id}` | SUPER_ADMIN | deactivate tenant |
| GET | `/api/v1/users` | SUPER_ADMIN, ORG_ADMIN | membership aware |
| POST | `/api/v1/users` | SUPER_ADMIN, ORG_ADMIN | create user/invite |
| PUT | `/api/v1/users/{id}` | SUPER_ADMIN, ORG_ADMIN | update user |
| DELETE | `/api/v1/users/{id}` | SUPER_ADMIN, ORG_ADMIN | disable user |
| GET | `/api/v1/administrative-districts` | ORG_* | by org |
| POST | `/api/v1/administrative-districts` | ORG_ADMIN | create |
| PUT | `/api/v1/administrative-districts/{id}` | ORG_ADMIN | update |
| DELETE | `/api/v1/administrative-districts/{id}` | ORG_ADMIN | delete |
| GET | `/api/v1/streets` | ORG_* | district filter optional |
| POST | `/api/v1/streets` | ORG_ADMIN | `districtId` required |
| PUT | `/api/v1/streets/{id}` | ORG_ADMIN | `districtId` required |
| DELETE | `/api/v1/streets/{id}` | ORG_ADMIN | delete |
| GET | `/api/v1/lighting-objects` | ORG_* | search + paging |
| POST | `/api/v1/lighting-objects` | ORG_ADMIN, DISPATCHER | create |
| PUT | `/api/v1/lighting-objects/{id}` | ORG_ADMIN, DISPATCHER | update |
| DELETE | `/api/v1/lighting-objects/{id}` | ORG_ADMIN | delete |
| GET | `/api/v1/work-acts` | ORG_* | filters + paging |
| POST | `/api/v1/work-acts` | ORG_ADMIN, DISPATCHER, TECHNICIAN | create |
| PUT | `/api/v1/work-acts/{id}` | ORG_ADMIN, DISPATCHER, TECHNICIAN | update |
| DELETE | `/api/v1/work-acts/{id}` | ORG_ADMIN | delete |
| GET | `/api/v1/map/points` | ORG_* | points + summary |
| GET | `/api/v1/map/grid` | ORG_* | future aggregation |

---

## 4) Security config blueprint (Spring Security + JWT)

```java
@Bean
SecurityFilterChain security(HttpSecurity http) throws Exception {
  return http
    .csrf(csrf -> csrf.disable())
    .cors(Customizer.withDefaults())
    .sessionManagement(sm -> sm.sessionCreationPolicy(SessionCreationPolicy.STATELESS))
    .authorizeHttpRequests(auth -> auth
      .requestMatchers("/api/v1/auth/login", "/api/v1/auth/refresh", "/actuator/health").permitAll()
      .requestMatchers("/api/v1/admin/**").hasRole("SUPER_ADMIN")
      .anyRequest().authenticated())
    .addFilterBefore(jwtAuthFilter, UsernamePasswordAuthenticationFilter.class)
    .build();
}
```

- RBAC: `@PreAuthorize("hasAnyRole('ORG_ADMIN','SUPER_ADMIN')")`
- Tenant check: `@PreAuthorize("@tenantGuard.canAccessOrg(#orgId)")`
- CORS (dev): `http://localhost:5173`

---

## 5) Frontend FSD target structure

```text
frontend/src
  app/
    providers/
    router/
    layout/
  pages/
    organizations/
    districts/
    streets/
    lighting-objects/
    acts/
    map/
    admin/organizations/
    admin/users/
  widgets/
    table-page/
    app-sidebar/
    app-topbar/
    stats-cards/
  features/
    auth/
    permissions/
    filters/
    forms/
  entities/
    organization/
    user/
    district/
    street/
    lighting-object/
    work-act/
    map/
  shared/
    api/
    ui/
    lib/
```

### Обязательные frontend блоки
1. `AuthProvider`: `login/logout/me`, refresh-on-401 (после внедрения refresh API).
2. `ProtectedRoute` + `RoleGuard`.
3. `usePermissions()` для управления видимостью меню и страниц.
4. Универсальный `TablePage`: header/actions/loading/error/empty/table/modal.

---

## 6) DB & migrations (Flyway)

Минимальные таблицы:
- `organization`
- `app_user`
- `role`
- `user_membership (user_id, organization_id, role)`
- `administrative_district (organization_id, name)`
- `street (organization_id, district_id, name)`
- `lighting_object (organization_id, district_id, street_id, status, load_kw, ...)`
- `work_act (organization_id, lighting_object_id, status, ...)`

Индексы:
- `(organization_id)` на всех tenant-таблицах
- `(organization_id, lower(name))` для search
- FK индексы: `district_id`, `street_id`, `lighting_object_id`

Seed:
- SUPER_ADMIN
- demo organization
- demo ORG_ADMIN
- 2-3 district/street/lighting objects

---

## 7) Тестирование и качество

Backend:
- Unit: service layer + tenant guards
- Integration: repositories + security filters (Testcontainers)

Frontend:
- Vitest: AuthProvider, RoleGuard, TablePage states
- Playwright: login → CRUD district/street → map load

CI minimum:
1. backend: `mvn -q test`
2. frontend: `npm ci && npm run build`
3. lint: backend checkstyle/spotless + frontend eslint

---

## 8) Карта: roadmap

1. Текущий этап: `/map/points` с summary + statuses.
2. Следующий: backend aggregation `/map/grid?cellSizeM=...`.
3. Heatmap слои:
   - pre-aggregated grid cache (Redis optional)
   - materialized views for time buckets
4. Производительность:
   - bbox + time window queries
   - pagination/chunked loading
   - tile-based backend endpoints (`/map/tiles/{z}/{x}/{y}`) для больших городов.

---

## 9) Скелеты сущностей/DTO/контроллеров (реально применимые)

```java
// domain/model/Organization.java
public class Organization {
  private Long id;
  private String name;
  private boolean active;
}

// api/dto/request/CreateStreetRequest.java
public record CreateStreetRequest(
  @NotBlank String name,
  @NotNull @Positive Long districtId
) {}

// api/dto/response/StreetResponse.java
public record StreetResponse(
  Long id,
  Long organizationId,
  Long districtId,
  String name
) {}

// api/controller/StreetController.java
@RestController
@RequestMapping("/api/v1/streets")
@RequiredArgsConstructor
class StreetController {
  private final StreetService service;

  @GetMapping
  public Page<StreetResponse> list(@RequestParam(required=false) String q, Pageable pageable) { ... }

  @PostMapping
  @PreAuthorize("hasAnyRole('SUPER_ADMIN','ORG_ADMIN')")
  public StreetResponse create(@Valid @RequestBody CreateStreetRequest req) { ... }
}

// application/service/StreetService.java
@Service
@RequiredArgsConstructor
@Transactional
class StreetService {
  private final StreetRepository repo;
  private final TenantContext tenant;

  public Street create(CreateStreetRequest req) {
    Long orgId = tenant.currentOrgIdOrThrow();
    // validate district belongs to orgId
    // save street with organizationId=orgId
  }
}
```

```java
// api/advice/GlobalExceptionHandler.java
@RestControllerAdvice
class GlobalExceptionHandler {
  @ExceptionHandler(NotFoundException.class)
  ResponseEntity<ApiError> notFound(NotFoundException ex) {
    return ResponseEntity.status(404).body(ApiError.of("NOT_FOUND", ex.getMessage()));
  }
}

record ApiError(String code, String message, Map<String,Object> details, String requestId) {
  static ApiError of(String code, String message) { return new ApiError(code, message, Map.of(), MDC.get("requestId")); }
}
```
