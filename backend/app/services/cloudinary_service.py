import os
import cloudinary
import cloudinary.uploader
from fastapi import UploadFile, HTTPException

# Initialize Cloudinary configuration
# The actual config happens when settings are loaded, or we just configure it here using env vars
CLOUDINARY_CLOUD_NAME = os.getenv("CLOUDINARY_CLOUD_NAME")
CLOUDINARY_API_KEY = os.getenv("CLOUDINARY_API_KEY")
CLOUDINARY_API_SECRET = os.getenv("CLOUDINARY_API_SECRET")

if CLOUDINARY_CLOUD_NAME and CLOUDINARY_API_KEY and CLOUDINARY_API_SECRET:
    cloudinary.config(
        cloud_name=CLOUDINARY_CLOUD_NAME,
        api_key=CLOUDINARY_API_KEY,
        api_secret=CLOUDINARY_API_SECRET,
        secure=True
    )

def upload_image(file: UploadFile) -> str:
    """
    Uploads an image to Cloudinary and returns the secure URL.
    """
    if not CLOUDINARY_CLOUD_NAME or CLOUDINARY_CLOUD_NAME == "your_cloud_name":
        raise HTTPException(
            status_code=500, 
            detail="Cloudinary is not configured. Please provide CLOUD_NAME, API_KEY, and API_SECRET in .env"
        )
        
    try:
        # Read file content
        content = file.file.read()
        
        # Upload to Cloudinary
        result = cloudinary.uploader.upload(
            content,
            folder="ez4gear/products", # Thư mục trên Cloudinary
            resource_type="image"
        )
        
        # Return the secure HTTPS url
        return result.get("secure_url")
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Image upload failed: {str(e)}")
    finally:
        file.file.close()
