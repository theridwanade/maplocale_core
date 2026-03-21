# POST /auth/login

Authenticate an existing user using email and password.

On successful authentication, the endpoint:

- returns the authenticated user payload in the response body
- issues a signed JWT as an HTTP-only cookie named `access_token`

## Route

- **Method:** `POST`
- **Path:** `/auth/login`
- **Controller:** `AuthController.login`
- **Guard:** `LocalAuthGuard` (`passport-local` strategy)

## Request

### Content Type

`application/json`

### Body DTO (`LoginDto`)

```ts
{
  email: string;    // must be a valid email (@IsEmail)
  password: string; // must be a string (@IsString)
}
```

### Example Request

```http
POST /auth/login HTTP/1.1
Content-Type: application/json

{
  "email": "email@email.com",
  "password": "securepassword"
}
```

## Authentication Flow (Implementation)

1. `LocalAuthGuard` intercepts `POST /auth/login`.
2. `LocalStrategy.validate(email, password)` calls `AuthService.validateUser`.
3. `AuthService.validateUser`:
   - fetches user by email
   - verifies password using bcrypt comparison
   - returns user object without password field
4. `AuthController.login` calls `AuthService.login(req.user)`.
5. `AuthService.login` signs JWT with payload:
   - `sub` (user id)
   - `email`
   - `role`
6. Controller sets cookie `access_token` and returns `{ user }`.

## JWT Details

- **Token location:** response cookie `access_token`
- **Signing secret:** `JWT_SECRET`
- **Expiry:** `1d` (configured in `JwtModule`)
- **Payload shape:**

```ts
{
  sub: string;
  email: string;
  role: string;
}
```

## Cookie Details

Cookie is set via `res.cookie("access_token", access_token, options)` with:

- `httpOnly: true`
- `secure: NODE_ENV === "production"`
- `sameSite: "strict"`
- `maxAge: 86400000` (24 hours)
- `path: "/"`

### Example `Set-Cookie`

```http
Set-Cookie: access_token=<jwt>; Max-Age=86400; Path=/; HttpOnly; SameSite=Strict
```

In production, `Secure` is also included.

## Success Response

### HTTP Status

`201 Created` (NestJS default for `@Post()` when status is not overridden)

### Body

```ts
{
  user: {
    id: string;
    email: string;
    role: string; // typically "ADMIN" | "CONTRIBUTOR"
  }
}
```

### Example Response

```json
{
  "user": {
    "id": "2c4dbf7f-9cad-4f29-bf2f-f4c3f5378d4a",
    "email": "email@email.com",
    "role": "CONTRIBUTOR"
  }
}
```

## Error Responses

Possible errors from current implementation:

- **404 Not Found**: user email does not exist
  - message: `User with this email: <email> not found`
- **401 Unauthorized**: password is invalid
  - message: `Invalid password`
- **400 Bad Request**: invalid request payload (DTO validation failure)

## Response Type Summary

- **JSON body return type:**

```ts
{
  user: UserDto;
}
```

- **Side effect:** sets auth cookie `access_token` containing the JWT.