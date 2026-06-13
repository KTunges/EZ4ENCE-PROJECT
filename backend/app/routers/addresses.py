from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List
import uuid

from app.database import get_db
from app.models.address import Address
from app.models.user import User
from app.schemas.address import AddressCreate, AddressUpdate, AddressResponse
from app.routers.auth import get_current_user

router = APIRouter(prefix="/addresses", tags=["addresses"])

@router.get("", response_model=List[AddressResponse])
def get_addresses(db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    return db.query(Address).filter(Address.user_id == current_user.id).order_by(Address.is_default.desc(), Address.created_at.desc()).all()

@router.post("", response_model=AddressResponse)
def create_address(req: AddressCreate, db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    # Nếu đánh dấu là default, xóa default của các address cũ
    if req.is_default:
        db.query(Address).filter(Address.user_id == current_user.id).update({"is_default": False})
        
    # Nếu đây là địa chỉ đầu tiên, mặc định là true
    existing = db.query(Address).filter(Address.user_id == current_user.id).count()
    if existing == 0:
        req.is_default = True

    new_address = Address(
        id=str(uuid.uuid4()),
        user_id=current_user.id,
        full_name=req.full_name,
        phone=req.phone,
        address_line=req.address_line,
        ward=req.ward,
        district=req.district,
        city=req.city,
        province_id=req.province_id,
        district_id=req.district_id,
        ward_code=req.ward_code,
        is_default=req.is_default
    )
    db.add(new_address)
    db.commit()
    db.refresh(new_address)
    return new_address

@router.put("/{address_id}", response_model=AddressResponse)
def update_address(address_id: str, req: AddressUpdate, db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    address = db.query(Address).filter(Address.id == address_id, Address.user_id == current_user.id).first()
    if not address:
        raise HTTPException(status_code=404, detail="Không tìm thấy địa chỉ")

    if req.is_default and not address.is_default:
        db.query(Address).filter(Address.user_id == current_user.id).update({"is_default": False})

    update_data = req.model_dump(exclude_unset=True)
    for key, value in update_data.items():
        setattr(address, key, value)
        
    db.commit()
    db.refresh(address)
    return address

@router.delete("/{address_id}")
def delete_address(address_id: str, db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    address = db.query(Address).filter(Address.id == address_id, Address.user_id == current_user.id).first()
    if not address:
        raise HTTPException(status_code=404, detail="Không tìm thấy địa chỉ")
    
    db.delete(address)
    db.commit()
    
    # Nếu xóa địa chỉ default, chọn address đầu tiên làm default mới nếu còn
    if address.is_default:
        first = db.query(Address).filter(Address.user_id == current_user.id).first()
        if first:
            first.is_default = True
            db.commit()
            
    return {"message": "Đã xóa địa chỉ thành công"}

@router.put("/{address_id}/default", response_model=AddressResponse)
def set_default_address(address_id: str, db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    address = db.query(Address).filter(Address.id == address_id, Address.user_id == current_user.id).first()
    if not address:
        raise HTTPException(status_code=404, detail="Không tìm thấy địa chỉ")
        
    db.query(Address).filter(Address.user_id == current_user.id).update({"is_default": False})
    address.is_default = True
    db.commit()
    db.refresh(address)
    return address
