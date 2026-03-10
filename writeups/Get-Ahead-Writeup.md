# Get aHEAD — picoCTF Writeup

## Challenge Info

| Field       | Details                                        |
|-------------|------------------------------------------------|
| Name        | Get aHEAD                                      |
| Category    | Web Exploitation                               |
| Platform    | picoCTF                                        |
| URL         | `http://wily-courier.picoctf.net:55950/`       |

**Description:**
Find the flag being held on this server to get ahead of the competition.

---

## Solution

### Step 1: Explore the Website

The page shows two buttons — "Choose Red" (GET request) and "Choose Blue" (POST request). Clicking either just changes the background color. There's no flag in the HTML source, CSS, or JavaScript.

```bash
curl -s http://wily-courier.picoctf.net:55950/
```

```html
<form action="index.php" method="GET">
    <input type="submit" value="Choose Red"/>
</form>

<form action="index.php" method="POST">
    <input type="submit" value="Choose Blue"/>
</form>
```

The page demonstrates two HTTP methods: **GET** and **POST**. But there's a third one hiding in plain sight...

---

### Step 2: Read the Hint

The challenge description says "get **ahead**". This is a wordplay hint pointing to the HTTP **HEAD** method — an HTTP method that works like GET but only returns the response **headers**, not the body.

---

### Step 3: Send a HEAD Request

```bash
curl -I http://wily-courier.picoctf.net:55950/
```

The `-I` flag tells curl to send a HEAD request. The response:

```
HTTP/1.1 200 OK
Date: Tue, 10 Mar 2026 02:26:54 GMT
Server: Apache/2.4.38 (Debian)
X-Powered-By: PHP/7.2.34
flag: picoCTF{r3j3ct_th3_du4l1ty_8b13f07}
Content-Type: text/html; charset=UTF-8
```

The flag is returned as a custom HTTP response header called `flag`.

---

## Flag

```
picoCTF{r3j3ct_th3_du4l1ty_8b13f07}
```

---

## Key Takeaways

1. **There are more HTTP methods than GET and POST.** The most common ones are:
   - `GET` — Retrieve a resource
   - `POST` — Submit data
   - `HEAD` — Same as GET but only returns headers (no body)
   - `PUT` — Update/create a resource
   - `DELETE` — Delete a resource
   - `OPTIONS` — List supported methods
   - `PATCH` — Partially update a resource

2. **Read the hints carefully.** "Get ahead" is a pun on GET + HEAD. CTF challenge descriptions often contain wordplay that points directly to the solution.

3. **Always inspect response headers.** The flag was in a custom HTTP header, not in the page content. Response headers can contain server information, cookies, security policies, and in this case, flags. Use `curl -v` or `curl -I` to see them, or check the Network tab in browser DevTools.

4. **The HEAD method is useful for reconnaissance.** In real-world security testing, HEAD requests can reveal server information, technology stack, and custom headers without downloading the full response body.
