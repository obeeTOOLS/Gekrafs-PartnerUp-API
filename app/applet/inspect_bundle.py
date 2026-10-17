import urllib.request
import re

url = "https://untungin-kas.vercel.app/assets/index-BhA8aovk.js"
try:
    req = urllib.request.urlopen(url)
    content = req.read().decode('utf-8', errors='ignore')
    print("Bundle size (bytes):", len(content))
    
    actions = re.findall(r'action\s*:\s*[`"\']([^`"\']+)[`"\']', content)
    print("Actions:", sorted(set(actions)))
    
    # check for thousand separator or terbilang
    has_separator = "id-ID" in content
    print("Has id-ID formatting:", has_separator)
    
    has_terbilang = "terbilang" in content.lower()
    print("Has terbilang:", has_terbilang)
    
    # Check offline queue
    has_offline = "offline" in content.lower() and "queue" in content.lower()
    print("Has offline queue:", has_offline)
    
    # Check for voucher / pro
    has_voucher = "voucher" in content.lower()
    print("Has voucher logic:", has_voucher)
    
    # Check tabs referenced
    for tab in ["Untungin_Profil", "Untungin_Transaksi", "Untungin_Akun", "Untungin_Voucher", "Untungin_Audit", "Kas_Transaksi"]:
        print(f"Tab {tab} present in bundle:", tab in content)

except Exception as e:
    print("Error:", e)
