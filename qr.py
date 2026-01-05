import qrcode

# Link for QR code
link = "https://www.linkedin.com/pulse/app-startup-tech-support-using-ai-nanda-gopala-krishna-vasala-7gpyc"

# Create QR code
qr = qrcode.QRCode(
    version=1,
    error_correction=qrcode.constants.ERROR_CORRECT_H,
    box_size=10,
    border=4,
)

qr.add_data(link)
qr.make(fit=True)

# Generate image
img = qr.make_image(fill_color="black", back_color="white")

# Save QR code
img.save("qr_code.png")

print("QR code generated successfully!")
