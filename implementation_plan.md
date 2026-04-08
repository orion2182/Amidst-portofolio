# Rencana Overhaul Desain (Total Redesign)

Karena Anda menginginkan perubahan yang **signifikan dan radikal**, kita tidak akan lagi menggunakan layout standar (Navbar di atas, lalu section berurutan ke bawah: Hero -> About -> Timelin -> Skills -> CTF). Kita akan merombak total **Struktur HTML dan Layout-nya**, namun tetap mempertahankan palet warna `Dark Navy/Teal/Purple`.

## > [!IMPORTANT] Feedback Diperlukan
Sebelum saya mulai memprogram kode ratusan baris, mohon pilih **SALAH SATU** dari 3 konsep desain radikal di bawah ini:

### Opsi 1: The "Bento Box" Dashboard (Modern & Minimalist)
Alih-alih men-scroll ke bawah panjang-panjang, halaman utama akan terlihat seperti dashboard MacOS/iOS modern (Bento Grid). 
- Semua informasi penting ada di **satu layar penuh** (tidak perlu banyak scroll).
- Info dibagi dalam kotak-kotak *widgets* dengan ukuran bervariasi (kecil, medium, besar).
- **Kiri:** Widget Profile & Foto Anda.
- **Kanan/Tengah:** Widget interaktif untuk Skill, CTF terbaru, Log Bounty.
- Jika sebuah widget (seperti CTF) di-klik, widget tersebut akan *expand* atau memunculkan modal (pop-up) overaly.
- **Kesan:** Sangat rapi, *premium*, kekinian (seperti tren desain UI/UX Dribbble saat ini).

### Opsi 2: "Hacker OS / Terminal" Experience
Desain akan meniru tampilan sistem operasi (seperti Kali Linux / Parrot OS UI) langsung di dalam browser.
- **Tampilan:** Menggunakan sistem *Window* yang bisa di-drag / di-close (meski dibuat dengan HTML/CSS).
- Navbar akan berubah menjadi sistem "Taskbar" di bawah halaman.
- Section CTF, About, Timeline akan terasa seperti aplikasi CLI (Command Line) atau folder GUI di dalam "Desktop" website Anda.
- **Kesan:** Sangat *nge-geek*, unik, interaktif, menunjukkan aura Cybersecurity Researcher secara maksimal.

### Opsi 3: "Split-Screen / Sidebar" Cyberpunk
- Layar dibagi dua: **Frame kiri** akan *fixed* (diam di tempat) menampilkan Avatar Anda, nama, dan tombol kontak secara besar.
- **Frame kanan** adalah area *scrollable* yang berisi semua perjalanan, CTF, dan lab.
- Tipografi akan menggunakan gaya *Oversized/Brutalism* (teks saling bertumpuk eksentrik).
- **Kesan:** Berani, out-of-the-box, sangat asimetris.

---

## Rencana Perubahan (Proposed Changes)

Terlepas dari opsi mana yang Anda pilih, file-file ini akan dirombak 100%:

### Frontend Layout

#### [MODIFY] `index.html`
- Akan dihapus struktur `<section>` standar lamanya.
- Akan dibangun grid sistem baru sesuai opsi yang dipilih (contoh: `<div class="bento-grid">...</div>`).

#### [MODIFY] `style.css`
- Menghapus semua pattern CSS umum.
- Membuat animasi baru (misalnya micro-interactions yang sangat responsif).
- Fokus layouting menggunakan CSS Grid tingkat lanjut.

#### [MODIFY] `script.js`
- Menghapus logika *scroll-reveal* lama.
- Mengganti logika interaksi sesuai dengan konsep baru (contoh: *modal windows* untuk Bento Box).

---

## Pertanyaan ke Anda (Open Questions)
> [!WARNING]
> Harap balas pesen ini dengan menyebutkan **Opsi 1, Opsi 2, atau Opsi 3**. Begitu Anda memilih, saya akan langsung mulai menghancurkan layout yang lama dan membangun ulang sesuai konsep yang Anda inginkan!
