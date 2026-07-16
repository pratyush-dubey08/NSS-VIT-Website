import zipfile
import os
import shutil

source_docx = r"c:\Users\risha\Desktop\NSS Website\Activity Reports NSS\NSS Activity Report 2025-26.docx"
target_dir = r"c:\Users\risha\Desktop\NSS Website\frontend\public\images\gallery\events_2025"

if not os.path.exists(target_dir):
    os.makedirs(target_dir)

try:
    with zipfile.ZipFile(source_docx, 'r') as docx_zip:
        image_count = 0
        for item in docx_zip.namelist():
            if item.startswith('word/media/'):
                filename = os.path.basename(item)
                if filename:
                    # Extract the file to target directory
                    source = docx_zip.open(item)
                    target = open(os.path.join(target_dir, filename), "wb")
                    with source, target:
                        shutil.copyfileobj(source, target)
                    image_count += 1
        print(f"Successfully extracted {image_count} images to {target_dir}")
except Exception as e:
    print(f"Error: {e}")
