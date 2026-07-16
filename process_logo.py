from PIL import Image, ImageDraw

def make_circle_transparent():
    # Load the image
    path = r'C:\Users\risha\.gemini\antigravity-ide\brain\55934e5d-627c-4979-ba98-499488fe3ee8\media__1784037236326.png'
    img = Image.open(path).convert("RGBA")
    
    # Create a circular mask
    mask = Image.new('L', img.size, 0)
    draw = ImageDraw.Draw(mask)
    draw.ellipse((0, 0) + img.size, fill=255)
    
    # Apply the mask
    result = img.copy()
    result.putalpha(mask)
    
    # Save the result
    out_path = r'C:\Users\risha\Desktop\NSS Website\frontend\public\images\nss-logo.png'
    result.save(out_path)
    print("Logo saved with transparent background")

make_circle_transparent()
