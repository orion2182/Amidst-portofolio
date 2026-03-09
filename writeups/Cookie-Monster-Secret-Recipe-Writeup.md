# Cookie Monster Secret Recipe — picoCTF Writeup

## Challenge Info

| Field       | Details                                        |
|-------------|------------------------------------------------|
| Name        | Cookie Monster Secret Recipe                   |
| Category    | Web Exploitation                               |
| Platform    | picoCTF                                        |
| URL         | `http://verbal-sleep.picoctf.net:50685/`       |

**Description:**
Cookie Monster has hidden his top-secret cookie recipe somewhere on his website. As an aspiring cookie detective, your mission is to uncover this delectable secret. Can you outsmart Cookie Monster and find the hidden recipe?

---

## Solution

### Step 1: Explore the Website

The website presents a simple login form with username and password fields that submits to `login.php`.

```bash
curl -s http://verbal-sleep.picoctf.net:50685/
```

```html
<form action="login.php" method="post">
    <input type="text" name="username" placeholder="Username" required>
    <input type="password" name="password" placeholder="Password" required>
    <input type="submit" value="Login">
</form>
```

---

### Step 2: Submit the Login Form and Inspect the Response

The challenge name mentions "Cookie Monster" and "cookie" — a strong hint to look at HTTP cookies. We submit the form with any credentials and use the `-v` flag in curl to see the full response headers:

```bash
curl -s -v -X POST http://verbal-sleep.picoctf.net:50685/login.php \
  -d 'username=admin&password=admin' 2>&1
```

The login is denied, but the response is very interesting:

**Response headers:**
```
Set-Cookie: secret_recipe=cGljb0NURntjMDBrMWVfbTBuc3Rlcl9sMHZlc19jMDBraWVzXzJDODA0MEVGfQ%3D%3D;
```

**Response body:**
```html
<h1>Access Denied</h1>
<p>Cookie Monster says: 'Me no need password. Me just need cookies!'</p>
<p>Hint: Have you checked your cookies lately?</p>
```

The server sets a cookie called `secret_recipe` even though login was denied. The cookie value looks like Base64 encoding with URL encoding (`%3D` is the URL-encoded form of `=`).

---

### Step 3: Decode the Cookie

First, URL decode the value (`%3D` → `=`):

```
cGljb0NURntjMDBrMWVfbTBuc3Rlcl9sMHZlc19jMDBraWVzXzJDODA0MEVGfQ==
```

Then, Base64 decode:

```bash
echo "cGljb0NURntjMDBrMWVfbTBuc3Rlcl9sMHZlc19jMDBraWVzXzJDODA0MEVGfQ==" | base64 -d
```

**Result:**

```
picoCTF{c00k1e_m0nster_l0ves_c00kies_2C8040EF}
```

---

## Flag

```
picoCTF{c00k1e_m0nster_l0ves_c00kies_2C8040EF}
```

---

## Key Takeaways

1. **Always inspect HTTP headers.** The flag wasn't in the page body — it was hidden in the `Set-Cookie` response header. Tools like browser DevTools (Network tab), `curl -v`, or Burp Suite let you see the full HTTP response including headers.

2. **Cookies can store sensitive data.** In this challenge, the server stored a secret directly in a cookie. In real-world applications, storing sensitive information in cookies (even encoded) is a security risk because cookies are fully visible and modifiable by the client.

3. **Recognize common encodings.** The cookie value used two layers of encoding:
   - **URL encoding** — `%3D` represents `=`. This is standard for cookies since `=` is a reserved character.
   - **Base64** — The telltale signs are alphanumeric characters ending with `=` or `==` padding. Base64 is encoding (not encryption) — it provides zero security.

4. **Read the hints.** The response message "Me no need password. Me just need cookies!" and "Have you checked your cookies lately?" both point directly to the solution — checking the cookies set by the server.
