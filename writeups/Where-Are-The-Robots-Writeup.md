# Where Are The Robots — picoCTF Writeup

## Challenge Info

| Field       | Details                                        |
|-------------|------------------------------------------------|
| Name        | Where Are The Robots                           |
| Category    | Web Exploitation                               |
| Platform    | picoCTF                                        |
| URL         | `http://fickle-tempest.picoctf.net:49922/`     |

**Description:**
Can you find the robots?

---

## Solution

### Step 1: Check robots.txt

The challenge title mentions "robots" — a direct reference to `robots.txt`, a standard file that tells search engine crawlers which pages they should or shouldn't index.

```bash
curl -s http://fickle-tempest.picoctf.net:49922/robots.txt
```

```
User-agent: *
Disallow: /cc6b1.html
```

The file tells all crawlers (`*`) to not index `/cc6b1.html`. Ironically, this reveals the existence of a hidden page.

---

### Step 2: Visit the Hidden Page

```bash
curl -s http://fickle-tempest.picoctf.net:49922/cc6b1.html
```

```html
<p>Guess you found the robots<br />
  <flag>picoCTF{ca1cu1at1ng_Mach1n3s_cc6b1}</flag></p>
```

---

## Flag

```
picoCTF{ca1cu1at1ng_Mach1n3s_cc6b1}
```

---

## Key Takeaways

1. **Always check robots.txt.** It's one of the first files to look at when enumerating a web application. It's meant to guide search engines, but it often accidentally reveals hidden directories, admin panels, or sensitive pages.

2. **Disallow is not access control.** The `Disallow` directive is a polite request to crawlers — it does NOT prevent anyone from accessing the page. Legitimate search engines respect it, but humans and malicious bots can visit the URL directly. Never rely on `robots.txt` for security.

3. **robots.txt is a recon goldmine.** In real-world pentesting, `robots.txt` frequently exposes paths like `/admin`, `/backup`, `/staging`, or internal API endpoints that the developer wanted to hide from search results but forgot to actually protect.
