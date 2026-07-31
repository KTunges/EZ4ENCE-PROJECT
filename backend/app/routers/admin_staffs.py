from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import List
import uuid

from app.database import get_db
from app.models.user import User, Role
from app.schemas.user import UserResponse, StaffCreate, StaffUpdate
from app.routers.auth import get_current_admin
from app.core import security

router = APIRouter(prefix="/admin/staffs", tags=["Admin Staffs"])

def check_superadmin(admin: User):
    if admin.staff_role != "QUAN_TRI_VIEN":
        raise HTTPException(status_code=403, detail="Không có quyền truy cập. Yêu cầu quyền QUẢN TRỊ VIÊN.")

@router.get("", response_model=List[UserResponse])
def get_staffs(db: Session = Depends(get_db), admin: User = Depends(get_current_admin)):
    """Lấy danh sách tất cả tài khoản quản trị viên."""
    check_superadmin(admin)
    staffs = db.query(User).filter(User.role == Role.ADMIN).order_by(User.created_at.desc()).all()
    return staffs

@router.post("", response_model=UserResponse)
def create_staff(staff_data: StaffCreate, db: Session = Depends(get_db), admin: User = Depends(get_current_admin)):
    """Tạo tài khoản quản trị viên mới."""
    check_superadmin(admin)
    
    # Kiểm tra email tồn tại
    existing_user = db.query(User).filter(User.email == staff_data.email).first()
    if existing_user:
        raise HTTPException(status_code=400, detail="Email này đã được sử dụng")
        
    new_staff = User(
        id=str(uuid.uuid4()),
        email=staff_data.email,
        full_name=staff_data.fullName,
        password=security.hash_password(staff_data.password),
        role=Role.ADMIN,
        staff_role=staff_data.staff_role,
        is_active=True
    )
    
    db.add(new_staff)
    db.commit()
    db.refresh(new_staff)
    return new_staff

@router.put("/{staff_id}", response_model=UserResponse)
def update_staff(staff_id: str, staff_data: StaffUpdate, db: Session = Depends(get_db), admin: User = Depends(get_current_admin)):
    """Cập nhật tài khoản quản trị viên."""
    check_superadmin(admin)
    
    staff = db.query(User).filter(User.id == staff_id, User.role == Role.ADMIN).first()
    if not staff:
        raise HTTPException(status_code=404, detail="Không tìm thấy tài khoản")
        
    if staff.staff_role == "QUAN_TRI_VIEN" and staff_data.staff_role and staff_data.staff_role != "QUAN_TRI_VIEN":
        # Check if there's any other QUAN_TRI_VIEN left
        superadmins_count = db.query(User).filter(User.role == Role.ADMIN, User.staff_role == "QUAN_TRI_VIEN").count()
        if superadmins_count <= 1:
            raise HTTPException(status_code=400, detail="Không thể xóa quyền QUẢN TRỊ VIÊN của người dùng cuối cùng")

    if staff_data.fullName is not None:
        staff.full_name = staff_data.fullName
    if staff_data.staff_role is not None:
        staff.staff_role = staff_data.staff_role
    if staff_data.is_active is not None:
        staff.is_active = staff_data.is_active
    if staff_data.password:
        staff.password = security.hash_password(staff_data.password)
        
    db.commit()
    db.refresh(staff)
    return staff

@router.delete("/{staff_id}")
def delete_staff(staff_id: str, db: Session = Depends(get_db), admin: User = Depends(get_current_admin)):
    """Xóa tài khoản quản trị viên."""
    check_superadmin(admin)
    
    staff = db.query(User).filter(User.id == staff_id, User.role == Role.ADMIN).first()
    if not staff:
        raise HTTPException(status_code=404, detail="Không tìm thấy tài khoản")
        
    if staff.staff_role == "QUAN_TRI_VIEN":
        superadmins_count = db.query(User).filter(User.role == Role.ADMIN, User.staff_role == "QUAN_TRI_VIEN").count()
        if superadmins_count <= 1:
            raise HTTPException(status_code=400, detail="Không thể xóa tài khoản QUẢN TRỊ VIÊN duy nhất")
            
    db.delete(staff)
    db.commit()
    return {"message": "Đã xóa tài khoản thành công"}
