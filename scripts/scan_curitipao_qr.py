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
    print(f"Scanning: {dirpath}", flush=True)
    matches = []
    for root, dirs, files in os.walk(dirpath):
        if 'node_modules' in root or '.git' in root:
            continue
        for f in files:
            ext = os.path.splitext(f)[1].lower()
            if ext in ['.png', '.jpg', '.jpeg', '.webp', '.bmp']:
                full = os.path.join(root, f)
                val = scan_file(full)
                if val:
                    print(f"!!! QR CODE FOUND: {full} -> {val}", flush=True)
                    matches.append((full, val))
    return matches

dirs = [
    r'C:\Users\Jesse\Downloads\Curitipao',
    r'C:\Documentos\Projetos Web\Websites\curitipao\assets',
    r'C:\Documentos\Projetos Web\Websites\curitipao\assets_original',
    r'C:\Documentos\Projetos Web\Websites\curitipao-2026\assets',
    r'C:\Documentos\Projetos Web\Websites\curitipao-2026\assets_original'
]

results = []
for d in dirs:
    if os.path.exists(d):
        results.extend(scan_dir(d))

print(f"\nScan finished. Total QR Codes found in CuritiPão assets: {len(results)}", flush=True)
for f, v in results:
    print(f"FILE: {f} => URL: {v}", flush=True)
