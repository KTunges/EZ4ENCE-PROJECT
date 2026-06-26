from pydantic import BaseModel, ConfigDict, EmailStr
from typing import Optional, List
from datetime import datetime

# =======================
# SUPPLIER
# =======================
class SupplierBase(BaseModel):
    name: str
    contact_name: Optional[str] = None
    phone: Optional[str] = None
    email: Optional[EmailStr] = None
    address: Optional[str] = None
    is_active: bool = True

class SupplierCreate(SupplierBase):
    pass

class SupplierUpdate(SupplierBase):
    pass

class SupplierResponse(SupplierBase):
    id: str
    created_at: datetime
    updated_at: datetime
    model_config = ConfigDict(from_attributes=True)

# =======================
# STOCK RECEIPT ITEMS
# =======================
class StockReceiptItemBase(BaseModel):
    sku_id: str
    quantity: int
    unit_price: float

class StockReceiptItemCreate(StockReceiptItemBase):
    pass

class StockReceiptItemResponse(StockReceiptItemBase):
    id: str
    receipt_id: str
    total_price: float
    model_config = ConfigDict(from_attributes=True)

# =======================
# STOCK RECEIPTS
# =======================
class StockReceiptBase(BaseModel):
    type: str # 'IN' or 'OUT'
    supplier_id: Optional[str] = None
    note: Optional[str] = None

class StockReceiptCreate(StockReceiptBase):
    items: List[StockReceiptItemCreate]

class StockReceiptResponse(StockReceiptBase):
    id: str
    receipt_code: str
    total_amount: float
    created_by: str
    created_at: datetime
    updated_at: datetime
    items: List[StockReceiptItemResponse] = []
    
    model_config = ConfigDict(from_attributes=True)

# =======================
# INVENTORY VIEW (For Admin)
# =======================
class InventorySKUResponse(BaseModel):
    sku_id: str
    product_name: str
    sku_code: str
    stock_quantity: int
    price: float
    image_url: Optional[str] = None
