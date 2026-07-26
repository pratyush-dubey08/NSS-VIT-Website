from docx import Document
import os

docx_path = r"c:\Users\risha\Desktop\NSS Website\Activity Reports NSS\NSS Activity Report 2025-26.docx"
doc = Document(docx_path)

print("--- Paragraphs ---")
for i, para in enumerate(doc.paragraphs):
    if para.text.strip():
        print(f"[{i}] Style: {para.style.name} | Text: {para.text[:100]}...")
    if i > 50:
        break

print("\n--- Inline Shapes (Images) ---")
image_count = 0
for i, inline_shape in enumerate(doc.inline_shapes):
    print(f"Image {i}: Type: {inline_shape.type}")
    image_count += 1
print(f"Total Images: {image_count}")
