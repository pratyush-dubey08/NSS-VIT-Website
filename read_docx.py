import zipfile
import re

def extract_text_from_docx(docx_path):
    with zipfile.ZipFile(docx_path) as docx_zip:
        xml_content = docx_zip.read('word/document.xml').decode('utf-8')
        # Simple regex to strip XML tags
        text = re.sub('<[^<]+>', ' ', xml_content)
        # Clean up whitespace
        text = re.sub(r'\s+', ' ', text)
        return text.strip()

text = extract_text_from_docx(r"c:\Users\risha\Desktop\NSS Website\Activity Reports NSS\NSS Activity Report 2025-26.docx")
print("First 3000 chars:")
print(text[:3000])
