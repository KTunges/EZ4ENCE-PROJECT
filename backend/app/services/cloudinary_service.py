import cloudinary
import cloudinary.uploader
from fastapi import UploadFile, HTTPException
from app.config import settings

if settings.CLOUDINARY_CLOUD_NAME and settings.CLOUDINARY_API_KEY and settings.CLOUDINARY_API_SECRET:
    cloudinary.config(
        cloud_name=settings.CLOUDINARY_CLOUD_NAME,
        api_key=settings.CLOUDINARY_API_KEY,
        api_secret=settings.CLOUDINARY_API_SECRET,
        secure=True
    )

def upload_image(file: UploadFile, folder: str = "ez4gear/products") -> str:
    """
    Uploads an image to Cloudinary and returns the secure URL.
    """
    if not settings.CLOUDINARY_CLOUD_NAME or settings.CLOUDINARY_CLOUD_NAME == "your_cloud_name":
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
            folder=folder, # Thư mục trên Cloudinary
            resource_type="image"
        )
        
        # Return the secure HTTPS url
        return result.get("secure_url")
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Image upload failed: {str(e)}")
    finally:
        file.file.close()
