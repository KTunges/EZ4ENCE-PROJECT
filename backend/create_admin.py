import sys
import uuid
import bcrypt
from app.database import SessionLocal
from app.models.user import User, Role
from app.core.security import hash_password

def create_admin(email: str, password: str, full_name: str):
    db = SessionLocal()
    try:
        # Check if user exists
        user = db.query(User).filter(User.email == email).first()
        if user:
            # Promote to admin
            user.role = Role.ADMIN
            db.commit()
            print(f"User {email} đã được cấp quyền ADMIN thành công!")
            return

        # Hash password
        hashed_password = hash_password(password)
        
        # Create new admin
        new_admin = User(
            id=str(uuid.uuid4()),
            email=email,
            password=hashed_password,
            full_name=full_name,
            role=Role.ADMIN,
            is_active=True
        )
        db.add(new_admin)
        db.commit()
        print(f"Tạo mới Admin {email} thành công!")
        
    except Exception as e:
        db.rollback()
        print(f"Lỗi: {e}")
    finally:
        db.close()

if __name__ == "__main__":
    if len(sys.argv) < 4:
        print("Sử dụng: python create_admin.py <email> <password> <full_name>")
        sys.exit(1)
        
    email = sys.argv[1]
    password = sys.argv[2]
    full_name = sys.argv[3]
    create_admin(email, password, full_name)
