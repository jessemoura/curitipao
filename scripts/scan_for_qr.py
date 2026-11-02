import os
import cv2
import numpy as np
from PIL import Image

def scan_file(fpath):
    try:
        pil_img = Image.open(fpath)
        img = cv2.cvtColor(np.array(pil_img), cv2.COLOR_RGB2BGR)
        detector = cv2.QRCodeDetector()
        val, pts, qr_code = detector.detectAndDecode(img)
        if val:
            return val
    except Exception as e:
        pass
    return None

def scan_dir(dirpath):
    print(f"Scanning directory: {dirpath}")
    matches = []
    for root, dirs, files in os.walk(dirpath):
        if 'node_modules' in root or '.git' in root or '.temp' in root:
            continue
        for f in files:
            ext = os.path.splitext(f)[1].lower()
            if ext in ['.png', '.jpg', '.jpeg', '.webp', '.bmp']:
                full = os.path.join(root, f)
                val = scan_file(full)
                if val:
                    print(f"!!! QR CODE DETECTED in {full} -> {val}")
                    matches.append((full, val))
    return matches

found = []
dirs_to_scan = [
    r'C:\Users\Jesse\Downloads\Curitipao',
    r'C:\Users\Jesse\Downloads',
    r'C:\Documentos\Projetos Web\Websites\curitipao',
    r'C:\Documentos\Projetos Web\Websites\curitipao-2026'
]

for d in dirs_to_scan:
    if os.path.exists(d):
        found.extend(scan_dir(d))

print("\n--- QR SCAN RESULTS ---")
print(f"Total QR Codes Found: {len(found)}")
for f, v in found:
    print(f"File: {f}\nDecoded URL: {v}\n")
