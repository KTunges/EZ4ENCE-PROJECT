import uuid
import sys
import os
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__))) # For seed_all_products
sys.path.insert(0, os.path.abspath(os.path.join(os.path.dirname(__file__), '../../backend'))) # For app.*
from datetime import datetime, timezone
import json
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
from app.config import settings

from app.models.user import User, Role
from app.models.category import Category
from app.models.brand import Brand
from app.models.product import Product, ProductSKU, ProductImage
from app.models.news import News
from app.models.marketing import Banner
from app.models.order import Order, OrderItem
from app.models.review import Review
from app.core.security import hash_password

true = True
false = False
null = None

engine = create_engine(settings.DATABASE_URL)
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

# ==========================================
# DỮ LIỆU ĐƯỢC TRÍCH XUẤT VÀ TỰ ĐỘNG SINH RA
# ==========================================
USERS_DATA = [
  {
    "id": "870b1d88-903a-44a4-adb4-d91c0b621405",
    "email": "leminhphan1@gmail.com",
    "password": "$2b$12$1VadyP22pJq.UQN6dsLf8eNRSgiQ7FvMaNFYOVhQTXM9hKaV8sD3C",
    "full_name": "minh",
    "phone": null,
    "avatar": null,
    "role": "USER",
    "staff_role": null,
    "is_active": true,
    "created_at": "2026-06-15T14:37:04.259229+07:00",
    "updated_at": "2026-06-15T14:37:04.259229+07:00"
  },
  {
    "id": "33d8ec32-23b4-4d98-9667-9d5f55c1b273",
    "email": "phanluuminh473@gmail.com",
    "password": "$2b$12$2SUDXUnW0gT6zzfp24177.yNepjgE39/7D9qc9Mg9FLBXHyEePJuG",
    "full_name": "minh1",
    "phone": null,
    "avatar": null,
    "role": "USER",
    "staff_role": null,
    "is_active": true,
    "created_at": "2026-06-15T14:37:04.259229+07:00",
    "updated_at": "2026-06-15T14:37:04.259229+07:00"
  },
  {
    "id": "7ce1a206-dd95-4d82-86dd-36373c7437ad",
    "email": "user1@ez4ence.com",
    "password": "$2b$12$1VadyP22pJq.UQN6dsLf8eNRSgiQ7FvMaNFYOVhQTXM9hKaV8sD3C",
    "full_name": "Tr\u1ea7n Minh Hi\u1ebfu",
    "phone": null,
    "avatar": null,
    "role": "USER",
    "staff_role": null,
    "is_active": true,
    "created_at": "2026-06-15T14:37:04.259229+07:00",
    "updated_at": "2026-06-15T14:37:04.259229+07:00"
  },
  {
    "id": "16d142c4-354d-4a5d-a2ec-e0b78227dade",
    "email": "user2@ez4ence.com",
    "password": "$2b$12$1VadyP22pJq.UQN6dsLf8eNRSgiQ7FvMaNFYOVhQTXM9hKaV8sD3C",
    "full_name": "Nguy\u1ec5n V\u0103n A",
    "phone": null,
    "avatar": null,
    "role": "USER",
    "staff_role": null,
    "is_active": true,
    "created_at": "2026-06-15T14:37:04.259229+07:00",
    "updated_at": "2026-06-15T14:37:04.259229+07:00"
  },
  {
    "id": "d3ee73fa-3b20-4bf3-8fb9-80d69dce34a4",
    "email": "user3@ez4ence.com",
    "password": "$2b$12$1VadyP22pJq.UQN6dsLf8eNRSgiQ7FvMaNFYOVhQTXM9hKaV8sD3C",
    "full_name": "L\u00ea Th\u1ecb B",
    "phone": null,
    "avatar": null,
    "role": "USER",
    "staff_role": null,
    "is_active": true,
    "created_at": "2026-06-15T14:37:04.259229+07:00",
    "updated_at": "2026-06-15T14:37:04.259229+07:00"
  },
  {
    "id": "0d6d139c-d612-4840-8aa0-c8cb00647d7f",
    "email": "admin@ez4ence.com",
    "password": "$2b$12$GBhpUOiHdXAcNcRdkGm0bu5nCNY9oKNrY0IWcBEQAbZmiNMlS3ulm",
    "full_name": "Administrator",
    "phone": null,
    "avatar": null,
    "role": "ADMIN",
    "staff_role": null,
    "is_active": true,
    "created_at": "2026-06-15T14:37:04.259229+07:00",
    "updated_at": "2026-06-15T14:42:54.783946+07:00"
  },
  {
    "id": "2efaf5ae-bc3b-47bc-90b9-632f3f6064da",
    "email": "customer1@gmail.com",
    "password": "$2b$12$EixZaYVK1fsbw1ZfbX3OXePaWxn96p36WQoeG6Lruj3vjPGga31lW",
    "full_name": "Nguy\u1ec5n V\u0103n A",
    "phone": "0912345678",
    "avatar": null,
    "role": "USER",
    "staff_role": null,
    "is_active": true,
    "created_at": "2026-06-15T21:16:32.439937+07:00",
    "updated_at": "2026-06-15T21:16:32.439937+07:00"
  },
  {
    "id": "f720b74c-ef1c-4b21-a158-a53619ef626c",
    "email": "customer2@gmail.com",
    "password": "$2b$12$EixZaYVK1fsbw1ZfbX3OXePaWxn96p36WQoeG6Lruj3vjPGga31lW",
    "full_name": "Tr\u1ea7n Th\u1ecb B",
    "phone": "0987654321",
    "avatar": null,
    "role": "USER",
    "staff_role": null,
    "is_active": true,
    "created_at": "2026-06-15T21:16:32.439937+07:00",
    "updated_at": "2026-06-15T21:16:32.439937+07:00"
  },
  {
    "id": "44e3fb18-124e-4107-a6a7-5f87440ca940",
    "email": "customer3@gmail.com",
    "password": "$2b$12$EixZaYVK1fsbw1ZfbX3OXePaWxn96p36WQoeG6Lruj3vjPGga31lW",
    "full_name": "L\u00ea Ho\u00e0ng C",
    "phone": "0901234567",
    "avatar": null,
    "role": "USER",
    "staff_role": null,
    "is_active": true,
    "created_at": "2026-06-15T21:16:32.439937+07:00",
    "updated_at": "2026-06-15T21:16:32.439937+07:00"
  },
  {
    "id": "1d497180-1ac7-4e30-ac44-1ae156ca796d",
    "email": "duoduo@gmail.com",
    "password": "$2b$12$a/QjY5WEU.XsPNLXl2tpDOkIWnMvbuTIoOy4g6oEC8GtAtu/wE9xC",
    "full_name": "ffff",
    "phone": null,
    "avatar": null,
    "role": "USER",
    "staff_role": null,
    "is_active": true,
    "created_at": "2026-06-15T21:25:37.687136+07:00",
    "updated_at": "2026-06-15T21:25:37.687136+07:00"
  },
  {
    "id": "154be4a1-0712-4b7c-b589-3a4817cdb9d2",
    "email": "khachhang1@gmail.com",
    "password": "$2b$12$Vtng756.r.uUuiw9njj0Sek4TwxMk9.6h8ENvNE6Os.PIs6kJ4ARC",
    "full_name": "Kh\u00e1ch H\u00e0ng 1",
    "phone": "0912650696",
    "avatar": null,
    "role": "USER",
    "staff_role": null,
    "is_active": true,
    "created_at": "2026-06-15T22:01:08.256719+07:00",
    "updated_at": "2026-06-15T22:01:08.256719+07:00"
  },
  {
    "id": "76a3244d-33f7-4021-8f06-7287523f5537",
    "email": "khachhang2@gmail.com",
    "password": "$2b$12$FrfB/9dXjx8tc87F9akmU.cyNrj.J37CZ7QxvRGtcJx6Jv5SRI/MG",
    "full_name": "Kh\u00e1ch H\u00e0ng 2",
    "phone": "0934958149",
    "avatar": null,
    "role": "USER",
    "staff_role": null,
    "is_active": true,
    "created_at": "2026-06-15T22:01:08.256719+07:00",
    "updated_at": "2026-06-15T22:01:08.256719+07:00"
  },
  {
    "id": "e1bcc0f2-0197-4a78-85ce-919f74128daa",
    "email": "khachhang3@gmail.com",
    "password": "$2b$12$6cn6ILQPx1KUWJcYlf81HezaRWp33BjWGu1pHBQadIExvFLSzb5/K",
    "full_name": "Kh\u00e1ch H\u00e0ng 3",
    "phone": "0989401195",
    "avatar": null,
    "role": "USER",
    "staff_role": null,
    "is_active": true,
    "created_at": "2026-06-15T22:01:08.256719+07:00",
    "updated_at": "2026-06-15T22:01:08.256719+07:00"
  },
  {
    "id": "03d7ce37-b04c-44ee-be56-0c284d235a81",
    "email": "khachhang4@gmail.com",
    "password": "$2b$12$hxC/Cpal.eD9pDDmRNRg8uiJWwLUnk5QdljMPl5G.eu90vHIcCcX2",
    "full_name": "Kh\u00e1ch H\u00e0ng 4",
    "phone": "0942783804",
    "avatar": null,
    "role": "USER",
    "staff_role": null,
    "is_active": true,
    "created_at": "2026-06-15T22:01:08.256719+07:00",
    "updated_at": "2026-06-15T22:01:08.256719+07:00"
  },
  {
    "id": "67df3dbf-027e-4bbc-8602-62cc4944ea21",
    "email": "khachhang5@gmail.com",
    "password": "$2b$12$RKjjL3Yl/.XnO7.0uyEHiu6KFBGTsFtdKEmFX.duR6tM7YXc.tg6y",
    "full_name": "Kh\u00e1ch H\u00e0ng 5",
    "phone": "0999878708",
    "avatar": null,
    "role": "USER",
    "staff_role": null,
    "is_active": true,
    "created_at": "2026-06-15T22:01:08.256719+07:00",
    "updated_at": "2026-06-15T22:01:08.256719+07:00"
  },
  {
    "id": "33721469-b1e5-49c8-b557-eaf6cad16c88",
    "email": "khachhang6@gmail.com",
    "password": "$2b$12$muxj8cZn8P9saz2mCT3p7ODticZ15HfMAcI1.pM8aUP1qInM9mOZ.",
    "full_name": "Kh\u00e1ch H\u00e0ng 6",
    "phone": "0976112166",
    "avatar": null,
    "role": "USER",
    "staff_role": null,
    "is_active": true,
    "created_at": "2026-06-15T22:01:08.256719+07:00",
    "updated_at": "2026-06-15T22:01:08.256719+07:00"
  },
  {
    "id": "95db6332-45a2-4e92-8d69-ec0b5a2f15de",
    "email": "khachhang7@gmail.com",
    "password": "$2b$12$EBsPLD4KhHYryjJjqLU1FOrS0Qpe4TudPCpl/9IqCt7k87RHE1vs2",
    "full_name": "Kh\u00e1ch H\u00e0ng 7",
    "phone": "0949694882",
    "avatar": null,
    "role": "USER",
    "staff_role": null,
    "is_active": true,
    "created_at": "2026-06-15T22:01:08.256719+07:00",
    "updated_at": "2026-06-15T22:01:08.256719+07:00"
  },
  {
    "id": "8cb44ebc-93c8-4a4d-a607-c35c4cb5eee6",
    "email": "khachhang8@gmail.com",
    "password": "$2b$12$YuGxmVlzbA49xgIWpxBAOuG6oOzMpnUv2g5m7gJXk25aPNTM3ImaG",
    "full_name": "Kh\u00e1ch H\u00e0ng 8",
    "phone": "0916759546",
    "avatar": null,
    "role": "USER",
    "staff_role": null,
    "is_active": true,
    "created_at": "2026-06-15T22:01:08.256719+07:00",
    "updated_at": "2026-06-15T22:01:08.256719+07:00"
  },
  {
    "id": "0d74d79b-4349-4693-b12f-c2968f25fc8d",
    "email": "khachhang9@gmail.com",
    "password": "$2b$12$N0Q42pkCJuCjku4T9./mSOVS.OPrutnlpz4HUTzMXieKQJGV.BrPK",
    "full_name": "Kh\u00e1ch H\u00e0ng 9",
    "phone": "0924521990",
    "avatar": null,
    "role": "USER",
    "staff_role": null,
    "is_active": true,
    "created_at": "2026-06-15T22:01:08.256719+07:00",
    "updated_at": "2026-06-15T22:01:08.256719+07:00"
  },
  {
    "id": "7476e4d1-6750-4d72-afe0-0b6891eacb56",
    "email": "khachhang10@gmail.com",
    "password": "$2b$12$Q9MK2s97KgYz7v/OmfPKtO6RikjLTjzUfuvqRy6xM5zBrd77VYon2",
    "full_name": "Kh\u00e1ch H\u00e0ng 10",
    "phone": "0988131480",
    "avatar": null,
    "role": "USER",
    "staff_role": null,
    "is_active": true,
    "created_at": "2026-06-15T22:01:08.256719+07:00",
    "updated_at": "2026-06-15T22:01:08.256719+07:00"
  },
  {
    "id": "838aada4-abdb-4205-8166-25c9332fb00c",
    "email": "khachhang11@gmail.com",
    "password": "$2b$12$.z.D48boZlbDZCSi3vgbSudf61t2dnapYtveet9/Ha5HIusyUz/Ii",
    "full_name": "Kh\u00e1ch H\u00e0ng 11",
    "phone": "0941713679",
    "avatar": null,
    "role": "USER",
    "staff_role": null,
    "is_active": true,
    "created_at": "2026-06-15T22:01:08.256719+07:00",
    "updated_at": "2026-06-15T22:01:08.256719+07:00"
  },
  {
    "id": "be078323-1783-4459-aafd-62ec93e671fd",
    "email": "khachhang12@gmail.com",
    "password": "$2b$12$cyv4DSDtCDV9IM8VEZ54B.zbuKO71LFvfmmVbH1.ndWA3U98jhH46",
    "full_name": "Kh\u00e1ch H\u00e0ng 12",
    "phone": "0984068383",
    "avatar": null,
    "role": "USER",
    "staff_role": null,
    "is_active": true,
    "created_at": "2026-06-15T22:01:08.256719+07:00",
    "updated_at": "2026-06-15T22:01:08.256719+07:00"
  },
  {
    "id": "8e3a3275-b0b4-4c3d-9532-83c3e29926c7",
    "email": "khachhang13@gmail.com",
    "password": "$2b$12$X.hmp1KEoyeI1H0mdOToCu6FGPHM8GjjOhlVlWGA.WTDs/6rYrJUe",
    "full_name": "Kh\u00e1ch H\u00e0ng 13",
    "phone": "0962180503",
    "avatar": null,
    "role": "USER",
    "staff_role": null,
    "is_active": true,
    "created_at": "2026-06-15T22:01:08.256719+07:00",
    "updated_at": "2026-06-15T22:01:08.256719+07:00"
  },
  {
    "id": "49053213-3c7f-4920-ae57-8020c45e461f",
    "email": "khachhang14@gmail.com",
    "password": "$2b$12$hI4tCZx42psf3cpGnv8WjujS.LoL5MczX142oNN6p7tEaGPb8hTN6",
    "full_name": "Kh\u00e1ch H\u00e0ng 14",
    "phone": "0929039772",
    "avatar": null,
    "role": "USER",
    "staff_role": null,
    "is_active": true,
    "created_at": "2026-06-15T22:01:08.256719+07:00",
    "updated_at": "2026-06-15T22:01:08.256719+07:00"
  },
  {
    "id": "3ee7dd3b-c6d6-482f-9691-94d6d29019d6",
    "email": "khachhang15@gmail.com",
    "password": "$2b$12$ij7MRXRPsqaXd/E14gfBhOHF21uIwPKz3afSr7CoGPFu94tU3P74K",
    "full_name": "Kh\u00e1ch H\u00e0ng 15",
    "phone": "0969411278",
    "avatar": null,
    "role": "USER",
    "staff_role": null,
    "is_active": true,
    "created_at": "2026-06-15T22:01:08.256719+07:00",
    "updated_at": "2026-06-15T22:01:08.256719+07:00"
  },
  {
    "id": "916f3dc1-cfcf-4d52-98d2-f5b943ee2d87",
    "email": "khachhang16@gmail.com",
    "password": "$2b$12$YQ8IkfkCkZpS3q1SjHQ23.BarrjgiNC0bVhBtUdtalaFoi8BvalIG",
    "full_name": "Kh\u00e1ch H\u00e0ng 16",
    "phone": "0964847031",
    "avatar": null,
    "role": "USER",
    "staff_role": null,
    "is_active": true,
    "created_at": "2026-06-15T22:01:08.256719+07:00",
    "updated_at": "2026-06-15T22:01:08.256719+07:00"
  },
  {
    "id": "42f1c24e-5b0b-4cb2-8c18-cce92319b708",
    "email": "khachhang17@gmail.com",
    "password": "$2b$12$Pm00Xtk/25ZmfTO4hjkFveP7OjALbhRUYwH3MT21fbNnwucT9ZrD6",
    "full_name": "Kh\u00e1ch H\u00e0ng 17",
    "phone": "0953820799",
    "avatar": null,
    "role": "USER",
    "staff_role": null,
    "is_active": true,
    "created_at": "2026-06-15T22:01:08.256719+07:00",
    "updated_at": "2026-06-15T22:01:08.256719+07:00"
  },
  {
    "id": "b0066f5e-291f-4bc8-b7de-3b040aa967b1",
    "email": "khachhang18@gmail.com",
    "password": "$2b$12$S75G0NqTxxrpvrc1BzMniuREOCw3ULVJS9p467H3DEmWUFIktetW.",
    "full_name": "Kh\u00e1ch H\u00e0ng 18",
    "phone": "0959929473",
    "avatar": null,
    "role": "USER",
    "staff_role": null,
    "is_active": true,
    "created_at": "2026-06-15T22:01:08.256719+07:00",
    "updated_at": "2026-06-15T22:01:08.256719+07:00"
  },
  {
    "id": "f8ff4ecd-db2d-4bb9-8ebc-ad1a76a39b05",
    "email": "khachhang19@gmail.com",
    "password": "$2b$12$FA18SgMZfMjz32qYRwK8CO4voGlS8FNcSaLh9wAPT2qegUr2ONmTm",
    "full_name": "Kh\u00e1ch H\u00e0ng 19",
    "phone": "0912262284",
    "avatar": null,
    "role": "USER",
    "staff_role": null,
    "is_active": true,
    "created_at": "2026-06-15T22:01:08.256719+07:00",
    "updated_at": "2026-06-15T22:01:08.256719+07:00"
  },
  {
    "id": "23b285fc-4f89-4941-bbaf-507e3cb87129",
    "email": "khachhang20@gmail.com",
    "password": "$2b$12$/EFE3eTCVXgtJEWBfXRvfeu9fQYgOPjtOMLf77c0KSzgv4kq12xGm",
    "full_name": "Kh\u00e1ch H\u00e0ng 20",
    "phone": "0967729537",
    "avatar": null,
    "role": "USER",
    "staff_role": null,
    "is_active": true,
    "created_at": "2026-06-15T22:01:08.256719+07:00",
    "updated_at": "2026-06-15T22:01:08.256719+07:00"
  },
  {
    "id": "5d9f851d-dc99-4bdc-8f48-35f154bd4642",
    "email": "kimtung5576@gmail.com",
    "password": "$2b$12$HZj5ykfihJXBnsjHxNa0OOjF/lDaHmlv7h9zn.uUJ/tCKGuImO3p6",
    "full_name": "Kim Tung",
    "phone": null,
    "avatar": null,
    "role": "ADMIN",
    "staff_role": "SUPER_ADMIN",
    "is_active": true,
    "created_at": "2026-06-15T14:49:53.142030+07:00",
    "updated_at": "2026-06-15T14:49:53.142030+07:00"
  },
  {
    "id": "3ff76a4e-5ce1-4101-b47b-3d67685979c2",
    "email": "phanleminh1@gmail.com",
    "password": "$2b$12$y514xFrfLVX9W7gT9qlAtOzdFa2cI7RoTFqpfPgEd.3/An4aLd6De",
    "full_name": "Phan L\u00ea Minh (Super Admin)",
    "phone": null,
    "avatar": null,
    "role": "ADMIN",
    "staff_role": null,
    "is_active": true,
    "created_at": "2026-06-15T23:34:43.455088+07:00",
    "updated_at": "2026-06-15T23:34:43.455088+07:00"
  }
]

MOCK_USERS = [
  {
    "id": "d4d0a559-436c-4172-b861-f16fd000c078",
    "email": "customer1@gmail.com",
    "password": "password123",
    "full_name": "Kh\u00e1ch H\u00e0ng 1",
    "role": "USER",
    "is_active": true
  },
  {
    "id": "fa1bc28f-9905-457f-95f3-2c87207d6aeb",
    "email": "customer2@gmail.com",
    "password": "password123",
    "full_name": "Kh\u00e1ch H\u00e0ng 2",
    "role": "USER",
    "is_active": true
  },
  {
    "id": "2220778b-4cee-41c2-bb35-48516cc1348a",
    "email": "customer3@gmail.com",
    "password": "password123",
    "full_name": "Kh\u00e1ch H\u00e0ng 3",
    "role": "USER",
    "is_active": true
  },
  {
    "id": "a680c785-e59a-4817-b37b-42a0a727f32c",
    "email": "customer4@gmail.com",
    "password": "password123",
    "full_name": "Kh\u00e1ch H\u00e0ng 4",
    "role": "USER",
    "is_active": true
  },
  {
    "id": "31889716-fa4b-4dc7-af82-659c527ef2f1",
    "email": "customer5@gmail.com",
    "password": "password123",
    "full_name": "Kh\u00e1ch H\u00e0ng 5",
    "role": "USER",
    "is_active": true
  },
  {
    "id": "22936cf5-52f2-417f-9627-0ef93c27a141",
    "email": "customer6@gmail.com",
    "password": "password123",
    "full_name": "Kh\u00e1ch H\u00e0ng 6",
    "role": "USER",
    "is_active": true
  },
  {
    "id": "2733b877-2d66-45d4-9ff5-472b363313d9",
    "email": "customer7@gmail.com",
    "password": "password123",
    "full_name": "Kh\u00e1ch H\u00e0ng 7",
    "role": "USER",
    "is_active": true
  },
  {
    "id": "73e1fe51-bcc3-48c9-81f8-a619c357fc6c",
    "email": "customer8@gmail.com",
    "password": "password123",
    "full_name": "Kh\u00e1ch H\u00e0ng 8",
    "role": "USER",
    "is_active": true
  },
  {
    "id": "362443ad-c157-4d84-ab37-18db4d43623e",
    "email": "customer9@gmail.com",
    "password": "password123",
    "full_name": "Kh\u00e1ch H\u00e0ng 9",
    "role": "USER",
    "is_active": true
  },
  {
    "id": "11877e70-287b-4620-a6d6-f54d88746c0d",
    "email": "customer10@gmail.com",
    "password": "password123",
    "full_name": "Kh\u00e1ch H\u00e0ng 10",
    "role": "USER",
    "is_active": true
  }
]

CATEGORIES_DATA = [
  {
    "id": "803d5488-84ba-46ae-a81d-1671518f7871",
    "name": "Gaming PC",
    "slug": "gaming-pc",
    "description": "High performance gaming PCs",
    "image": "",
    "parent_id": null,
    "created_at": "2026-06-15T14:37:04.263897+07:00",
    "updated_at": "2026-06-15T14:37:04.263897+07:00"
  },
  {
    "id": "83a5bd29-f50f-4f44-a5d5-f08dc00db238",
    "name": "Laptops",
    "slug": "laptops",
    "description": "Gaming and office laptops",
    "image": "",
    "parent_id": null,
    "created_at": "2026-06-15T14:37:04.263897+07:00",
    "updated_at": "2026-06-15T14:37:04.263897+07:00"
  },
  {
    "id": "e70174e8-bbd9-4060-93a0-f7b536374933",
    "name": "Peripherals",
    "slug": "peripherals",
    "description": "Keyboards, mice, and headsets",
    "image": "",
    "parent_id": null,
    "created_at": "2026-06-15T14:37:04.263897+07:00",
    "updated_at": "2026-06-15T14:37:04.263897+07:00"
  },
  {
    "id": "05ced308-c726-4003-820d-c8359e025afc",
    "name": "B\u00e0n ph\u00edm",
    "slug": "b\u00e0n-ph\u00edm",
    "description": "B\u00e0n ph\u00edm c\u01a1 v\u00e0 v\u0103n ph\u00f2ng",
    "image": "",
    "parent_id": null,
    "created_at": "2026-06-15T14:37:04.263897+07:00",
    "updated_at": "2026-06-15T14:37:04.263897+07:00"
  },
  {
    "id": "0ed3e760-d030-4dc9-9fa1-2be1e016ff94",
    "name": "\u1ed4 c\u1ee9ng, RAM",
    "slug": "ram",
    "description": "B\u1ed9 nh\u1edb trong v\u00e0 l\u01b0u tr\u1eef",
    "image": "",
    "parent_id": null,
    "created_at": "2026-06-15T14:37:04.263897+07:00",
    "updated_at": "2026-06-15T14:37:04.263897+07:00"
  },
  {
    "id": "1cadbb93-661c-445a-bba6-f8a469e61b7c",
    "name": "Case, Ngu\u1ed3n, T\u1ea3n",
    "slug": "case",
    "description": "V\u1ecf m\u00e1y, ngu\u1ed3n v\u00e0 t\u1ea3n nhi\u1ec7t",
    "image": "",
    "parent_id": null,
    "created_at": "2026-06-15T14:37:04.263897+07:00",
    "updated_at": "2026-06-15T14:37:04.263897+07:00"
  },
  {
    "id": "5d452037-725f-43c6-bbb9-72ceae06bab1",
    "name": "M\u00e0n h\u00ecnh",
    "slug": "m\u00e0n-h\u00ecnh",
    "description": "M\u00e0n h\u00ecnh m\u00e1y t\u00ednh chuy\u00ean nghi\u1ec7p v\u00e0 gaming",
    "image": "",
    "parent_id": null,
    "created_at": "2026-06-15T14:37:04.263897+07:00",
    "updated_at": "2026-06-15T14:37:04.263897+07:00"
  },
  {
    "id": "80145f50-5772-4aef-b398-3882bc8c04fb",
    "name": "PC EZ4ENCE",
    "slug": "pc",
    "description": "M\u00e1y t\u00ednh \u0111\u1ec3 b\u00e0n l\u1eafp r\u00e1p s\u1eb5n",
    "image": "",
    "parent_id": null,
    "created_at": "2026-06-15T14:37:04.263897+07:00",
    "updated_at": "2026-06-15T14:37:04.263897+07:00"
  },
  {
    "id": "86fe4a3f-1dc5-4c35-a20f-156ce680c143",
    "name": "Chu\u1ed9t + L\u00f3t chu\u1ed9t",
    "slug": "chu\u1ed9t",
    "description": "Chu\u1ed9t v\u00e0 l\u00f3t chu\u1ed9t gaming",
    "image": "",
    "parent_id": null,
    "created_at": "2026-06-15T14:37:04.263897+07:00",
    "updated_at": "2026-06-15T14:37:04.263897+07:00"
  },
  {
    "id": "9ae4a892-6898-469f-9596-969e024ecad3",
    "name": "Laptop Gaming",
    "slug": "laptop-gaming",
    "description": "Laptop ch\u01a1i game hi\u1ec7u n\u0103ng cao",
    "image": "",
    "parent_id": null,
    "created_at": "2026-06-15T14:37:04.263897+07:00",
    "updated_at": "2026-06-15T14:37:04.263897+07:00"
  },
  {
    "id": "9de67045-2957-43a8-9178-be675e3cbfff",
    "name": "Main, CPU, VGA",
    "slug": "mainboard",
    "description": "Linh ki\u1ec7n PC c\u01a1 b\u1ea3n",
    "image": "",
    "parent_id": null,
    "created_at": "2026-06-15T14:37:04.263897+07:00",
    "updated_at": "2026-06-15T14:37:04.263897+07:00"
  },
  {
    "id": "c1923d9a-740e-4808-aa7e-87fd429e990a",
    "name": "Tai Nghe",
    "slug": "tai-nghe",
    "description": "Tai nghe gaming, studio",
    "image": "",
    "parent_id": null,
    "created_at": "2026-06-15T14:37:04.263897+07:00",
    "updated_at": "2026-06-15T14:37:04.263897+07:00"
  },
  {
    "id": "f13dc502-a309-4021-89e0-f4276458635d",
    "name": "Laptop",
    "slug": "laptop",
    "description": "Laptops v\u0103n ph\u00f2ng, m\u1ecfng nh\u1eb9, doanh nh\u00e2n",
    "image": "",
    "parent_id": null,
    "created_at": "2026-06-15T14:37:04.263897+07:00",
    "updated_at": "2026-06-15T14:37:04.263897+07:00"
  },
  {
    "id": "e7463255-fe41-4038-96fa-c8094eeee5b8",
    "name": "Laptop",
    "slug": "Laptop",
    "description": "Laptops v\u0103n ph\u00f2ng, m\u1ecfng nh\u1eb9, doanh nh\u00e2n",
    "image": "",
    "parent_id": null,
    "created_at": "2026-06-15T14:37:04.263897+07:00",
    "updated_at": "2026-06-15T14:37:04.263897+07:00"
  },
  {
    "id": "7dd818d3-5766-4438-9192-7fc6ed535912",
    "name": "Laptop Gaming",
    "slug": "Laptop Gaming",
    "description": "Laptop ch\u01a1i game hi\u1ec7u n\u0103ng cao",
    "image": "",
    "parent_id": null,
    "created_at": "2026-06-15T14:37:04.263897+07:00",
    "updated_at": "2026-06-15T14:37:04.263897+07:00"
  },
  {
    "id": "478bde3f-b84a-411b-8de8-9e542dcb383d",
    "name": "PC EZ4ENCE",
    "slug": "PC",
    "description": "M\u00e1y t\u00ednh \u0111\u1ec3 b\u00e0n l\u1eafp r\u00e1p s\u1eb5n",
    "image": "",
    "parent_id": null,
    "created_at": "2026-06-15T14:37:04.263897+07:00",
    "updated_at": "2026-06-15T14:37:04.263897+07:00"
  },
  {
    "id": "325d35f4-c1c3-402c-b7f8-434edaa3c175",
    "name": "Main, CPU, VGA",
    "slug": "Mainboard",
    "description": "Linh ki\u1ec7n PC c\u01a1 b\u1ea3n",
    "image": "",
    "parent_id": null,
    "created_at": "2026-06-15T14:37:04.263897+07:00",
    "updated_at": "2026-06-15T14:37:04.263897+07:00"
  },
  {
    "id": "d62db7fa-e49f-4289-b538-1d312231f3e1",
    "name": "\u1ed4 c\u1ee9ng, RAM",
    "slug": "RAM",
    "description": "B\u1ed9 nh\u1edb trong v\u00e0 l\u01b0u tr\u1eef",
    "image": "",
    "parent_id": null,
    "created_at": "2026-06-15T14:37:04.263897+07:00",
    "updated_at": "2026-06-15T14:37:04.263897+07:00"
  },
  {
    "id": "299f49ff-e87e-4b2e-9f60-b0cd9c56107f",
    "name": "M\u00e0n h\u00ecnh",
    "slug": "M\u00e0n h\u00ecnh",
    "description": "M\u00e0n h\u00ecnh m\u00e1y t\u00ednh chuy\u00ean nghi\u1ec7p v\u00e0 gaming",
    "image": "",
    "parent_id": null,
    "created_at": "2026-06-15T14:37:04.263897+07:00",
    "updated_at": "2026-06-15T14:37:04.263897+07:00"
  },
  {
    "id": "c64afbfb-9d44-49b0-b440-2497695c7bba",
    "name": "Chu\u1ed9t + L\u00f3t chu\u1ed9t",
    "slug": "Chu\u1ed9t",
    "description": "Chu\u1ed9t v\u00e0 l\u00f3t chu\u1ed9t gaming",
    "image": "",
    "parent_id": null,
    "created_at": "2026-06-15T14:37:04.263897+07:00",
    "updated_at": "2026-06-15T14:37:04.263897+07:00"
  },
  {
    "id": "7b38fdda-e278-4713-9eec-5a14c2df1134",
    "name": "B\u00e0n ph\u00edm",
    "slug": "B\u00e0n ph\u00edm",
    "description": "B\u00e0n ph\u00edm c\u01a1 v\u00e0 v\u0103n ph\u00f2ng",
    "image": "",
    "parent_id": null,
    "created_at": "2026-06-15T14:37:04.263897+07:00",
    "updated_at": "2026-06-15T14:37:04.263897+07:00"
  },
  {
    "id": "dddb3535-7ef9-41ee-ba29-bd6b67f91a9c",
    "name": "Loa, Webcam",
    "slug": "Loa",
    "description": "Loa v\u00e0 Webcam",
    "image": null,
    "parent_id": null,
    "created_at": "2026-06-15T14:37:04.263897+07:00",
    "updated_at": "2026-06-15T14:37:04.263897+07:00"
  },
  {
    "id": "a60f77c7-c63a-4558-abbf-2c0db59eab37",
    "name": "Ph\u1ea7n m\u1ec1m, m\u1ea1ng",
    "slug": "Ph\u1ea7n m\u1ec1m",
    "description": "Ph\u1ea7n m\u1ec1m v\u00e0 thi\u1ebft b\u1ecb m\u1ea1ng",
    "image": null,
    "parent_id": null,
    "created_at": "2026-06-15T14:37:04.263897+07:00",
    "updated_at": "2026-06-15T14:37:04.263897+07:00"
  },
  {
    "id": "1d7c2d15-db46-4f83-8f4d-1b59dea112b4",
    "name": "Handheld, Console",
    "slug": "Console",
    "description": "M\u00e1y ch\u01a1i game, thi\u1ebft b\u1ecb m\u1ea1ng v\u00e0 ph\u1ee5 ki\u1ec7n kh\u00e1c",
    "image": null,
    "parent_id": null,
    "created_at": "2026-06-15T14:37:04.263897+07:00",
    "updated_at": "2026-06-15T14:37:04.263897+07:00"
  },
  {
    "id": "68c59ccc-4b71-4200-aa59-15089e945bc9",
    "name": "D\u1ecbch v\u1ee5 kh\u00e1c",
    "slug": "D\u1ecbch v\u1ee5",
    "description": "H\u1ec7 \u0111i\u1ec1u h\u00e0nh, ph\u1ea7n m\u1ec1m v\u00e0 d\u1ecbch v\u1ee5 b\u1ea3o d\u01b0\u1ee1ng",
    "image": null,
    "parent_id": null,
    "created_at": "2026-06-15T14:37:04.263897+07:00",
    "updated_at": "2026-06-15T14:37:04.263897+07:00"
  },
  {
    "id": "e1ab13a9-ec24-4d8a-84d2-25faca94e509",
    "name": "Ph\u1ee5 ki\u1ec7n",
    "slug": "Ph\u1ee5 ki\u1ec7n",
    "description": "C\u00e1c lo\u1ea1i ph\u1ee5 ki\u1ec7n m\u00e1y t\u00ednh, gi\u00e1 \u0111\u1ee1, c\u00e1p, hub...",
    "image": "",
    "parent_id": null,
    "created_at": "2026-06-15T14:37:04.263897+07:00",
    "updated_at": "2026-06-15T14:37:04.263897+07:00"
  },
  {
    "id": "64d6f455-8867-43d3-976b-98094d8f16d6",
    "name": "B\u1ed9 Vi X\u1eed L\u00fd",
    "slug": "b\u1ed9-vi-x\u1eed-l\u00fd-64d6f455",
    "description": "Danh m\u1ee5c B\u1ed9 Vi X\u1eed L\u00fd",
    "image": null,
    "parent_id": null,
    "created_at": "2026-06-15T22:01:08.256719+07:00",
    "updated_at": "2026-06-15T22:01:08.256719+07:00"
  },
  {
    "id": "d08aa7ba-fabc-43f4-9484-141d4f2628db",
    "name": "Card M\u00e0n H\u00ecnh",
    "slug": "card-m\u00e0n-h\u00ecnh-d08aa7ba",
    "description": "Danh m\u1ee5c Card M\u00e0n H\u00ecnh",
    "image": null,
    "parent_id": null,
    "created_at": "2026-06-15T22:01:08.256719+07:00",
    "updated_at": "2026-06-15T22:01:08.256719+07:00"
  },
  {
    "id": "56162dc3-558b-489f-9735-c7a27e80f7ac",
    "name": "B\u1ed9 Nh\u1edb Trong",
    "slug": "b\u1ed9-nh\u1edb-trong-56162dc3",
    "description": "Danh m\u1ee5c B\u1ed9 Nh\u1edb Trong",
    "image": null,
    "parent_id": null,
    "created_at": "2026-06-15T22:01:08.256719+07:00",
    "updated_at": "2026-06-15T22:01:08.256719+07:00"
  },
  {
    "id": "acce1753-eade-487f-a300-68b45fd325f6",
    "name": "Bo M\u1ea1ch Ch\u1ee7",
    "slug": "bo-m\u1ea1ch-ch\u1ee7-acce1753",
    "description": "Danh m\u1ee5c Bo M\u1ea1ch Ch\u1ee7",
    "image": null,
    "parent_id": null,
    "created_at": "2026-06-15T22:01:08.256719+07:00",
    "updated_at": "2026-06-15T22:01:08.256719+07:00"
  },
  {
    "id": "53d9cc06-0378-4bd5-a195-e9dc3a5da902",
    "name": "\u1ed4 C\u1ee9ng SSD",
    "slug": "\u1ed5-c\u1ee9ng-ssd-53d9cc06",
    "description": "Danh m\u1ee5c \u1ed4 C\u1ee9ng SSD",
    "image": null,
    "parent_id": null,
    "created_at": "2026-06-15T22:01:08.256719+07:00",
    "updated_at": "2026-06-15T22:01:08.256719+07:00"
  },
  {
    "id": "00be23d9-8fb9-46fc-a5e4-8cf48bc1bc2a",
    "name": "V\u1ecf M\u00e1y T\u00ednh",
    "slug": "v\u1ecf-m\u00e1y-t\u00ednh-00be23d9",
    "description": "Danh m\u1ee5c V\u1ecf M\u00e1y T\u00ednh",
    "image": null,
    "parent_id": null,
    "created_at": "2026-06-15T22:01:08.256719+07:00",
    "updated_at": "2026-06-15T22:01:08.256719+07:00"
  },
  {
    "id": "342ca7e2-6ad3-4c6e-82c3-50baac105e49",
    "name": "Ngu\u1ed3n M\u00e1y T\u00ednh",
    "slug": "ngu\u1ed3n-m\u00e1y-t\u00ednh-342ca7e2",
    "description": "Danh m\u1ee5c Ngu\u1ed3n M\u00e1y T\u00ednh",
    "image": null,
    "parent_id": null,
    "created_at": "2026-06-15T22:01:08.256719+07:00",
    "updated_at": "2026-06-15T22:01:08.256719+07:00"
  },
  {
    "id": "e186a6c2-7d53-4b04-b9fb-b02d1f6c85af",
    "name": "M\u00e0n H\u00ecnh",
    "slug": "m\u00e0n-h\u00ecnh-e186a6c2",
    "description": "Danh m\u1ee5c M\u00e0n H\u00ecnh",
    "image": null,
    "parent_id": null,
    "created_at": "2026-06-15T22:01:08.256719+07:00",
    "updated_at": "2026-06-15T22:01:08.256719+07:00"
  },
  {
    "id": "c89bfd04-0d68-4142-91b8-ffe51c3a3bdc",
    "name": "PC L\u1eafp R\u00e1p",
    "slug": "pc-lap-rap",
    "description": null,
    "image": null,
    "parent_id": null,
    "created_at": "2026-06-15T23:34:43.853212+07:00",
    "updated_at": "2026-06-15T23:34:43.853212+07:00"
  },
  {
    "id": "8e0249e7-3fe7-4afd-92ae-a5e5e9fd600c",
    "name": "Linh Ki\u1ec7n PC",
    "slug": "linh-kien-pc",
    "description": null,
    "image": null,
    "parent_id": null,
    "created_at": "2026-06-15T23:34:43.853212+07:00",
    "updated_at": "2026-06-15T23:34:43.853212+07:00"
  },
  {
    "id": "9b370fa5-e697-4b87-9021-30e2daad4ecb",
    "name": "M\u00e0n H\u00ecnh",
    "slug": "man-hinh",
    "description": null,
    "image": null,
    "parent_id": null,
    "created_at": "2026-06-15T23:34:43.853212+07:00",
    "updated_at": "2026-06-15T23:34:43.853212+07:00"
  },
  {
    "id": "df948d90-8f20-4039-9e95-515633f05118",
    "name": "B\u00e0n Ph\u00edm C\u01a1",
    "slug": "ban-phim-co",
    "description": null,
    "image": null,
    "parent_id": null,
    "created_at": "2026-06-15T23:34:43.853212+07:00",
    "updated_at": "2026-06-15T23:34:43.853212+07:00"
  },
  {
    "id": "17755134-577b-40c3-a4c5-511f0594e413",
    "name": "Chu\u1ed9t Gaming",
    "slug": "chuot-gaming",
    "description": null,
    "image": null,
    "parent_id": null,
    "created_at": "2026-06-15T23:34:43.853212+07:00",
    "updated_at": "2026-06-15T23:34:43.853212+07:00"
  }
]

BRANDS_DATA = [
  {
    "id": "5da698cc-6b22-4eff-9493-e619bdbd387a",
    "name": "Logitech",
    "slug": "logitech",
    "description": "",
    "logo_url": "",
    "created_at": "2026-06-16T20:57:25.300471",
    "updated_at": "2026-06-16T20:57:25.300471"
  },
  {
    "id": "ae145fd2-c6e9-4841-88e3-03bac25c3b56",
    "name": "Razer",
    "slug": "razer",
    "description": "",
    "logo_url": "",
    "created_at": "2026-06-16T20:57:25.300471",
    "updated_at": "2026-06-16T20:57:25.300471"
  },
  {
    "id": "f75e0e15-034d-4e21-adbb-10f75685a10f",
    "name": "Akko",
    "slug": "akko",
    "description": "",
    "logo_url": "",
    "created_at": "2026-06-16T20:57:25.300471",
    "updated_at": "2026-06-16T20:57:25.300471"
  },
  {
    "id": "d35a1862-b253-4855-bc3f-05282e96ea67",
    "name": "HyperX",
    "slug": "hyperx",
    "description": "",
    "logo_url": "",
    "created_at": "2026-06-16T20:57:25.300471",
    "updated_at": "2026-06-16T20:57:25.300471"
  },
  {
    "id": "69f7c933-4f05-4b6f-8a73-6ad04ebbd774",
    "name": "Harman Kardon",
    "slug": "harman-kardon",
    "description": "",
    "logo_url": "",
    "created_at": "2026-06-16T20:57:25.300471",
    "updated_at": "2026-06-16T20:57:25.300471"
  },
  {
    "id": "6341491c-f795-4096-8ed1-13519a1f3b1a",
    "name": "Lian Li",
    "slug": "lian-li",
    "description": "",
    "logo_url": "",
    "created_at": "2026-06-16T20:57:25.300471",
    "updated_at": "2026-06-16T20:57:25.300471"
  },
  {
    "id": "7a594ee7-5656-4318-954c-e85481663b61",
    "name": "Wooting",
    "slug": "wooting",
    "description": "",
    "logo_url": "",
    "created_at": "2026-06-16T20:57:25.300471",
    "updated_at": "2026-06-16T20:57:25.300471"
  },

  {
    "id": "0eacc349-0eb7-44be-a970-310b68cbe645",
    "name": "Asus",
    "slug": "asus",
    "description": null,
    "logo_url": "",
    "created_at": "2026-06-15T14:37:04.269867+07:00",
    "updated_at": "2026-06-15T14:37:04.269867+07:00"
  },
  {
    "id": "c63a919f-5938-460c-9b8b-e90cd66b1291",
    "name": "MSI",
    "slug": "msi",
    "description": null,
    "logo_url": "",
    "created_at": "2026-06-15T14:37:04.269867+07:00",
    "updated_at": "2026-06-15T14:37:04.269867+07:00"
  },
  {
    "id": "7a508659-0944-40ea-8cb7-bf5d76c797bc",
    "name": "Corsair",
    "slug": "corsair",
    "description": null,
    "logo_url": "",
    "created_at": "2026-06-15T14:37:04.269867+07:00",
    "updated_at": "2026-06-15T14:37:04.269867+07:00"
  },
  {
    "id": "ecf34ee3-0789-400f-afe8-31a1da50d924",
    "name": "Lenovo",
    "slug": "lenovo",
    "description": null,
    "logo_url": "",
    "created_at": "2026-06-15T14:37:04.269867+07:00",
    "updated_at": "2026-06-15T14:37:04.269867+07:00"
  },
  {
    "id": "c837f719-42b5-4e28-b7e2-dc0e1bc25058",
    "name": "Acer",
    "slug": "acer",
    "description": null,
    "logo_url": "",
    "created_at": "2026-06-15T14:37:04.269867+07:00",
    "updated_at": "2026-06-15T14:37:04.269867+07:00"
  },
  {
    "id": "68c582d5-cfdf-4d5d-9c28-d3f4eac3a614",
    "name": "Dell",
    "slug": "dell",
    "description": null,
    "logo_url": "",
    "created_at": "2026-06-15T14:37:04.269867+07:00",
    "updated_at": "2026-06-15T14:37:04.269867+07:00"
  },
  {
    "id": "48de0310-95de-4e8f-b185-ecd3f1334799",
    "name": "HP",
    "slug": "hp",
    "description": null,
    "logo_url": "",
    "created_at": "2026-06-15T14:37:04.269867+07:00",
    "updated_at": "2026-06-15T14:37:04.269867+07:00"
  },
  {
    "id": "69669bfa-bf86-496f-84f0-ef8b6d212c21",
    "name": "Apple",
    "slug": "apple",
    "description": null,
    "logo_url": "",
    "created_at": "2026-06-15T14:37:04.269867+07:00",
    "updated_at": "2026-06-15T14:37:04.269867+07:00"
  },
  {
    "id": "b08bb8ef-402c-44e1-beb9-65f279d3b61b",
    "name": "NZXT",
    "slug": "nzxt",
    "description": null,
    "logo_url": "",
    "created_at": "2026-06-15T14:37:04.269867+07:00",
    "updated_at": "2026-06-15T14:37:04.269867+07:00"
  },
  {
    "id": "22fcd678-380c-4698-8fd5-e4ec1b8b1017",
    "name": "Deepcool",
    "slug": "deepcool",
    "description": null,
    "logo_url": "",
    "created_at": "2026-06-15T14:37:04.269867+07:00",
    "updated_at": "2026-06-15T14:37:04.269867+07:00"
  },
  {
    "id": "31bffa70-e26f-4965-941b-cb4b3021502b",
    "name": "SteelSeries",
    "slug": "steelseries",
    "description": null,
    "logo_url": "",
    "created_at": "2026-06-15T14:37:04.269867+07:00",
    "updated_at": "2026-06-15T14:37:04.269867+07:00"
  },
  {
    "id": "24e65b24-31af-4915-882c-e8116fb33c99",
    "name": "Intel",
    "slug": "intel",
    "description": null,
    "logo_url": "",
    "created_at": "2026-06-15T14:37:04.273939+07:00",
    "updated_at": "2026-06-15T14:37:04.273939+07:00"
  },
  {
    "id": "66a0211c-8bfa-4dd2-8583-dfd87f7da2e2",
    "name": "AMD",
    "slug": "amd",
    "description": null,
    "logo_url": "",
    "created_at": "2026-06-15T14:37:04.273939+07:00",
    "updated_at": "2026-06-15T14:37:04.273939+07:00"
  },
  {
    "id": "b951edf0-37c6-4c24-916f-c5705f71044d",
    "name": "Gigabyte",
    "slug": "gigabyte",
    "description": null,
    "logo_url": "",
    "created_at": "2026-06-15T14:37:04.273939+07:00",
    "updated_at": "2026-06-15T14:37:04.273939+07:00"
  },
  {
    "id": "d09748d1-9c9d-4f1b-b8ff-b867fb402d25",
    "name": "Samsung",
    "slug": "samsung",
    "description": null,
    "logo_url": "",
    "created_at": "2026-06-15T14:37:04.273939+07:00",
    "updated_at": "2026-06-15T14:37:04.273939+07:00"
  },
  {
    "id": "2c8f9a39-2506-42c5-ba51-bf7348fc419a",
    "name": "NVIDIA",
    "slug": "nvidia-2c8f9a39",
    "description": "Th\u01b0\u01a1ng hi\u1ec7u NVIDIA",
    "logo_url": null,
    "created_at": "2026-06-15T22:01:08.256719+07:00",
    "updated_at": "2026-06-15T22:01:08.256719+07:00"
  },
  {
    "id": "c308ee69-36f0-44c9-b0de-220f9bb2e5a4",
    "name": "Kingston",
    "slug": "kingston-c308ee69",
    "description": "Th\u01b0\u01a1ng hi\u1ec7u Kingston",
    "logo_url": null,
    "created_at": "2026-06-15T22:01:08.256719+07:00",
    "updated_at": "2026-06-15T22:01:08.256719+07:00"
  }
]


PRODUCTS_DATA = [
  {
    "id": "eafee440-d395-4ff3-9334-bd036b7fb183",
    "name": "Chuột Logitech G Pro X Superlight",
    "slug": "logitech-g-pro-x-superlight",
    "description": "Chuột không dây siêu nhẹ cho game thủ",
    "category_id": null,
    "brand_id": "5da698cc-6b22-4eff-9493-e619bdbd387a",
    "base_price": 2500000,
    "is_published": True,
    "created_at": "2026-06-16T20:57:25.300471",
    "updated_at": "2026-06-16T20:57:25.300471",
    "full_specs": {"Kết nối": "Không dây Lightspeed", "DPI": "25000", "Trọng lượng": "63g"}
  },
  {
    "id": "ce4bc865-756c-481a-a495-9d04caf0f1c6",
    "name": "Chuột Razer DeathAdder V3 Pro",
    "slug": "razer-deathadder-v3-pro",
    "description": "Chuột gaming công thái học cao cấp",
    "category_id": "17755134-577b-40c3-a4c5-511f0594e413",
    "brand_id": "ae145fd2-c6e9-4841-88e3-03bac25c3b56",
    "base_price": 3200000,
    "is_published": True,
    "created_at": "2026-06-16T20:57:25.300471",
    "updated_at": "2026-06-16T20:57:25.300471",
    "full_specs": {"Kết nối": "Không dây Hyperspeed", "DPI": "30000", "Trọng lượng": "63g"}
  },
  {
    "id": "4eabb709-4283-4082-9605-a185c83513ea",
    "name": "Bàn phím cơ Akko MOD007 PC",
    "slug": "akko-mod007-pc",
    "description": "Bàn phím cơ custom giá rẻ",
    "category_id": null,
    "brand_id": "f75e0e15-034d-4e21-adbb-10f75685a10f",
    "base_price": 1800000,
    "is_published": True,
    "created_at": "2026-06-16T20:57:25.300471",
    "updated_at": "2026-06-16T20:57:25.300471",
    "full_specs": {"Loại Switch": "Akko CS", "Kích thước": "TKL", "Kết nối": "Có dây"}
  },
  {
    "id": "e9f81682-06fc-49d3-b2d4-3794cecb1fd8",
    "name": "Bàn phím Wooting 60HE",
    "slug": "wooting-60he",
    "description": "Bàn phím analog tốt nhất thế giới",
    "category_id": null,
    "brand_id": "7a594ee7-5656-4318-954c-e85481663b61",
    "base_price": 4500000,
    "is_published": True,
    "created_at": "2026-06-16T20:57:25.300471",
    "updated_at": "2026-06-16T20:57:25.300471",
    "full_specs": {"Loại Switch": "Lekker", "Kích thước": "60%", "Kết nối": "Có dây"}
  },
  {
    "id": "6f21aaf4-1b4d-4d0e-a670-96a58c2754cb",
    "name": "Tai nghe HyperX Cloud III",
    "slug": "hyperx-cloud-iii",
    "description": "Tai nghe gaming thoải mái nhất",
    "category_id": "c1923d9a-740e-4808-aa7e-87fd429e990a",
    "brand_id": "d35a1862-b253-4855-bc3f-05282e96ea67",
    "base_price": 2200000,
    "is_published": True,
    "created_at": "2026-06-16T20:57:25.300471",
    "updated_at": "2026-06-16T20:57:25.300471",
    "full_specs": {"Kết nối": "Có dây 3.5mm/USB", "Kiểu dáng": "Over-ear", "Microphone": "Có"}
  },
  {
    "id": "6fbb6c4b-a401-40f2-b49b-0ab6d41b3b4b",
    "name": "Tai nghe Razer BlackShark V2",
    "slug": "razer-blackshark-v2-mock",
    "description": "Tai nghe e-sports chuyên nghiệp",
    "category_id": "c1923d9a-740e-4808-aa7e-87fd429e990a",
    "brand_id": "ae145fd2-c6e9-4841-88e3-03bac25c3b56",
    "base_price": 2500000,
    "is_published": True,
    "created_at": "2026-06-16T20:57:25.300471",
    "updated_at": "2026-06-16T20:57:25.300471",
    "full_specs": {"Kết nối": "Có dây 3.5mm/USB", "Kiểu dáng": "Over-ear", "Microphone": "Có"}
  },
  {
    "id": "50dd943f-98c9-42b6-a666-2637bb3ced7e",
    "name": "Vỏ Case Lian Li O11 Dynamic EVO",
    "slug": "lian-li-o11-dynamic-evo",
    "description": "Vỏ case bể cá huyền thoại",
    "category_id": "1cadbb93-661c-445a-bba6-f8a469e61b7c",
    "brand_id": "6341491c-f795-4096-8ed1-13519a1f3b1a",
    "base_price": 3800000,
    "is_published": True,
    "created_at": "2026-06-16T20:57:25.300471",
    "updated_at": "2026-06-16T20:57:25.300471",
    "full_specs": {"Kích thước": "Mid Tower", "Màu sắc": "Trắng", "Chất liệu": "Nhôm, Kính cường lực"}
  },
  {
    "id": "24db29a0-5f28-4aca-b6ff-a9d004cda6b8",
    "name": "Loa Harman Kardon SoundSticks 4",
    "slug": "harman-kardon-soundsticks-4",
    "description": "Loa bluetooth thiết kế trong suốt",
    "category_id": null,
    "brand_id": "69f7c933-4f05-4b6f-8a73-6ad04ebbd774",
    "base_price": 6500000,
    "is_published": True,
    "created_at": "2026-06-16T20:57:25.300471",
    "updated_at": "2026-06-16T20:57:25.300471",
    "full_specs": {"Kết nối": "Bluetooth", "Công suất": "140W", "Màu sắc": "Trắng"}
  },

  {
    "id": "7624c1c8-ac4e-44bb-a942-cc2889721300",
    "name": "Router Wi-Fi 6 ASUS RT-AX82U v2 Chu\u1ea9n Gaming",
    "slug": "router-wifi-6-asus-rt-ax82u",
    "description": "S\u1ea3n ph\u1ea9m kh\u00f4i ph\u1ee5c t\u1ef1 \u0111\u1ed9ng.",
    "category_id": "a60f77c7-c63a-4558-abbf-2c0db59eab37",
    "brand_id": "0eacc349-0eb7-44be-a970-310b68cbe645",
    "specifications": {},
    "is_published": true,
    "created_at": "2026-06-15T14:37:04.273939+07:00",
    "updated_at": "2026-06-15T14:37:04.273939+07:00"
  },
  {
    "id": "deeea250-8252-430a-9d26-2b57083163b4",
    "name": "H\u1ec7 \u0111i\u1ec1u h\u00e0nh Windows 11 Pro (B\u1ea3n Quy\u1ec1n Digital)",
    "slug": "windows-11-pro",
    "description": "S\u1ea3n ph\u1ea9m kh\u00f4i ph\u1ee5c t\u1ef1 \u0111\u1ed9ng.",
    "category_id": "a60f77c7-c63a-4558-abbf-2c0db59eab37",
    "brand_id": "0eacc349-0eb7-44be-a970-310b68cbe645",
    "specifications": {},
    "is_published": true,
    "created_at": "2026-06-15T14:37:04.273939+07:00",
    "updated_at": "2026-06-15T14:37:04.273939+07:00"
  },
  {
    "id": "db8b1df1-a8a6-4bdf-a570-0768b790e99f",
    "name": "D\u1ecbch V\u1ee5 V\u1ec7 Sinh B\u1ea3o D\u01b0\u1ee1ng PC Tr\u1ecdn G\u00f3i",
    "slug": "dich-vu-ve-sinh-pc",
    "description": "S\u1ea3n ph\u1ea9m kh\u00f4i ph\u1ee5c t\u1ef1 \u0111\u1ed9ng.",
    "category_id": "68c59ccc-4b71-4200-aa59-15089e945bc9",
    "brand_id": "0eacc349-0eb7-44be-a970-310b68cbe645",
    "specifications": {},
    "is_published": true,
    "created_at": "2026-06-15T14:37:04.273939+07:00",
    "updated_at": "2026-06-15T14:37:04.273939+07:00"
  },
  {
    "id": "12babdc2-fb5f-4022-b2ba-0557ad041bcb",
    "name": "Laptop Lenovo IdeaPad Slim 5 14IMH9",
    "slug": "lenovo-ideapad-slim-5-14imh9",
    "description": "Chi\u1ebfc m\u00e1y v\u0103n ph\u00f2ng ho\u00e0n h\u1ea3o v\u1edbi m\u00e0n h\u00ecnh OLED hi\u1ec3n th\u1ecb m\u00e0u s\u1eafc r\u1ef1c r\u1ee1 chu\u1ea9n \u0111i\u1ec7n \u1ea3nh. Thi\u1ebft k\u1ebf v\u1ecf nh\u00f4m si\u00eau m\u1ecfng nh\u1eb9 c\u00f9ng chip Intel Core Ultra t\u00edch h\u1ee3p NPU x\u1eed l\u00fd AI ti\u00ean ti\u1ebfn.",
    "category_id": "f13dc502-a309-4021-89e0-f4276458635d",
    "brand_id": "ecf34ee3-0789-400f-afe8-31a1da50d924",
    "specifications": {
      "CPU": "Intel Core Ultra 5 125H (14 nh\u00e2n, 18 lu\u1ed3ng, xung nh\u1ecbp l\u00ean \u0111\u1ebfn 4.5GHz, 18MB Cache, t\u00edch h\u1ee3p NPU AI)",
      "RAM": "16GB LPDDR5X 7467MHz (Onboard, kh\u00f4ng n\u00e2ng c\u1ea5p)",
      "\u1ed4 c\u1ee9ng": "512GB PCIe Gen4 NVMe M.2 SSD",
      "Card \u0111\u1ed3 h\u1ecda": "Intel Arc Graphics (t\u00edch h\u1ee3p)",
      "M\u00e0n h\u00ecnh": "14 inch WUXGA (1920 x 1200), OLED, 400nits, 100% DCI-P3, DisplayHDR True Black 500",
      "H\u1ec7 \u0111i\u1ec1u h\u00e0nh": "Windows 11 Home",
      "Pin": "56.6WHrs, 4 cell Li-ion, s\u1ea1c nhanh Rapid Charge Pro",
      "Tr\u1ecdng l\u01b0\u1ee3ng": "1.46 kg",
      "B\u00e0n ph\u00edm": "Backlit, h\u00e0nh tr\u00ecnh ph\u00edm 1.5mm",
      "C\u1ed5ng k\u1ebft n\u1ed1i": "1x USB-C 3.2 Gen2 (Thunderbolt 4, PD, DisplayPort 1.4), 1x USB-C 3.2 Gen1 (PD), 1x USB-A 3.2 Gen1, 1x HDMI 2.1, 1x 3.5mm audio, 1x SD card reader",
      "WiFi": "Wi-Fi 6E (802.11ax), Bluetooth 5.3",
      "Loa": "Dual speaker 2W, Dolby Atmos",
      "Webcam": "1080p FHD + IR Camera (Windows Hello)",
      "B\u1ea3o h\u00e0nh": "24 th\u00e1ng ch\u00ednh h\u00e3ng Lenovo Vi\u1ec7t Nam"
    },
    "is_published": true,
    "created_at": "2026-06-15T14:37:04.273939+07:00",
    "updated_at": "2026-06-15T14:37:04.273939+07:00"
  },
  {
    "id": "1a16164f-51f0-45d9-b9dd-f14ebbd374f5",
    "name": "Laptop Gaming Acer Nitro 16 Phoenix",
    "slug": "acer-nitro-16-phoenix",
    "description": "Phi\u00ean b\u1ea3n Phoenix v\u1edbi logo ho\u00e0n to\u00e0n m\u1edbi. M\u00e1y trang b\u1ecb t\u1ea3n nhi\u1ec7t t\u1ed1i t\u00e2n v\u1edbi kem t\u1ea3n nhi\u1ec7t kim lo\u1ea1i l\u1ecfng, CPU AMD Ryzen 7 7840HS m\u00e1t m\u1ebb v\u00e0 card \u0111\u1ed3 h\u1ecda RTX 4050.",
    "category_id": "9ae4a892-6898-469f-9596-969e024ecad3",
    "brand_id": "c837f719-42b5-4e28-b7e2-dc0e1bc25058",
    "specifications": {
      "CPU": "AMD Ryzen 7 7840HS (8 nh\u00e2n, 16 lu\u1ed3ng, xung nh\u1ecbp l\u00ean \u0111\u1ebfn 5.1GHz, 16MB Cache)",
      "RAM": "16GB DDR5 5600MHz (2 khe, n\u00e2ng c\u1ea5p t\u1ed1i \u0111a 32GB)",
      "\u1ed4 c\u1ee9ng": "512GB PCIe Gen4 NVMe M.2 SSD (c\u00f2n 1 khe M.2 tr\u1ed1ng)",
      "Card \u0111\u1ed3 h\u1ecda": "NVIDIA GeForce RTX 4050 6GB GDDR6",
      "M\u00e0n h\u00ecnh": "16 inch WUXGA (1920 x 1200), 165Hz, IPS, 350nits, 100% sRGB",
      "H\u1ec7 \u0111i\u1ec1u h\u00e0nh": "Windows 11 Home",
      "Pin": "76WHrs, 4 cell Li-ion",
      "Tr\u1ecdng l\u01b0\u1ee3ng": "2.6 kg",
      "B\u00e0n ph\u00edm": "4-Zone RGB Backlit, b\u00e0n ph\u00edm s\u1ed1",
      "C\u1ed5ng k\u1ebft n\u1ed1i": "1x USB-C 3.2 Gen2 (DisplayPort), 2x USB-A 3.2 Gen2, 1x HDMI 2.1, 1x RJ45 LAN, 1x 3.5mm audio, 1x Thunderbolt 4",
      "WiFi": "Wi-Fi 6E (802.11ax), Bluetooth 5.2",
      "T\u1ea3n nhi\u1ec7t": "AeroBlade 3D Fan th\u1ebf h\u1ec7 m\u1edbi, keo t\u1ea3n nhi\u1ec7t kim lo\u1ea1i l\u1ecfng",
      "B\u1ea3o h\u00e0nh": "24 th\u00e1ng ch\u00ednh h\u00e3ng Acer Vi\u1ec7t Nam"
    },
    "is_published": true,
    "created_at": "2026-06-15T14:37:04.273939+07:00",
    "updated_at": "2026-06-15T14:37:04.273939+07:00"
  },
  {
    "id": "1d0a012e-ea93-47b4-b8a8-a0f68c9d09d6",
    "name": "Laptop Gaming Lenovo Legion 5 16IRX9",
    "slug": "lenovo-legion-5-16irx9",
    "description": "Lenovo Legion 5 - Bi\u1ec3u t\u01b0\u1ee3ng c\u1ee7a s\u1ef1 ho\u00e0n h\u1ea3o trong ph\u00e2n kh\u00fac gaming. Thi\u1ebft k\u1ebf tinh t\u1ebf, build nh\u00f4m nguy\u00ean kh\u1ed1i, k\u1ebft h\u1ee3p v\u1edbi s\u1ee9c m\u1ea1nh t\u1eeb c\u1ea5u h\u00ecnh m\u1edbi nh\u1ea5t v\u00e0 m\u00e0n h\u00ecnh 2K si\u00eau n\u00e9t chu\u1ea9n m\u00e0u.",
    "category_id": "9ae4a892-6898-469f-9596-969e024ecad3",
    "brand_id": "ecf34ee3-0789-400f-afe8-31a1da50d924",
    "specifications": {
      "CPU": "Intel Core i7-14650HX (16 nh\u00e2n, 24 lu\u1ed3ng, xung nh\u1ecbp l\u00ean \u0111\u1ebfn 5.2GHz, 30MB Cache)",
      "RAM": "32GB DDR5 5600MHz (2 khe, n\u00e2ng c\u1ea5p t\u1ed1i \u0111a 64GB)",
      "\u1ed4 c\u1ee9ng": "1TB PCIe Gen4 NVMe M.2 SSD (c\u00f2n 1 khe M.2 tr\u1ed1ng)",
      "Card \u0111\u1ed3 h\u1ecda": "NVIDIA GeForce RTX 4060 8GB GDDR6",
      "M\u00e0n h\u00ecnh": "16 inch WQXGA (2560 x 1600), 165Hz, IPS, 350nits, 100% sRGB",
      "H\u1ec7 \u0111i\u1ec1u h\u00e0nh": "Windows 11 Home",
      "Pin": "80WHrs, 4 cell Li-ion, s\u1ea1c nhanh Super Rapid Charge",
      "Tr\u1ecdng l\u01b0\u1ee3ng": "2.3 kg",
      "B\u00e0n ph\u00edm": "RGB Backlit 4-Zone, b\u00e0n ph\u00edm s\u1ed1, h\u00e0nh tr\u00ecnh ph\u00edm 1.5mm",
      "C\u1ed5ng k\u1ebft n\u1ed1i": "1x USB-C 3.2 Gen2 (DisplayPort 1.4, PD 140W), 1x USB-C 3.2 Gen2 (DisplayPort 1.4), 2x USB-A 3.2 Gen1, 1x HDMI 2.1, 1x RJ45 2.5Gbps LAN, 1x 3.5mm audio",
      "WiFi": "Wi-Fi 6E (802.11ax), Bluetooth 5.3",
      "T\u1ea3n nhi\u1ec7t": "Lenovo LA-CoolZone, qu\u1ea1t k\u00e9p 87-blade, \u1ed1ng d\u1eabn nhi\u1ec7t k\u00e9p, keo t\u1ea3n nhi\u1ec7t kim lo\u1ea1i l\u1ecfng",
      "B\u1ea3o h\u00e0nh": "24 th\u00e1ng ch\u00ednh h\u00e3ng Lenovo Vi\u1ec7t Nam"
    },
    "is_published": true,
    "created_at": "2026-06-15T14:37:04.273939+07:00",
    "updated_at": "2026-06-15T14:37:04.273939+07:00"
  },
  {
    "id": "5c6eec03-0254-458b-ad41-f27a9b9c38c1",
    "name": "Laptop ASUS Zenbook 14 OLED UX3405MA",
    "slug": "asus-zenbook-14-oled-ux3405ma",
    "description": "ASUS Zenbook 14 OLED n\u1ed5i b\u1eadt v\u1edbi s\u1ef1 m\u1ecfng nh\u1eb9 phi th\u01b0\u1eddng, n\u1eb7ng ch\u1ec9 1.2kg. M\u00e0n h\u00ecnh Lumina OLED 3K 120Hz si\u00eau s\u1eafc n\u00e9t \u0111em l\u1ea1i tr\u1ea3i nghi\u1ec7m th\u1ecb gi\u00e1c r\u1ef1c r\u1ee1 v\u00e0 ch\u00e2n th\u1ef1c \u0111\u1ebfn kinh ng\u1ea1c.",
    "category_id": "f13dc502-a309-4021-89e0-f4276458635d",
    "brand_id": "0eacc349-0eb7-44be-a970-310b68cbe645",
    "specifications": {
      "CPU": "Intel Core Ultra 7 155H (16 nh\u00e2n, 22 lu\u1ed3ng, xung nh\u1ecbp l\u00ean \u0111\u1ebfn 4.8GHz, 24MB Cache, t\u00edch h\u1ee3p NPU AI)",
      "RAM": "16GB LPDDR5X 7467MHz (Onboard, kh\u00f4ng n\u00e2ng c\u1ea5p)",
      "\u1ed4 c\u1ee9ng": "1TB PCIe Gen4 NVMe M.2 SSD",
      "Card \u0111\u1ed3 h\u1ecda": "Intel Arc Graphics (t\u00edch h\u1ee3p)",
      "M\u00e0n h\u00ecnh": "14 inch 3K (2880 x 1800), OLED, 120Hz, 400nits, 100% DCI-P3, Pantone Validated, VESA DisplayHDR True Black 600",
      "H\u1ec7 \u0111i\u1ec1u h\u00e0nh": "Windows 11 Home",
      "Pin": "75WHrs, 4 cell Li-polymer",
      "Tr\u1ecdng l\u01b0\u1ee3ng": "1.2 kg",
      "B\u00e0n ph\u00edm": "Backlit, h\u00e0nh tr\u00ecnh ph\u00edm 1.4mm, ASUS ErgoSense",
      "C\u1ed5ng k\u1ebft n\u1ed1i": "1x Thunderbolt 4 / USB-C (s\u1ea1c, DisplayPort), 1x USB-C 3.2 Gen2 (s\u1ea1c, DisplayPort), 1x USB-A 3.2 Gen2, 1x HDMI 2.1, 1x MicroSD card reader",
      "WiFi": "Wi-Fi 6E (802.11ax), Bluetooth 5.3",
      "Loa": "Harman Kardon Dual speaker, Dolby Atmos",
      "Webcam": "1080p FHD + IR Camera (Windows Hello)",
      "B\u1ea3o h\u00e0nh": "24 th\u00e1ng ch\u00ednh h\u00e3ng ASUS Vi\u1ec7t Nam"
    },
    "is_published": true,
    "created_at": "2026-06-15T14:37:04.273939+07:00",
    "updated_at": "2026-06-15T14:37:04.273939+07:00"
  },
  {
    "id": "9f1295ba-f8a1-4f61-9dee-f12d4f60147e",
    "name": "B\u00e0n ph\u00edm c\u01a1 Corsair K70 RGB PRO Cherry MX Red",
    "slug": "ban-phim-corsair-k70-rgb-pro-cherry",
    "description": "S\u1ea3n ph\u1ea9m kh\u00f4i ph\u1ee5c t\u1ef1 \u0111\u1ed9ng.",
    "category_id": "05ced308-c726-4003-820d-c8359e025afc",
    "brand_id": "7a508659-0944-40ea-8cb7-bf5d76c797bc",
    "specifications": {},
    "is_published": true,
    "created_at": "2026-06-15T14:37:04.273939+07:00",
    "updated_at": "2026-06-15T14:37:04.273939+07:00"
  },
  {
    "id": "50118b77-7023-42d9-966d-091da8c12c9d",
    "name": "Corsair K70 RGB",
    "slug": "corsair-k70-rgb",
    "description": "S\u1ea3n ph\u1ea9m kh\u00f4i ph\u1ee5c t\u1ef1 \u0111\u1ed9ng.",
    "category_id": "05ced308-c726-4003-820d-c8359e025afc",
    "brand_id": "7a508659-0944-40ea-8cb7-bf5d76c797bc",
    "specifications": {},
    "is_published": true,
    "created_at": "2026-06-15T14:37:04.273939+07:00",
    "updated_at": "2026-06-15T14:37:04.273939+07:00"
  },
  {
    "id": "1cc36166-2e7e-4e74-85ee-b64316ffde03",
    "name": "Card M\u00e0n H\u00ecnh ASUS ROG Strix GeForce RTX 4090 OC Edition 24GB",
    "slug": "vga-asus-rog-strix-rtx-4090",
    "description": "S\u1ea3n ph\u1ea9m kh\u00f4i ph\u1ee5c t\u1ef1 \u0111\u1ed9ng.",
    "category_id": "9de67045-2957-43a8-9178-be675e3cbfff",
    "brand_id": "0eacc349-0eb7-44be-a970-310b68cbe645",
    "specifications": {},
    "is_published": true,
    "created_at": "2026-06-15T14:37:04.273939+07:00",
    "updated_at": "2026-06-15T14:37:04.273939+07:00"
  },
  {
    "id": "7a576cbd-2a4f-4d90-83c0-9cea2ae00b92",
    "name": "Laptop Gaming ASUS TUF Gaming A15",
    "slug": "asus-tuf-gaming-a15",
    "description": "B\u1ec1n b\u1ec9 chu\u1ea9n qu\u00e2n \u0111\u1ed9i MIL-STD-810H. Thi\u1ebft k\u1ebf g\u00f3c c\u1ea1nh m\u1ea1nh m\u1ebd, vi\u00ean pin dung l\u01b0\u1ee3ng l\u1edbn 90Wh c\u00f9ng c\u1ea5u h\u00ecnh RTX th\u1ebf h\u1ec7 40 series cho kh\u1ea3 n\u0103ng chi\u1ebfn game AAA \u1edf m\u1ee9c thi\u1ebft l\u1eadp cao.",
    "category_id": "9ae4a892-6898-469f-9596-969e024ecad3",
    "brand_id": "0eacc349-0eb7-44be-a970-310b68cbe645",
    "specifications": {
      "CPU": "AMD Ryzen 7 8845HS (8 nh\u00e2n, 16 lu\u1ed3ng, xung nh\u1ecbp l\u00ean \u0111\u1ebfn 5.1GHz, 16MB Cache, Zen 4)",
      "RAM": "16GB DDR5 5600MHz (2 khe, n\u00e2ng c\u1ea5p t\u1ed1i \u0111a 32GB)",
      "\u1ed4 c\u1ee9ng": "512GB PCIe Gen4 NVMe M.2 SSD (c\u00f2n 1 khe M.2 tr\u1ed1ng)",
      "Card \u0111\u1ed3 h\u1ecda": "NVIDIA GeForce RTX 4060 8GB GDDR6",
      "M\u00e0n h\u00ecnh": "15.6 inch FHD (1920 x 1080), 144Hz, IPS, 250nits, Adaptive-Sync",
      "H\u1ec7 \u0111i\u1ec1u h\u00e0nh": "Windows 11 Home",
      "Pin": "90WHrs, 4 cell Li-ion",
      "Tr\u1ecdng l\u01b0\u1ee3ng": "2.2 kg",
      "B\u00e0n ph\u00edm": "RGB Backlit 1-Zone, b\u00e0n ph\u00edm s\u1ed1",
      "C\u1ed5ng k\u1ebft n\u1ed1i": "1x USB-C 3.2 Gen2 (DisplayPort), 2x USB-A 3.2 Gen1, 1x HDMI 2.1, 1x RJ45 LAN, 1x 3.5mm audio",
      "WiFi": "Wi-Fi 6 (802.11ax), Bluetooth 5.3",
      "T\u1ea3n nhi\u1ec7t": "TUF Gaming Cooling, qu\u1ea1t 84-blade Arc Flow, t\u1ea3n nhi\u1ec7t Self-cleaning",
      "Ti\u00eau chu\u1ea9n qu\u00e2n \u0111\u1ed9i": "MIL-STD-810H",
      "B\u1ea3o h\u00e0nh": "24 th\u00e1ng ch\u00ednh h\u00e3ng ASUS Vi\u1ec7t Nam"
    },
    "is_published": true,
    "created_at": "2026-06-15T14:37:04.273939+07:00",
    "updated_at": "2026-06-15T14:37:04.273939+07:00"
  },
  {
    "id": "abdddb28-5121-4510-8e16-2f70e5f6fc5a",
    "name": "Laptop Gaming ASUS ROG Strix G16 G614JV",
    "slug": "asus-rog-strix-g16-g614jv",
    "description": "ASUS ROG Strix G16 mang \u0111\u1ebfn hi\u1ec7u n\u0103ng \u0111\u1ec9nh cao v\u1edbi CPU Intel Core i7 th\u1ebf h\u1ec7 13 v\u00e0 GPU NVIDIA GeForce RTX 4060. H\u1ec7 th\u1ed1ng t\u1ea3n nhi\u1ec7t th\u00f4ng minh ROG Intelligent Cooling gi\u00fap duy tr\u00ec nhi\u1ec7t \u0111\u1ed9 t\u1ed1i \u01b0u, \u0111\u1ea3m b\u1ea3o hi\u1ec7u su\u1ea5t ch\u01a1i game m\u01b0\u1ee3t m\u00e0 kh\u00f4ng b\u1ecb gi\u00e1n \u0111o\u1ea1n.",
    "category_id": "9ae4a892-6898-469f-9596-969e024ecad3",
    "brand_id": "0eacc349-0eb7-44be-a970-310b68cbe645",
    "specifications": {
      "CPU": "Intel Core i7-13650HX (14 nh\u00e2n, 20 lu\u1ed3ng, xung nh\u1ecbp l\u00ean \u0111\u1ebfn 4.9GHz, 30MB Cache)",
      "RAM": "16GB DDR5 4800MHz (2 khe, n\u00e2ng c\u1ea5p t\u1ed1i \u0111a 32GB)",
      "\u1ed4 c\u1ee9ng": "512GB PCIe Gen4 NVMe M.2 SSD (c\u00f2n 1 khe M.2 tr\u1ed1ng)",
      "Card \u0111\u1ed3 h\u1ecda": "NVIDIA GeForce RTX 4060 8GB GDDR6",
      "M\u00e0n h\u00ecnh": "16 inch FHD+ (1920 x 1200), 165Hz, IPS, 250nits, 100% sRGB",
      "H\u1ec7 \u0111i\u1ec1u h\u00e0nh": "Windows 11 Home",
      "Pin": "90WHrs, 4 cell Li-ion",
      "Tr\u1ecdng l\u01b0\u1ee3ng": "2.5 kg",
      "B\u00e0n ph\u00edm": "RGB Backlit 4-Zone, b\u00e0n ph\u00edm s\u1ed1",
      "C\u1ed5ng k\u1ebft n\u1ed1i": "1x USB 3.2 Gen2 Type-C (DisplayPort), 2x USB 3.2 Gen1 Type-A, 1x HDMI 2.1, 1x RJ45 LAN, 1x 3.5mm combo audio",
      "WiFi": "Wi-Fi 6 (802.11ax), Bluetooth 5.2",
      "T\u1ea3n nhi\u1ec7t": "ROG Intelligent Cooling, 2 qu\u1ea1t Arc Flow, \u1ed1ng d\u1eabn nhi\u1ec7t k\u00e9p",
      "B\u1ea3o h\u00e0nh": "24 th\u00e1ng ch\u00ednh h\u00e3ng ASUS Vi\u1ec7t Nam"
    },
    "is_published": true,
    "created_at": "2026-06-15T14:37:04.273939+07:00",
    "updated_at": "2026-06-15T14:37:04.273939+07:00"
  },
  {
    "id": "b128197e-48a5-40aa-8418-2f5155d74b1c",
    "name": "Laptop Dell XPS 13 9340",
    "slug": "dell-xps-13-9340",
    "description": "Thi\u1ebft k\u1ebf t\u1ed1i gi\u1ea3n th\u1eddi th\u01b0\u1ee3ng v\u1edbi nh\u00f4m c\u1eaft CNC nguy\u00ean kh\u1ed1i, b\u00e0n ph\u00edm tr\u00e0n vi\u1ec1n v\u00e0 thanh touchbar c\u1ea3m \u1ee9ng l\u1ef1c \u0111\u1ed9c \u0111\u00e1o. XPS 13 l\u00e0 bi\u1ec3u t\u01b0\u1ee3ng c\u1ee7a doanh nh\u00e2n th\u00e0nh \u0111\u1ea1t.",
    "category_id": "f13dc502-a309-4021-89e0-f4276458635d",
    "brand_id": "68c582d5-cfdf-4d5d-9c28-d3f4eac3a614",
    "specifications": {
      "CPU": "Intel Core Ultra 7 155H (16 nh\u00e2n, 22 lu\u1ed3ng, xung nh\u1ecbp l\u00ean \u0111\u1ebfn 4.8GHz, 24MB Cache, t\u00edch h\u1ee3p NPU AI)",
      "RAM": "16GB LPDDR5X 7467MHz (Onboard, kh\u00f4ng n\u00e2ng c\u1ea5p)",
      "\u1ed4 c\u1ee9ng": "512GB PCIe Gen4 NVMe M.2 SSD",
      "Card \u0111\u1ed3 h\u1ecda": "Intel Arc Graphics (t\u00edch h\u1ee3p)",
      "M\u00e0n h\u00ecnh": "13.4 inch FHD+ (1920 x 1200), Touch, 500nits, Anti-Reflective, 100% sRGB, Corning Gorilla Glass",
      "H\u1ec7 \u0111i\u1ec1u h\u00e0nh": "Windows 11 Home",
      "Pin": "55WHrs, 2 cell, s\u1ea1c nhanh ExpressCharge",
      "Tr\u1ecdng l\u01b0\u1ee3ng": "1.17 kg",
      "B\u00e0n ph\u00edm": "Backlit, h\u00e0nh tr\u00ecnh ph\u00edm 1mm, b\u00e0n ph\u00edm tr\u00e0n vi\u1ec1n",
      "C\u1ed5ng k\u1ebft n\u1ed1i": "2x Thunderbolt 4 / USB-C (s\u1ea1c, DisplayPort 1.4, USB 4)",
      "WiFi": "Wi-Fi 7 (802.11be), Bluetooth 5.4",
      "Loa": "Dual speaker, Dolby Atmos",
      "Webcam": "1080p FHD + IR Camera (Windows Hello)",
      "B\u1ea3o h\u00e0nh": "12 th\u00e1ng ch\u00ednh h\u00e3ng Dell Vi\u1ec7t Nam"
    },
    "is_published": true,
    "created_at": "2026-06-15T14:37:04.273939+07:00",
    "updated_at": "2026-06-15T14:37:04.273939+07:00"
  },
  {
    "id": "cebd09e6-1f74-4557-8a96-414f6a5f949d",
    "name": "Laptop Gaming MSI Katana 15 B13VGK",
    "slug": "msi-katana-15-b13vgk",
    "description": "\u0110\u01b0\u1ee3c r\u00e8n gi\u0169a nh\u01b0 m\u1ed9t l\u01b0\u1ee1i ki\u1ebfm Katana th\u1ef1c th\u1ee5, MSI Katana 15 trang b\u1ecb c\u1ea5u h\u00ecnh si\u00eau kh\u1ee7ng v\u1edbi RTX 4070 c\u00f9ng b\u1ed9 vi x\u1eed l\u00fd Intel Core i7 th\u1ebf h\u1ec7 13, mang \u0111\u1ebfn tr\u1ea3i nghi\u1ec7m \u0111\u1ed3 h\u1ecda tuy\u1ec7t v\u1eddi cho game th\u1ee7 v\u00e0 nh\u00e0 s\u00e1ng t\u1ea1o n\u1ed9i dung.",
    "category_id": "9ae4a892-6898-469f-9596-969e024ecad3",
    "brand_id": "c63a919f-5938-460c-9b8b-e90cd66b1291",
    "specifications": {
      "CPU": "Intel Core i7-13620H (10 nh\u00e2n, 16 lu\u1ed3ng, xung nh\u1ecbp l\u00ean \u0111\u1ebfn 4.9GHz, 24MB Cache)",
      "RAM": "16GB DDR5 4800MHz (2 khe, n\u00e2ng c\u1ea5p t\u1ed1i \u0111a 64GB)",
      "\u1ed4 c\u1ee9ng": "1TB PCIe Gen4 NVMe M.2 SSD",
      "Card \u0111\u1ed3 h\u1ecda": "NVIDIA GeForce RTX 4070 8GB GDDR6",
      "M\u00e0n h\u00ecnh": "15.6 inch FHD (1920 x 1080), 144Hz, IPS, 45% NTSC",
      "H\u1ec7 \u0111i\u1ec1u h\u00e0nh": "Windows 11 Home",
      "Pin": "53.5WHrs, 3 cell Li-ion",
      "Tr\u1ecdng l\u01b0\u1ee3ng": "2.25 kg",
      "B\u00e0n ph\u00edm": "White Backlit, b\u00e0n ph\u00edm s\u1ed1",
      "C\u1ed5ng k\u1ebft n\u1ed1i": "1x USB-C 3.2 Gen1 (DisplayPort), 2x USB 3.2 Gen1 Type-A, 1x HDMI 2.1, 1x RJ45 LAN, 1x 3.5mm audio",
      "WiFi": "Wi-Fi 6 (802.11ax), Bluetooth 5.2",
      "T\u1ea3n nhi\u1ec7t": "Cooler Boost 5, 2 qu\u1ea1t, 6 \u1ed1ng \u0111\u1ed3ng",
      "B\u1ea3o h\u00e0nh": "24 th\u00e1ng ch\u00ednh h\u00e3ng MSI Vi\u1ec7t Nam"
    },
    "is_published": true,
    "created_at": "2026-06-15T14:37:04.273939+07:00",
    "updated_at": "2026-06-15T14:37:04.273939+07:00"
  },
  {
    "id": "d69649a1-2f8b-4485-863e-431c17ec18fb",
    "name": "Apple MacBook Pro 14 M3",
    "slug": "apple-macbook-pro-14-m3",
    "description": "Si\u00eau ph\u1ea9m m\u00e1y t\u00ednh x\u00e1ch tay cao c\u1ea5p d\u00e0nh cho d\u00e2n s\u00e1ng t\u1ea1o n\u1ed9i dung, l\u1eadp tr\u00ecnh vi\u00ean. Chip M3 mang \u0111\u1ebfn hi\u1ec7u su\u1ea5t v\u01b0\u1ee3t tr\u1ed9i c\u00f9ng th\u1eddi l\u01b0\u1ee3ng pin l\u00ean \u0111\u1ebfn 22 gi\u1edd. M\u00e0n h\u00ecnh Liquid Retina XDR \u0111\u1eb9p xu\u1ea5t s\u1eafc.",
    "category_id": "f13dc502-a309-4021-89e0-f4276458635d",
    "brand_id": "69669bfa-bf86-496f-84f0-ef8b6d212c21",
    "specifications": {
      "CPU": "Apple M3 (8 nh\u00e2n CPU: 4 hi\u1ec7u n\u0103ng + 4 ti\u1ebft ki\u1ec7m, 10 nh\u00e2n GPU, 16 nh\u00e2n Neural Engine)",
      "RAM": "8GB Unified Memory (B\u1ed9 nh\u1edb h\u1ee3p nh\u1ea5t, b\u0103ng th\u00f4ng 100GB/s)",
      "\u1ed4 c\u1ee9ng": "512GB SSD",
      "Card \u0111\u1ed3 h\u1ecda": "Apple M3 10-Core GPU (t\u00edch h\u1ee3p, h\u1ed7 tr\u1ee3 Ray Tracing ph\u1ea7n c\u1ee9ng)",
      "M\u00e0n h\u00ecnh": "14.2 inch Liquid Retina XDR (3024 x 1964), 120Hz ProMotion, 1000nits SDR / 1600nits HDR, P3 Wide Color",
      "H\u1ec7 \u0111i\u1ec1u h\u00e0nh": "macOS Sonoma",
      "Pin": "L\u00ean \u0111\u1ebfn 22 gi\u1edd ph\u00e1t video, 72.4WHrs Li-polymer",
      "Tr\u1ecdng l\u01b0\u1ee3ng": "1.55 kg",
      "B\u00e0n ph\u00edm": "Magic Keyboard v\u1edbi Touch ID, Backlit, h\u00e0nh tr\u00ecnh ph\u00edm 1mm",
      "C\u1ed5ng k\u1ebft n\u1ed1i": "2x Thunderbolt 4 / USB 4 (s\u1ea1c, DisplayPort, USB 4), 1x HDMI 2.1, 1x SDXC card slot, 1x MagSafe 3, 1x 3.5mm headphone jack",
      "WiFi": "Wi-Fi 6E (802.11ax), Bluetooth 5.3",
      "Loa": "H\u1ec7 th\u1ed1ng 6 loa Hi-Fi, h\u1ed7 tr\u1ee3 Spatial Audio v\u1edbi Dolby Atmos",
      "Webcam": "1080p FaceTime HD Camera",
      "B\u1ea3o h\u00e0nh": "12 th\u00e1ng ch\u00ednh h\u00e3ng Apple Vi\u1ec7t Nam"
    },
    "is_published": true,
    "created_at": "2026-06-15T14:37:04.273939+07:00",
    "updated_at": "2026-06-15T14:37:04.273939+07:00"
  },
  {
    "id": "a9b3ffcc-22f1-40d7-b8af-f84b5602edc3",
    "name": "B\u00e0n ph\u00edm c\u01a1 Razer Huntsman V2 Analog",
    "slug": "ban-phim-razer-huntsman-v2-analog",
    "description": "S\u1ea3n ph\u1ea9m kh\u00f4i ph\u1ee5c t\u1ef1 \u0111\u1ed9ng.",
    "category_id": "05ced308-c726-4003-820d-c8359e025afc",
    "brand_id": "b40cdaaf-c0b3-4b09-af44-440da0f542a3",
    "specifications": {},
    "is_published": true,
    "created_at": "2026-06-15T14:37:04.273939+07:00",
    "updated_at": "2026-06-15T14:37:04.273939+07:00"
  },
  {
    "id": "f832c1a6-3d27-4529-8987-091da207d632",
    "name": "Laptop Gaming HP Victus 16-r0129TX",
    "slug": "hp-victus-16-r0129tx",
    "description": "Mang d\u00e1ng v\u1ebb thanh l\u1ecbch kh\u00f4ng qu\u00e1 h\u1ea7m h\u1ed1, HP Victus 16 ph\u00f9 h\u1ee3p cho c\u1ea3 nhu c\u1ea7u h\u1ecdc t\u1eadp, l\u00e0m vi\u1ec7c v\u0103n ph\u00f2ng l\u1eabn tr\u1ea3i nghi\u1ec7m gaming gi\u1ea3i tr\u00ed \u0111\u1ec9nh cao nh\u1edd card r\u1eddi RTX 4050.",
    "category_id": "9ae4a892-6898-469f-9596-969e024ecad3",
    "brand_id": "48de0310-95de-4e8f-b185-ecd3f1334799",
    "specifications": {
      "CPU": "Intel Core i5-13500H (12 nh\u00e2n, 16 lu\u1ed3ng, xung nh\u1ecbp l\u00ean \u0111\u1ebfn 4.7GHz, 18MB Cache)",
      "RAM": "16GB DDR5 5200MHz (2 khe, n\u00e2ng c\u1ea5p t\u1ed1i \u0111a 32GB)",
      "\u1ed4 c\u1ee9ng": "512GB PCIe Gen4 NVMe M.2 SSD",
      "Card \u0111\u1ed3 h\u1ecda": "NVIDIA GeForce RTX 4050 6GB GDDR6",
      "M\u00e0n h\u00ecnh": "16.1 inch FHD (1920 x 1080), 144Hz, IPS, 250nits, 45% NTSC",
      "H\u1ec7 \u0111i\u1ec1u h\u00e0nh": "Windows 11 Home",
      "Pin": "70WHrs, 4 cell Li-ion",
      "Tr\u1ecdng l\u01b0\u1ee3ng": "2.3 kg",
      "B\u00e0n ph\u00edm": "White Backlit, b\u00e0n ph\u00edm s\u1ed1",
      "C\u1ed5ng k\u1ebft n\u1ed1i": "1x USB-C 3.2 Gen1 (DisplayPort 1.4), 1x USB-A 3.2 Gen1, 1x USB-A 2.0, 1x HDMI 2.1, 1x RJ45 LAN, 1x 3.5mm audio",
      "WiFi": "Wi-Fi 6 (802.11ax), Bluetooth 5.3",
      "T\u1ea3n nhi\u1ec7t": "HP OMEN Tempest Cooling, qu\u1ea1t k\u00e9p",
      "B\u1ea3o h\u00e0nh": "12 th\u00e1ng ch\u00ednh h\u00e3ng HP Vi\u1ec7t Nam"
    },
    "is_published": true,
    "created_at": "2026-06-15T14:37:04.273939+07:00",
    "updated_at": "2026-06-15T14:37:04.273939+07:00"
  },
  {
    "id": "add61a47-0679-406e-9a61-1d94e78b818a",
    "name": "Ngu\u1ed3n Corsair RM850e 850W",
    "slug": "nguon-corsair-rm850e-850w",
    "description": "Ngu\u1ed3n m\u00e1y t\u00ednh Corsair RM850e 850W chu\u1ea9n 80 Plus Gold Fully Modular mang \u0111\u1ebfn n\u0103ng l\u01b0\u1ee3ng s\u1ea1ch, \u1ed5n \u0111\u1ecbnh v\u00e0 hi\u1ec7u su\u1ea5t cao cho h\u1ec7 th\u1ed1ng c\u1ee7a b\u1ea1n.",
    "category_id": "1cadbb93-661c-445a-bba6-f8a469e61b7c",
    "brand_id": "7a508659-0944-40ea-8cb7-bf5d76c797bc",
    "specifications": {
      "C\u00f4ng su\u1ea5t": "850W",
      "Chu\u1ea9n": "80 Plus Gold",
      "Lo\u1ea1i c\u00e1p": "Fully Modular",
      "K\u00edch th\u01b0\u1edbc qu\u1ea1t": "120mm"
    },
    "is_published": true,
    "created_at": "2026-06-15T14:37:04.273939+07:00",
    "updated_at": "2026-06-15T14:37:04.273939+07:00"
  },
  {
    "id": "3aef8961-342a-4381-a1e1-ba366519d89e",
    "name": "T\u1ea3n nhi\u1ec7t n\u01b0\u1edbc NZXT Kraken Elite 360",
    "slug": "tan-nhiet-nuoc-nzxt-kraken-elite-360",
    "description": "T\u1ea3n nhi\u1ec7t n\u01b0\u1edbc AIO cao c\u1ea5p NZXT Kraken Elite 360 v\u1edbi m\u00e0n h\u00ecnh LCD 2.36 inch s\u1eafc n\u00e9t hi\u1ec3n th\u1ecb th\u00f4ng tin h\u1ec7 th\u1ed1ng ho\u1eb7c \u1ea3nh GIF t\u00f9y ch\u1ec9nh.",
    "category_id": "1cadbb93-661c-445a-bba6-f8a469e61b7c",
    "brand_id": "b08bb8ef-402c-44e1-beb9-65f279d3b61b",
    "specifications": {
      "Lo\u1ea1i t\u1ea3n": "T\u1ea3n nhi\u1ec7t n\u01b0\u1edbc AIO",
      "K\u00edch th\u01b0\u1edbc Rad": "360mm",
      "Qu\u1ea1t": "3 x 120mm PWM",
      "M\u00e0n h\u00ecnh": "LCD 2.36 inch"
    },
    "is_published": true,
    "created_at": "2026-06-15T14:37:04.273939+07:00",
    "updated_at": "2026-06-15T14:37:04.273939+07:00"
  },
  {
    "id": "5b86f872-f21f-4e07-a1bd-84de9cbfe85f",
    "name": "Case NZXT H9 Flow",
    "slug": "case-nzxt-h9-flow",
    "description": "Case NZXT H9 Flow c\u00f3 thi\u1ebft k\u1ebf bu\u1ed3ng \u0111\u00f4i r\u1ed9ng r\u00e3i, k\u00ednh c\u01b0\u1eddng l\u1ef1c li\u1ec1n m\u1ea1ch cho c\u00e1i nh\u00ecn to\u00e0n c\u1ea3nh linh ki\u1ec7n b\u00ean trong, c\u00f9ng lu\u1ed3ng kh\u00ed l\u01b0u th\u00f4ng \u1ea5n t\u01b0\u1ee3ng.",
    "category_id": "1cadbb93-661c-445a-bba6-f8a469e61b7c",
    "brand_id": "b08bb8ef-402c-44e1-beb9-65f279d3b61b",
    "specifications": {
      "Lo\u1ea1i": "Mid Tower bu\u1ed3ng \u0111\u00f4i",
      "K\u00ednh": "K\u00ednh c\u01b0\u1eddng l\u1ef1c 2 m\u1eb7t",
      "H\u1ed7 tr\u1ee3 t\u1ea3n": "L\u00ean \u0111\u1ebfn 360mm \u1edf nhi\u1ec1u v\u1ecb tr\u00ed"
    },
    "is_published": true,
    "created_at": "2026-06-15T14:37:04.273939+07:00",
    "updated_at": "2026-06-15T14:37:04.273939+07:00"
  },
  {
    "id": "8599736d-a766-4bc5-9034-af9257ac1131",
    "name": "Case Corsair 4000D Airflow",
    "slug": "case-corsair-4000d-airflow",
    "description": "Case Corsair 4000D Airflow l\u00e0 m\u1ed9t chi\u1ebfc case ATX mid-tower ho\u00e0n h\u1ea3o v\u1edbi lu\u1ed3ng kh\u00f4ng kh\u00ed m\u1ea1nh m\u1ebd v\u00e0 kh\u1ea3 n\u0103ng l\u00e0m m\u00e1t xu\u1ea5t s\u1eafc, \u0111i k\u00e8m m\u1eb7t tr\u01b0\u1edbc \u0111\u01b0\u1ee3c thi\u1ebft k\u1ebf d\u1ea1ng l\u01b0\u1edbi t\u1ed1i \u01b0u t\u1ea3n nhi\u1ec7t.",
    "category_id": "1cadbb93-661c-445a-bba6-f8a469e61b7c",
    "brand_id": "7a508659-0944-40ea-8cb7-bf5d76c797bc",
    "specifications": {
      "Lo\u1ea1i": "Mid Tower",
      "M\u00e0u s\u1eafc": "\u0110en/Tr\u1eafng",
      "H\u1ed7 tr\u1ee3 Mainboard": "ATX, Micro-ATX, Mini-ITX",
      "C\u1ed5ng k\u1ebft n\u1ed1i": "USB 3.0, Type-C"
    },
    "is_published": true,
    "created_at": "2026-06-15T14:37:04.273939+07:00",
    "updated_at": "2026-06-15T14:37:04.273939+07:00"
  },
  {
    "id": "6a090fcf-aca5-4a5b-badc-407519fc9ba3",
    "name": "Tai nghe Corsair HS80 RGB Wireless",
    "slug": "tai-nghe-corsair-hs80-rgb-wireless",
    "description": "Tai nghe gaming kh\u00f4ng d\u00e2y cao c\u1ea5p Corsair HS80 RGB Wireless mang \u0111\u1ebfn tr\u1ea3i nghi\u1ec7m \u00e2m thanh c\u1ef1c \u0111\u1ec9nh v\u1edbi c\u00f4ng ngh\u1ec7 SLIPSTREAM WIRELESS \u0111\u1ed9 tr\u1ec5 c\u1ef1c th\u1ea5p. Trang b\u1ecb c\u1ee7 loa neodymium 50mm t\u00f9y ch\u1ec9nh, mang \u0111\u1ebfn d\u1ea3i \u00e2m r\u1ed9ng v\u00e0 chi ti\u1ebft ho\u00e0n h\u1ea3o. H\u1ed7 tr\u1ee3 Dolby Atmos tr\u00ean PC gi\u00fap \u0111\u1ecbnh v\u1ecb \u00e2m thanh 3D s\u1ed1ng \u0111\u1ed9ng trong c\u00e1c t\u1ef1a game FPS. \u0110\u1ec7m tai b\u1eb1ng memory foam b\u1ecdc v\u1ea3i tho\u00e1ng kh\u00ed c\u1ef1c k\u1ef3 tho\u1ea3i m\u00e1i cho c\u00e1c session ch\u01a1i game k\u00e9o d\u00e0i.",
    "category_id": "c1923d9a-740e-4808-aa7e-87fd429e990a",
    "brand_id": "7a508659-0944-40ea-8cb7-bf5d76c797bc",
    "specifications": {
      "K\u1ebft n\u1ed1i": "Kh\u00f4ng d\u00e2y Slipstream / USB Type-C",
      "M\u00e0ng loa": "50mm Neodymium",
      "T\u1ea7n s\u1ed1 ph\u1ea3n h\u1ed3i": "20Hz - 40,000Hz",
      "Th\u1eddi l\u01b0\u1ee3ng pin": "L\u00ean \u0111\u1ebfn 20 gi\u1edd",
      "Microphone": "\u0110a h\u01b0\u1edbng c\u1ea5p \u0111\u1ed9 ph\u00e1t thanh (Omni-directional broadcast-grade)",
      "T\u01b0\u01a1ng th\u00edch": "PC, Mac, PS5, PS4"
    },
    "is_published": true,
    "created_at": "2026-06-15T14:37:04.273939+07:00",
    "updated_at": "2026-06-15T14:37:04.273939+07:00"
  },
  {
    "id": "a1cfa90b-a3ea-49dd-8bd6-bd0ba2d3bc5b",
    "name": "Tai nghe SteelSeries Arctis Nova Pro",
    "slug": "tai-nghe-steelseries-arctis-nova-pro",
    "description": "H\u1ec7 th\u1ed1ng \u00e2m thanh Arctis Nova Pro mang \u0111\u1ebfn tr\u1ea3i nghi\u1ec7m Almighty Audio ho\u00e0n h\u1ea3o, t\u00edch h\u1ee3p DAC r\u1eddi (GameDAC Gen 2) chu\u1ea9n Hi-Res. Thi\u1ebft k\u1ebf ComfortMAX ho\u00e0n to\u00e0n m\u1edbi ph\u00f9 h\u1ee3p v\u1edbi m\u1ecdi k\u00edch c\u1ee1 \u0111\u1ea7u v\u1edbi khung th\u00e9p ch\u1eafc ch\u1eafn nh\u01b0ng nh\u1eb9 nh\u00e0ng. H\u1ec7 th\u1ed1ng micro kh\u1eed ti\u1ebfng \u1ed3n b\u1eb1ng AI ClearCast Gen 2 lo\u1ea1i b\u1ecf ho\u00e0n to\u00e0n t\u1ea1p \u00e2m t\u1eeb m\u00f4i tr\u01b0\u1eddng.",
    "category_id": "c1923d9a-740e-4808-aa7e-87fd429e990a",
    "brand_id": "31bffa70-e26f-4965-941b-cb4b3021502b",
    "specifications": {
      "K\u1ebft n\u1ed1i": "C\u00f3 d\u00e2y (USB-C to USB-A/USB-C), k\u00e8m GameDAC Gen 2",
      "M\u00e0ng loa": "40mm Neodymium cao c\u1ea5p",
      "T\u1ea7n s\u1ed1": "10Hz - 40,000Hz",
      "Tr\u1edf kh\u00e1ng": "38 Ohm",
      "C\u00f4ng ngh\u1ec7 \u00e2m thanh": "Chu\u1ea9n Hi-Res 96KHz/24-Bit / 360\u00b0 Spatial Audio",
      "Microphone": "Ch\u1ed1ng \u1ed3n AI, thu g\u1ecdn v\u00e0o c\u1ee7 tai"
    },
    "is_published": true,
    "created_at": "2026-06-15T14:37:04.273939+07:00",
    "updated_at": "2026-06-15T14:37:04.273939+07:00"
  },
  {
    "id": "d9448278-2754-4a49-9f58-25dff1a926f3",
    "name": "Tai nghe Razer BlackShark V2",
    "slug": "tai-nghe-razer-blackshark-v2",
    "description": "Tr\u1ea3i nghi\u1ec7m eSports chuy\u00ean nghi\u1ec7p v\u1edbi Razer BlackShark V2. S\u1eed d\u1ee5ng driver Razer\u2122 TriForce Titanium 50mm chia l\u00e0m 3 ph\u1ea7n ri\u00eang bi\u1ec7t cho \u00e2m tr\u1ea7m, trung v\u00e0 cao, mang l\u1ea1i \u00e2m thanh s\u00e1ng, r\u00f5 n\u00e9t. \u0110i k\u00e8m USB Sound Card cao c\u1ea5p cho ph\u00e9p tinh ch\u1ec9nh qua Razer Synapse v\u00e0 micro Razer HyperClear Cardioid cho gi\u1ecdng n\u00f3i trong tr\u1ebbo.",
    "category_id": "c1923d9a-740e-4808-aa7e-87fd429e990a",
    "brand_id": "b40cdaaf-c0b3-4b09-af44-440da0f542a3",
    "specifications": {
      "K\u1ebft n\u1ed1i": "Jack 3.5mm / USB Sound Card",
      "M\u00e0ng loa": "50mm TriForce Titanium",
      "T\u1ea7n s\u1ed1": "12Hz - 28,000Hz",
      "Tr\u1ecdng l\u01b0\u1ee3ng": "Si\u00eau nh\u1eb9 240g",
      "C\u00f4ng ngh\u1ec7": "THX Spatial Audio",
      "\u0110\u1ec7m tai": "FlowKnit Memory Foam"
    },
    "is_published": true,
    "created_at": "2026-06-15T14:37:04.273939+07:00",
    "updated_at": "2026-06-15T14:37:04.273939+07:00"
  },
  {
    "id": "d691360a-785f-4f85-8e70-cc1dcadedf43",
    "name": "Webcam Logitech Brio 4K Ultra HD",
    "slug": "webcam-logitech-brio-4k",
    "description": "S\u1ea3n ph\u1ea9m kh\u00f4i ph\u1ee5c t\u1ef1 \u0111\u1ed9ng.",
    "category_id": "dddb3535-7ef9-41ee-ba29-bd6b67f91a9c",
    "brand_id": "a0d8f24b-6880-4d92-aeed-f71afb813fac",
    "specifications": {},
    "is_published": true,
    "created_at": "2026-06-15T14:37:04.273939+07:00",
    "updated_at": "2026-06-15T14:37:04.273939+07:00"
  },
  {
    "id": "5c911bcb-713b-480c-8a57-8ed727c9dd86",
    "name": "Loa M\u00e1y T\u00ednh Logitech G560 LIGHTSYNC PC Gaming",
    "slug": "loa-logitech-g560",
    "description": "S\u1ea3n ph\u1ea9m kh\u00f4i ph\u1ee5c t\u1ef1 \u0111\u1ed9ng.",
    "category_id": "dddb3535-7ef9-41ee-ba29-bd6b67f91a9c",
    "brand_id": "a0d8f24b-6880-4d92-aeed-f71afb813fac",
    "specifications": {},
    "is_published": true,
    "created_at": "2026-06-15T14:37:04.273939+07:00",
    "updated_at": "2026-06-15T14:37:04.273939+07:00"
  },
  {
    "id": "2eb35990-22ec-440e-8fcd-d7dddfcfede5",
    "name": "M\u00e0n h\u00ecnh LG UltraGear 27GR95QE-B 27 inch OLED 240Hz",
    "slug": "man-hinh-lg-ultragear-27",
    "description": "S\u1ea3n ph\u1ea9m kh\u00f4i ph\u1ee5c t\u1ef1 \u0111\u1ed9ng.",
    "category_id": "5d452037-725f-43c6-bbb9-72ceae06bab1",
    "brand_id": "0eacc349-0eb7-44be-a970-310b68cbe645",
    "specifications": {},
    "is_published": true,
    "created_at": "2026-06-15T14:37:04.273939+07:00",
    "updated_at": "2026-06-15T14:37:04.273939+07:00"
  },
  {
    "id": "adafff4d-d064-444d-aece-1f5150af3b03",
    "name": "M\u00e0n h\u00ecnh ASUS ROG Swift 360Hz PG259QN",
    "slug": "man-hinh-asus-rog-swift-360hz",
    "description": "S\u1ea3n ph\u1ea9m kh\u00f4i ph\u1ee5c t\u1ef1 \u0111\u1ed9ng.",
    "category_id": "5d452037-725f-43c6-bbb9-72ceae06bab1",
    "brand_id": "0eacc349-0eb7-44be-a970-310b68cbe645",
    "specifications": {},
    "is_published": true,
    "created_at": "2026-06-15T14:37:04.273939+07:00",
    "updated_at": "2026-06-15T14:37:04.273939+07:00"
  },
  {
    "id": "ba539d8b-7b56-49b9-8622-269819795978",
    "name": "Mainboard GIGABYTE Z790 AORUS ELITE AX",
    "slug": "mainboard-gigabyte-z790",
    "description": "S\u1ea3n ph\u1ea9m kh\u00f4i ph\u1ee5c t\u1ef1 \u0111\u1ed9ng.",
    "category_id": "9de67045-2957-43a8-9178-be675e3cbfff",
    "brand_id": "0eacc349-0eb7-44be-a970-310b68cbe645",
    "specifications": {},
    "is_published": true,
    "created_at": "2026-06-15T14:37:04.273939+07:00",
    "updated_at": "2026-06-15T14:37:04.273939+07:00"
  },
  {
    "id": "a64b8ab5-8093-4e54-a477-9897dc9ed69b",
    "name": "Case NZXT H9 Flow Dual-Chamber ATX Mid-Tower (\u0110en)",
    "slug": "case-nzxt-h9-flow-dual-chamber",
    "description": "S\u1ea3n ph\u1ea9m kh\u00f4i ph\u1ee5c t\u1ef1 \u0111\u1ed9ng.",
    "category_id": "1cadbb93-661c-445a-bba6-f8a469e61b7c",
    "brand_id": "b08bb8ef-402c-44e1-beb9-65f279d3b61b",
    "specifications": {},
    "is_published": true,
    "created_at": "2026-06-15T14:37:04.273939+07:00",
    "updated_at": "2026-06-15T14:37:04.273939+07:00"
  },
  {
    "id": "202d9bae-1a60-431e-80dc-6add19e0daa4",
    "name": "Ngu\u1ed3n m\u00e1y t\u00ednh Corsair RM1000x Shift 80 PLUS Gold",
    "slug": "nguon-corsair-rm1000x",
    "description": "S\u1ea3n ph\u1ea9m kh\u00f4i ph\u1ee5c t\u1ef1 \u0111\u1ed9ng.",
    "category_id": "1cadbb93-661c-445a-bba6-f8a469e61b7c",
    "brand_id": "7a508659-0944-40ea-8cb7-bf5d76c797bc",
    "specifications": {},
    "is_published": true,
    "created_at": "2026-06-15T14:37:04.273939+07:00",
    "updated_at": "2026-06-15T14:37:04.273939+07:00"
  },
  {
    "id": "400460c7-89dc-42db-8d70-d1d8aceeaf29",
    "name": "T\u1ea3n nhi\u1ec7t n\u01b0\u1edbc NZXT Kraken Elite 360 RGB",
    "slug": "tan-nhiet-nuoc-nzxt-kraken-elite-360-rgb",
    "description": "S\u1ea3n ph\u1ea9m kh\u00f4i ph\u1ee5c t\u1ef1 \u0111\u1ed9ng.",
    "category_id": "1cadbb93-661c-445a-bba6-f8a469e61b7c",
    "brand_id": "b08bb8ef-402c-44e1-beb9-65f279d3b61b",
    "specifications": {},
    "is_published": true,
    "created_at": "2026-06-15T14:37:04.273939+07:00",
    "updated_at": "2026-06-15T14:37:04.273939+07:00"
  },
  {
    "id": "c319f0de-a084-41fd-87a3-2672ae04504c",
    "name": "RAM Corsair Dominator Titanium RGB 64GB (2x32GB) DDR5 6000MHz",
    "slug": "ram-corsair-dominator-64gb",
    "description": "S\u1ea3n ph\u1ea9m kh\u00f4i ph\u1ee5c t\u1ef1 \u0111\u1ed9ng.",
    "category_id": "0ed3e760-d030-4dc9-9fa1-2be1e016ff94",
    "brand_id": "7a508659-0944-40ea-8cb7-bf5d76c797bc",
    "specifications": {},
    "is_published": true,
    "created_at": "2026-06-15T14:37:04.273939+07:00",
    "updated_at": "2026-06-15T14:37:04.273939+07:00"
  },
  {
    "id": "5d02b473-ed4a-4aa2-8f0c-b97fd2614548",
    "name": "CPU Intel Core i9-14900K",
    "slug": "cpu-intel-core-i9-14900k",
    "description": "S\u1ea3n ph\u1ea9m kh\u00f4i ph\u1ee5c t\u1ef1 \u0111\u1ed9ng.",
    "category_id": "9de67045-2957-43a8-9178-be675e3cbfff",
    "brand_id": "0eacc349-0eb7-44be-a970-310b68cbe645",
    "specifications": {},
    "is_published": true,
    "created_at": "2026-06-15T14:37:04.273939+07:00",
    "updated_at": "2026-06-15T14:37:04.273939+07:00"
  },
  {
    "id": "a792e3fd-8d80-4bae-9fa2-b27ee2802550",
    "name": "Chu\u1ed9t Kh\u00f4ng D\u00e2y Logitech G Pro X Superlight 2 (\u0110en)",
    "slug": "chuot-logitech-g-pro-x-superlight-2-den",
    "description": "S\u1ea3n ph\u1ea9m kh\u00f4i ph\u1ee5c t\u1ef1 \u0111\u1ed9ng.",
    "category_id": "86fe4a3f-1dc5-4c35-a20f-156ce680c143",
    "brand_id": "a0d8f24b-6880-4d92-aeed-f71afb813fac",
    "specifications": {},
    "is_published": true,
    "created_at": "2026-06-15T14:37:04.273939+07:00",
    "updated_at": "2026-06-15T14:37:04.273939+07:00"
  },
  {
    "id": "836f2252-b6af-49c8-9ae6-9cd1bb4e4d08",
    "name": "L\u00f3t chu\u1ed9t Razer Gigantus V2 - XXL",
    "slug": "lot-chuot-razer-gigantus-v2-xxl",
    "description": "S\u1ea3n ph\u1ea9m kh\u00f4i ph\u1ee5c t\u1ef1 \u0111\u1ed9ng.",
    "category_id": "86fe4a3f-1dc5-4c35-a20f-156ce680c143",
    "brand_id": "b40cdaaf-c0b3-4b09-af44-440da0f542a3",
    "specifications": {},
    "is_published": true,
    "created_at": "2026-06-15T14:37:04.273939+07:00",
    "updated_at": "2026-06-15T14:37:04.273939+07:00"
  },
  {
    "id": "ab0c44e9-031c-4c19-83c7-2f19a528731a",
    "name": "Tai nghe HyperX Cloud III Wireless",
    "slug": "tai-nghe-hyperx-cloud-iii-wireless",
    "description": "S\u1ea3n ph\u1ea9m kh\u00f4i ph\u1ee5c t\u1ef1 \u0111\u1ed9ng.",
    "category_id": "c1923d9a-740e-4808-aa7e-87fd429e990a",
    "brand_id": "4afffe0d-118d-424d-9a43-09a0276e7436",
    "specifications": {},
    "is_published": true,
    "created_at": "2026-06-15T14:37:04.273939+07:00",
    "updated_at": "2026-06-15T14:37:04.273939+07:00"
  },
  {
    "id": "e3aa86a2-05c2-4cea-8118-a9d18602e9d1",
    "name": "\u1ed4 c\u1ee9ng SSD Samsung 990 PRO 2TB PCIe Gen 4.0 x4 NVMe",
    "slug": "ssd-samsung-990-pro-2tb",
    "description": "S\u1ea3n ph\u1ea9m kh\u00f4i ph\u1ee5c t\u1ef1 \u0111\u1ed9ng.",
    "category_id": "0ed3e760-d030-4dc9-9fa1-2be1e016ff94",
    "brand_id": "0eacc349-0eb7-44be-a970-310b68cbe645",
    "specifications": {},
    "is_published": true,
    "created_at": "2026-06-15T14:37:04.273939+07:00",
    "updated_at": "2026-06-15T14:37:04.273939+07:00"
  },
  {
    "id": "df36d128-3a47-4b20-8fab-20f18fc2b8c8",
    "name": "M\u00e1y ch\u01a1i game Valve Steam Deck OLED 512GB",
    "slug": "may-choi-game-steam-deck-oled",
    "description": "S\u1ea3n ph\u1ea9m kh\u00f4i ph\u1ee5c t\u1ef1 \u0111\u1ed9ng.",
    "category_id": "1d7c2d15-db46-4f83-8f4d-1b59dea112b4",
    "brand_id": "0eacc349-0eb7-44be-a970-310b68cbe645",
    "specifications": {
      "CPU": "AMD APU 6nm (Zen 2 4 nh\u00e2n/8 lu\u1ed3ng, 2.4-3.5GHz)",
      "GPU": "8 RDNA 2 CUs, 1.0-1.6GHz",
      "RAM": "16 GB LPDDR5 (6400 MT/s)",
      "B\u1ed9 nh\u1edb trong": "512 GB NVMe SSD",
      "M\u00e0n h\u00ecnh": "7.4 inch OLED HDR, \u0111\u1ed9 ph\u00e2n gi\u1ea3i 1280 x 800, 90Hz",
      "\u0110\u1ed9 s\u00e1ng": "T\u1ed1i \u0111a 1000 nits (HDR)",
      "Pin": "50Whr",
      "K\u1ebft n\u1ed1i": "Wi-Fi 6E, Bluetooth 5.3, USB-C",
      "Tr\u1ecdng l\u01b0\u1ee3ng": "Kho\u1ea3ng 639g"
    },
    "is_published": true,
    "created_at": "2026-06-15T14:37:04.273939+07:00",
    "updated_at": "2026-06-15T14:37:04.273939+07:00"
  },
  {
    "id": "cd9de695-205a-4f4c-a1c2-6a130511ba09",
    "name": "M\u00e1y ch\u01a1i game Sony PlayStation 5 (PS5) Slim Standard",
    "slug": "may-choi-game-ps5-slim",
    "description": "S\u1ea3n ph\u1ea9m kh\u00f4i ph\u1ee5c t\u1ef1 \u0111\u1ed9ng.",
    "category_id": "1d7c2d15-db46-4f83-8f4d-1b59dea112b4",
    "brand_id": "0eacc349-0eb7-44be-a970-310b68cbe645",
    "specifications": {
      "CPU": "AMD Ryzen Zen 2 (8 nh\u00e2n/16 lu\u1ed3ng, 3.5 GHz)",
      "GPU": "AMD Radeon RDNA 2, 10.3 TFLOPS, 2.23 GHz",
      "RAM": "16GB GDDR6",
      "B\u1ed9 nh\u1edb trong": "1TB SSD (T\u1ed1c \u0111\u1ed9 \u0111\u1ecdc 5.5GB/s)",
      "\u1ed4 \u0111\u0129a quang": "Ultra HD Blu-ray",
      "K\u00edch th\u01b0\u1edbc": "358 x 96 x 216 mm",
      "Tr\u1ecdng l\u01b0\u1ee3ng": "Kho\u1ea3ng 3.2 kg",
      "C\u1ed5ng k\u1ebft n\u1ed1i": "2x USB-C, 2x USB-A, HDMI 2.1, LAN",
      "\u0110\u1ed9 ph\u00e2n gi\u1ea3i": "H\u1ed7 tr\u1ee3 4K 120Hz, 8K 60Hz"
    },
    "is_published": true,
    "created_at": "2026-06-15T14:37:04.273939+07:00",
    "updated_at": "2026-06-15T14:37:04.273939+07:00"
  },
  {
    "id": "ca5b7468-47d5-4c9e-bccc-dd5524c82e49",
    "name": "Gi\u00e1 treo tai nghe Razer Base Station V2 Chroma",
    "slug": "gia-treo-tai-nghe-razer-base-station",
    "description": "S\u1ea3n ph\u1ea9m kh\u00f4i ph\u1ee5c t\u1ef1 \u0111\u1ed9ng.",
    "category_id": "e1ab13a9-ec24-4d8a-84d2-25faca94e509",
    "brand_id": "b40cdaaf-c0b3-4b09-af44-440da0f542a3",
    "specifications": {},
    "is_published": true,
    "created_at": "2026-06-15T14:37:04.273939+07:00",
    "updated_at": "2026-06-15T14:37:04.273939+07:00"
  },
  {
    "id": "8c9f9097-99b8-4b11-b13f-235500b80aae",
    "name": "Balo Laptop Gaming ASUS ROG Ranger",
    "slug": "balo-laptop-gaming-asus-rog-ranger",
    "description": "Balo Laptop Gaming ASUS ROG Ranger BP2500G",
    "category_id": "e1ab13a9-ec24-4d8a-84d2-25faca94e509",
    "brand_id": null,
    "specifications": {},
    "is_published": true,
    "created_at": "2026-06-15T14:37:04.273939+07:00",
    "updated_at": "2026-06-15T14:37:04.273939+07:00"
  },
  {
    "id": "7b902cf4-50c8-4aa5-9167-1ae2b738bbd7",
    "name": "Laptop Gaming Asus ROG Strix G15",
    "slug": "laptop-gaming-asus-rog-strix-g15",
    "description": "S\u1ea3n ph\u1ea9m kh\u00f4i ph\u1ee5c t\u1ef1 \u0111\u1ed9ng.",
    "category_id": "9ae4a892-6898-469f-9596-969e024ecad3",
    "brand_id": "0eacc349-0eb7-44be-a970-310b68cbe645",
    "specifications": {
      "M\u00e0n h\u00ecnh": "15.6 inch FHD (1920 x 1080) 144Hz IPS",
      "CPU": "AMD Ryzen 7 4800H (8 nh\u00e2n/16 lu\u1ed3ng, 2.9GHz - 4.2GHz)",
      "GPU": "NVIDIA GeForce RTX 3050 4GB GDDR6",
      "RAM": "8GB DDR4 3200MHz",
      "\u1ed4 c\u1ee9ng": "512GB PCIe NVMe M.2 SSD",
      "H\u1ec7 \u0111i\u1ec1u h\u00e0nh": "Windows 11 Home",
      "Tr\u1ecdng l\u01b0\u1ee3ng": "Kho\u1ea3ng 2.1 kg"
    },
    "is_published": true,
    "created_at": "2026-06-15T14:37:04.273939+07:00",
    "updated_at": "2026-06-15T14:37:04.273939+07:00"
  },
  {
    "id": "d196e5b3-a717-45de-8e74-be9b388ec83c",
    "name": "CPU INTEL CORE I5 13600KF (3.5GHZ TURBO UP TO 5.1GHZ, 14 NH\u00c2N 20 LU\u1ed2NG, 20MB CACHE, 125W)",
    "slug": "cpu-intel-core-i5-13600kf",
    "description": "S\u1ea3n ph\u1ea9m m\u1edbi th\u00eam.",
    "category_id": "9de67045-2957-43a8-9178-be675e3cbfff",
    "brand_id": "24e65b24-31af-4915-882c-e8116fb33c99",
    "specifications": {},
    "is_published": true,
    "created_at": "2026-06-15T14:37:04.284090+07:00",
    "updated_at": "2026-06-15T14:37:04.284090+07:00"
  },
  {
    "id": "1deb0839-d157-41c1-8e8e-8f11039dc9e7",
    "name": "CPU AMD RYZEN 9 7950X3D (4.2GHZ BOOST 5.7GHZ, 16 NH\u00c2N 32 LU\u1ed2NG)",
    "slug": "cpu-amd-ryzen-9-7950x3d",
    "description": "S\u1ea3n ph\u1ea9m m\u1edbi th\u00eam.",
    "category_id": "9de67045-2957-43a8-9178-be675e3cbfff",
    "brand_id": "66a0211c-8bfa-4dd2-8583-dfd87f7da2e2",
    "specifications": {},
    "is_published": true,
    "created_at": "2026-06-15T14:37:04.284090+07:00",
    "updated_at": "2026-06-15T14:37:04.284090+07:00"
  },
  {
    "id": "28901278-8268-454a-988e-921315a2bb75",
    "name": "Mainboard ASUS ROG MAXIMUS Z790 HERO",
    "slug": "mainboard-asus-rog-maximus-z790-hero",
    "description": "S\u1ea3n ph\u1ea9m m\u1edbi th\u00eam.",
    "category_id": "9de67045-2957-43a8-9178-be675e3cbfff",
    "brand_id": "0eacc349-0eb7-44be-a970-310b68cbe645",
    "specifications": {},
    "is_published": true,
    "created_at": "2026-06-15T14:37:04.284090+07:00",
    "updated_at": "2026-06-15T14:37:04.284090+07:00"
  },
  {
    "id": "bbffbaf4-11a7-495a-8f36-de59b16d6ea6",
    "name": "Mainboard GIGABYTE B760M AORUS ELITE AX",
    "slug": "mainboard-gigabyte-b760m-aorus-elite-ax",
    "description": "S\u1ea3n ph\u1ea9m m\u1edbi th\u00eam.",
    "category_id": "9de67045-2957-43a8-9178-be675e3cbfff",
    "brand_id": "b951edf0-37c6-4c24-916f-c5705f71044d",
    "specifications": {},
    "is_published": true,
    "created_at": "2026-06-15T14:37:04.284090+07:00",
    "updated_at": "2026-06-15T14:37:04.284090+07:00"
  },
  {
    "id": "55eda567-7cf3-45e8-bc50-8b2dade1e9ff",
    "name": "RAM Corsair Dominator Platinum RGB 32GB (2x16GB) DDR5 6200MHz",
    "slug": "ram-corsair-dominator-platinum-rgb-32gb-6200mhz",
    "description": "S\u1ea3n ph\u1ea9m m\u1edbi th\u00eam.",
    "category_id": "0ed3e760-d030-4dc9-9fa1-2be1e016ff94",
    "brand_id": "7a508659-0944-40ea-8cb7-bf5d76c797bc",
    "specifications": {},
    "is_published": true,
    "created_at": "2026-06-15T14:37:04.284090+07:00",
    "updated_at": "2026-06-15T14:37:04.284090+07:00"
  },
  {
    "id": "97c46ea3-a056-4034-9c52-95f9a8a48c3a",
    "name": "VGA MSI GeForce RTX 4060 Ti Ventus 2X Black 8G OC",
    "slug": "vga-msi-rtx-4060-ti-ventus-2x",
    "description": "S\u1ea3n ph\u1ea9m m\u1edbi th\u00eam.",
    "category_id": "9de67045-2957-43a8-9178-be675e3cbfff",
    "brand_id": "c63a919f-5938-460c-9b8b-e90cd66b1291",
    "specifications": {},
    "is_published": true,
    "created_at": "2026-06-15T14:37:04.284090+07:00",
    "updated_at": "2026-06-15T14:37:04.284090+07:00"
  },
  {
    "id": "22d0ca13-e482-4e81-a19e-381f086d8885",
    "name": "VGA GIGABYTE AORUS GeForce RTX 4080 SUPER MASTER 16G",
    "slug": "vga-gigabyte-aorus-rtx-4080-super",
    "description": "S\u1ea3n ph\u1ea9m m\u1edbi th\u00eam.",
    "category_id": "9de67045-2957-43a8-9178-be675e3cbfff",
    "brand_id": "b951edf0-37c6-4c24-916f-c5705f71044d",
    "specifications": {},
    "is_published": true,
    "created_at": "2026-06-15T14:37:04.284090+07:00",
    "updated_at": "2026-06-15T14:37:04.284090+07:00"
  },
  {
    "id": "771109fa-6328-42bc-8f40-c63d7d432b3a",
    "name": "\u1ed4 c\u1ee9ng SSD Samsung 990 PRO 1TB PCIe Gen 4.0 x4 NVMe",
    "slug": "ssd-samsung-990-pro-1tb",
    "description": "S\u1ea3n ph\u1ea9m m\u1edbi th\u00eam.",
    "category_id": "0ed3e760-d030-4dc9-9fa1-2be1e016ff94",
    "brand_id": "d09748d1-9c9d-4f1b-b8ff-b867fb402d25",
    "specifications": {},
    "is_published": true,
    "created_at": "2026-06-15T14:37:04.284090+07:00",
    "updated_at": "2026-06-15T14:37:04.284090+07:00"
  },
  {
    "id": "49edb037-01d7-474a-a590-92e38459049a",
    "name": "Ngu\u1ed3n Corsair RM1000e 1000W 80 Plus Gold - Fully Modular",
    "slug": "nguon-corsair-rm1000e-1000w",
    "description": "S\u1ea3n ph\u1ea9m m\u1edbi th\u00eam.",
    "category_id": "1cadbb93-661c-445a-bba6-f8a469e61b7c",
    "brand_id": "7a508659-0944-40ea-8cb7-bf5d76c797bc",
    "specifications": {},
    "is_published": true,
    "created_at": "2026-06-15T14:37:04.284090+07:00",
    "updated_at": "2026-06-15T14:37:04.284090+07:00"
  },
  {
    "id": "5396472c-16c9-4105-b098-34a0bdc0b672",
    "name": "Case NZXT H9 Flow Matte White",
    "slug": "case-nzxt-h9-flow-matte-white",
    "description": "S\u1ea3n ph\u1ea9m m\u1edbi th\u00eam.",
    "category_id": "1cadbb93-661c-445a-bba6-f8a469e61b7c",
    "brand_id": "b08bb8ef-402c-44e1-beb9-65f279d3b61b",
    "specifications": {},
    "is_published": true,
    "created_at": "2026-06-15T14:37:04.284090+07:00",
    "updated_at": "2026-06-15T14:37:04.284090+07:00"
  },
  {
    "id": "34d6f12d-b710-4eee-9e30-5e23356dd7f9",
    "name": "T\u1ea3n nhi\u1ec7t n\u01b0\u1edbc NZXT Kraken Elite 360 RGB White",
    "slug": "tan-nhiet-nuoc-nzxt-kraken-elite-360-rgb-white",
    "description": "S\u1ea3n ph\u1ea9m m\u1edbi th\u00eam.",
    "category_id": "1cadbb93-661c-445a-bba6-f8a469e61b7c",
    "brand_id": "b08bb8ef-402c-44e1-beb9-65f279d3b61b",
    "specifications": {},
    "is_published": true,
    "created_at": "2026-06-15T14:37:04.284090+07:00",
    "updated_at": "2026-06-15T14:37:04.284090+07:00"
  },
  {
    "id": "2f3a4d20-5a0e-443b-9740-012722a51e9e",
    "name": "Core i9-14900K",
    "slug": "core-i9-14900k-2f3a4d20",
    "description": "S\u1ea3n ph\u1ea9m Core i9-14900K ch\u00ednh h\u00e3ng t\u1eeb Intel.",
    "category_id": "64d6f455-8867-43d3-976b-98094d8f16d6",
    "brand_id": "24e65b24-31af-4915-882c-e8116fb33c99",
    "specifications": {},
    "is_published": true,
    "created_at": "2026-06-15T22:01:08.256719+07:00",
    "updated_at": "2026-06-15T22:01:08.256719+07:00"
  },
  {
    "id": "c75a36ae-f1f5-4a14-9656-e3d82855d6a3",
    "name": "Ryzen 9 7950X3D",
    "slug": "ryzen-9-7950x3d-c75a36ae",
    "description": "S\u1ea3n ph\u1ea9m Ryzen 9 7950X3D ch\u00ednh h\u00e3ng t\u1eeb AMD.",
    "category_id": "64d6f455-8867-43d3-976b-98094d8f16d6",
    "brand_id": "66a0211c-8bfa-4dd2-8583-dfd87f7da2e2",
    "specifications": {},
    "is_published": true,
    "created_at": "2026-06-15T22:01:08.256719+07:00",
    "updated_at": "2026-06-15T22:01:08.256719+07:00"
  },
  {
    "id": "c5e68ab3-c817-4196-9480-523bbf5a285d",
    "name": "RTX 4090 ROG Strix",
    "slug": "rtx-4090-rog-strix-c5e68ab3",
    "description": "S\u1ea3n ph\u1ea9m RTX 4090 ROG Strix ch\u00ednh h\u00e3ng t\u1eeb ASUS.",
    "category_id": "d08aa7ba-fabc-43f4-9484-141d4f2628db",
    "brand_id": "839267e8-f82c-4d5d-be94-fc3ec90d83e3",
    "specifications": {},
    "is_published": true,
    "created_at": "2026-06-15T22:01:08.256719+07:00",
    "updated_at": "2026-06-15T22:01:08.256719+07:00"
  },
  {
    "id": "77061f56-08b4-4134-ac7f-f69ee6cba3c1",
    "name": "RTX 4080 Super Suprim X",
    "slug": "rtx-4080-super-suprim-x-77061f56",
    "description": "S\u1ea3n ph\u1ea9m RTX 4080 Super Suprim X ch\u00ednh h\u00e3ng t\u1eeb MSI.",
    "category_id": "d08aa7ba-fabc-43f4-9484-141d4f2628db",
    "brand_id": "c63a919f-5938-460c-9b8b-e90cd66b1291",
    "specifications": {},
    "is_published": true,
    "created_at": "2026-06-15T22:01:08.256719+07:00",
    "updated_at": "2026-06-15T22:01:08.256719+07:00"
  },
  {
    "id": "e866108c-04a3-4fab-957a-c7733843d942",
    "name": "RX 7900 XTX AORUS",
    "slug": "rx-7900-xtx-aorus-e866108c",
    "description": "S\u1ea3n ph\u1ea9m RX 7900 XTX AORUS ch\u00ednh h\u00e3ng t\u1eeb GIGABYTE.",
    "category_id": "d08aa7ba-fabc-43f4-9484-141d4f2628db",
    "brand_id": "feeba4f2-d5a6-4b57-82fa-9ff772a856e9",
    "specifications": {},
    "is_published": true,
    "created_at": "2026-06-15T22:01:08.256719+07:00",
    "updated_at": "2026-06-15T22:01:08.256719+07:00"
  },
  {
    "id": "9e7b4d57-a18a-4e7e-8f34-60047115dd57",
    "name": "Z790 HERO",
    "slug": "z790-hero-9e7b4d57",
    "description": "S\u1ea3n ph\u1ea9m Z790 HERO ch\u00ednh h\u00e3ng t\u1eeb ASUS.",
    "category_id": "acce1753-eade-487f-a300-68b45fd325f6",
    "brand_id": "839267e8-f82c-4d5d-be94-fc3ec90d83e3",
    "specifications": {},
    "is_published": true,
    "created_at": "2026-06-15T22:01:08.256719+07:00",
    "updated_at": "2026-06-15T22:01:08.256719+07:00"
  },
  {
    "id": "4ea2c4ea-581b-44d2-a29b-2b34f1a6bfdf",
    "name": "B650 TOMAHAWK WIFI",
    "slug": "b650-tomahawk-wifi-4ea2c4ea",
    "description": "S\u1ea3n ph\u1ea9m B650 TOMAHAWK WIFI ch\u00ednh h\u00e3ng t\u1eeb MSI.",
    "category_id": "acce1753-eade-487f-a300-68b45fd325f6",
    "brand_id": "c63a919f-5938-460c-9b8b-e90cd66b1291",
    "specifications": {},
    "is_published": true,
    "created_at": "2026-06-15T22:01:08.256719+07:00",
    "updated_at": "2026-06-15T22:01:08.256719+07:00"
  },
  {
    "id": "1f514bbe-d484-4886-9345-7d5e58248a8f",
    "name": "Dominator Titanium 32GB (2x16) DDR5",
    "slug": "dominator-titanium-32gb-(2x16)-ddr5-1f514bbe",
    "description": "S\u1ea3n ph\u1ea9m Dominator Titanium 32GB (2x16) DDR5 ch\u00ednh h\u00e3ng t\u1eeb Corsair.",
    "category_id": "56162dc3-558b-489f-9735-c7a27e80f7ac",
    "brand_id": "7a508659-0944-40ea-8cb7-bf5d76c797bc",
    "specifications": {},
    "is_published": true,
    "created_at": "2026-06-15T22:01:08.256719+07:00",
    "updated_at": "2026-06-15T22:01:08.256719+07:00"
  },
  {
    "id": "58212a42-1779-4a14-a650-a4c0b0289b2c",
    "name": "Fury Beast 32GB (2x16) DDR5",
    "slug": "fury-beast-32gb-(2x16)-ddr5-58212a42",
    "description": "S\u1ea3n ph\u1ea9m Fury Beast 32GB (2x16) DDR5 ch\u00ednh h\u00e3ng t\u1eeb Kingston.",
    "category_id": "56162dc3-558b-489f-9735-c7a27e80f7ac",
    "brand_id": "c308ee69-36f0-44c9-b0de-220f9bb2e5a4",
    "specifications": {},
    "is_published": true,
    "created_at": "2026-06-15T22:01:08.256719+07:00",
    "updated_at": "2026-06-15T22:01:08.256719+07:00"
  },
  {
    "id": "7b8384b8-9030-4ccf-9932-1735cab1881b",
    "name": "990 PRO 2TB PCIe 4.0",
    "slug": "990-pro-2tb-pcie-4.0-7b8384b8",
    "description": "S\u1ea3n ph\u1ea9m 990 PRO 2TB PCIe 4.0 ch\u00ednh h\u00e3ng t\u1eeb Samsung.",
    "category_id": "53d9cc06-0378-4bd5-a195-e9dc3a5da902",
    "brand_id": "d09748d1-9c9d-4f1b-b8ff-b867fb402d25",
    "specifications": {},
    "is_published": true,
    "created_at": "2026-06-15T22:01:08.256719+07:00",
    "updated_at": "2026-06-15T22:01:08.256719+07:00"
  },
  {
    "id": "059d3d5c-e674-4336-bc6f-ebf3d5091604",
    "name": "RM1000x 1000W 80 Plus Gold",
    "slug": "rm1000x-1000w-80-plus-gold-059d3d5c",
    "description": "S\u1ea3n ph\u1ea9m RM1000x 1000W 80 Plus Gold ch\u00ednh h\u00e3ng t\u1eeb Corsair.",
    "category_id": "342ca7e2-6ad3-4c6e-82c3-50baac105e49",
    "brand_id": "7a508659-0944-40ea-8cb7-bf5d76c797bc",
    "specifications": {},
    "is_published": true,
    "created_at": "2026-06-15T22:01:08.256719+07:00",
    "updated_at": "2026-06-15T22:01:08.256719+07:00"
  },
  {
    "id": "783a6615-3e15-4ba6-a81a-29938a086a23",
    "name": "Laptop Gaming ASUS ROG Strix SCAR 16",
    "slug": "asus-rog-strix-scar-16",
    "description": "<p>M\u1eabu laptop gaming m\u1ea1nh m\u1ebd nh\u1ea5t th\u1ebf gi\u1edbi.</p>",
    "category_id": "9ae4a892-6898-469f-9596-969e024ecad3",
    "brand_id": "0eacc349-0eb7-44be-a970-310b68cbe645",
    "specifications": {
      "CPU": "Intel Core i9 14900HX",
      "RAM": "32GB DDR5",
      "VGA": "RTX 4090 16GB",
      "SSD": "2TB NVMe Gen4"
    },
    "is_published": true,
    "created_at": "2026-06-15T23:35:30.507331+07:00",
    "updated_at": "2026-06-15T23:35:30.507331+07:00"
  }
]

SKUS_DATA = [
  {
    "id": "1bee753f-fcee-4c88-b440-d6dcd723ccdd",
    "product_id": "cebd09e6-1f74-4557-8a96-414f6a5f949d",
    "sku_code": "SKU-MSI-KATANA-15-B13VGK",
    "price": 36990000.0,
    "promotional_price": 42030000.0,
    "stock_quantity": 20,
    "attributes": {},
    "created_at": "2026-06-15T14:37:04.284090+07:00",
    "updated_at": "2026-06-15T14:37:04.284090+07:00"
  },
  {
    "id": "3d2b321f-d187-4866-9361-98dc82437792",
    "product_id": "12babdc2-fb5f-4022-b2ba-0557ad041bcb",
    "sku_code": "SKU-LENOVO-IDEAPAD-SLIM-5-14IMH9",
    "price": 18490000.0,
    "promotional_price": 20320000.0,
    "stock_quantity": 40,
    "attributes": {},
    "created_at": "2026-06-15T14:37:04.284090+07:00",
    "updated_at": "2026-06-15T14:37:04.284090+07:00"
  },
  {
    "id": "89c73658-6fce-4444-a3d4-c0858e48f6a5",
    "product_id": "7a576cbd-2a4f-4d90-83c0-9cea2ae00b92",
    "sku_code": "SKU-ASUS-TUF-GAMING-A15",
    "price": 25490000.0,
    "promotional_price": 26830000.0,
    "stock_quantity": 25,
    "attributes": {},
    "created_at": "2026-06-15T14:37:04.284090+07:00",
    "updated_at": "2026-06-15T14:37:04.284090+07:00"
  },
  {
    "id": "9fead9af-39b0-41d1-b231-7ade7ee903b7",
    "product_id": "1d0a012e-ea93-47b4-b8a8-a0f68c9d09d6",
    "sku_code": "SKU-LENOVO-LEGION-5-16IRX9",
    "price": 39990000.0,
    "promotional_price": 45440000.0,
    "stock_quantity": 10,
    "attributes": {},
    "created_at": "2026-06-15T14:37:04.284090+07:00",
    "updated_at": "2026-06-15T14:37:04.284090+07:00"
  },
  {
    "id": "a5b5bf12-7dc6-4cc8-804e-0bde88e6eaac",
    "product_id": "d69649a1-2f8b-4485-863e-431c17ec18fb",
    "sku_code": "SKU-APPLE-MACBOOK-PRO-14-M3",
    "price": 37490000.0,
    "promotional_price": 41660000.0,
    "stock_quantity": 12,
    "attributes": {},
    "created_at": "2026-06-15T14:37:04.284090+07:00",
    "updated_at": "2026-06-15T14:37:04.284090+07:00"
  },
  {
    "id": "da5ccf4a-a1c6-4451-800f-5ae048c47962",
    "product_id": "abdddb28-5121-4510-8e16-2f70e5f6fc5a",
    "sku_code": "SKU-ASUS-ROG-STRIX-G16-G614JV",
    "price": 32490000.0,
    "promotional_price": 34200000.0,
    "stock_quantity": 15,
    "attributes": {},
    "created_at": "2026-06-15T14:37:04.284090+07:00",
    "updated_at": "2026-06-15T14:37:04.284090+07:00"
  },
  {
    "id": "eada485b-a487-45ab-9cdf-de0ef249bb2c",
    "product_id": "f832c1a6-3d27-4529-8987-091da207d632",
    "sku_code": "SKU-HP-VICTUS-16-R0129TX",
    "price": 24990000.0,
    "promotional_price": 27770000.0,
    "stock_quantity": 20,
    "attributes": {},
    "created_at": "2026-06-15T14:37:04.284090+07:00",
    "updated_at": "2026-06-15T14:37:04.284090+07:00"
  },
  {
    "id": "fdbba26f-2662-4123-b8db-140fad14da45",
    "product_id": "5c6eec03-0254-458b-ad41-f27a9b9c38c1",
    "sku_code": "SKU-ASUS-ZENBOOK-14-OLED-UX3405MA",
    "price": 27490000.0,
    "promotional_price": 32340000.0,
    "stock_quantity": 18,
    "attributes": {},
    "created_at": "2026-06-15T14:37:04.284090+07:00",
    "updated_at": "2026-06-15T14:37:04.284090+07:00"
  },
  {
    "id": "609be5ed-f04d-46d1-8b99-cd571573f5cd",
    "product_id": "b128197e-48a5-40aa-8418-2f5155d74b1c",
    "sku_code": "SKU-DELL-XPS-13-9340",
    "price": 47990000.0,
    "promotional_price": 51600000.0,
    "stock_quantity": 4,
    "attributes": {},
    "created_at": "2026-06-15T14:37:04.284090+07:00",
    "updated_at": "2026-06-15T14:37:04.284090+07:00"
  },
  {
    "id": "cd03d210-7d12-4587-9b73-c92bf9bc080e",
    "product_id": "1a16164f-51f0-45d9-b9dd-f14ebbd374f5",
    "sku_code": "SKU-ACER-NITRO-16-PHOENIX",
    "price": 26990000.0,
    "promotional_price": 30670000.0,
    "stock_quantity": 29,
    "attributes": {},
    "created_at": "2026-06-15T14:37:04.284090+07:00",
    "updated_at": "2026-06-15T14:37:04.284090+07:00"
  },
  {
    "id": "cd31a5d8-22f4-4083-8f26-0c1827da1935",
    "product_id": "836f2252-b6af-49c8-9ae6-9cd1bb4e4d08",
    "sku_code": "SKU-LOT-CHUOT-RAZER-GIGANTUS-V2-XXL",
    "price": 800000.0,
    "promotional_price": 800000.0,
    "stock_quantity": 10,
    "attributes": {},
    "created_at": "2026-06-15T14:37:04.284090+07:00",
    "updated_at": "2026-06-15T14:37:04.284090+07:00"
  },
  {
    "id": "3d7fee31-76b7-467d-bf07-533335f62706",
    "product_id": "ab0c44e9-031c-4c19-83c7-2f19a528731a",
    "sku_code": "SKU-TAI-NGHE-HYPERX-CLOUD-III-WIRELESS",
    "price": 4000000.0,
    "promotional_price": 4000000.0,
    "stock_quantity": 10,
    "attributes": {},
    "created_at": "2026-06-15T14:37:04.284090+07:00",
    "updated_at": "2026-06-15T14:37:04.284090+07:00"
  },
  {
    "id": "aab3f2b0-7640-40ec-9ffe-00b97429e42e",
    "product_id": "deeea250-8252-430a-9d26-2b57083163b4",
    "sku_code": "SKU-WINDOWS-11-PRO",
    "price": 500000.0,
    "promotional_price": 500000.0,
    "stock_quantity": 10,
    "attributes": {},
    "created_at": "2026-06-15T14:37:04.284090+07:00",
    "updated_at": "2026-06-15T14:37:04.284090+07:00"
  },
  {
    "id": "e9d62893-458b-460e-a55f-8abb087b83d2",
    "product_id": "7624c1c8-ac4e-44bb-a942-cc2889721300",
    "sku_code": "SKU-ROUTER-WIFI-6-ASUS-RT-AX82U",
    "price": 3000000.0,
    "promotional_price": 3000000.0,
    "stock_quantity": 10,
    "attributes": {},
    "created_at": "2026-06-15T14:37:04.284090+07:00",
    "updated_at": "2026-06-15T14:37:04.284090+07:00"
  },
  {
    "id": "931e8c56-645b-491d-a150-771e6f67d027",
    "product_id": "ca5b7468-47d5-4c9e-bccc-dd5524c82e49",
    "sku_code": "SKU-GIA-TREO-TAI-NGHE-RAZER-BASE-STATION",
    "price": 1500000.0,
    "promotional_price": 1500000.0,
    "stock_quantity": 10,
    "attributes": {},
    "created_at": "2026-06-15T14:37:04.284090+07:00",
    "updated_at": "2026-06-15T14:37:04.284090+07:00"
  },
  {
    "id": "8a05ebfb-fab3-4507-9547-3c7ad21bb7ca",
    "product_id": "db8b1df1-a8a6-4bdf-a570-0768b790e99f",
    "sku_code": "SKU-DICH-VU-VE-SINH-PC",
    "price": 200000.0,
    "promotional_price": 200000.0,
    "stock_quantity": 10,
    "attributes": {},
    "created_at": "2026-06-15T14:37:04.284090+07:00",
    "updated_at": "2026-06-15T14:37:04.284090+07:00"
  },
  {
    "id": "14dd53b8-5c1a-413e-9614-9e21a184738a",
    "product_id": "7b902cf4-50c8-4aa5-9167-1ae2b738bbd7",
    "sku_code": "SKU-LAPTOP-GAMING-ASUS-ROG-STRIX-G15",
    "price": 25000000.0,
    "promotional_price": 25000000.0,
    "stock_quantity": 10,
    "attributes": {},
    "created_at": "2026-06-15T14:37:04.284090+07:00",
    "updated_at": "2026-06-15T14:37:04.284090+07:00"
  },
  {
    "id": "c725e0ff-58f5-4851-8565-4681e7326aad",
    "product_id": "8599736d-a766-4bc5-9034-af9257ac1131",
    "sku_code": "SKU-CASE-CORSAIR-4000D-AIRFLOW",
    "price": 2190000.0,
    "promotional_price": 1990000.0,
    "stock_quantity": 10,
    "attributes": {},
    "created_at": "2026-06-15T14:37:04.284090+07:00",
    "updated_at": "2026-06-15T14:37:04.284090+07:00"
  },
  {
    "id": "391eb63e-c7c3-4da5-8261-e4deb198e4cf",
    "product_id": "add61a47-0679-406e-9a61-1d94e78b818a",
    "sku_code": "SKU-NGUON-CORSAIR-RM850E-850W",
    "price": 3150000.0,
    "promotional_price": 2890000.0,
    "stock_quantity": 15,
    "attributes": {},
    "created_at": "2026-06-15T14:37:04.284090+07:00",
    "updated_at": "2026-06-15T14:37:04.284090+07:00"
  },
  {
    "id": "cc004f34-fdc7-457e-b46c-5a7e423a107b",
    "product_id": "3aef8961-342a-4381-a1e1-ba366519d89e",
    "sku_code": "SKU-TAN-NHIET-NUOC-NZXT-KRAKEN-ELITE-360",
    "price": 7590000.0,
    "promotional_price": 6990000.0,
    "stock_quantity": 8,
    "attributes": {},
    "created_at": "2026-06-15T14:37:04.284090+07:00",
    "updated_at": "2026-06-15T14:37:04.284090+07:00"
  },
  {
    "id": "1d254b03-eeb0-42dd-9b05-69336073c4a1",
    "product_id": "5b86f872-f21f-4e07-a1bd-84de9cbfe85f",
    "sku_code": "SKU-CASE-NZXT-H9-FLOW",
    "price": 4290000.0,
    "promotional_price": 3990000.0,
    "stock_quantity": 12,
    "attributes": {},
    "created_at": "2026-06-15T14:37:04.284090+07:00",
    "updated_at": "2026-06-15T14:37:04.284090+07:00"
  },
  {
    "id": "bce15f77-2ef0-4892-9f25-98619c4455c4",
    "product_id": "a1cfa90b-a3ea-49dd-8bd6-bd0ba2d3bc5b",
    "sku_code": "SKU-TAI-NGHE-STEELSERIES-ARCTIS-NOVA-PRO",
    "price": 6490000.0,
    "promotional_price": 5990000.0,
    "stock_quantity": 5,
    "attributes": {},
    "created_at": "2026-06-15T14:37:04.284090+07:00",
    "updated_at": "2026-06-15T14:37:04.284090+07:00"
  },
  {
    "id": "222f0d9f-66ac-4880-8e8e-7c3edfd71512",
    "product_id": "6a090fcf-aca5-4a5b-badc-407519fc9ba3",
    "sku_code": "SKU-TAI-NGHE-CORSAIR-HS80-RGB-WIRELESS",
    "price": 3590000.0,
    "promotional_price": 3490000.0,
    "stock_quantity": 12,
    "attributes": {},
    "created_at": "2026-06-15T14:37:04.284090+07:00",
    "updated_at": "2026-06-15T14:37:04.284090+07:00"
  },
  {
    "id": "71158553-da38-4170-bc74-5123fc59d3cf",
    "product_id": "d9448278-2754-4a49-9f58-25dff1a926f3",
    "sku_code": "SKU-TAI-NGHE-RAZER-BLACKSHARK-V2",
    "price": 2490000.0,
    "promotional_price": 2290000.0,
    "stock_quantity": 18,
    "attributes": {},
    "created_at": "2026-06-15T14:37:04.284090+07:00",
    "updated_at": "2026-06-15T14:37:04.284090+07:00"
  },
  {
    "id": "0054a9f5-abab-470f-ab03-293df51ddd2c",
    "product_id": "2eb35990-22ec-440e-8fcd-d7dddfcfede5",
    "sku_code": "SKU-MAN-HINH-LG-ULTRAGEAR-27",
    "price": 20000000.0,
    "promotional_price": 20000000.0,
    "stock_quantity": 10,
    "attributes": {},
    "created_at": "2026-06-15T14:37:04.284090+07:00",
    "updated_at": "2026-06-15T14:37:04.284090+07:00"
  },
  {
    "id": "9552374b-5193-4fd4-ba7f-2871d040a862",
    "product_id": "adafff4d-d064-444d-aece-1f5150af3b03",
    "sku_code": "SKU-MAN-HINH-ASUS-ROG-SWIFT-360HZ",
    "price": 15000000.0,
    "promotional_price": 15000000.0,
    "stock_quantity": 10,
    "attributes": {},
    "created_at": "2026-06-15T14:37:04.284090+07:00",
    "updated_at": "2026-06-15T14:37:04.284090+07:00"
  },
  {
    "id": "317a6401-f461-4a9b-9ba4-2b788e7c2ddb",
    "product_id": "9f1295ba-f8a1-4f61-9dee-f12d4f60147e",
    "sku_code": "SKU-BAN-PHIM-CORSAIR-K70-RGB-PRO-CHERRY",
    "price": 3800000.0,
    "promotional_price": 3800000.0,
    "stock_quantity": 10,
    "attributes": {},
    "created_at": "2026-06-15T14:37:04.284090+07:00",
    "updated_at": "2026-06-15T14:37:04.284090+07:00"
  },
  {
    "id": "e2c5c607-e95b-4a76-a7a8-3532103ee113",
    "product_id": "a9b3ffcc-22f1-40d7-b8af-f84b5602edc3",
    "sku_code": "SKU-BAN-PHIM-RAZER-HUNTSMAN-V2-ANALOG",
    "price": 6000000.0,
    "promotional_price": 6000000.0,
    "stock_quantity": 10,
    "attributes": {},
    "created_at": "2026-06-15T14:37:04.284090+07:00",
    "updated_at": "2026-06-15T14:37:04.284090+07:00"
  },
  {
    "id": "007efe20-a691-4c97-8ec4-79f538eb0451",
    "product_id": "50118b77-7023-42d9-966d-091da8c12c9d",
    "sku_code": "SKU-CORSAIR-K70-RGB",
    "price": 3000000.0,
    "promotional_price": 3000000.0,
    "stock_quantity": 10,
    "attributes": {},
    "created_at": "2026-06-15T14:37:04.284090+07:00",
    "updated_at": "2026-06-15T14:37:04.284090+07:00"
  },
  {
    "id": "c5b5c142-ae67-4ba9-bb1f-19995d132fd4",
    "product_id": "d691360a-785f-4f85-8e70-cc1dcadedf43",
    "sku_code": "SKU-WEBCAM-LOGITECH-BRIO-4K",
    "price": 4500000.0,
    "promotional_price": 4500000.0,
    "stock_quantity": 10,
    "attributes": {},
    "created_at": "2026-06-15T14:37:04.284090+07:00",
    "updated_at": "2026-06-15T14:37:04.284090+07:00"
  },
  {
    "id": "d8898942-d3c8-4f16-b29f-0bf0d888bde2",
    "product_id": "1cc36166-2e7e-4e74-85ee-b64316ffde03",
    "sku_code": "SKU-VGA-ASUS-ROG-STRIX-RTX-4090",
    "price": 55000000.0,
    "promotional_price": 55000000.0,
    "stock_quantity": 10,
    "attributes": {},
    "created_at": "2026-06-15T14:37:04.284090+07:00",
    "updated_at": "2026-06-15T14:37:04.284090+07:00"
  },
  {
    "id": "6014dd57-1752-4960-b1a5-bdd6a39019a5",
    "product_id": "ba539d8b-7b56-49b9-8622-269819795978",
    "sku_code": "SKU-MAINBOARD-GIGABYTE-Z790",
    "price": 8000000.0,
    "promotional_price": 8000000.0,
    "stock_quantity": 10,
    "attributes": {},
    "created_at": "2026-06-15T14:37:04.284090+07:00",
    "updated_at": "2026-06-15T14:37:04.284090+07:00"
  },
  {
    "id": "e919c31a-fc24-434a-9faa-5d367fdfb667",
    "product_id": "a64b8ab5-8093-4e54-a477-9897dc9ed69b",
    "sku_code": "SKU-CASE-NZXT-H9-FLOW-DUAL-CHAMBER",
    "price": 4000000.0,
    "promotional_price": 4000000.0,
    "stock_quantity": 10,
    "attributes": {},
    "created_at": "2026-06-15T14:37:04.284090+07:00",
    "updated_at": "2026-06-15T14:37:04.284090+07:00"
  },
  {
    "id": "1da9d3c1-0cdb-4807-abd9-03e9120963de",
    "product_id": "202d9bae-1a60-431e-80dc-6add19e0daa4",
    "sku_code": "SKU-NGUON-CORSAIR-RM1000X",
    "price": 5000000.0,
    "promotional_price": 5000000.0,
    "stock_quantity": 10,
    "attributes": {},
    "created_at": "2026-06-15T14:37:04.284090+07:00",
    "updated_at": "2026-06-15T14:37:04.284090+07:00"
  },
  {
    "id": "e3c437ea-1d39-45d5-a03a-f4be30042fb9",
    "product_id": "400460c7-89dc-42db-8d70-d1d8aceeaf29",
    "sku_code": "SKU-TAN-NHIET-NUOC-NZXT-KRAKEN-ELITE-360-RGB",
    "price": 7500000.0,
    "promotional_price": 7500000.0,
    "stock_quantity": 10,
    "attributes": {},
    "created_at": "2026-06-15T14:37:04.284090+07:00",
    "updated_at": "2026-06-15T14:37:04.284090+07:00"
  },
  {
    "id": "d57ace7c-cafd-4c24-9e92-b434a7edcfd5",
    "product_id": "c319f0de-a084-41fd-87a3-2672ae04504c",
    "sku_code": "SKU-RAM-CORSAIR-DOMINATOR-64GB",
    "price": 10000000.0,
    "promotional_price": 10000000.0,
    "stock_quantity": 10,
    "attributes": {},
    "created_at": "2026-06-15T14:37:04.284090+07:00",
    "updated_at": "2026-06-15T14:37:04.284090+07:00"
  },
  {
    "id": "908ccec3-575a-49c2-8fcf-b86d97c0057f",
    "product_id": "5c911bcb-713b-480c-8a57-8ed727c9dd86",
    "sku_code": "SKU-LOA-LOGITECH-G560",
    "price": 5000000.0,
    "promotional_price": 5000000.0,
    "stock_quantity": 10,
    "attributes": {},
    "created_at": "2026-06-15T14:37:04.284090+07:00",
    "updated_at": "2026-06-15T14:37:04.284090+07:00"
  },
  {
    "id": "6f410ab1-a679-4581-9297-fe50e4fb590e",
    "product_id": "5d02b473-ed4a-4aa2-8f0c-b97fd2614548",
    "sku_code": "SKU-CPU-INTEL-CORE-I9-14900K",
    "price": 15000000.0,
    "promotional_price": 15000000.0,
    "stock_quantity": 10,
    "attributes": {},
    "created_at": "2026-06-15T14:37:04.284090+07:00",
    "updated_at": "2026-06-15T14:37:04.284090+07:00"
  },
  {
    "id": "e9312a69-1554-4494-bb49-924c29b33c98",
    "product_id": "a792e3fd-8d80-4bae-9fa2-b27ee2802550",
    "sku_code": "SKU-CHUOT-LOGITECH-G-PRO-X-SUPERLIGHT-2-DEN",
    "price": 3500000.0,
    "promotional_price": 3500000.0,
    "stock_quantity": 10,
    "attributes": {},
    "created_at": "2026-06-15T14:37:04.284090+07:00",
    "updated_at": "2026-06-15T14:37:04.284090+07:00"
  },
  {
    "id": "0fd5ba27-a866-447c-9b64-a770fef5f519",
    "product_id": "e3aa86a2-05c2-4cea-8118-a9d18602e9d1",
    "sku_code": "SKU-SSD-SAMSUNG-990-PRO-2TB",
    "price": 4500000.0,
    "promotional_price": 4500000.0,
    "stock_quantity": 10,
    "attributes": {},
    "created_at": "2026-06-15T14:37:04.284090+07:00",
    "updated_at": "2026-06-15T14:37:04.284090+07:00"
  },
  {
    "id": "2243aa34-e30b-4ab9-81a6-199c623a0aa6",
    "product_id": "df36d128-3a47-4b20-8fab-20f18fc2b8c8",
    "sku_code": "SKU-MAY-CHOI-GAME-STEAM-DECK-OLED",
    "price": 15990000.0,
    "promotional_price": 15990000.0,
    "stock_quantity": 10,
    "attributes": {},
    "created_at": "2026-06-15T14:37:04.284090+07:00",
    "updated_at": "2026-06-15T14:37:04.284090+07:00"
  },
  {
    "id": "536e4ab2-3e3a-41a2-91cd-05958a327b55",
    "product_id": "cd9de695-205a-4f4c-a1c2-6a130511ba09",
    "sku_code": "SKU-MAY-CHOI-GAME-PS5-SLIM",
    "price": 13990000.0,
    "promotional_price": 13990000.0,
    "stock_quantity": 10,
    "attributes": {},
    "created_at": "2026-06-15T14:37:04.284090+07:00",
    "updated_at": "2026-06-15T14:37:04.284090+07:00"
  },
  {
    "id": "625fe146-dfdc-4515-a191-75faebf6be8c",
    "product_id": "8c9f9097-99b8-4b11-b13f-235500b80aae",
    "sku_code": "ASUS-ROG-BP2500G",
    "price": 1290000.0,
    "promotional_price": 1190000.0,
    "stock_quantity": 50,
    "attributes": {},
    "created_at": "2026-06-15T14:37:04.284090+07:00",
    "updated_at": "2026-06-15T14:37:04.284090+07:00"
  },
  {
    "id": "2d0ce679-d8e5-487e-aa95-8332adfb4516",
    "product_id": "d196e5b3-a717-45de-8e74-be9b388ec83c",
    "sku_code": "CPU-13600KF",
    "price": 7799000.0,
    "promotional_price": 7799000.0,
    "stock_quantity": 15,
    "attributes": {},
    "created_at": "2026-06-15T14:37:04.295985+07:00",
    "updated_at": "2026-06-15T14:37:04.295985+07:00"
  },
  {
    "id": "78e9c5cf-a766-404b-9a27-f5ee9b803dea",
    "product_id": "1deb0839-d157-41c1-8e8e-8f11039dc9e7",
    "sku_code": "CPU-7950X3D",
    "price": 16900000.0,
    "promotional_price": 16900000.0,
    "stock_quantity": 15,
    "attributes": {},
    "created_at": "2026-06-15T14:37:04.295985+07:00",
    "updated_at": "2026-06-15T14:37:04.295985+07:00"
  },
  {
    "id": "4da91f9f-b76b-434b-9115-b8953405c0cb",
    "product_id": "28901278-8268-454a-988e-921315a2bb75",
    "sku_code": "MB-Z790-HERO",
    "price": 16900000.0,
    "promotional_price": 16900000.0,
    "stock_quantity": 15,
    "attributes": {},
    "created_at": "2026-06-15T14:37:04.295985+07:00",
    "updated_at": "2026-06-15T14:37:04.295985+07:00"
  },
  {
    "id": "92b2e5c3-543c-4ae2-9001-399dfcaa3900",
    "product_id": "bbffbaf4-11a7-495a-8f36-de59b16d6ea6",
    "sku_code": "MB-B760M-AORUS",
    "price": 4200000.0,
    "promotional_price": 4200000.0,
    "stock_quantity": 15,
    "attributes": {},
    "created_at": "2026-06-15T14:37:04.295985+07:00",
    "updated_at": "2026-06-15T14:37:04.295985+07:00"
  },
  {
    "id": "cfd87422-7d72-4b3b-90b0-238094fae581",
    "product_id": "55eda567-7cf3-45e8-bc50-8b2dade1e9ff",
    "sku_code": "RAM-COR-32GB-6200",
    "price": 4800000.0,
    "promotional_price": 4800000.0,
    "stock_quantity": 15,
    "attributes": {},
    "created_at": "2026-06-15T14:37:04.295985+07:00",
    "updated_at": "2026-06-15T14:37:04.295985+07:00"
  },
  {
    "id": "fdda0721-8128-4fe1-9920-f5c829b9c5e7",
    "product_id": "97c46ea3-a056-4034-9c52-95f9a8a48c3a",
    "sku_code": "VGA-RTX4060TI",
    "price": 10500000.0,
    "promotional_price": 10500000.0,
    "stock_quantity": 15,
    "attributes": {},
    "created_at": "2026-06-15T14:37:04.295985+07:00",
    "updated_at": "2026-06-15T14:37:04.295985+07:00"
  },
  {
    "id": "f586754f-559e-4e76-bd4e-6e3a73076951",
    "product_id": "22d0ca13-e482-4e81-a19e-381f086d8885",
    "sku_code": "VGA-RTX4080S",
    "price": 33500000.0,
    "promotional_price": 33500000.0,
    "stock_quantity": 15,
    "attributes": {},
    "created_at": "2026-06-15T14:37:04.295985+07:00",
    "updated_at": "2026-06-15T14:37:04.295985+07:00"
  },
  {
    "id": "68213052-28ba-4a94-a201-1c9790577cb3",
    "product_id": "771109fa-6328-42bc-8f40-c63d7d432b3a",
    "sku_code": "SSD-SAM-990-1TB",
    "price": 3200000.0,
    "promotional_price": 3200000.0,
    "stock_quantity": 15,
    "attributes": {},
    "created_at": "2026-06-15T14:37:04.295985+07:00",
    "updated_at": "2026-06-15T14:37:04.295985+07:00"
  },
  {
    "id": "ec7b1e9b-8912-47b2-a57d-db4302503641",
    "product_id": "49edb037-01d7-474a-a590-92e38459049a",
    "sku_code": "PSU-COR-1000E",
    "price": 4500000.0,
    "promotional_price": 4500000.0,
    "stock_quantity": 15,
    "attributes": {},
    "created_at": "2026-06-15T14:37:04.295985+07:00",
    "updated_at": "2026-06-15T14:37:04.295985+07:00"
  },
  {
    "id": "63735e13-efa5-4501-bcbe-eef6117f5218",
    "product_id": "5396472c-16c9-4105-b098-34a0bdc0b672",
    "sku_code": "CASE-NZXT-H9-W",
    "price": 4200000.0,
    "promotional_price": 4200000.0,
    "stock_quantity": 15,
    "attributes": {},
    "created_at": "2026-06-15T14:37:04.295985+07:00",
    "updated_at": "2026-06-15T14:37:04.295985+07:00"
  },
  {
    "id": "0346c59c-9c76-42b7-a706-aeceaf375893",
    "product_id": "34d6f12d-b710-4eee-9e30-5e23356dd7f9",
    "sku_code": "COOL-NZXT-360-W",
    "price": 7500000.0,
    "promotional_price": 7500000.0,
    "stock_quantity": 15,
    "attributes": {},
    "created_at": "2026-06-15T14:37:04.295985+07:00",
    "updated_at": "2026-06-15T14:37:04.295985+07:00"
  },
  {
    "id": "376ad42e-1d81-4bd1-9018-5434129adec4",
    "product_id": "2f3a4d20-5a0e-443b-9740-012722a51e9e",
    "sku_code": "SKU-COREI9-14900K-2f3a",
    "price": 16000000.0,
    "promotional_price": null,
    "stock_quantity": 42,
    "attributes": {
      "color": "Default"
    },
    "created_at": "2026-06-15T22:01:08.256719+07:00",
    "updated_at": "2026-06-15T22:01:08.256719+07:00"
  },
  {
    "id": "73567175-0545-4514-8633-529f72d5b99e",
    "product_id": "c75a36ae-f1f5-4a14-9656-e3d82855d6a3",
    "sku_code": "SKU-RYZEN97950X3D-c75a",
    "price": 17000000.0,
    "promotional_price": null,
    "stock_quantity": 80,
    "attributes": {
      "color": "Default"
    },
    "created_at": "2026-06-15T22:01:08.256719+07:00",
    "updated_at": "2026-06-15T22:01:08.256719+07:00"
  },
  {
    "id": "60dc3b95-ca94-4be3-884d-f7ce94208474",
    "product_id": "c5e68ab3-c817-4196-9480-523bbf5a285d",
    "sku_code": "SKU-RTX4090ROGSTRIX-c5e6",
    "price": 65000000.0,
    "promotional_price": null,
    "stock_quantity": 61,
    "attributes": {
      "color": "Default"
    },
    "created_at": "2026-06-15T22:01:08.256719+07:00",
    "updated_at": "2026-06-15T22:01:08.256719+07:00"
  },
  {
    "id": "29f2a32e-768f-4061-bfaf-5848e342f31f",
    "product_id": "77061f56-08b4-4134-ac7f-f69ee6cba3c1",
    "sku_code": "SKU-RTX4080SUPERSUPRIMX-7706",
    "price": 32000000.0,
    "promotional_price": null,
    "stock_quantity": 52,
    "attributes": {
      "color": "Default"
    },
    "created_at": "2026-06-15T22:01:08.256719+07:00",
    "updated_at": "2026-06-15T22:01:08.256719+07:00"
  },
  {
    "id": "870cbc7d-26c3-4225-872a-5c43dc55502f",
    "product_id": "e866108c-04a3-4fab-957a-c7733843d942",
    "sku_code": "SKU-RX7900XTXAORUS-e866",
    "price": 30000000.0,
    "promotional_price": null,
    "stock_quantity": 96,
    "attributes": {
      "color": "Default"
    },
    "created_at": "2026-06-15T22:01:08.256719+07:00",
    "updated_at": "2026-06-15T22:01:08.256719+07:00"
  },
  {
    "id": "81e477c7-3991-490c-b2a9-5a155fb20f45",
    "product_id": "9e7b4d57-a18a-4e7e-8f34-60047115dd57",
    "sku_code": "SKU-Z790HERO-9e7b",
    "price": 16000000.0,
    "promotional_price": null,
    "stock_quantity": 81,
    "attributes": {
      "color": "Default"
    },
    "created_at": "2026-06-15T22:01:08.256719+07:00",
    "updated_at": "2026-06-15T22:01:08.256719+07:00"
  },
  {
    "id": "537722f7-16dd-4be7-a30d-d11c2dd4419a",
    "product_id": "4ea2c4ea-581b-44d2-a29b-2b34f1a6bfdf",
    "sku_code": "SKU-B650TOMAHAWKWIFI-4ea2",
    "price": 6500000.0,
    "promotional_price": null,
    "stock_quantity": 43,
    "attributes": {
      "color": "Default"
    },
    "created_at": "2026-06-15T22:01:08.256719+07:00",
    "updated_at": "2026-06-15T22:01:08.256719+07:00"
  },
  {
    "id": "cab9b6db-1217-46ee-a2c5-450dee80ac65",
    "product_id": "1f514bbe-d484-4886-9345-7d5e58248a8f",
    "sku_code": "SKU-DOMINATORTITANIUM32GB(2X16)DDR5-1f51",
    "price": 5500000.0,
    "promotional_price": null,
    "stock_quantity": 60,
    "attributes": {
      "color": "Default"
    },
    "created_at": "2026-06-15T22:01:08.256719+07:00",
    "updated_at": "2026-06-15T22:01:08.256719+07:00"
  },
  {
    "id": "3a865c62-803b-40a3-a4e3-0202c48960b7",
    "product_id": "58212a42-1779-4a14-a650-a4c0b0289b2c",
    "sku_code": "SKU-FURYBEAST32GB(2X16)DDR5-5821",
    "price": 4000000.0,
    "promotional_price": null,
    "stock_quantity": 15,
    "attributes": {
      "color": "Default"
    },
    "created_at": "2026-06-15T22:01:08.256719+07:00",
    "updated_at": "2026-06-15T22:01:08.256719+07:00"
  },
  {
    "id": "6fbec32f-f96f-4aa7-8317-224d892e45fe",
    "product_id": "7b8384b8-9030-4ccf-9932-1735cab1881b",
    "sku_code": "SKU-990PRO2TBPCIE4.0-7b83",
    "price": 5000000.0,
    "promotional_price": null,
    "stock_quantity": 37,
    "attributes": {
      "color": "Default"
    },
    "created_at": "2026-06-15T22:01:08.256719+07:00",
    "updated_at": "2026-06-15T22:01:08.256719+07:00"
  },
  {
    "id": "919e2b7b-fec0-4549-a303-79324ca02f6f",
    "product_id": "059d3d5c-e674-4336-bc6f-ebf3d5091604",
    "sku_code": "SKU-RM1000X1000W80PLUSGOLD-059d",
    "price": 4500000.0,
    "promotional_price": null,
    "stock_quantity": 62,
    "attributes": {
      "color": "Default"
    },
    "created_at": "2026-06-15T22:01:08.256719+07:00",
    "updated_at": "2026-06-15T22:01:08.256719+07:00"
  },
  {
    "id": "75d8ac8c-be36-43da-a0e6-576b65d6e4b7",
    "product_id": "783a6615-3e15-4ba6-a81a-29938a086a23",
    "sku_code": "ASUS-ROG-16",
    "price": 110000000.0,
    "promotional_price": 105000000.0,
    "stock_quantity": 10,
    "attributes": {
      "color": "Black"
    },
    "created_at": "2026-06-15T23:35:30.507331+07:00",
    "updated_at": "2026-06-15T23:35:30.507331+07:00"
  }
]

IMAGES_DATA = [
  {
    "id": "06defb4b-c082-4786-9f73-b1d79b5dbd92",
    "product_id": "a792e3fd-8d80-4bae-9fa2-b27ee2802550",
    "url": "https://res.cloudinary.com/dtbbbq4zr/image/upload/v1781331409/ez4ence/products/Chuot-Khong-Day-Logitech-G-Pro-X-Superlight-2-2.webp",
    "alt_text": "Chu\u1ed9t Kh\u00f4ng D\u00e2y Logitech G Pro X Superlight 2 (\u0110en) 3",
    "is_primary": false
  },
  {
    "id": "150ad9c6-a872-4345-8737-8323825b04e6",
    "product_id": "836f2252-b6af-49c8-9ae6-9cd1bb4e4d08",
    "url": "https://res.cloudinary.com/dtbbbq4zr/image/upload/v1781331415/ez4ence/products/Lot-chuot-Razer-Gigantus-V2-XXL-2.jpg",
    "alt_text": "L\u00f3t chu\u1ed9t Razer Gigantus V2 - XXL 1",
    "is_primary": true
  },
  {
    "id": "2c30e84a-d344-4c25-9a3f-b206c9f72e24",
    "product_id": "836f2252-b6af-49c8-9ae6-9cd1bb4e4d08",
    "url": "https://res.cloudinary.com/dtbbbq4zr/image/upload/v1781331413/ez4ence/products/Lot-chuot-Razer-Gigantus-V2-XXL-1.webp",
    "alt_text": "L\u00f3t chu\u1ed9t Razer Gigantus V2 - XXL 2",
    "is_primary": false
  },
  {
    "id": "309d526e-840d-44e3-9ff6-2ec2d283d418",
    "product_id": "1a16164f-51f0-45d9-b9dd-f14ebbd374f5",
    "url": "https://res.cloudinary.com/dtbbbq4zr/image/upload/v1781308490/ez4ence/products/Laptop-Gaming-Acer-Nitro-16-Phoenix-1.jpg",
    "alt_text": "Laptop Gaming Acer Nitro 16 Phoenix image 1",
    "is_primary": true
  },
  {
    "id": "46477714-13ff-4eea-aa69-cb845047a2a1",
    "product_id": "836f2252-b6af-49c8-9ae6-9cd1bb4e4d08",
    "url": "https://res.cloudinary.com/dtbbbq4zr/image/upload/v1781331417/ez4ence/products/Lot-chuot-Razer-Gigantus-V2-XXL-3.jpg",
    "alt_text": "L\u00f3t chu\u1ed9t Razer Gigantus V2 - XXL 3",
    "is_primary": false
  },
  {
    "id": "c36b59f2-82d9-40ca-8296-f63effa76026",
    "product_id": "ab0c44e9-031c-4c19-83c7-2f19a528731a",
    "url": "https://res.cloudinary.com/dtbbbq4zr/image/upload/v1781346423/ez4ence/products/tai-nghe-hyperx-cloud-iii-wireless-2.jpg",
    "alt_text": "Tai nghe HyperX Cloud III Wireless 1",
    "is_primary": true
  },
  {
    "id": "fc91e282-647c-4a12-b701-737d08aa2990",
    "product_id": "ab0c44e9-031c-4c19-83c7-2f19a528731a",
    "url": "https://res.cloudinary.com/dtbbbq4zr/image/upload/v1781346823/ez4ence/products/tai-nghe-hyperx-cloud-iii-wireless-3_hq.png",
    "alt_text": "Tai nghe HyperX Cloud III Wireless 2",
    "is_primary": false
  },
  {
    "id": "1f029f5e-57b4-4d27-afbc-c7c3751e6bb1",
    "product_id": "ab0c44e9-031c-4c19-83c7-2f19a528731a",
    "url": "https://res.cloudinary.com/dtbbbq4zr/image/upload/v1781346822/ez4ence/products/tai-nghe-hyperx-cloud-iii-wireless-2_hq.png",
    "alt_text": "Tai nghe HyperX Cloud III Wireless 3",
    "is_primary": false
  },
  {
    "id": "0ab8fd75-2731-4b8f-ba7a-eadb5e6176a7",
    "product_id": "ca5b7468-47d5-4c9e-bccc-dd5524c82e49",
    "url": "https://res.cloudinary.com/dtbbbq4zr/image/upload/v1781344705/ez4ence/products/tai-nghe-razer-blackshark-v2-3.png",
    "alt_text": "Gi\u00e1 treo tai nghe Razer Base Station V2 Chroma 1",
    "is_primary": true
  },
  {
    "id": "21d96c7b-58cc-4813-87df-32fa512b6c52",
    "product_id": "ca5b7468-47d5-4c9e-bccc-dd5524c82e49",
    "url": "https://res.cloudinary.com/dtbbbq4zr/image/upload/v1781344682/ez4ence/products/tai-nghe-razer-blackshark-v2-2.png",
    "alt_text": "Gi\u00e1 treo tai nghe Razer Base Station V2 Chroma 2",
    "is_primary": false
  },
  {
    "id": "80a2151a-5cf3-42c1-a7bf-7bde9606ee81",
    "product_id": "ca5b7468-47d5-4c9e-bccc-dd5524c82e49",
    "url": "https://res.cloudinary.com/dtbbbq4zr/image/upload/v1781344660/ez4ence/products/tai-nghe-razer-blackshark-v2-1.jpg",
    "alt_text": "Gi\u00e1 treo tai nghe Razer Base Station V2 Chroma 3",
    "is_primary": false
  },
  {
    "id": "b3bc690a-3395-4214-8160-eba26dfcb21d",
    "product_id": "7b902cf4-50c8-4aa5-9167-1ae2b738bbd7",
    "url": "https://res.cloudinary.com/dtbbbq4zr/image/upload/v1781308816/ez4ence/products/Laptop-Gaming-Asus-ROG-Strix-G15-2.png",
    "alt_text": "Laptop Gaming Asus ROG Strix G15 1",
    "is_primary": true
  },
  {
    "id": "bc8b0b32-aec4-403a-99ba-1d36a7453bd1",
    "product_id": "7b902cf4-50c8-4aa5-9167-1ae2b738bbd7",
    "url": "https://res.cloudinary.com/dtbbbq4zr/image/upload/v1781308818/ez4ence/products/Laptop-Gaming-Asus-ROG-Strix-G15-3.png",
    "alt_text": "Laptop Gaming Asus ROG Strix G15 2",
    "is_primary": false
  },
  {
    "id": "d1f85d27-b7a6-4af1-9330-c3e35e05c20c",
    "product_id": "7b902cf4-50c8-4aa5-9167-1ae2b738bbd7",
    "url": "https://res.cloudinary.com/dtbbbq4zr/image/upload/v1781308815/ez4ence/products/Laptop-Gaming-Asus-ROG-Strix-G15-1.png",
    "alt_text": "Laptop Gaming Asus ROG Strix G15 3",
    "is_primary": false
  },
  {
    "id": "0e6c51c5-da8b-4248-8015-ab8770a701ff",
    "product_id": "e3aa86a2-05c2-4cea-8118-a9d18602e9d1",
    "url": "https://res.cloudinary.com/dtbbbq4zr/image/upload/v1781314496/ez4ence/products/%E1%BB%94%20c%E1%BB%A9ng%20SSD%20Samsung%20990%20PRO%202TB%20PCIe%20Gen%204.0%20x4%20NVMe_0.jpg",
    "alt_text": "\u1ed4 c\u1ee9ng SSD Samsung 990 PRO 2TB PCIe Gen 4.0 x4 NVMe 1",
    "is_primary": true
  },
  {
    "id": "96c862df-24cd-4c88-9a74-10c67ed107dc",
    "product_id": "c319f0de-a084-41fd-87a3-2672ae04504c",
    "url": "https://res.cloudinary.com/dtbbbq4zr/image/upload/v1781354826/ez4ence/products/ram-corsair-dominator-titanium-rgb-64gb-2x32gb-ddr5-6000mhz-1.jpg",
    "alt_text": "RAM Corsair Dominator Titanium RGB 64GB (2x32GB) DDR5 6000MHz",
    "is_primary": true
  },
  {
    "id": "2b2c1692-bd48-409f-a3c9-603370ba92ae",
    "product_id": "12babdc2-fb5f-4022-b2ba-0557ad041bcb",
    "url": "https://res.cloudinary.com/dtbbbq4zr/image/upload/v1781288268/ez4ence/products/jc45zhjqfukj6jxco4ia.webp",
    "alt_text": "Laptop Lenovo IdeaPad Slim 5 14IMH9 image 1",
    "is_primary": true
  },
  {
    "id": "56051167-ccc2-43e3-b9f1-42080e85e447",
    "product_id": "12babdc2-fb5f-4022-b2ba-0557ad041bcb",
    "url": "https://res.cloudinary.com/dtbbbq4zr/image/upload/v1781288269/ez4ence/products/jebsdoeiijlzjccqprqm.webp",
    "alt_text": "Laptop Lenovo IdeaPad Slim 5 14IMH9 image 2",
    "is_primary": false
  },
  {
    "id": "5575738b-c56a-42c7-a937-84fa2e1cac28",
    "product_id": "12babdc2-fb5f-4022-b2ba-0557ad041bcb",
    "url": "https://res.cloudinary.com/dtbbbq4zr/image/upload/v1781288269/ez4ence/products/liaimbiic6kf98n7l7dh.webp",
    "alt_text": "Laptop Lenovo IdeaPad Slim 5 14IMH9 image 3",
    "is_primary": false
  },
  {
    "id": "d3036911-d9a9-4929-ac84-8d3d7036f7a2",
    "product_id": "5c6eec03-0254-458b-ad41-f27a9b9c38c1",
    "url": "https://res.cloudinary.com/dtbbbq4zr/image/upload/v1781288271/ez4ence/products/tr6ziddjpqleyem2drge.webp",
    "alt_text": "Laptop ASUS Zenbook 14 OLED UX3405MA image 1",
    "is_primary": true
  },
  {
    "id": "5acdd281-cf89-4f89-a20e-010a2bb23e47",
    "product_id": "5c6eec03-0254-458b-ad41-f27a9b9c38c1",
    "url": "https://res.cloudinary.com/dtbbbq4zr/image/upload/v1781288272/ez4ence/products/apgaarf5ovixlrqivg8c.webp",
    "alt_text": "Laptop ASUS Zenbook 14 OLED UX3405MA image 2",
    "is_primary": false
  },
  {
    "id": "b114f0b4-3633-45f2-97a6-669c650292dc",
    "product_id": "5c6eec03-0254-458b-ad41-f27a9b9c38c1",
    "url": "https://res.cloudinary.com/dtbbbq4zr/image/upload/v1781288274/ez4ence/products/jfkf42irnbwvol7kbysh.webp",
    "alt_text": "Laptop ASUS Zenbook 14 OLED UX3405MA image 3",
    "is_primary": false
  },
  {
    "id": "7076ddf2-3e01-473f-a276-4ac6fa2603aa",
    "product_id": "f832c1a6-3d27-4529-8987-091da207d632",
    "url": "https://res.cloudinary.com/dtbbbq4zr/image/upload/v1781307044/ez4ence/products/upzgv5spgsxxiknhozoy.jpg",
    "alt_text": "Laptop Gaming HP Victus 16-r0129TX image 1",
    "is_primary": true
  },
  {
    "id": "4568b280-3d35-4a62-a662-9cc1d2d8bbfb",
    "product_id": "f832c1a6-3d27-4529-8987-091da207d632",
    "url": "https://res.cloudinary.com/dtbbbq4zr/image/upload/v1781307045/ez4ence/products/n05af8villxbxofqxkui.jpg",
    "alt_text": "Laptop Gaming HP Victus 16-r0129TX image 2",
    "is_primary": false
  },
  {
    "id": "d0264bdb-02fb-40f6-b2b8-cf52b9914dde",
    "product_id": "f832c1a6-3d27-4529-8987-091da207d632",
    "url": "https://res.cloudinary.com/dtbbbq4zr/image/upload/v1781307046/ez4ence/products/lvuhgs4jb0rkqzzzubmr.jpg",
    "alt_text": "Laptop Gaming HP Victus 16-r0129TX image 3",
    "is_primary": false
  },
  {
    "id": "1388cd48-cd85-4fb8-978b-c6c6d734d8a7",
    "product_id": "b128197e-48a5-40aa-8418-2f5155d74b1c",
    "url": "https://res.cloudinary.com/dtbbbq4zr/image/upload/v1781307047/ez4ence/products/dmxa5a43ia62lvmwywmx.jpg",
    "alt_text": "Laptop Dell XPS 13 9340 image 1",
    "is_primary": true
  },
  {
    "id": "3b437153-5763-4d4a-b58c-e1359b4e46e9",
    "product_id": "b128197e-48a5-40aa-8418-2f5155d74b1c",
    "url": "https://res.cloudinary.com/dtbbbq4zr/image/upload/v1781307048/ez4ence/products/wsrecc70jj48motebdff.jpg",
    "alt_text": "Laptop Dell XPS 13 9340 image 2",
    "is_primary": false
  },
  {
    "id": "7096390c-36db-44a2-a778-e19f0c676917",
    "product_id": "b128197e-48a5-40aa-8418-2f5155d74b1c",
    "url": "https://res.cloudinary.com/dtbbbq4zr/image/upload/v1781307048/ez4ence/products/zyyohqkdid6gmtne2orj.jpg",
    "alt_text": "Laptop Dell XPS 13 9340 image 3",
    "is_primary": false
  },
  {
    "id": "01f0def9-4145-464e-a38d-0fceaaed142c",
    "product_id": "1a16164f-51f0-45d9-b9dd-f14ebbd374f5",
    "url": "https://res.cloudinary.com/dtbbbq4zr/image/upload/v1781307973/ez4ence/products/Laptop-Gaming-Acer-Nitro-16-Phoenix-3.webp",
    "alt_text": "Laptop Gaming Acer Nitro 16 Phoenix image 3",
    "is_primary": false
  },
  {
    "id": "f2c4c016-b4e3-413c-b29d-4d99e6f905a9",
    "product_id": "1a16164f-51f0-45d9-b9dd-f14ebbd374f5",
    "url": "https://res.cloudinary.com/dtbbbq4zr/image/upload/v1781308492/ez4ence/products/Laptop-Gaming-Acer-Nitro-16-Phoenix-2.jpg",
    "alt_text": "Laptop Gaming Acer Nitro 16 Phoenix image 2",
    "is_primary": false
  },
  {
    "id": "3814ce65-1941-48bd-adcb-335e201908df",
    "product_id": "8599736d-a766-4bc5-9034-af9257ac1131",
    "url": "https://res.cloudinary.com/dtbbbq4zr/image/upload/v1781338885/ez4ence/products/case-corsair-4000d-airflow-1.jpg",
    "alt_text": "Case Corsair 4000D Airflow image 1",
    "is_primary": true
  },
  {
    "id": "bdff665c-c8d1-4ce1-87dc-bfd6cc272217",
    "product_id": "8599736d-a766-4bc5-9034-af9257ac1131",
    "url": "https://res.cloudinary.com/dtbbbq4zr/image/upload/v1781338886/ez4ence/products/case-corsair-4000d-airflow-2.jpg",
    "alt_text": "Case Corsair 4000D Airflow image 2",
    "is_primary": false
  },
  {
    "id": "580656b6-a07d-48b4-a9de-16ada13d33e1",
    "product_id": "d69649a1-2f8b-4485-863e-431c17ec18fb",
    "url": "https://res.cloudinary.com/dtbbbq4zr/image/upload/v1781284396/ez4ence/products/dvmfrohrj3trkuktdolz.jpg",
    "alt_text": "Apple MacBook Pro 14 M3 image 3",
    "is_primary": false
  },
  {
    "id": "94def40c-cf47-473b-b017-a696f7d7941b",
    "product_id": "abdddb28-5121-4510-8e16-2f70e5f6fc5a",
    "url": "https://res.cloudinary.com/dtbbbq4zr/image/upload/v1781284417/ez4ence/products/wqkknlqjrlojerrfu0n3.png",
    "alt_text": "Laptop Gaming ASUS ROG Strix G16 G614JV - H\u00ecnh 2",
    "is_primary": false
  },
  {
    "id": "adfeb48d-3aad-4a6a-a749-47a50b6a2b2c",
    "product_id": "d69649a1-2f8b-4485-863e-431c17ec18fb",
    "url": "https://res.cloudinary.com/dtbbbq4zr/image/upload/v1781284394/ez4ence/products/hjgofuycpkx5ebxpdrlt.jpg",
    "alt_text": "Apple MacBook Pro 14 M3 image 2",
    "is_primary": false
  },
  {
    "id": "b4a17272-ffd6-48cf-91ba-fd178094059f",
    "product_id": "abdddb28-5121-4510-8e16-2f70e5f6fc5a",
    "url": "https://res.cloudinary.com/dtbbbq4zr/image/upload/v1781284416/ez4ence/products/ryopp3xyapdt85rkinml.png",
    "alt_text": "Laptop Gaming ASUS ROG Strix G16 G614JV - H\u00ecnh 1",
    "is_primary": true
  },
  {
    "id": "c671b782-f6ea-4615-95bb-d0114a8fccf5",
    "product_id": "abdddb28-5121-4510-8e16-2f70e5f6fc5a",
    "url": "https://res.cloudinary.com/dtbbbq4zr/image/upload/v1781284418/ez4ence/products/wcezvzfyhysihoqnkd9h.png",
    "alt_text": "Laptop Gaming ASUS ROG Strix G16 G614JV - H\u00ecnh 3",
    "is_primary": false
  },
  {
    "id": "ccf66ad7-4ff7-43bf-a429-d3b553e11e68",
    "product_id": "d69649a1-2f8b-4485-863e-431c17ec18fb",
    "url": "https://res.cloudinary.com/dtbbbq4zr/image/upload/v1781284392/ez4ence/products/pmyficun6fgoxcgvryn3.jpg",
    "alt_text": "Apple MacBook Pro 14 M3 image 1",
    "is_primary": true
  },
  {
    "id": "e7af275f-3d0b-473b-9151-7b45ccdb687b",
    "product_id": "cebd09e6-1f74-4557-8a96-414f6a5f949d",
    "url": "https://res.cloudinary.com/dtbbbq4zr/image/upload/v1781284420/ez4ence/products/ayuw4pwsbrosbufvurg0.png",
    "alt_text": "Laptop Gaming MSI Katana 15 B13VGK - H\u00ecnh 1",
    "is_primary": true
  },
  {
    "id": "798e90e7-03de-469e-88b1-b6929c26ff0f",
    "product_id": "8599736d-a766-4bc5-9034-af9257ac1131",
    "url": "https://res.cloudinary.com/dtbbbq4zr/image/upload/v1781338886/ez4ence/products/case-corsair-4000d-airflow-3.jpg",
    "alt_text": "Case Corsair 4000D Airflow image 3",
    "is_primary": false
  },
  {
    "id": "922dec5c-7391-46af-9daa-5b3933751170",
    "product_id": "add61a47-0679-406e-9a61-1d94e78b818a",
    "url": "https://res.cloudinary.com/dtbbbq4zr/image/upload/v1781344463/ez4ence/products/nguon-corsair-rm850e-850w-1.png",
    "alt_text": "Ngu\u1ed3n Corsair RM850e 850W image 1",
    "is_primary": true
  },
  {
    "id": "1ae8e6ad-5983-4519-84b3-d2ad001288d3",
    "product_id": "7a576cbd-2a4f-4d90-83c0-9cea2ae00b92",
    "url": "https://res.cloudinary.com/dtbbbq4zr/image/upload/v1781288012/ez4ence/products/lkdccv6b3bqvek2av7vj.jpg",
    "alt_text": "Laptop Gaming ASUS TUF Gaming A15 image 3",
    "is_primary": true
  },
  {
    "id": "7dd7cfad-9806-4441-ad38-870a3305a025",
    "product_id": "7a576cbd-2a4f-4d90-83c0-9cea2ae00b92",
    "url": "https://res.cloudinary.com/dtbbbq4zr/image/upload/v1781288013/ez4ence/products/seksjroyemqbsqibk0ln.jpg",
    "alt_text": "Laptop Gaming ASUS TUF Gaming A15 image 1",
    "is_primary": false
  },
  {
    "id": "0e1ba073-85a6-4813-ab2a-9f445be3bc72",
    "product_id": "cebd09e6-1f74-4557-8a96-414f6a5f949d",
    "url": "https://res.cloudinary.com/dtbbbq4zr/image/upload/v1781284422/ez4ence/products/fj1gttwvql6wk9xjq57o.png",
    "alt_text": "Laptop Gaming MSI Katana 15 B13VGK - H\u00ecnh 3",
    "is_primary": false
  },
  {
    "id": "9e4e2733-6073-4173-8523-5fffae6704f3",
    "product_id": "cebd09e6-1f74-4557-8a96-414f6a5f949d",
    "url": "https://res.cloudinary.com/dtbbbq4zr/image/upload/v1781284421/ez4ence/products/qdt9agd6yeasc0tb1v60.png",
    "alt_text": "Laptop Gaming MSI Katana 15 B13VGK - H\u00ecnh 2",
    "is_primary": false
  },
  {
    "id": "c354eb5b-59ff-40b5-acbc-ccaff5292efe",
    "product_id": "1d0a012e-ea93-47b4-b8a8-a0f68c9d09d6",
    "url": "https://res.cloudinary.com/dtbbbq4zr/image/upload/v1781284424/ez4ence/products/ctn6meovbvunz7l3aus3.png",
    "alt_text": "Laptop Gaming Lenovo Legion 5 16IRX9 - H\u00ecnh 1",
    "is_primary": true
  },
  {
    "id": "d405a8a1-aa13-4f53-b729-3a204b832804",
    "product_id": "1d0a012e-ea93-47b4-b8a8-a0f68c9d09d6",
    "url": "https://res.cloudinary.com/dtbbbq4zr/image/upload/v1781284426/ez4ence/products/jgz6mvmh0olafiaedheo.png",
    "alt_text": "Laptop Gaming Lenovo Legion 5 16IRX9 - H\u00ecnh 2",
    "is_primary": false
  },
  {
    "id": "e6c52ec6-2a54-43ae-8638-1ccf579dd95d",
    "product_id": "1d0a012e-ea93-47b4-b8a8-a0f68c9d09d6",
    "url": "https://res.cloudinary.com/dtbbbq4zr/image/upload/v1781284428/ez4ence/products/xzw5mwixfob4j3tiwa0s.png",
    "alt_text": "Laptop Gaming Lenovo Legion 5 16IRX9 - H\u00ecnh 3",
    "is_primary": false
  },
  {
    "id": "24a81e21-28c3-42f3-a0d7-4b544a0f7642",
    "product_id": "d691360a-785f-4f85-8e70-cc1dcadedf43",
    "url": "https://res.cloudinary.com/dtbbbq4zr/image/upload/v1781354371/ez4ence/products/webcam-logitech-brio-4k-ultra-hd-1.png",
    "alt_text": "Webcam Logitech Brio 4K Ultra HD",
    "is_primary": true
  },
  {
    "id": "4e72d7ee-9bca-4259-8d06-e2cec11af0b5",
    "product_id": "5c911bcb-713b-480c-8a57-8ed727c9dd86",
    "url": "https://res.cloudinary.com/dtbbbq4zr/image/upload/v1781354375/ez4ence/products/loa-may-tinh-logitech-g560-lightsync-pc-gaming-1.png",
    "alt_text": "Loa M\u00e1y T\u00ednh Logitech G560 LIGHTSYNC PC Gaming",
    "is_primary": true
  },
  {
    "id": "d00a4a10-cf65-4127-8f81-84a968a4013e",
    "product_id": "deeea250-8252-430a-9d26-2b57083163b4",
    "url": "https://res.cloudinary.com/dtbbbq4zr/image/upload/v1781354377/ez4ence/products/he-ieu-hanh-windows-11-pro-ban-quyen-digital-1.jpg",
    "alt_text": "H\u1ec7 \u0111i\u1ec1u h\u00e0nh Windows 11 Pro (B\u1ea3n Quy\u1ec1n Digital)",
    "is_primary": true
  },
  {
    "id": "2f5e5463-2153-4b87-9d65-dfff54f33b72",
    "product_id": "7624c1c8-ac4e-44bb-a942-cc2889721300",
    "url": "https://res.cloudinary.com/dtbbbq4zr/image/upload/v1781354378/ez4ence/products/router-wi-fi-6-asus-rt-ax82u-v2-chuan-gaming-1.png",
    "alt_text": "Router Wi-Fi 6 ASUS RT-AX82U v2 Chu\u1ea9n Gaming",
    "is_primary": true
  },
  {
    "id": "1302b77d-79ca-42cf-b8dc-395507bdb41b",
    "product_id": "7a576cbd-2a4f-4d90-83c0-9cea2ae00b92",
    "url": "https://res.cloudinary.com/dtbbbq4zr/image/upload/v1781288014/ez4ence/products/mhebrgub95vwlgk3rhi1.jpg",
    "alt_text": "Laptop Gaming ASUS TUF Gaming A15 image 2",
    "is_primary": false
  },
  {
    "id": "ade438f8-1565-4d7c-8fae-1843da6576b2",
    "product_id": "db8b1df1-a8a6-4bdf-a570-0768b790e99f",
    "url": "https://res.cloudinary.com/dtbbbq4zr/image/upload/v1781354382/ez4ence/products/dich-vu-ve-sinh-bao-duong-pc-tron-goi-1.png",
    "alt_text": "D\u1ecbch V\u1ee5 V\u1ec7 Sinh B\u1ea3o D\u01b0\u1ee1ng PC Tr\u1ecdn G\u00f3i",
    "is_primary": true
  },
  {
    "id": "de3b0d35-932c-4def-90d0-77b113030949",
    "product_id": "6a090fcf-aca5-4a5b-badc-407519fc9ba3",
    "url": "https://res.cloudinary.com/dtbbbq4zr/image/upload/ez4ence/products/tai-nghe-corsair-hs80-rgb-wireless-1.jpg",
    "alt_text": "Tai nghe Corsair HS80 RGB Wireless 1",
    "is_primary": true
  },
  {
    "id": "0399f2ed-248e-4f82-a2c5-4ab97342a790",
    "product_id": "6a090fcf-aca5-4a5b-badc-407519fc9ba3",
    "url": "https://res.cloudinary.com/dtbbbq4zr/image/upload/ez4ence/products/tai-nghe-corsair-hs80-rgb-wireless-2.jpg",
    "alt_text": "Tai nghe Corsair HS80 RGB Wireless 2",
    "is_primary": false
  },
  {
    "id": "f7268f68-84c7-42ae-af52-a39ba5724fe5",
    "product_id": "6a090fcf-aca5-4a5b-badc-407519fc9ba3",
    "url": "https://res.cloudinary.com/dtbbbq4zr/image/upload/ez4ence/products/tai-nghe-corsair-hs80-rgb-wireless-3.jpg",
    "alt_text": "Tai nghe Corsair HS80 RGB Wireless 3",
    "is_primary": false
  },
  {
    "id": "d18bc5f4-8f5a-4a64-8edf-33175143c110",
    "product_id": "a1cfa90b-a3ea-49dd-8bd6-bd0ba2d3bc5b",
    "url": "https://res.cloudinary.com/dtbbbq4zr/image/upload/ez4ence/products/tai-nghe-steelseries-arctis-nova-pro-1.png",
    "alt_text": "Tai nghe SteelSeries Arctis Nova Pro 1",
    "is_primary": true
  },
  {
    "id": "76edf323-787e-428a-906c-a2eb6c350d15",
    "product_id": "a1cfa90b-a3ea-49dd-8bd6-bd0ba2d3bc5b",
    "url": "https://res.cloudinary.com/dtbbbq4zr/image/upload/ez4ence/products/tai-nghe-steelseries-arctis-nova-pro-2.png",
    "alt_text": "Tai nghe SteelSeries Arctis Nova Pro 2",
    "is_primary": false
  },
  {
    "id": "a8a970b3-5af9-4177-bbcb-9f7bf0039bb7",
    "product_id": "a1cfa90b-a3ea-49dd-8bd6-bd0ba2d3bc5b",
    "url": "https://res.cloudinary.com/dtbbbq4zr/image/upload/ez4ence/products/tai-nghe-steelseries-arctis-nova-pro-3.png",
    "alt_text": "Tai nghe SteelSeries Arctis Nova Pro 3",
    "is_primary": false
  },
  {
    "id": "b73e8b98-d8af-41a4-bdbe-faf127f3c8bb",
    "product_id": "d9448278-2754-4a49-9f58-25dff1a926f3",
    "url": "https://res.cloudinary.com/dtbbbq4zr/image/upload/ez4ence/products/tai-nghe-razer-blackshark-v2-1.jpg",
    "alt_text": "Tai nghe Razer BlackShark V2 1",
    "is_primary": true
  },
  {
    "id": "682064f0-8f3c-497d-8244-e7bb040be2ad",
    "product_id": "d9448278-2754-4a49-9f58-25dff1a926f3",
    "url": "https://res.cloudinary.com/dtbbbq4zr/image/upload/ez4ence/products/tai-nghe-razer-blackshark-v2-2.png",
    "alt_text": "Tai nghe Razer BlackShark V2 2",
    "is_primary": false
  },
  {
    "id": "1dc20944-3c1f-4f68-af81-460fefef480c",
    "product_id": "d9448278-2754-4a49-9f58-25dff1a926f3",
    "url": "https://res.cloudinary.com/dtbbbq4zr/image/upload/ez4ence/products/tai-nghe-razer-blackshark-v2-3.png",
    "alt_text": "Tai nghe Razer BlackShark V2 3",
    "is_primary": false
  },
  {
    "id": "997afd86-ee6e-4b77-abd7-e73b708c0f5b",
    "product_id": "50118b77-7023-42d9-966d-091da8c12c9d",
    "url": "https://res.cloudinary.com/dtbbbq4zr/image/upload/v1781330521/ez4ence/products/Ban-phim-co-Corsair-K70-RGB-PRO-2.jpg",
    "alt_text": "Corsair K70 RGB 1",
    "is_primary": true
  },
  {
    "id": "b03c6865-3aaf-4bc6-ae83-b34cc9adaa39",
    "product_id": "50118b77-7023-42d9-966d-091da8c12c9d",
    "url": "https://res.cloudinary.com/dtbbbq4zr/image/upload/v1781330523/ez4ence/products/Ban-phim-co-Corsair-K70-RGB-PRO-3.png",
    "alt_text": "Corsair K70 RGB 2",
    "is_primary": false
  },
  {
    "id": "8b09565e-fcb0-47cf-a750-5a1b81e977e3",
    "product_id": "50118b77-7023-42d9-966d-091da8c12c9d",
    "url": "https://res.cloudinary.com/dtbbbq4zr/image/upload/v1781330520/ez4ence/products/Ban-phim-co-Corsair-K70-RGB-PRO-1.webp",
    "alt_text": "Corsair K70 RGB 3",
    "is_primary": false
  },
  {
    "id": "c2cb731a-a349-4e2a-a739-3426ef641b09",
    "product_id": "1cc36166-2e7e-4e74-85ee-b64316ffde03",
    "url": "https://res.cloudinary.com/dtbbbq4zr/image/upload/v1781314097/ez4ence/products/Card%20M%C3%A0n%20H%C3%ACnh%20ASUS%20ROG%20Strix%20GeForce%20RTX%204090%20OC%20Edition%2024GB_0.png",
    "alt_text": "Card M\u00e0n H\u00ecnh ASUS ROG Strix GeForce RTX 4090 OC Edition 24GB 1",
    "is_primary": true
  },
  {
    "id": "3ff42eae-4c60-4426-94a8-8940042e5dc6",
    "product_id": "ba539d8b-7b56-49b9-8622-269819795978",
    "url": "https://res.cloudinary.com/dtbbbq4zr/image/upload/v1781314099/ez4ence/products/Mainboard%20GIGABYTE%20Z790%20AORUS%20ELITE%20AX_0.png",
    "alt_text": "Mainboard GIGABYTE Z790 AORUS ELITE AX 1",
    "is_primary": true
  },
  {
    "id": "e61ec2e9-95bd-418c-b124-e68638277276",
    "product_id": "a64b8ab5-8093-4e54-a477-9897dc9ed69b",
    "url": "https://res.cloudinary.com/dtbbbq4zr/image/upload/v1781346810/ez4ence/products/case-nzxt-h9-flow-dual-chamber-atx-mid-tower-%C4%91en-2_hq.png",
    "alt_text": "Case NZXT H9 Flow Dual-Chamber ATX Mid-Tower (\u0110en) 1",
    "is_primary": true
  },
  {
    "id": "c1e331d5-24d9-4b45-940d-a84f1a6c2745",
    "product_id": "a64b8ab5-8093-4e54-a477-9897dc9ed69b",
    "url": "https://res.cloudinary.com/dtbbbq4zr/image/upload/v1781346409/ez4ence/products/case-nzxt-h9-flow-dual-chamber-atx-mid-tower-%C4%91en-1.jpg",
    "alt_text": "Case NZXT H9 Flow Dual-Chamber ATX Mid-Tower (\u0110en) 2",
    "is_primary": false
  },
  {
    "id": "81c638ce-fa73-4359-85bc-f95b586a6444",
    "product_id": "a64b8ab5-8093-4e54-a477-9897dc9ed69b",
    "url": "https://res.cloudinary.com/dtbbbq4zr/image/upload/v1781346811/ez4ence/products/case-nzxt-h9-flow-dual-chamber-atx-mid-tower-%C4%91en-3_hq.png",
    "alt_text": "Case NZXT H9 Flow Dual-Chamber ATX Mid-Tower (\u0110en) 3",
    "is_primary": false
  },
  {
    "id": "fcc5aec7-9ada-4bd4-9fbd-b4507b7fcbd8",
    "product_id": "202d9bae-1a60-431e-80dc-6add19e0daa4",
    "url": "https://res.cloudinary.com/dtbbbq4zr/image/upload/v1781346815/ez4ence/products/ngu%E1%BB%93n-m%C3%A1y-t%C3%ADnh-corsair-rm1000x-shift-80-plus-gold-3_hq.jpg",
    "alt_text": "Ngu\u1ed3n m\u00e1y t\u00ednh Corsair RM1000x Shift 80 PLUS Gold 1",
    "is_primary": true
  },
  {
    "id": "1573f594-a1e3-4b74-8502-254dcbb66a69",
    "product_id": "202d9bae-1a60-431e-80dc-6add19e0daa4",
    "url": "https://res.cloudinary.com/dtbbbq4zr/image/upload/v1781346813/ez4ence/products/ngu%E1%BB%93n-m%C3%A1y-t%C3%ADnh-corsair-rm1000x-shift-80-plus-gold-1_hq.jpg",
    "alt_text": "Ngu\u1ed3n m\u00e1y t\u00ednh Corsair RM1000x Shift 80 PLUS Gold 2",
    "is_primary": false
  },
  {
    "id": "55929cbf-4bee-4c48-84d8-da4280195f5b",
    "product_id": "202d9bae-1a60-431e-80dc-6add19e0daa4",
    "url": "https://res.cloudinary.com/dtbbbq4zr/image/upload/v1781346814/ez4ence/products/ngu%E1%BB%93n-m%C3%A1y-t%C3%ADnh-corsair-rm1000x-shift-80-plus-gold-2_hq.jpg",
    "alt_text": "Ngu\u1ed3n m\u00e1y t\u00ednh Corsair RM1000x Shift 80 PLUS Gold 3",
    "is_primary": false
  },
  {
    "id": "d7eb37ff-31b6-4c4a-9cf2-c039fdded4f1",
    "product_id": "400460c7-89dc-42db-8d70-d1d8aceeaf29",
    "url": "https://res.cloudinary.com/dtbbbq4zr/image/upload/v1781346816/ez4ence/products/t%E1%BA%A3n-nhi%E1%BB%87t-n%C6%B0%E1%BB%9Bc-nzxt-kraken-elite-360-rgb-1_hq.jpg",
    "alt_text": "T\u1ea3n nhi\u1ec7t n\u01b0\u1edbc NZXT Kraken Elite 360 RGB 1",
    "is_primary": true
  },
  {
    "id": "8f7d9aab-5576-4492-a86c-d0b522f71c9d",
    "product_id": "400460c7-89dc-42db-8d70-d1d8aceeaf29",
    "url": "https://res.cloudinary.com/dtbbbq4zr/image/upload/v1781346819/ez4ence/products/t%E1%BA%A3n-nhi%E1%BB%87t-n%C6%B0%E1%BB%9Bc-nzxt-kraken-elite-360-rgb-3_hq.jpg",
    "alt_text": "T\u1ea3n nhi\u1ec7t n\u01b0\u1edbc NZXT Kraken Elite 360 RGB 2",
    "is_primary": false
  },
  {
    "id": "734ecab1-527a-4dad-869c-57557c5fccb6",
    "product_id": "400460c7-89dc-42db-8d70-d1d8aceeaf29",
    "url": "https://res.cloudinary.com/dtbbbq4zr/image/upload/v1781346415/ez4ence/products/t%E1%BA%A3n-nhi%E1%BB%87t-n%C6%B0%E1%BB%9Bc-nzxt-kraken-elite-360-rgb-1.jpg",
    "alt_text": "T\u1ea3n nhi\u1ec7t n\u01b0\u1edbc NZXT Kraken Elite 360 RGB 3",
    "is_primary": false
  },
  {
    "id": "0b5805c9-5dce-4046-8ce6-f391e187b978",
    "product_id": "2eb35990-22ec-440e-8fcd-d7dddfcfede5",
    "url": "https://res.cloudinary.com/dtbbbq4zr/image/upload/v1781329483/ez4ence/products/Man-hinh-LG-UltraGear-27GR95QE-B-2.jpg",
    "alt_text": "M\u00e0n h\u00ecnh LG UltraGear 27GR95QE-B 27 inch OLED 240Hz 1",
    "is_primary": true
  },
  {
    "id": "ce93fb50-3ab2-4b9d-b695-72cb2421d3c2",
    "product_id": "2eb35990-22ec-440e-8fcd-d7dddfcfede5",
    "url": "https://res.cloudinary.com/dtbbbq4zr/image/upload/v1781329482/ez4ence/products/Man-hinh-LG-UltraGear-27GR95QE-B-1.jpg",
    "alt_text": "M\u00e0n h\u00ecnh LG UltraGear 27GR95QE-B 27 inch OLED 240Hz 2",
    "is_primary": false
  },
  {
    "id": "2616520e-d3b6-4b04-a656-4da1a2652e3a",
    "product_id": "2eb35990-22ec-440e-8fcd-d7dddfcfede5",
    "url": "https://res.cloudinary.com/dtbbbq4zr/image/upload/v1781329484/ez4ence/products/Man-hinh-LG-UltraGear-27GR95QE-B-3.jpg",
    "alt_text": "M\u00e0n h\u00ecnh LG UltraGear 27GR95QE-B 27 inch OLED 240Hz 3",
    "is_primary": false
  },
  {
    "id": "10109aeb-f63f-4ec6-acd0-23910db04e77",
    "product_id": "adafff4d-d064-444d-aece-1f5150af3b03",
    "url": "https://res.cloudinary.com/dtbbbq4zr/image/upload/v1781329485/ez4ence/products/Man-hinh-ASUS-ROG-Swift-PG259QN-1.png",
    "alt_text": "M\u00e0n h\u00ecnh ASUS ROG Swift 360Hz PG259QN 1",
    "is_primary": true
  },
  {
    "id": "a9f33e30-470e-4998-a65f-1451ddf2a094",
    "product_id": "adafff4d-d064-444d-aece-1f5150af3b03",
    "url": "https://res.cloudinary.com/dtbbbq4zr/image/upload/v1781329487/ez4ence/products/Man-hinh-ASUS-ROG-Swift-PG259QN-3.png",
    "alt_text": "M\u00e0n h\u00ecnh ASUS ROG Swift 360Hz PG259QN 2",
    "is_primary": false
  },
  {
    "id": "ed94aa3c-5f6d-41b6-b207-4d0075620713",
    "product_id": "adafff4d-d064-444d-aece-1f5150af3b03",
    "url": "https://res.cloudinary.com/dtbbbq4zr/image/upload/v1781329486/ez4ence/products/Man-hinh-ASUS-ROG-Swift-PG259QN-2.png",
    "alt_text": "M\u00e0n h\u00ecnh ASUS ROG Swift 360Hz PG259QN 3",
    "is_primary": false
  },
  {
    "id": "88176fa0-723e-437d-9736-462debe7422c",
    "product_id": "5d02b473-ed4a-4aa2-8f0c-b97fd2614548",
    "url": "https://res.cloudinary.com/dtbbbq4zr/image/upload/v1781314094/ez4ence/products/CPU%20Intel%20Core%20i9-14900K_0.jpg",
    "alt_text": "CPU Intel Core i9-14900K 1",
    "is_primary": true
  },
  {
    "id": "4bf0146b-2dbb-4a01-be28-0ab04b718b36",
    "product_id": "9f1295ba-f8a1-4f61-9dee-f12d4f60147e",
    "url": "https://res.cloudinary.com/dtbbbq4zr/image/upload/v1781330523/ez4ence/products/Ban-phim-co-Corsair-K70-RGB-PRO-3.png",
    "alt_text": "B\u00e0n ph\u00edm c\u01a1 Corsair K70 RGB PRO Cherry MX Red 1",
    "is_primary": true
  },
  {
    "id": "55a79eed-da3f-4896-bf0f-e8940744937d",
    "product_id": "9f1295ba-f8a1-4f61-9dee-f12d4f60147e",
    "url": "https://res.cloudinary.com/dtbbbq4zr/image/upload/v1781330521/ez4ence/products/Ban-phim-co-Corsair-K70-RGB-PRO-2.jpg",
    "alt_text": "B\u00e0n ph\u00edm c\u01a1 Corsair K70 RGB PRO Cherry MX Red 2",
    "is_primary": false
  },
  {
    "id": "6ca7ba86-371c-40e4-a9f2-7151a4ea978f",
    "product_id": "9f1295ba-f8a1-4f61-9dee-f12d4f60147e",
    "url": "https://res.cloudinary.com/dtbbbq4zr/image/upload/v1781330520/ez4ence/products/Ban-phim-co-Corsair-K70-RGB-PRO-1.webp",
    "alt_text": "B\u00e0n ph\u00edm c\u01a1 Corsair K70 RGB PRO Cherry MX Red 3",
    "is_primary": false
  },
  {
    "id": "641e35e0-92f6-47d8-8650-afe87193e693",
    "product_id": "a9b3ffcc-22f1-40d7-b8af-f84b5602edc3",
    "url": "https://res.cloudinary.com/dtbbbq4zr/image/upload/v1781330529/ez4ence/products/Ban-phim-co-Razer-Huntsman-V2-Analog-3.jpg",
    "alt_text": "B\u00e0n ph\u00edm c\u01a1 Razer Huntsman V2 Analog 1",
    "is_primary": true
  },
  {
    "id": "3cd0ad05-05f1-4295-92ac-baaf7c5e1e47",
    "product_id": "a9b3ffcc-22f1-40d7-b8af-f84b5602edc3",
    "url": "https://res.cloudinary.com/dtbbbq4zr/image/upload/v1781330525/ez4ence/products/Ban-phim-co-Razer-Huntsman-V2-Analog-1.jpg",
    "alt_text": "B\u00e0n ph\u00edm c\u01a1 Razer Huntsman V2 Analog 2",
    "is_primary": false
  },
  {
    "id": "581c6605-0901-4236-9fba-2746bf81b175",
    "product_id": "a9b3ffcc-22f1-40d7-b8af-f84b5602edc3",
    "url": "https://res.cloudinary.com/dtbbbq4zr/image/upload/v1781330526/ez4ence/products/Ban-phim-co-Razer-Huntsman-V2-Analog-2.jpg",
    "alt_text": "B\u00e0n ph\u00edm c\u01a1 Razer Huntsman V2 Analog 3",
    "is_primary": false
  },
  {
    "id": "7a820308-5a6e-48ad-ae3a-a55260e79275",
    "product_id": "a792e3fd-8d80-4bae-9fa2-b27ee2802550",
    "url": "https://res.cloudinary.com/dtbbbq4zr/image/upload/v1781331407/ez4ence/products/Chuot-Khong-Day-Logitech-G-Pro-X-Superlight-2-1.jpg",
    "alt_text": "Chu\u1ed9t Kh\u00f4ng D\u00e2y Logitech G Pro X Superlight 2 (\u0110en) 1",
    "is_primary": true
  },
  {
    "id": "6271a212-85c8-41bc-8565-12850343c15a",
    "product_id": "a792e3fd-8d80-4bae-9fa2-b27ee2802550",
    "url": "https://res.cloudinary.com/dtbbbq4zr/image/upload/v1781331411/ez4ence/products/Chuot-Khong-Day-Logitech-G-Pro-X-Superlight-2-3.jpg",
    "alt_text": "Chu\u1ed9t Kh\u00f4ng D\u00e2y Logitech G Pro X Superlight 2 (\u0110en) 2",
    "is_primary": false
  },
  {
    "id": "7210f1e1-bb7c-406d-bdd2-8e927cb86df4",
    "product_id": "add61a47-0679-406e-9a61-1d94e78b818a",
    "url": "https://res.cloudinary.com/dtbbbq4zr/image/upload/v1781344485/ez4ence/products/nguon-corsair-rm850e-850w-2.png",
    "alt_text": "Ngu\u1ed3n Corsair RM850e 850W image 2",
    "is_primary": false
  },
  {
    "id": "8cbf89bf-aca0-4c7a-956b-25146f285340",
    "product_id": "add61a47-0679-406e-9a61-1d94e78b818a",
    "url": "https://res.cloudinary.com/dtbbbq4zr/image/upload/v1781344508/ez4ence/products/nguon-corsair-rm850e-850w-3.png",
    "alt_text": "Ngu\u1ed3n Corsair RM850e 850W image 3",
    "is_primary": false
  },
  {
    "id": "47b06549-9321-4fad-a10a-996e2a5f4a62",
    "product_id": "3aef8961-342a-4381-a1e1-ba366519d89e",
    "url": "https://res.cloudinary.com/dtbbbq4zr/image/upload/v1781344529/ez4ence/products/tan-nhiet-nuoc-nzxt-kraken-elite-360-1.jpg",
    "alt_text": "T\u1ea3n nhi\u1ec7t n\u01b0\u1edbc NZXT Kraken Elite 360 image 1",
    "is_primary": true
  },
  {
    "id": "b278f255-c327-4a95-b10d-586c6c5963f5",
    "product_id": "3aef8961-342a-4381-a1e1-ba366519d89e",
    "url": "https://res.cloudinary.com/dtbbbq4zr/image/upload/v1781344550/ez4ence/products/tan-nhiet-nuoc-nzxt-kraken-elite-360-2.jpg",
    "alt_text": "T\u1ea3n nhi\u1ec7t n\u01b0\u1edbc NZXT Kraken Elite 360 image 2",
    "is_primary": false
  },
  {
    "id": "5bda69a7-2ea4-4e52-a09b-a14d2e8bca6b",
    "product_id": "3aef8961-342a-4381-a1e1-ba366519d89e",
    "url": "https://res.cloudinary.com/dtbbbq4zr/image/upload/v1781344571/ez4ence/products/tan-nhiet-nuoc-nzxt-kraken-elite-360-3.jpg",
    "alt_text": "T\u1ea3n nhi\u1ec7t n\u01b0\u1edbc NZXT Kraken Elite 360 image 3",
    "is_primary": false
  },
  {
    "id": "7c797cb2-f70f-4f95-ace8-8e63255864d3",
    "product_id": "5b86f872-f21f-4e07-a1bd-84de9cbfe85f",
    "url": "https://res.cloudinary.com/dtbbbq4zr/image/upload/v1781344594/ez4ence/products/case-nzxt-h9-flow-1.png",
    "alt_text": "Case NZXT H9 Flow image 1",
    "is_primary": true
  },
  {
    "id": "8b5c6e59-658a-4e64-9c3f-b6e8c9666417",
    "product_id": "5b86f872-f21f-4e07-a1bd-84de9cbfe85f",
    "url": "https://res.cloudinary.com/dtbbbq4zr/image/upload/v1781344617/ez4ence/products/case-nzxt-h9-flow-2.png",
    "alt_text": "Case NZXT H9 Flow image 2",
    "is_primary": false
  },
  {
    "id": "9d65bf17-edfa-4380-a450-027752c6cd12",
    "product_id": "5b86f872-f21f-4e07-a1bd-84de9cbfe85f",
    "url": "https://res.cloudinary.com/dtbbbq4zr/image/upload/v1781344639/ez4ence/products/case-nzxt-h9-flow-3.png",
    "alt_text": "Case NZXT H9 Flow image 3",
    "is_primary": false
  },
  {
    "id": "7774abfc-c83d-4b69-bb8d-1e3f748df5ce",
    "product_id": "df36d128-3a47-4b20-8fab-20f18fc2b8c8",
    "url": "https://res.cloudinary.com/dtbbbq4zr/image/upload/v1781418764/ez4ence/products/may-choi-game-valve-steam-deck-oled-512gb-1.jpg",
    "alt_text": "M\u00e1y ch\u01a1i game Valve Steam Deck OLED 512GB 1",
    "is_primary": true
  },
  {
    "id": "22e7dab2-f39e-4346-b8a0-d0f21e8b70fb",
    "product_id": "df36d128-3a47-4b20-8fab-20f18fc2b8c8",
    "url": "https://res.cloudinary.com/dtbbbq4zr/image/upload/v1781418765/ez4ence/products/may-choi-game-valve-steam-deck-oled-512gb-2.webp",
    "alt_text": "M\u00e1y ch\u01a1i game Valve Steam Deck OLED 512GB 2",
    "is_primary": false
  },
  {
    "id": "62d8d5b8-8ccb-4948-b027-22975f768572",
    "product_id": "df36d128-3a47-4b20-8fab-20f18fc2b8c8",
    "url": "https://res.cloudinary.com/dtbbbq4zr/image/upload/v1781418767/ez4ence/products/may-choi-game-valve-steam-deck-oled-512gb-3.jpg",
    "alt_text": "M\u00e1y ch\u01a1i game Valve Steam Deck OLED 512GB 3",
    "is_primary": false
  },
  {
    "id": "d3257ecc-adef-4a43-b5b8-1a96b7415909",
    "product_id": "cd9de695-205a-4f4c-a1c2-6a130511ba09",
    "url": "https://res.cloudinary.com/dtbbbq4zr/image/upload/v1781418768/ez4ence/products/may-choi-game-sony-playstation-5-ps5-slim-standard-1.jpg",
    "alt_text": "M\u00e1y ch\u01a1i game Sony PlayStation 5 (PS5) Slim Standard 1",
    "is_primary": true
  },
  {
    "id": "eb4b01a4-1cdc-4308-8c28-fdb65d6ef206",
    "product_id": "cd9de695-205a-4f4c-a1c2-6a130511ba09",
    "url": "https://res.cloudinary.com/dtbbbq4zr/image/upload/v1781418770/ez4ence/products/may-choi-game-sony-playstation-5-ps5-slim-standard-2.jpg",
    "alt_text": "M\u00e1y ch\u01a1i game Sony PlayStation 5 (PS5) Slim Standard 2",
    "is_primary": false
  },
  {
    "id": "63d95da0-c448-4975-8ed4-d2e861e7532b",
    "product_id": "cd9de695-205a-4f4c-a1c2-6a130511ba09",
    "url": "https://res.cloudinary.com/dtbbbq4zr/image/upload/v1781418771/ez4ence/products/may-choi-game-sony-playstation-5-ps5-slim-standard-3.jpg",
    "alt_text": "M\u00e1y ch\u01a1i game Sony PlayStation 5 (PS5) Slim Standard 3",
    "is_primary": false
  },
  {
    "id": "37981222-69f2-4be3-a19a-2359c4743ba0",
    "product_id": "8c9f9097-99b8-4b11-b13f-235500b80aae",
    "url": "https://res.cloudinary.com/dtbbbq4zr/image/upload/v1781418764/ez4ence/products/dummy-accessory.jpg",
    "alt_text": "Balo ROG",
    "is_primary": true
  },
  {
    "id": "c89b5d41-e2b2-4791-b66a-0546936a61c5",
    "product_id": "d196e5b3-a717-45de-8e74-be9b388ec83c",
    "url": "https://images.unsplash.com/photo-1591799264318-7e6ef8ddb7ea?auto=format&fit=crop&w=400&q=80",
    "alt_text": "CPU INTEL CORE I5 13600KF (3.5GHZ TURBO UP TO 5.1GHZ, 14 NH\u00c2N 20 LU\u1ed2NG, 20MB CACHE, 125W)",
    "is_primary": true
  },
  {
    "id": "a8a59b6c-fceb-4543-8f9f-0f3077842a5f",
    "product_id": "1deb0839-d157-41c1-8e8e-8f11039dc9e7",
    "url": "https://images.unsplash.com/photo-1591799264318-7e6ef8ddb7ea?auto=format&fit=crop&w=400&q=80",
    "alt_text": "CPU AMD RYZEN 9 7950X3D (4.2GHZ BOOST 5.7GHZ, 16 NH\u00c2N 32 LU\u1ed2NG)",
    "is_primary": true
  },
  {
    "id": "c55c8fca-9d36-4663-b059-4008100cd83d",
    "product_id": "28901278-8268-454a-988e-921315a2bb75",
    "url": "https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=400&q=80",
    "alt_text": "Mainboard ASUS ROG MAXIMUS Z790 HERO",
    "is_primary": true
  },
  {
    "id": "dfae99a5-e980-44f6-b346-1fc7e489ad10",
    "product_id": "bbffbaf4-11a7-495a-8f36-de59b16d6ea6",
    "url": "https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=400&q=80",
    "alt_text": "Mainboard GIGABYTE B760M AORUS ELITE AX",
    "is_primary": true
  },
  {
    "id": "41b5bf97-1a8c-4dd4-b7f5-abc96e2751da",
    "product_id": "55eda567-7cf3-45e8-bc50-8b2dade1e9ff",
    "url": "https://images.unsplash.com/photo-1563687462186-b4845186b5b8?auto=format&fit=crop&w=400&q=80",
    "alt_text": "RAM Corsair Dominator Platinum RGB 32GB (2x16GB) DDR5 6200MHz",
    "is_primary": true
  },
  {
    "id": "50dcc884-aab9-4b26-a317-54fd6175fbd6",
    "product_id": "97c46ea3-a056-4034-9c52-95f9a8a48c3a",
    "url": "https://images.unsplash.com/photo-1591488320449-011701bb6704?auto=format&fit=crop&w=400&q=80",
    "alt_text": "VGA MSI GeForce RTX 4060 Ti Ventus 2X Black 8G OC",
    "is_primary": true
  },
  {
    "id": "68a3b195-d405-4771-af40-81fb78112a0a",
    "product_id": "22d0ca13-e482-4e81-a19e-381f086d8885",
    "url": "https://images.unsplash.com/photo-1591488320449-011701bb6704?auto=format&fit=crop&w=400&q=80",
    "alt_text": "VGA GIGABYTE AORUS GeForce RTX 4080 SUPER MASTER 16G",
    "is_primary": true
  },
  {
    "id": "a0a6a07a-3f19-4096-a0e3-77c1ed4d3380",
    "product_id": "771109fa-6328-42bc-8f40-c63d7d432b3a",
    "url": "https://images.unsplash.com/photo-1531492746076-161ca9bcad58?auto=format&fit=crop&w=400&q=80",
    "alt_text": "\u1ed4 c\u1ee9ng SSD Samsung 990 PRO 1TB PCIe Gen 4.0 x4 NVMe",
    "is_primary": true
  },
  {
    "id": "66e803b3-0a0f-44e4-9d2f-7f003dd1a901",
    "product_id": "49edb037-01d7-474a-a590-92e38459049a",
    "url": "https://images.unsplash.com/photo-1587202372775-e229f172b9d7?auto=format&fit=crop&w=400&q=80",
    "alt_text": "Ngu\u1ed3n Corsair RM1000e 1000W 80 Plus Gold - Fully Modular",
    "is_primary": true
  },
  {
    "id": "578ceccf-d465-42e3-bbb3-2d2e05c1c79a",
    "product_id": "5396472c-16c9-4105-b098-34a0bdc0b672",
    "url": "https://images.unsplash.com/photo-1587202372634-32705e3bf49c?auto=format&fit=crop&w=400&q=80",
    "alt_text": "Case NZXT H9 Flow Matte White",
    "is_primary": true
  },
  {
    "id": "6c6ba918-ba8b-4b6a-b592-6873c65f8118",
    "product_id": "34d6f12d-b710-4eee-9e30-5e23356dd7f9",
    "url": "https://images.unsplash.com/photo-1587202372775-e229f172b9d7?auto=format&fit=crop&w=400&q=80",
    "alt_text": "T\u1ea3n nhi\u1ec7t n\u01b0\u1edbc NZXT Kraken Elite 360 RGB White",
    "is_primary": true
  },
  {
    "id": "ecae632d-85d9-4c80-8d7e-d36de208f58c",
    "product_id": "783a6615-3e15-4ba6-a81a-29938a086a23",
    "url": "https://images.unsplash.com/photo-1603302576837-37561b2e2302?auto=format&fit=crop&w=800&q=80",
    "alt_text": null,
    "is_primary": true
  }
]

NEWS_DATA = [
  {
    "id": "cf68e9d1-0068-48da-a286-d38bc488ab19",
    "title": "NVIDIA RTX 5090 r\u00f2 r\u1ec9 th\u00f4ng s\u1ed1 kh\u1ee7ng, m\u1ea1nh g\u1ea5p \u0111\u00f4i RTX 4090?",
    "slug": "nvidia-rtx-5090-ro-ri-thong-so-khung",
    "summary": "Tin t\u1ee9c c\u00f4ng ngh\u1ec7 m\u1edbi nh\u1ea5t trong ng\u00e0y. N\u1eafm b\u1eaft xu h\u01b0\u1edbng, c\u1eadp nh\u1eadt ph\u1ea7n c\u1ee9ng, tr\u1ea3i nghi\u1ec7m c\u00f4ng ngh\u1ec7 tuy\u1ec7t \u0111\u1ec9nh.",
    "content": "<p>\u0110\u00e2y l\u00e0 b\u00e0i vi\u1ebft chi ti\u1ebft \u0111\u01b0\u1ee3c t\u1ea1o t\u1ef1 \u0111\u1ed9ng b\u1edfi h\u1ec7 th\u1ed1ng... B\u1ea1n c\u00f3 th\u1ec3 t\u1ef1 do ch\u1ec9nh s\u1eeda n\u1ed9i dung b\u00e0i vi\u1ebft n\u00e0y th\u00f4ng qua tr\u00ecnh qu\u1ea3n l\u00fd Admin nh\u00e9.</p>",
    "image_url": "https://images.unsplash.com/photo-1591488320449-011701bb6704?auto=format&fit=crop&w=400&q=80",
    "category": "Ph\u1ea7n C\u1ee9ng",
    "is_active": true,
    "published_at": "2026-06-15T23:03:18.088910+07:00",
    "created_at": "2026-06-15T23:03:18.087700+07:00",
    "updated_at": "2026-06-15T23:03:18.087700+07:00"
  },
  {
    "id": "0b22c8b7-0eeb-4585-a157-74708df83971",
    "title": "Intel Core Ultra 200 series ch\u00ednh th\u1ee9c ra m\u1eaft, thi\u1ebft l\u1eadp ti\u00eau chu\u1ea9n m\u1edbi",
    "slug": "intel-core-ultra-200-series-chinh-thuc-ra-mat",
    "summary": "Tin t\u1ee9c c\u00f4ng ngh\u1ec7 m\u1edbi nh\u1ea5t trong ng\u00e0y. N\u1eafm b\u1eaft xu h\u01b0\u1edbng, c\u1eadp nh\u1eadt ph\u1ea7n c\u1ee9ng, tr\u1ea3i nghi\u1ec7m c\u00f4ng ngh\u1ec7 tuy\u1ec7t \u0111\u1ec9nh.",
    "content": "<p>\u0110\u00e2y l\u00e0 b\u00e0i vi\u1ebft chi ti\u1ebft \u0111\u01b0\u1ee3c t\u1ea1o t\u1ef1 \u0111\u1ed9ng b\u1edfi h\u1ec7 th\u1ed1ng... B\u1ea1n c\u00f3 th\u1ec3 t\u1ef1 do ch\u1ec9nh s\u1eeda n\u1ed9i dung b\u00e0i vi\u1ebft n\u00e0y th\u00f4ng qua tr\u00ecnh qu\u1ea3n l\u00fd Admin nh\u00e9.</p>",
    "image_url": "https://images.unsplash.com/photo-1591799264318-7e6ef8ddb7ea?auto=format&fit=crop&w=400&q=80",
    "category": "CPU",
    "is_active": true,
    "published_at": "2026-06-15T23:03:18.089558+07:00",
    "created_at": "2026-06-15T23:03:18.087700+07:00",
    "updated_at": "2026-06-15T23:03:18.087700+07:00"
  },
  {
    "id": "f5e196bf-4053-4390-8a98-f43fdc27c363",
    "title": "Apple h\u00e9 l\u1ed9 chip M4 Max c\u1ef1c m\u1ea1nh tr\u00ean MacBook Pro th\u1ebf h\u1ec7 m\u1edbi",
    "slug": "apple-he-lo-chip-m4-max",
    "summary": "Tin t\u1ee9c c\u00f4ng ngh\u1ec7 m\u1edbi nh\u1ea5t trong ng\u00e0y. N\u1eafm b\u1eaft xu h\u01b0\u1edbng, c\u1eadp nh\u1eadt ph\u1ea7n c\u1ee9ng, tr\u1ea3i nghi\u1ec7m c\u00f4ng ngh\u1ec7 tuy\u1ec7t \u0111\u1ec9nh.",
    "content": "<p>\u0110\u00e2y l\u00e0 b\u00e0i vi\u1ebft chi ti\u1ebft \u0111\u01b0\u1ee3c t\u1ea1o t\u1ef1 \u0111\u1ed9ng b\u1edfi h\u1ec7 th\u1ed1ng... B\u1ea1n c\u00f3 th\u1ec3 t\u1ef1 do ch\u1ec9nh s\u1eeda n\u1ed9i dung b\u00e0i vi\u1ebft n\u00e0y th\u00f4ng qua tr\u00ecnh qu\u1ea3n l\u00fd Admin nh\u00e9.</p>",
    "image_url": "https://images.unsplash.com/photo-1517336714731-489689fd1ca8?auto=format&fit=crop&w=400&q=80",
    "category": "Laptop",
    "is_active": true,
    "published_at": "2026-06-15T23:03:18.089962+07:00",
    "created_at": "2026-06-15T23:03:18.087700+07:00",
    "updated_at": "2026-06-15T23:03:18.087700+07:00"
  },
  {
    "id": "100fd576-aae9-415b-8fb4-1085e0b0c656",
    "title": "Top 5 b\u00e0n ph\u00edm c\u01a1 Custom \u0111\u00e1ng mua nh\u1ea5t t\u1ea7m gi\u00e1 d\u01b0\u1edbi 2 tri\u1ec7u",
    "slug": "top-5-ban-phim-co-custom-duoi-2-trieu",
    "summary": "Tin t\u1ee9c c\u00f4ng ngh\u1ec7 m\u1edbi nh\u1ea5t trong ng\u00e0y. N\u1eafm b\u1eaft xu h\u01b0\u1edbng, c\u1eadp nh\u1eadt ph\u1ea7n c\u1ee9ng, tr\u1ea3i nghi\u1ec7m c\u00f4ng ngh\u1ec7 tuy\u1ec7t \u0111\u1ec9nh.",
    "content": "<p>\u0110\u00e2y l\u00e0 b\u00e0i vi\u1ebft chi ti\u1ebft \u0111\u01b0\u1ee3c t\u1ea1o t\u1ef1 \u0111\u1ed9ng b\u1edfi h\u1ec7 th\u1ed1ng... B\u1ea1n c\u00f3 th\u1ec3 t\u1ef1 do ch\u1ec9nh s\u1eeda n\u1ed9i dung b\u00e0i vi\u1ebft n\u00e0y th\u00f4ng qua tr\u00ecnh qu\u1ea3n l\u00fd Admin nh\u00e9.</p>",
    "image_url": "https://images.unsplash.com/photo-1595225476474-87563907a212?auto=format&fit=crop&w=400&q=80",
    "category": "\u0110\u00e1nh Gi\u00e1",
    "is_active": true,
    "published_at": "2026-06-15T23:03:18.090432+07:00",
    "created_at": "2026-06-15T23:03:18.087700+07:00",
    "updated_at": "2026-06-15T23:03:18.087700+07:00"
  }
]

BANNERS_DATA = [
  {
    "id": "8f8cc61b-94fc-4b22-b7e0-b0c99898b7f9",
    "title": "Bento Main 1",
    "image_url": "https://images.unsplash.com/photo-1542751371-adc38448a05e?auto=format&fit=crop&w=1200&q=80",
    "link_url": "/products",
    "position": "bento_main",
    "is_active": true,
    "start_date": null,
    "end_date": null,
    "created_at": "2026-06-15T23:07:49.629990+07:00",
    "updated_at": "2026-06-15T23:07:49.629990+07:00"
  },
  {
    "id": "c9009b11-7b8c-4cc9-9785-12dee204f79b",
    "title": "Bento Main 2",
    "image_url": "https://images.unsplash.com/photo-1593640408182-31c70c8268f5?auto=format&fit=crop&w=1200&q=80",
    "link_url": "/products",
    "position": "bento_main",
    "is_active": true,
    "start_date": null,
    "end_date": null,
    "created_at": "2026-06-15T23:07:49.629990+07:00",
    "updated_at": "2026-06-15T23:07:49.629990+07:00"
  },
  {
    "id": "dd6d8f7c-b520-4611-b975-f5766e54ecc9",
    "title": "Bento Main 3",
    "image_url": "https://images.unsplash.com/photo-1600861194942-f883de0dfe96?auto=format&fit=crop&w=1200&q=80",
    "link_url": "/products",
    "position": "bento_main",
    "is_active": true,
    "start_date": null,
    "end_date": null,
    "created_at": "2026-06-15T23:07:49.629990+07:00",
    "updated_at": "2026-06-15T23:07:49.629990+07:00"
  },
  {
    "id": "9a9edd06-b2e8-4b1e-b264-9f9293c91171",
    "title": "Bento Side 1",
    "image_url": "https://images.unsplash.com/photo-1587202372775-e229f172b9d7?auto=format&fit=crop&w=600&q=80",
    "link_url": "/products?category=pc",
    "position": "bento_side",
    "is_active": true,
    "start_date": null,
    "end_date": null,
    "created_at": "2026-06-15T23:07:49.629990+07:00",
    "updated_at": "2026-06-15T23:07:49.629990+07:00"
  },
  {
    "id": "00ace203-fcbc-45e2-8966-10d7bebca456",
    "title": "Bento Side 2",
    "image_url": "https://images.unsplash.com/photo-1555680202-c86f0e12f086?auto=format&fit=crop&w=600&q=80",
    "link_url": "/products?category=ban-phim",
    "position": "bento_side",
    "is_active": true,
    "start_date": null,
    "end_date": null,
    "created_at": "2026-06-15T23:07:49.629990+07:00",
    "updated_at": "2026-06-15T23:07:49.629990+07:00"
  },
  {
    "id": "17a88d3d-8ed1-4180-8d27-c7738f4479df",
    "title": "Bento Bottom 1",
    "image_url": "https://images.unsplash.com/photo-1593640408182-31c70c8268f5?auto=format&fit=crop&w=600&q=80",
    "link_url": "/products?category=laptop",
    "position": "bento_bottom",
    "is_active": true,
    "start_date": null,
    "end_date": null,
    "created_at": "2026-06-15T23:07:49.629990+07:00",
    "updated_at": "2026-06-15T23:07:49.629990+07:00"
  },
  {
    "id": "32106083-23d0-4d15-afaf-a9a0bcaf7c27",
    "title": "Bento Bottom 2",
    "image_url": "https://images.unsplash.com/photo-1611186871348-b1ce696e52c9?auto=format&fit=crop&w=600&q=80",
    "link_url": "/products?category=laptop-office",
    "position": "bento_bottom",
    "is_active": true,
    "start_date": null,
    "end_date": null,
    "created_at": "2026-06-15T23:07:49.629990+07:00",
    "updated_at": "2026-06-15T23:07:49.629990+07:00"
  },
  {
    "id": "af1acace-9c13-4440-94fc-bec36b7de478",
    "title": "Bento Bottom 3",
    "image_url": "https://images.unsplash.com/photo-1587831990711-23ca6441447b?auto=format&fit=crop&w=600&q=80",
    "link_url": "/products?category=pc-gaming",
    "position": "bento_bottom",
    "is_active": true,
    "start_date": null,
    "end_date": null,
    "created_at": "2026-06-15T23:07:49.629990+07:00",
    "updated_at": "2026-06-15T23:07:49.629990+07:00"
  },
  {
    "id": "152cf3d4-e448-4405-9e49-62fddaca93d9",
    "title": "SETUP M\u01a0 \u01af\u1edaC",
    "image_url": "https://images.unsplash.com/photo-1542751371-adc38448a05e?auto=format&fit=crop&w=1920&q=80",
    "link_url": "/products",
    "position": "home_middle",
    "is_active": true,
    "start_date": null,
    "end_date": null,
    "created_at": "2026-06-15T23:07:49.629990+07:00",
    "updated_at": "2026-06-15T23:07:49.629990+07:00"
  },
  {
    "id": "75f0d358-9b20-4094-925d-94f123ee944e",
    "title": "B\u00d9NG N\u1ed4 \u01afU \u0110\u00c3I",
    "image_url": "https://images.unsplash.com/photo-1600861194942-f883de0dfe96?auto=format&fit=crop&w=1920&q=80",
    "link_url": "/products",
    "position": "home_bottom",
    "is_active": true,
    "start_date": null,
    "end_date": null,
    "created_at": "2026-06-15T23:07:49.629990+07:00",
    "updated_at": "2026-06-15T23:07:49.629990+07:00"
  }
]

ORDERS_DATA = [
  {
    "id": "ord-001",
    "user_id": "0d6d139c-d612-4840-8aa0-c8cb00647d7f",
    "address_id": "addr-001",
    "promotion_id": null,
    "status": "DELIVERED",
    "payment_method": "COD",
    "payment_status": "PAID",
    "payment_transaction_id": null,
    "total_amount": 15000000.0,
    "shipping_fee": 0.0,
    "shipping_provider": null,
    "discount_amount": 0.0,
    "note": null,
    "created_at": "2026-06-13T14:49:06.619680+07:00",
    "updated_at": "2026-06-15T14:49:06.619680+07:00"
  },
  {
    "id": "ord-002",
    "user_id": "0d6d139c-d612-4840-8aa0-c8cb00647d7f",
    "address_id": "addr-001",
    "promotion_id": null,
    "status": "PENDING",
    "payment_method": "VNPAY",
    "payment_status": "UNPAID",
    "payment_transaction_id": null,
    "total_amount": 5000000.0,
    "shipping_fee": 0.0,
    "shipping_provider": null,
    "discount_amount": 0.0,
    "note": null,
    "created_at": "2026-06-14T14:49:06.619680+07:00",
    "updated_at": "2026-06-15T14:49:06.619680+07:00"
  },
  {
    "id": "e280f5fc-23f5-44b2-9d35-e4cc778d966c",
    "user_id": "49053213-3c7f-4920-ae57-8020c45e461f",
    "address_id": "1b825bd8-3e4b-4a3c-876a-bd7a35662368",
    "promotion_id": null,
    "status": "DELIVERED",
    "payment_method": "VNPAY",
    "payment_status": "UNPAID",
    "payment_transaction_id": null,
    "total_amount": 175000000.0,
    "shipping_fee": 0.0,
    "shipping_provider": null,
    "discount_amount": 0.0,
    "note": null,
    "created_at": "2026-06-12T22:01:16.152081+07:00",
    "updated_at": "2026-06-15T22:01:08.256719+07:00"
  },
  {
    "id": "f000e9b4-3a68-493d-80bb-681dab9b1c88",
    "user_id": "0d74d79b-4349-4693-b12f-c2968f25fc8d",
    "address_id": "a2310a1c-ee36-4f03-b5ff-f22cd8f81ab6",
    "promotion_id": null,
    "status": "CANCELLED",
    "payment_method": "VNPAY",
    "payment_status": "UNPAID",
    "payment_transaction_id": null,
    "total_amount": 21000000.0,
    "shipping_fee": 0.0,
    "shipping_provider": null,
    "discount_amount": 0.0,
    "note": null,
    "created_at": "2026-06-07T22:01:16.161228+07:00",
    "updated_at": "2026-06-15T22:01:08.256719+07:00"
  },
  {
    "id": "695cedab-9d74-4ae4-8c9c-35c527027bf8",
    "user_id": "916f3dc1-cfcf-4d52-98d2-f5b943ee2d87",
    "address_id": "1d687a44-239b-49f2-b026-affc1dbd76b0",
    "promotion_id": null,
    "status": "CONFIRMED",
    "payment_method": "COD",
    "payment_status": "UNPAID",
    "payment_transaction_id": null,
    "total_amount": 5000000.0,
    "shipping_fee": 0.0,
    "shipping_provider": null,
    "discount_amount": 0.0,
    "note": null,
    "created_at": "2026-06-03T22:01:16.169520+07:00",
    "updated_at": "2026-06-15T22:01:08.256719+07:00"
  },
  {
    "id": "f5d2438e-2958-4c8a-9884-b3af172906bb",
    "user_id": "8cb44ebc-93c8-4a4d-a607-c35c4cb5eee6",
    "address_id": "315f2a81-2b4f-460f-b5f8-5c98f91b393c",
    "promotion_id": null,
    "status": "PENDING",
    "payment_method": "VNPAY",
    "payment_status": "PAID",
    "payment_transaction_id": null,
    "total_amount": 54500000.0,
    "shipping_fee": 0.0,
    "shipping_provider": null,
    "discount_amount": 0.0,
    "note": null,
    "created_at": "2026-06-08T22:01:16.173139+07:00",
    "updated_at": "2026-06-15T22:01:08.256719+07:00"
  },
  {
    "id": "9df30406-37ca-478d-8789-55f61a437b33",
    "user_id": "e1bcc0f2-0197-4a78-85ce-919f74128daa",
    "address_id": "5dbd1e8b-cc62-485c-a2dd-09f2f5c295a9",
    "promotion_id": null,
    "status": "DELIVERED",
    "payment_method": "COD",
    "payment_status": "PAID",
    "payment_transaction_id": null,
    "total_amount": 77000000.0,
    "shipping_fee": 0.0,
    "shipping_provider": null,
    "discount_amount": 0.0,
    "note": null,
    "created_at": "2026-06-03T22:01:16.177044+07:00",
    "updated_at": "2026-06-15T22:01:08.256719+07:00"
  },
  {
    "id": "7947448e-028a-4315-b55a-06728c1291df",
    "user_id": "be078323-1783-4459-aafd-62ec93e671fd",
    "address_id": "2761036c-2c4b-4b5d-b703-f6e47014dce2",
    "promotion_id": null,
    "status": "CANCELLED",
    "payment_method": "VNPAY",
    "payment_status": "PAID",
    "payment_transaction_id": null,
    "total_amount": 30000000.0,
    "shipping_fee": 0.0,
    "shipping_provider": null,
    "discount_amount": 0.0,
    "note": null,
    "created_at": "2026-06-03T22:01:16.179564+07:00",
    "updated_at": "2026-06-15T22:01:08.256719+07:00"
  },
  {
    "id": "c27ef060-1c52-4efb-b22d-3c3cc583f3eb",
    "user_id": "8e3a3275-b0b4-4c3d-9532-83c3e29926c7",
    "address_id": "74de8b23-bc68-4162-aecb-5186de5c5c03",
    "promotion_id": null,
    "status": "DELIVERED",
    "payment_method": "VNPAY",
    "payment_status": "PAID",
    "payment_transaction_id": null,
    "total_amount": 42000000.0,
    "shipping_fee": 0.0,
    "shipping_provider": null,
    "discount_amount": 0.0,
    "note": null,
    "created_at": "2026-06-13T22:01:16.183049+07:00",
    "updated_at": "2026-06-15T22:01:08.256719+07:00"
  },
  {
    "id": "98f205f5-0f0b-4b63-861c-9fc2474b1353",
    "user_id": "7476e4d1-6750-4d72-afe0-0b6891eacb56",
    "address_id": "349d3274-244d-4054-b5e2-7985fb08eff5",
    "promotion_id": null,
    "status": "DELIVERED",
    "payment_method": "VNPAY",
    "payment_status": "PAID",
    "payment_transaction_id": null,
    "total_amount": 151000000.0,
    "shipping_fee": 0.0,
    "shipping_provider": null,
    "discount_amount": 0.0,
    "note": null,
    "created_at": "2026-06-07T22:01:16.185196+07:00",
    "updated_at": "2026-06-15T22:01:08.256719+07:00"
  },
  {
    "id": "053069ae-20a9-4033-a981-a2185047fb04",
    "user_id": "838aada4-abdb-4205-8166-25c9332fb00c",
    "address_id": "c5ade02b-ba7d-4a8d-8c79-93eba7145e09",
    "promotion_id": null,
    "status": "SHIPPING",
    "payment_method": "VNPAY",
    "payment_status": "PAID",
    "payment_transaction_id": null,
    "total_amount": 85000000.0,
    "shipping_fee": 0.0,
    "shipping_provider": null,
    "discount_amount": 0.0,
    "note": null,
    "created_at": "2026-06-02T22:01:16.187110+07:00",
    "updated_at": "2026-06-15T22:01:08.256719+07:00"
  },
  {
    "id": "ac97545c-fbbc-443a-8c5b-1d86a8ba2c67",
    "user_id": "95db6332-45a2-4e92-8d69-ec0b5a2f15de",
    "address_id": "9464962d-59e8-4dde-94b5-1eb150458a4c",
    "promotion_id": null,
    "status": "DELIVERED",
    "payment_method": "VNPAY",
    "payment_status": "PAID",
    "payment_transaction_id": null,
    "total_amount": 194000000.0,
    "shipping_fee": 0.0,
    "shipping_provider": null,
    "discount_amount": 0.0,
    "note": null,
    "created_at": "2026-06-07T22:01:16.189039+07:00",
    "updated_at": "2026-06-15T22:01:08.256719+07:00"
  },
  {
    "id": "a8f8f1eb-637e-427c-886b-22c1da231caf",
    "user_id": "be078323-1783-4459-aafd-62ec93e671fd",
    "address_id": "2761036c-2c4b-4b5d-b703-f6e47014dce2",
    "promotion_id": null,
    "status": "DELIVERED",
    "payment_method": "VNPAY",
    "payment_status": "UNPAID",
    "payment_transaction_id": null,
    "total_amount": 54500000.0,
    "shipping_fee": 0.0,
    "shipping_provider": null,
    "discount_amount": 0.0,
    "note": null,
    "created_at": "2026-06-09T22:01:16.191012+07:00",
    "updated_at": "2026-06-15T22:01:08.256719+07:00"
  },
  {
    "id": "ada69a3d-1ebd-418c-8f69-cde6863aeb77",
    "user_id": "7476e4d1-6750-4d72-afe0-0b6891eacb56",
    "address_id": "349d3274-244d-4054-b5e2-7985fb08eff5",
    "promotion_id": null,
    "status": "DELIVERED",
    "payment_method": "COD",
    "payment_status": "UNPAID",
    "payment_transaction_id": null,
    "total_amount": 33000000.0,
    "shipping_fee": 0.0,
    "shipping_provider": null,
    "discount_amount": 0.0,
    "note": null,
    "created_at": "2026-06-14T22:01:16.193021+07:00",
    "updated_at": "2026-06-15T22:01:08.256719+07:00"
  },
  {
    "id": "3aede67b-83ed-4faa-a844-eccf2586a53f",
    "user_id": "95db6332-45a2-4e92-8d69-ec0b5a2f15de",
    "address_id": "9464962d-59e8-4dde-94b5-1eb150458a4c",
    "promotion_id": null,
    "status": "DELIVERED",
    "payment_method": "COD",
    "payment_status": "PAID",
    "payment_transaction_id": null,
    "total_amount": 4500000.0,
    "shipping_fee": 0.0,
    "shipping_provider": null,
    "discount_amount": 0.0,
    "note": null,
    "created_at": "2026-06-05T22:01:16.195670+07:00",
    "updated_at": "2026-06-15T22:01:08.256719+07:00"
  },
  {
    "id": "d85e8f0f-47c5-4e21-85c8-ecbc04bfcc3c",
    "user_id": "e1bcc0f2-0197-4a78-85ce-919f74128daa",
    "address_id": "5dbd1e8b-cc62-485c-a2dd-09f2f5c295a9",
    "promotion_id": null,
    "status": "DELIVERED",
    "payment_method": "VNPAY",
    "payment_status": "PAID",
    "payment_transaction_id": null,
    "total_amount": 102000000.0,
    "shipping_fee": 0.0,
    "shipping_provider": null,
    "discount_amount": 0.0,
    "note": null,
    "created_at": "2026-06-06T22:01:16.197738+07:00",
    "updated_at": "2026-06-15T22:01:08.256719+07:00"
  },
  {
    "id": "56fb10a6-6acd-4276-9f1c-7d88604dbd81",
    "user_id": "76a3244d-33f7-4021-8f06-7287523f5537",
    "address_id": "e874ab14-837d-4bf4-a1b1-a2cb2a92d78d",
    "promotion_id": null,
    "status": "PENDING",
    "payment_method": "COD",
    "payment_status": "UNPAID",
    "payment_transaction_id": null,
    "total_amount": 69500000.0,
    "shipping_fee": 0.0,
    "shipping_provider": null,
    "discount_amount": 0.0,
    "note": null,
    "created_at": "2026-06-13T22:01:16.199724+07:00",
    "updated_at": "2026-06-15T22:01:08.256719+07:00"
  },
  {
    "id": "37a11dca-fe6e-4c43-8bd9-237e5b18ad5f",
    "user_id": "42f1c24e-5b0b-4cb2-8c18-cce92319b708",
    "address_id": "449e26e9-0e5f-4eed-b99c-22583497e5eb",
    "promotion_id": null,
    "status": "DELIVERED",
    "payment_method": "COD",
    "payment_status": "UNPAID",
    "payment_transaction_id": null,
    "total_amount": 16000000.0,
    "shipping_fee": 0.0,
    "shipping_provider": null,
    "discount_amount": 0.0,
    "note": null,
    "created_at": "2026-06-11T22:01:16.201767+07:00",
    "updated_at": "2026-06-15T22:01:08.256719+07:00"
  },
  {
    "id": "0529e328-6d46-4f14-a877-7e2bdaaee2bf",
    "user_id": "76a3244d-33f7-4021-8f06-7287523f5537",
    "address_id": "e874ab14-837d-4bf4-a1b1-a2cb2a92d78d",
    "promotion_id": null,
    "status": "DELIVERED",
    "payment_method": "VNPAY",
    "payment_status": "PAID",
    "payment_transaction_id": null,
    "total_amount": 13500000.0,
    "shipping_fee": 0.0,
    "shipping_provider": null,
    "discount_amount": 0.0,
    "note": null,
    "created_at": "2026-06-04T22:01:16.203747+07:00",
    "updated_at": "2026-06-15T22:01:08.256719+07:00"
  },
  {
    "id": "1f94e011-36e1-4399-9e8b-457cbaf93ebc",
    "user_id": "154be4a1-0712-4b7c-b589-3a4817cdb9d2",
    "address_id": "1613a322-7985-471f-bfc2-d5f945bade6d",
    "promotion_id": null,
    "status": "DELIVERED",
    "payment_method": "COD",
    "payment_status": "PAID",
    "payment_transaction_id": null,
    "total_amount": 70500000.0,
    "shipping_fee": 0.0,
    "shipping_provider": null,
    "discount_amount": 0.0,
    "note": null,
    "created_at": "2026-06-14T22:01:16.205592+07:00",
    "updated_at": "2026-06-15T22:01:08.256719+07:00"
  },
  {
    "id": "d35ad90a-731b-493b-9530-704d62599726",
    "user_id": "67df3dbf-027e-4bbc-8602-62cc4944ea21",
    "address_id": "4e9636c3-83d5-493d-aaad-895e302337fa",
    "promotion_id": null,
    "status": "DELIVERED",
    "payment_method": "COD",
    "payment_status": "PAID",
    "payment_transaction_id": null,
    "total_amount": 12500000.0,
    "shipping_fee": 0.0,
    "shipping_provider": null,
    "discount_amount": 0.0,
    "note": null,
    "created_at": "2026-06-09T22:01:16.208037+07:00",
    "updated_at": "2026-06-15T22:01:08.256719+07:00"
  },
  {
    "id": "d58c3e67-7f8e-4424-aba3-89b21be6b72c",
    "user_id": "e1bcc0f2-0197-4a78-85ce-919f74128daa",
    "address_id": "5dbd1e8b-cc62-485c-a2dd-09f2f5c295a9",
    "promotion_id": null,
    "status": "DELIVERED",
    "payment_method": "COD",
    "payment_status": "PAID",
    "payment_transaction_id": null,
    "total_amount": 8500000.0,
    "shipping_fee": 0.0,
    "shipping_provider": null,
    "discount_amount": 0.0,
    "note": null,
    "created_at": "2026-06-04T22:01:16.211728+07:00",
    "updated_at": "2026-06-15T22:01:08.256719+07:00"
  },
  {
    "id": "a4854111-7edc-44cb-b8d6-ebac06d678b6",
    "user_id": "916f3dc1-cfcf-4d52-98d2-f5b943ee2d87",
    "address_id": "1d687a44-239b-49f2-b026-affc1dbd76b0",
    "promotion_id": null,
    "status": "DELIVERED",
    "payment_method": "VNPAY",
    "payment_status": "PAID",
    "payment_transaction_id": null,
    "total_amount": 64000000.0,
    "shipping_fee": 0.0,
    "shipping_provider": null,
    "discount_amount": 0.0,
    "note": null,
    "created_at": "2026-06-03T22:01:16.215439+07:00",
    "updated_at": "2026-06-15T22:01:08.256719+07:00"
  },
  {
    "id": "6c1b2dd8-e055-499b-8b91-0b952d48a3b4",
    "user_id": "49053213-3c7f-4920-ae57-8020c45e461f",
    "address_id": "1b825bd8-3e4b-4a3c-876a-bd7a35662368",
    "promotion_id": null,
    "status": "SHIPPING",
    "payment_method": "COD",
    "payment_status": "PAID",
    "payment_transaction_id": null,
    "total_amount": 41000000.0,
    "shipping_fee": 0.0,
    "shipping_provider": null,
    "discount_amount": 0.0,
    "note": null,
    "created_at": "2026-06-13T22:01:16.217816+07:00",
    "updated_at": "2026-06-15T22:01:08.256719+07:00"
  },
  {
    "id": "5a0e28c3-0f81-4b35-8d7d-1d568f6a735d",
    "user_id": "916f3dc1-cfcf-4d52-98d2-f5b943ee2d87",
    "address_id": "1d687a44-239b-49f2-b026-affc1dbd76b0",
    "promotion_id": null,
    "status": "CANCELLED",
    "payment_method": "VNPAY",
    "payment_status": "PAID",
    "payment_transaction_id": null,
    "total_amount": 86000000.0,
    "shipping_fee": 0.0,
    "shipping_provider": null,
    "discount_amount": 0.0,
    "note": null,
    "created_at": "2026-06-13T22:01:16.220055+07:00",
    "updated_at": "2026-06-15T22:01:08.256719+07:00"
  },
  {
    "id": "d813c668-d43c-42ea-834e-ad0e8af8f372",
    "user_id": "49053213-3c7f-4920-ae57-8020c45e461f",
    "address_id": "1b825bd8-3e4b-4a3c-876a-bd7a35662368",
    "promotion_id": null,
    "status": "DELIVERED",
    "payment_method": "COD",
    "payment_status": "UNPAID",
    "payment_transaction_id": null,
    "total_amount": 13000000.0,
    "shipping_fee": 0.0,
    "shipping_provider": null,
    "discount_amount": 0.0,
    "note": null,
    "created_at": "2026-06-01T22:01:16.222588+07:00",
    "updated_at": "2026-06-15T22:01:08.256719+07:00"
  },
  {
    "id": "c108ab6f-6ead-45ad-939a-dc5642d7434c",
    "user_id": "03d7ce37-b04c-44ee-be56-0c284d235a81",
    "address_id": "91a7efbb-e5d9-4bba-9bd1-a7f4365383e1",
    "promotion_id": null,
    "status": "DELIVERED",
    "payment_method": "COD",
    "payment_status": "PAID",
    "payment_transaction_id": null,
    "total_amount": 39500000.0,
    "shipping_fee": 0.0,
    "shipping_provider": null,
    "discount_amount": 0.0,
    "note": null,
    "created_at": "2026-06-10T22:01:16.225196+07:00",
    "updated_at": "2026-06-15T22:01:08.256719+07:00"
  },
  {
    "id": "8f6383ee-7e55-4787-8e67-a070957bc616",
    "user_id": "67df3dbf-027e-4bbc-8602-62cc4944ea21",
    "address_id": "4e9636c3-83d5-493d-aaad-895e302337fa",
    "promotion_id": null,
    "status": "DELIVERED",
    "payment_method": "VNPAY",
    "payment_status": "PAID",
    "payment_transaction_id": null,
    "total_amount": 8500000.0,
    "shipping_fee": 0.0,
    "shipping_provider": null,
    "discount_amount": 0.0,
    "note": null,
    "created_at": "2026-06-15T22:01:16.227690+07:00",
    "updated_at": "2026-06-15T22:01:08.256719+07:00"
  },
  {
    "id": "6c58a90e-a316-447b-bb55-fc0da962fa32",
    "user_id": "f8ff4ecd-db2d-4bb9-8ebc-ad1a76a39b05",
    "address_id": "db6ec6fd-a20e-4c07-ad9b-f0e900d14d84",
    "promotion_id": null,
    "status": "DELIVERED",
    "payment_method": "COD",
    "payment_status": "UNPAID",
    "payment_transaction_id": null,
    "total_amount": 16000000.0,
    "shipping_fee": 0.0,
    "shipping_provider": null,
    "discount_amount": 0.0,
    "note": null,
    "created_at": "2026-06-01T22:01:16.229964+07:00",
    "updated_at": "2026-06-15T22:01:08.256719+07:00"
  },
  {
    "id": "d3bb8e51-4ee2-4c19-af75-15dd12d988bd",
    "user_id": "76a3244d-33f7-4021-8f06-7287523f5537",
    "address_id": "e874ab14-837d-4bf4-a1b1-a2cb2a92d78d",
    "promotion_id": null,
    "status": "DELIVERED",
    "payment_method": "COD",
    "payment_status": "UNPAID",
    "payment_transaction_id": null,
    "total_amount": 81000000.0,
    "shipping_fee": 0.0,
    "shipping_provider": null,
    "discount_amount": 0.0,
    "note": null,
    "created_at": "2026-06-01T22:01:16.231760+07:00",
    "updated_at": "2026-06-15T22:01:08.256719+07:00"
  },
  {
    "id": "1c5a777a-c47a-4b95-b0ca-18e928b43a68",
    "user_id": "8cb44ebc-93c8-4a4d-a607-c35c4cb5eee6",
    "address_id": "315f2a81-2b4f-460f-b5f8-5c98f91b393c",
    "promotion_id": null,
    "status": "DELIVERED",
    "payment_method": "COD",
    "payment_status": "PAID",
    "payment_transaction_id": null,
    "total_amount": 140000000.0,
    "shipping_fee": 0.0,
    "shipping_provider": null,
    "discount_amount": 0.0,
    "note": null,
    "created_at": "2026-06-09T22:01:16.233656+07:00",
    "updated_at": "2026-06-15T22:01:08.256719+07:00"
  },
  {
    "id": "a7da5b0f-38ce-4add-b0fd-ba33a6bcec09",
    "user_id": "838aada4-abdb-4205-8166-25c9332fb00c",
    "address_id": "c5ade02b-ba7d-4a8d-8c79-93eba7145e09",
    "promotion_id": null,
    "status": "SHIPPING",
    "payment_method": "COD",
    "payment_status": "UNPAID",
    "payment_transaction_id": null,
    "total_amount": 8000000.0,
    "shipping_fee": 0.0,
    "shipping_provider": null,
    "discount_amount": 0.0,
    "note": null,
    "created_at": "2026-06-05T22:01:16.235481+07:00",
    "updated_at": "2026-06-15T22:01:08.256719+07:00"
  },
  {
    "id": "8e13d59d-3c13-4680-87bd-6032cf9d0ee0",
    "user_id": "67df3dbf-027e-4bbc-8602-62cc4944ea21",
    "address_id": "4e9636c3-83d5-493d-aaad-895e302337fa",
    "promotion_id": null,
    "status": "CONFIRMED",
    "payment_method": "VNPAY",
    "payment_status": "UNPAID",
    "payment_transaction_id": null,
    "total_amount": 30000000.0,
    "shipping_fee": 0.0,
    "shipping_provider": null,
    "discount_amount": 0.0,
    "note": null,
    "created_at": "2026-06-12T22:01:16.237523+07:00",
    "updated_at": "2026-06-15T22:01:08.256719+07:00"
  },
  {
    "id": "a4dd6897-25b3-43c3-8679-b32fca240913",
    "user_id": "8cb44ebc-93c8-4a4d-a607-c35c4cb5eee6",
    "address_id": "315f2a81-2b4f-460f-b5f8-5c98f91b393c",
    "promotion_id": null,
    "status": "DELIVERED",
    "payment_method": "VNPAY",
    "payment_status": "UNPAID",
    "payment_transaction_id": null,
    "total_amount": 109000000.0,
    "shipping_fee": 0.0,
    "shipping_provider": null,
    "discount_amount": 0.0,
    "note": null,
    "created_at": "2026-06-05T22:01:16.239152+07:00",
    "updated_at": "2026-06-15T22:01:08.256719+07:00"
  },
  {
    "id": "3d293b3a-f830-4057-aa8c-9d1c50e2d159",
    "user_id": "23b285fc-4f89-4941-bbaf-507e3cb87129",
    "address_id": "18b283b7-31d6-43b8-91a5-47bafd49b2a0",
    "promotion_id": null,
    "status": "CONFIRMED",
    "payment_method": "COD",
    "payment_status": "PAID",
    "payment_transaction_id": null,
    "total_amount": 96000000.0,
    "shipping_fee": 0.0,
    "shipping_provider": null,
    "discount_amount": 0.0,
    "note": null,
    "created_at": "2026-06-01T22:01:16.241637+07:00",
    "updated_at": "2026-06-15T22:01:08.256719+07:00"
  },
  {
    "id": "6a64f2ba-3253-47b9-a849-a0e2cb366c73",
    "user_id": "7476e4d1-6750-4d72-afe0-0b6891eacb56",
    "address_id": "349d3274-244d-4054-b5e2-7985fb08eff5",
    "promotion_id": null,
    "status": "DELIVERED",
    "payment_method": "VNPAY",
    "payment_status": "PAID",
    "payment_transaction_id": null,
    "total_amount": 45000000.0,
    "shipping_fee": 0.0,
    "shipping_provider": null,
    "discount_amount": 0.0,
    "note": null,
    "created_at": "2026-06-07T22:01:16.245629+07:00",
    "updated_at": "2026-06-15T22:01:08.256719+07:00"
  },
  {
    "id": "71900004-05bb-4608-981e-86b256daa935",
    "user_id": "e1bcc0f2-0197-4a78-85ce-919f74128daa",
    "address_id": "5dbd1e8b-cc62-485c-a2dd-09f2f5c295a9",
    "promotion_id": null,
    "status": "CANCELLED",
    "payment_method": "VNPAY",
    "payment_status": "UNPAID",
    "payment_transaction_id": null,
    "total_amount": 22500000.0,
    "shipping_fee": 0.0,
    "shipping_provider": null,
    "discount_amount": 0.0,
    "note": null,
    "created_at": "2026-06-11T22:01:16.248179+07:00",
    "updated_at": "2026-06-15T22:01:08.256719+07:00"
  },
  {
    "id": "ef83a67e-df87-415f-a79f-6e0f5e259afe",
    "user_id": "42f1c24e-5b0b-4cb2-8c18-cce92319b708",
    "address_id": "449e26e9-0e5f-4eed-b99c-22583497e5eb",
    "promotion_id": null,
    "status": "CANCELLED",
    "payment_method": "COD",
    "payment_status": "PAID",
    "payment_transaction_id": null,
    "total_amount": 8000000.0,
    "shipping_fee": 0.0,
    "shipping_provider": null,
    "discount_amount": 0.0,
    "note": null,
    "created_at": "2026-06-03T22:01:16.250477+07:00",
    "updated_at": "2026-06-15T22:01:08.256719+07:00"
  },
  {
    "id": "80b71372-fcba-46c1-a5fe-bb5529e3f5f1",
    "user_id": "e1bcc0f2-0197-4a78-85ce-919f74128daa",
    "address_id": "5dbd1e8b-cc62-485c-a2dd-09f2f5c295a9",
    "promotion_id": null,
    "status": "DELIVERED",
    "payment_method": "VNPAY",
    "payment_status": "PAID",
    "payment_transaction_id": null,
    "total_amount": 6500000.0,
    "shipping_fee": 0.0,
    "shipping_provider": null,
    "discount_amount": 0.0,
    "note": null,
    "created_at": "2026-06-05T22:01:16.252273+07:00",
    "updated_at": "2026-06-15T22:01:08.256719+07:00"
  },
  {
    "id": "7236fcc6-d0eb-4e2c-bbdf-cc13fc8801a7",
    "user_id": "8cb44ebc-93c8-4a4d-a607-c35c4cb5eee6",
    "address_id": "315f2a81-2b4f-460f-b5f8-5c98f91b393c",
    "promotion_id": null,
    "status": "DELIVERED",
    "payment_method": "COD",
    "payment_status": "PAID",
    "payment_transaction_id": null,
    "total_amount": 44000000.0,
    "shipping_fee": 0.0,
    "shipping_provider": null,
    "discount_amount": 0.0,
    "note": null,
    "created_at": "2026-06-07T22:01:16.254497+07:00",
    "updated_at": "2026-06-15T22:01:08.256719+07:00"
  },
  {
    "id": "5915fb47-fbc6-4fc4-860f-4ad03be9b165",
    "user_id": "03d7ce37-b04c-44ee-be56-0c284d235a81",
    "address_id": "91a7efbb-e5d9-4bba-9bd1-a7f4365383e1",
    "promotion_id": null,
    "status": "DELIVERED",
    "payment_method": "VNPAY",
    "payment_status": "PAID",
    "payment_transaction_id": null,
    "total_amount": 4000000.0,
    "shipping_fee": 0.0,
    "shipping_provider": null,
    "discount_amount": 0.0,
    "note": null,
    "created_at": "2026-06-12T22:01:16.256823+07:00",
    "updated_at": "2026-06-15T22:01:08.256719+07:00"
  },
  {
    "id": "830e2fc3-0e92-4179-8391-4435d1a65249",
    "user_id": "154be4a1-0712-4b7c-b589-3a4817cdb9d2",
    "address_id": "1613a322-7985-471f-bfc2-d5f945bade6d",
    "promotion_id": null,
    "status": "DELIVERED",
    "payment_method": "COD",
    "payment_status": "PAID",
    "payment_transaction_id": null,
    "total_amount": 153000000.0,
    "shipping_fee": 0.0,
    "shipping_provider": null,
    "discount_amount": 0.0,
    "note": null,
    "created_at": "2026-06-03T22:01:16.259523+07:00",
    "updated_at": "2026-06-15T22:01:08.256719+07:00"
  },
  {
    "id": "0708b2be-e8f5-4212-955a-ef84c7834c11",
    "user_id": "95db6332-45a2-4e92-8d69-ec0b5a2f15de",
    "address_id": "9464962d-59e8-4dde-94b5-1eb150458a4c",
    "promotion_id": null,
    "status": "DELIVERED",
    "payment_method": "COD",
    "payment_status": "UNPAID",
    "payment_transaction_id": null,
    "total_amount": 74000000.0,
    "shipping_fee": 0.0,
    "shipping_provider": null,
    "discount_amount": 0.0,
    "note": null,
    "created_at": "2026-06-10T22:01:16.262151+07:00",
    "updated_at": "2026-06-15T22:01:08.256719+07:00"
  },
  {
    "id": "2f82932c-acc5-4b67-be55-eaa987dba056",
    "user_id": "23b285fc-4f89-4941-bbaf-507e3cb87129",
    "address_id": "18b283b7-31d6-43b8-91a5-47bafd49b2a0",
    "promotion_id": null,
    "status": "CONFIRMED",
    "payment_method": "COD",
    "payment_status": "UNPAID",
    "payment_transaction_id": null,
    "total_amount": 164000000.0,
    "shipping_fee": 0.0,
    "shipping_provider": null,
    "discount_amount": 0.0,
    "note": null,
    "created_at": "2026-06-15T22:01:16.264767+07:00",
    "updated_at": "2026-06-15T22:01:08.256719+07:00"
  },
  {
    "id": "5da9c60f-a1fb-41d7-89ec-be3c73553c66",
    "user_id": "03d7ce37-b04c-44ee-be56-0c284d235a81",
    "address_id": "91a7efbb-e5d9-4bba-9bd1-a7f4365383e1",
    "promotion_id": null,
    "status": "CONFIRMED",
    "payment_method": "COD",
    "payment_status": "PAID",
    "payment_transaction_id": null,
    "total_amount": 75000000.0,
    "shipping_fee": 0.0,
    "shipping_provider": null,
    "discount_amount": 0.0,
    "note": null,
    "created_at": "2026-06-03T22:01:16.266886+07:00",
    "updated_at": "2026-06-15T22:01:08.256719+07:00"
  },
  {
    "id": "b0ac9510-b6de-4c40-842a-f8d342b2eb7c",
    "user_id": "3ee7dd3b-c6d6-482f-9691-94d6d29019d6",
    "address_id": "a0571c61-b8a6-49a6-b6b3-e72a8fff1671",
    "promotion_id": null,
    "status": "CANCELLED",
    "payment_method": "COD",
    "payment_status": "UNPAID",
    "payment_transaction_id": null,
    "total_amount": 130000000.0,
    "shipping_fee": 0.0,
    "shipping_provider": null,
    "discount_amount": 0.0,
    "note": null,
    "created_at": "2026-06-13T22:01:16.268953+07:00",
    "updated_at": "2026-06-15T22:01:08.256719+07:00"
  },
  {
    "id": "5845fc2c-a847-4439-bd32-efb3641bbf35",
    "user_id": "f8ff4ecd-db2d-4bb9-8ebc-ad1a76a39b05",
    "address_id": "db6ec6fd-a20e-4c07-ad9b-f0e900d14d84",
    "promotion_id": null,
    "status": "DELIVERED",
    "payment_method": "VNPAY",
    "payment_status": "UNPAID",
    "payment_transaction_id": null,
    "total_amount": 73000000.0,
    "shipping_fee": 0.0,
    "shipping_provider": null,
    "discount_amount": 0.0,
    "note": null,
    "created_at": "2026-06-03T22:01:16.270980+07:00",
    "updated_at": "2026-06-15T22:01:08.256719+07:00"
  },
  {
    "id": "4d744461-7495-417d-899b-bd701c22200f",
    "user_id": "916f3dc1-cfcf-4d52-98d2-f5b943ee2d87",
    "address_id": "1d687a44-239b-49f2-b026-affc1dbd76b0",
    "promotion_id": null,
    "status": "DELIVERED",
    "payment_method": "VNPAY",
    "payment_status": "PAID",
    "payment_transaction_id": null,
    "total_amount": 65000000.0,
    "shipping_fee": 0.0,
    "shipping_provider": null,
    "discount_amount": 0.0,
    "note": null,
    "created_at": "2026-06-02T22:01:16.272814+07:00",
    "updated_at": "2026-06-15T22:01:08.256719+07:00"
  },
  {
    "id": "bf8aee23-12b7-4090-915f-2a51e04e519a",
    "user_id": "8cb44ebc-93c8-4a4d-a607-c35c4cb5eee6",
    "address_id": "315f2a81-2b4f-460f-b5f8-5c98f91b393c",
    "promotion_id": null,
    "status": "CANCELLED",
    "payment_method": "COD",
    "payment_status": "UNPAID",
    "payment_transaction_id": null,
    "total_amount": 47500000.0,
    "shipping_fee": 0.0,
    "shipping_provider": null,
    "discount_amount": 0.0,
    "note": null,
    "created_at": "2026-06-10T22:01:16.275517+07:00",
    "updated_at": "2026-06-15T22:01:08.256719+07:00"
  },
  {
    "id": "bb1667fb-b533-4892-b06f-242902fb8a38",
    "user_id": "8e3a3275-b0b4-4c3d-9532-83c3e29926c7",
    "address_id": "74de8b23-bc68-4162-aecb-5186de5c5c03",
    "promotion_id": null,
    "status": "DELIVERED",
    "payment_method": "VNPAY",
    "payment_status": "UNPAID",
    "payment_transaction_id": null,
    "total_amount": 66000000.0,
    "shipping_fee": 0.0,
    "shipping_provider": null,
    "discount_amount": 0.0,
    "note": null,
    "created_at": "2026-06-05T22:01:16.278262+07:00",
    "updated_at": "2026-06-15T22:01:08.256719+07:00"
  },
  {
    "id": "5cbb90fd-f4b1-4e10-9bea-cb1d7d4aa7c9",
    "user_id": "33721469-b1e5-49c8-b557-eaf6cad16c88",
    "address_id": "5aa44901-c467-442b-9d2e-14d8c630d853",
    "promotion_id": null,
    "status": "SHIPPING",
    "payment_method": "VNPAY",
    "payment_status": "UNPAID",
    "payment_transaction_id": null,
    "total_amount": 4000000.0,
    "shipping_fee": 0.0,
    "shipping_provider": null,
    "discount_amount": 0.0,
    "note": null,
    "created_at": "2026-06-02T22:01:16.280223+07:00",
    "updated_at": "2026-06-15T22:01:08.256719+07:00"
  },
  {
    "id": "d8f00131-8436-4dcc-9525-e4b5e2a9c724",
    "user_id": "e1bcc0f2-0197-4a78-85ce-919f74128daa",
    "address_id": "5dbd1e8b-cc62-485c-a2dd-09f2f5c295a9",
    "promotion_id": null,
    "status": "CONFIRMED",
    "payment_method": "COD",
    "payment_status": "UNPAID",
    "payment_transaction_id": null,
    "total_amount": 17000000.0,
    "shipping_fee": 0.0,
    "shipping_provider": null,
    "discount_amount": 0.0,
    "note": null,
    "created_at": "2026-06-06T22:01:16.282701+07:00",
    "updated_at": "2026-06-15T22:01:08.256719+07:00"
  }
]

ORDER_ITEMS_DATA = [
  {
    "id": "1312199e-df5d-4581-aab8-ba61cc194d31",
    "order_id": "e280f5fc-23f5-44b2-9d35-e4cc778d966c",
    "sku_id": "cab9b6db-1217-46ee-a2c5-450dee80ac65",
    "product_name": "Dominator Titanium 32GB (2x16) DDR5",
    "sku_code": "SKU-DOMINATORTITANIUM32GB(2X16)DDR5-1f51",
    "price_at_purchase": 5500000.0,
    "quantity": 2
  },
  {
    "id": "e66e01c0-5a26-4ef7-a1f0-43c46f9f8541",
    "order_id": "e280f5fc-23f5-44b2-9d35-e4cc778d966c",
    "sku_id": "60dc3b95-ca94-4be3-884d-f7ce94208474",
    "product_name": "RTX 4090 ROG Strix",
    "sku_code": "SKU-RTX4090ROGSTRIX-c5e6",
    "price_at_purchase": 65000000.0,
    "quantity": 2
  },
  {
    "id": "3623792b-1192-4136-a641-1b2a5870433b",
    "order_id": "e280f5fc-23f5-44b2-9d35-e4cc778d966c",
    "sku_id": "73567175-0545-4514-8633-529f72d5b99e",
    "product_name": "Ryzen 9 7950X3D",
    "sku_code": "SKU-RYZEN97950X3D-c75a",
    "price_at_purchase": 17000000.0,
    "quantity": 2
  },
  {
    "id": "8251d110-4d38-46ac-85d2-083a1ed061a4",
    "order_id": "f000e9b4-3a68-493d-80bb-681dab9b1c88",
    "sku_id": "3a865c62-803b-40a3-a4e3-0202c48960b7",
    "product_name": "Fury Beast 32GB (2x16) DDR5",
    "sku_code": "SKU-FURYBEAST32GB(2X16)DDR5-5821",
    "price_at_purchase": 4000000.0,
    "quantity": 1
  },
  {
    "id": "d7a82c52-a20a-4974-9d2f-82be960b5d56",
    "order_id": "f000e9b4-3a68-493d-80bb-681dab9b1c88",
    "sku_id": "73567175-0545-4514-8633-529f72d5b99e",
    "product_name": "Ryzen 9 7950X3D",
    "sku_code": "SKU-RYZEN97950X3D-c75a",
    "price_at_purchase": 17000000.0,
    "quantity": 1
  },
  {
    "id": "ab7208f2-830f-496a-a7cc-47d398e5ebf4",
    "order_id": "695cedab-9d74-4ae4-8c9c-35c527027bf8",
    "sku_id": "6fbec32f-f96f-4aa7-8317-224d892e45fe",
    "product_name": "990 PRO 2TB PCIe 4.0",
    "sku_code": "SKU-990PRO2TBPCIE4.0-7b83",
    "price_at_purchase": 5000000.0,
    "quantity": 1
  },
  {
    "id": "c07b9132-cc1e-4eec-befa-0772aacb781e",
    "order_id": "f5d2438e-2958-4c8a-9884-b3af172906bb",
    "sku_id": "29f2a32e-768f-4061-bfaf-5848e342f31f",
    "product_name": "RTX 4080 Super Suprim X",
    "sku_code": "SKU-RTX4080SUPERSUPRIMX-7706",
    "price_at_purchase": 32000000.0,
    "quantity": 1
  },
  {
    "id": "0954e0fb-b8fe-4656-ba2d-f05a372909e6",
    "order_id": "f5d2438e-2958-4c8a-9884-b3af172906bb",
    "sku_id": "376ad42e-1d81-4bd1-9018-5434129adec4",
    "product_name": "Core i9-14900K",
    "sku_code": "SKU-COREI9-14900K-2f3a",
    "price_at_purchase": 16000000.0,
    "quantity": 1
  },
  {
    "id": "6b93187a-d43d-46ee-a83b-6451dc1f2084",
    "order_id": "f5d2438e-2958-4c8a-9884-b3af172906bb",
    "sku_id": "537722f7-16dd-4be7-a30d-d11c2dd4419a",
    "product_name": "B650 TOMAHAWK WIFI",
    "sku_code": "SKU-B650TOMAHAWKWIFI-4ea2",
    "price_at_purchase": 6500000.0,
    "quantity": 1
  },
  {
    "id": "6dee27e4-e9d3-4fad-a5e6-4c3ee4213001",
    "order_id": "9df30406-37ca-478d-8789-55f61a437b33",
    "sku_id": "cab9b6db-1217-46ee-a2c5-450dee80ac65",
    "product_name": "Dominator Titanium 32GB (2x16) DDR5",
    "sku_code": "SKU-DOMINATORTITANIUM32GB(2X16)DDR5-1f51",
    "price_at_purchase": 5500000.0,
    "quantity": 2
  },
  {
    "id": "ba7341ed-bfb8-4ccf-8ebc-49f537f3beba",
    "order_id": "9df30406-37ca-478d-8789-55f61a437b33",
    "sku_id": "73567175-0545-4514-8633-529f72d5b99e",
    "product_name": "Ryzen 9 7950X3D",
    "sku_code": "SKU-RYZEN97950X3D-c75a",
    "price_at_purchase": 17000000.0,
    "quantity": 2
  },
  {
    "id": "9d90a8ee-f3f7-462d-a3be-50d6aee9b83b",
    "order_id": "9df30406-37ca-478d-8789-55f61a437b33",
    "sku_id": "29f2a32e-768f-4061-bfaf-5848e342f31f",
    "product_name": "RTX 4080 Super Suprim X",
    "sku_code": "SKU-RTX4080SUPERSUPRIMX-7706",
    "price_at_purchase": 32000000.0,
    "quantity": 1
  },
  {
    "id": "506c8ed2-41bb-4496-9451-38c06d3407cd",
    "order_id": "7947448e-028a-4315-b55a-06728c1291df",
    "sku_id": "870cbc7d-26c3-4225-872a-5c43dc55502f",
    "product_name": "RX 7900 XTX AORUS",
    "sku_code": "SKU-RX7900XTXAORUS-e866",
    "price_at_purchase": 30000000.0,
    "quantity": 1
  },
  {
    "id": "fb15ec53-2f6c-44ee-bfe0-dd46a6060416",
    "order_id": "c27ef060-1c52-4efb-b22d-3c3cc583f3eb",
    "sku_id": "73567175-0545-4514-8633-529f72d5b99e",
    "product_name": "Ryzen 9 7950X3D",
    "sku_code": "SKU-RYZEN97950X3D-c75a",
    "price_at_purchase": 17000000.0,
    "quantity": 2
  },
  {
    "id": "790c5ef0-388a-4207-994b-29eb6593ff18",
    "order_id": "c27ef060-1c52-4efb-b22d-3c3cc583f3eb",
    "sku_id": "3a865c62-803b-40a3-a4e3-0202c48960b7",
    "product_name": "Fury Beast 32GB (2x16) DDR5",
    "sku_code": "SKU-FURYBEAST32GB(2X16)DDR5-5821",
    "price_at_purchase": 4000000.0,
    "quantity": 2
  },
  {
    "id": "a23c9d90-9cac-41eb-a3f3-0c6c23af4e28",
    "order_id": "98f205f5-0f0b-4b63-861c-9fc2474b1353",
    "sku_id": "cab9b6db-1217-46ee-a2c5-450dee80ac65",
    "product_name": "Dominator Titanium 32GB (2x16) DDR5",
    "sku_code": "SKU-DOMINATORTITANIUM32GB(2X16)DDR5-1f51",
    "price_at_purchase": 5500000.0,
    "quantity": 2
  },
  {
    "id": "45b64ff8-1b26-4d04-bc86-2888665a9ff6",
    "order_id": "98f205f5-0f0b-4b63-861c-9fc2474b1353",
    "sku_id": "60dc3b95-ca94-4be3-884d-f7ce94208474",
    "product_name": "RTX 4090 ROG Strix",
    "sku_code": "SKU-RTX4090ROGSTRIX-c5e6",
    "price_at_purchase": 65000000.0,
    "quantity": 2
  },
  {
    "id": "f753c087-5a62-46d4-aaf1-ae5cd285c9f4",
    "order_id": "98f205f5-0f0b-4b63-861c-9fc2474b1353",
    "sku_id": "6fbec32f-f96f-4aa7-8317-224d892e45fe",
    "product_name": "990 PRO 2TB PCIe 4.0",
    "sku_code": "SKU-990PRO2TBPCIE4.0-7b83",
    "price_at_purchase": 5000000.0,
    "quantity": 2
  },
  {
    "id": "96bd4d4b-3416-4132-8f02-b3a5bae23314",
    "order_id": "053069ae-20a9-4033-a981-a2185047fb04",
    "sku_id": "3a865c62-803b-40a3-a4e3-0202c48960b7",
    "product_name": "Fury Beast 32GB (2x16) DDR5",
    "sku_code": "SKU-FURYBEAST32GB(2X16)DDR5-5821",
    "price_at_purchase": 4000000.0,
    "quantity": 1
  },
  {
    "id": "08c3165a-c0ed-4e1b-bfcc-6aeb32ac61e2",
    "order_id": "053069ae-20a9-4033-a981-a2185047fb04",
    "sku_id": "73567175-0545-4514-8633-529f72d5b99e",
    "product_name": "Ryzen 9 7950X3D",
    "sku_code": "SKU-RYZEN97950X3D-c75a",
    "price_at_purchase": 17000000.0,
    "quantity": 1
  },
  {
    "id": "9a1b7e70-f93e-440c-ab37-d09512574d3f",
    "order_id": "053069ae-20a9-4033-a981-a2185047fb04",
    "sku_id": "29f2a32e-768f-4061-bfaf-5848e342f31f",
    "product_name": "RTX 4080 Super Suprim X",
    "sku_code": "SKU-RTX4080SUPERSUPRIMX-7706",
    "price_at_purchase": 32000000.0,
    "quantity": 2
  },
  {
    "id": "500e6925-c0eb-4622-98ab-76056d3359db",
    "order_id": "ac97545c-fbbc-443a-8c5b-1d86a8ba2c67",
    "sku_id": "60dc3b95-ca94-4be3-884d-f7ce94208474",
    "product_name": "RTX 4090 ROG Strix",
    "sku_code": "SKU-RTX4090ROGSTRIX-c5e6",
    "price_at_purchase": 65000000.0,
    "quantity": 2
  },
  {
    "id": "532ac9d6-e3f1-464b-9df7-0222f220d899",
    "order_id": "ac97545c-fbbc-443a-8c5b-1d86a8ba2c67",
    "sku_id": "29f2a32e-768f-4061-bfaf-5848e342f31f",
    "product_name": "RTX 4080 Super Suprim X",
    "sku_code": "SKU-RTX4080SUPERSUPRIMX-7706",
    "price_at_purchase": 32000000.0,
    "quantity": 2
  },
  {
    "id": "86bfe81b-40d8-425d-826c-823a9d325550",
    "order_id": "a8f8f1eb-637e-427c-886b-22c1da231caf",
    "sku_id": "537722f7-16dd-4be7-a30d-d11c2dd4419a",
    "product_name": "B650 TOMAHAWK WIFI",
    "sku_code": "SKU-B650TOMAHAWKWIFI-4ea2",
    "price_at_purchase": 6500000.0,
    "quantity": 1
  },
  {
    "id": "9a1010b6-9d7a-4ec9-9eaf-d95353ebdb04",
    "order_id": "a8f8f1eb-637e-427c-886b-22c1da231caf",
    "sku_id": "29f2a32e-768f-4061-bfaf-5848e342f31f",
    "product_name": "RTX 4080 Super Suprim X",
    "sku_code": "SKU-RTX4080SUPERSUPRIMX-7706",
    "price_at_purchase": 32000000.0,
    "quantity": 1
  },
  {
    "id": "de51a5d0-4b1f-4974-8258-8c4f43ab8488",
    "order_id": "a8f8f1eb-637e-427c-886b-22c1da231caf",
    "sku_id": "376ad42e-1d81-4bd1-9018-5434129adec4",
    "product_name": "Core i9-14900K",
    "sku_code": "SKU-COREI9-14900K-2f3a",
    "price_at_purchase": 16000000.0,
    "quantity": 1
  },
  {
    "id": "bc4de5ca-3140-4068-8081-87cf7dccde56",
    "order_id": "ada69a3d-1ebd-418c-8f69-cde6863aeb77",
    "sku_id": "81e477c7-3991-490c-b2a9-5a155fb20f45",
    "product_name": "Z790 HERO",
    "sku_code": "SKU-Z790HERO-9e7b",
    "price_at_purchase": 16000000.0,
    "quantity": 1
  },
  {
    "id": "f0670760-b998-4a37-bada-0f9cbd50982c",
    "order_id": "ada69a3d-1ebd-418c-8f69-cde6863aeb77",
    "sku_id": "73567175-0545-4514-8633-529f72d5b99e",
    "product_name": "Ryzen 9 7950X3D",
    "sku_code": "SKU-RYZEN97950X3D-c75a",
    "price_at_purchase": 17000000.0,
    "quantity": 1
  },
  {
    "id": "c0a09aa8-fe36-45ab-8b67-dad751bfed22",
    "order_id": "3aede67b-83ed-4faa-a844-eccf2586a53f",
    "sku_id": "919e2b7b-fec0-4549-a303-79324ca02f6f",
    "product_name": "RM1000x 1000W 80 Plus Gold",
    "sku_code": "SKU-RM1000X1000W80PLUSGOLD-059d",
    "price_at_purchase": 4500000.0,
    "quantity": 1
  },
  {
    "id": "6b4b9fb7-d974-4af3-bc7e-4c9b23c28a86",
    "order_id": "d85e8f0f-47c5-4e21-85c8-ecbc04bfcc3c",
    "sku_id": "73567175-0545-4514-8633-529f72d5b99e",
    "product_name": "Ryzen 9 7950X3D",
    "sku_code": "SKU-RYZEN97950X3D-c75a",
    "price_at_purchase": 17000000.0,
    "quantity": 2
  },
  {
    "id": "b84afdcd-ee9f-45fb-95bb-be65517123dd",
    "order_id": "d85e8f0f-47c5-4e21-85c8-ecbc04bfcc3c",
    "sku_id": "29f2a32e-768f-4061-bfaf-5848e342f31f",
    "product_name": "RTX 4080 Super Suprim X",
    "sku_code": "SKU-RTX4080SUPERSUPRIMX-7706",
    "price_at_purchase": 32000000.0,
    "quantity": 2
  },
  {
    "id": "2c660d00-1cf2-4c44-8f2d-0b469521ec3a",
    "order_id": "d85e8f0f-47c5-4e21-85c8-ecbc04bfcc3c",
    "sku_id": "3a865c62-803b-40a3-a4e3-0202c48960b7",
    "product_name": "Fury Beast 32GB (2x16) DDR5",
    "sku_code": "SKU-FURYBEAST32GB(2X16)DDR5-5821",
    "price_at_purchase": 4000000.0,
    "quantity": 1
  },
  {
    "id": "73344d2b-02bf-433a-bf76-4d80dd693959",
    "order_id": "56fb10a6-6acd-4276-9f1c-7d88604dbd81",
    "sku_id": "60dc3b95-ca94-4be3-884d-f7ce94208474",
    "product_name": "RTX 4090 ROG Strix",
    "sku_code": "SKU-RTX4090ROGSTRIX-c5e6",
    "price_at_purchase": 65000000.0,
    "quantity": 1
  },
  {
    "id": "e0ebe038-b153-4fde-9a4c-963d3902ac30",
    "order_id": "56fb10a6-6acd-4276-9f1c-7d88604dbd81",
    "sku_id": "919e2b7b-fec0-4549-a303-79324ca02f6f",
    "product_name": "RM1000x 1000W 80 Plus Gold",
    "sku_code": "SKU-RM1000X1000W80PLUSGOLD-059d",
    "price_at_purchase": 4500000.0,
    "quantity": 1
  },
  {
    "id": "666f1677-d777-4f4d-837b-b286ef54b20b",
    "order_id": "37a11dca-fe6e-4c43-8bd9-237e5b18ad5f",
    "sku_id": "81e477c7-3991-490c-b2a9-5a155fb20f45",
    "product_name": "Z790 HERO",
    "sku_code": "SKU-Z790HERO-9e7b",
    "price_at_purchase": 16000000.0,
    "quantity": 1
  },
  {
    "id": "313244f8-24b9-43f8-a261-84580883d580",
    "order_id": "0529e328-6d46-4f14-a877-7e2bdaaee2bf",
    "sku_id": "3a865c62-803b-40a3-a4e3-0202c48960b7",
    "product_name": "Fury Beast 32GB (2x16) DDR5",
    "sku_code": "SKU-FURYBEAST32GB(2X16)DDR5-5821",
    "price_at_purchase": 4000000.0,
    "quantity": 2
  },
  {
    "id": "a6ea4db1-d62e-4619-9c89-ac37b605b9be",
    "order_id": "0529e328-6d46-4f14-a877-7e2bdaaee2bf",
    "sku_id": "cab9b6db-1217-46ee-a2c5-450dee80ac65",
    "product_name": "Dominator Titanium 32GB (2x16) DDR5",
    "sku_code": "SKU-DOMINATORTITANIUM32GB(2X16)DDR5-1f51",
    "price_at_purchase": 5500000.0,
    "quantity": 1
  },
  {
    "id": "ea26838f-ff51-429b-bfbf-cdf613e778bf",
    "order_id": "1f94e011-36e1-4399-9e8b-457cbaf93ebc",
    "sku_id": "537722f7-16dd-4be7-a30d-d11c2dd4419a",
    "product_name": "B650 TOMAHAWK WIFI",
    "sku_code": "SKU-B650TOMAHAWKWIFI-4ea2",
    "price_at_purchase": 6500000.0,
    "quantity": 1
  },
  {
    "id": "069ab2b7-8174-4f61-8295-9e42b32e8933",
    "order_id": "1f94e011-36e1-4399-9e8b-457cbaf93ebc",
    "sku_id": "3a865c62-803b-40a3-a4e3-0202c48960b7",
    "product_name": "Fury Beast 32GB (2x16) DDR5",
    "sku_code": "SKU-FURYBEAST32GB(2X16)DDR5-5821",
    "price_at_purchase": 4000000.0,
    "quantity": 1
  },
  {
    "id": "03647346-db13-4712-ada6-e517ee8b8ab6",
    "order_id": "1f94e011-36e1-4399-9e8b-457cbaf93ebc",
    "sku_id": "870cbc7d-26c3-4225-872a-5c43dc55502f",
    "product_name": "RX 7900 XTX AORUS",
    "sku_code": "SKU-RX7900XTXAORUS-e866",
    "price_at_purchase": 30000000.0,
    "quantity": 2
  },
  {
    "id": "01a2df90-aff7-47d4-8380-9c8389364cc0",
    "order_id": "d35ad90a-731b-493b-9530-704d62599726",
    "sku_id": "3a865c62-803b-40a3-a4e3-0202c48960b7",
    "product_name": "Fury Beast 32GB (2x16) DDR5",
    "sku_code": "SKU-FURYBEAST32GB(2X16)DDR5-5821",
    "price_at_purchase": 4000000.0,
    "quantity": 2
  },
  {
    "id": "ba1efec6-8809-4793-960c-121ac0926886",
    "order_id": "d35ad90a-731b-493b-9530-704d62599726",
    "sku_id": "919e2b7b-fec0-4549-a303-79324ca02f6f",
    "product_name": "RM1000x 1000W 80 Plus Gold",
    "sku_code": "SKU-RM1000X1000W80PLUSGOLD-059d",
    "price_at_purchase": 4500000.0,
    "quantity": 1
  },
  {
    "id": "9a8adbac-e5d3-44d7-a7d3-e248265ddcfb",
    "order_id": "d58c3e67-7f8e-4424-aba3-89b21be6b72c",
    "sku_id": "919e2b7b-fec0-4549-a303-79324ca02f6f",
    "product_name": "RM1000x 1000W 80 Plus Gold",
    "sku_code": "SKU-RM1000X1000W80PLUSGOLD-059d",
    "price_at_purchase": 4500000.0,
    "quantity": 1
  },
  {
    "id": "294a20e7-b9e7-4fc5-b6ee-649605250c05",
    "order_id": "d58c3e67-7f8e-4424-aba3-89b21be6b72c",
    "sku_id": "3a865c62-803b-40a3-a4e3-0202c48960b7",
    "product_name": "Fury Beast 32GB (2x16) DDR5",
    "sku_code": "SKU-FURYBEAST32GB(2X16)DDR5-5821",
    "price_at_purchase": 4000000.0,
    "quantity": 1
  },
  {
    "id": "b20a3066-ecb9-4391-a083-efb7bcd24293",
    "order_id": "a4854111-7edc-44cb-b8d6-ebac06d678b6",
    "sku_id": "29f2a32e-768f-4061-bfaf-5848e342f31f",
    "product_name": "RTX 4080 Super Suprim X",
    "sku_code": "SKU-RTX4080SUPERSUPRIMX-7706",
    "price_at_purchase": 32000000.0,
    "quantity": 2
  },
  {
    "id": "b4610b94-97c1-49ff-819f-bd1fddcc601f",
    "order_id": "6c1b2dd8-e055-499b-8b91-0b952d48a3b4",
    "sku_id": "919e2b7b-fec0-4549-a303-79324ca02f6f",
    "product_name": "RM1000x 1000W 80 Plus Gold",
    "sku_code": "SKU-RM1000X1000W80PLUSGOLD-059d",
    "price_at_purchase": 4500000.0,
    "quantity": 2
  },
  {
    "id": "5f940ee5-1b24-4715-9f9b-4f5bbafb89f4",
    "order_id": "6c1b2dd8-e055-499b-8b91-0b952d48a3b4",
    "sku_id": "81e477c7-3991-490c-b2a9-5a155fb20f45",
    "product_name": "Z790 HERO",
    "sku_code": "SKU-Z790HERO-9e7b",
    "price_at_purchase": 16000000.0,
    "quantity": 2
  },
  {
    "id": "6cddf407-47a5-490b-be5c-e36bcb7b60c9",
    "order_id": "5a0e28c3-0f81-4b35-8d7d-1d568f6a735d",
    "sku_id": "3a865c62-803b-40a3-a4e3-0202c48960b7",
    "product_name": "Fury Beast 32GB (2x16) DDR5",
    "sku_code": "SKU-FURYBEAST32GB(2X16)DDR5-5821",
    "price_at_purchase": 4000000.0,
    "quantity": 2
  },
  {
    "id": "79f7016a-da5f-4104-b87c-4b7a297d85d2",
    "order_id": "5a0e28c3-0f81-4b35-8d7d-1d568f6a735d",
    "sku_id": "537722f7-16dd-4be7-a30d-d11c2dd4419a",
    "product_name": "B650 TOMAHAWK WIFI",
    "sku_code": "SKU-B650TOMAHAWKWIFI-4ea2",
    "price_at_purchase": 6500000.0,
    "quantity": 2
  },
  {
    "id": "d4589f36-5251-4ef9-add8-c19dd2a14fb3",
    "order_id": "5a0e28c3-0f81-4b35-8d7d-1d568f6a735d",
    "sku_id": "60dc3b95-ca94-4be3-884d-f7ce94208474",
    "product_name": "RTX 4090 ROG Strix",
    "sku_code": "SKU-RTX4090ROGSTRIX-c5e6",
    "price_at_purchase": 65000000.0,
    "quantity": 1
  },
  {
    "id": "50a8a6d9-6da0-4d81-93cc-ea5b184b8b30",
    "order_id": "d813c668-d43c-42ea-834e-ad0e8af8f372",
    "sku_id": "537722f7-16dd-4be7-a30d-d11c2dd4419a",
    "product_name": "B650 TOMAHAWK WIFI",
    "sku_code": "SKU-B650TOMAHAWKWIFI-4ea2",
    "price_at_purchase": 6500000.0,
    "quantity": 2
  },
  {
    "id": "4e816267-4051-44b6-876e-fa9574ee7c8f",
    "order_id": "c108ab6f-6ead-45ad-939a-dc5642d7434c",
    "sku_id": "cab9b6db-1217-46ee-a2c5-450dee80ac65",
    "product_name": "Dominator Titanium 32GB (2x16) DDR5",
    "sku_code": "SKU-DOMINATORTITANIUM32GB(2X16)DDR5-1f51",
    "price_at_purchase": 5500000.0,
    "quantity": 1
  },
  {
    "id": "5714503b-c815-482d-b71e-45e12729156a",
    "order_id": "c108ab6f-6ead-45ad-939a-dc5642d7434c",
    "sku_id": "73567175-0545-4514-8633-529f72d5b99e",
    "product_name": "Ryzen 9 7950X3D",
    "sku_code": "SKU-RYZEN97950X3D-c75a",
    "price_at_purchase": 17000000.0,
    "quantity": 2
  },
  {
    "id": "0190e50f-6ed2-4080-88bd-c9e02b14b9d9",
    "order_id": "8f6383ee-7e55-4787-8e67-a070957bc616",
    "sku_id": "3a865c62-803b-40a3-a4e3-0202c48960b7",
    "product_name": "Fury Beast 32GB (2x16) DDR5",
    "sku_code": "SKU-FURYBEAST32GB(2X16)DDR5-5821",
    "price_at_purchase": 4000000.0,
    "quantity": 1
  },
  {
    "id": "3f02355f-6fad-4ba5-9076-f80d66fdfb82",
    "order_id": "8f6383ee-7e55-4787-8e67-a070957bc616",
    "sku_id": "919e2b7b-fec0-4549-a303-79324ca02f6f",
    "product_name": "RM1000x 1000W 80 Plus Gold",
    "sku_code": "SKU-RM1000X1000W80PLUSGOLD-059d",
    "price_at_purchase": 4500000.0,
    "quantity": 1
  },
  {
    "id": "f4c126a1-d0ec-4466-98eb-9dda23c6497d",
    "order_id": "6c58a90e-a316-447b-bb55-fc0da962fa32",
    "sku_id": "376ad42e-1d81-4bd1-9018-5434129adec4",
    "product_name": "Core i9-14900K",
    "sku_code": "SKU-COREI9-14900K-2f3a",
    "price_at_purchase": 16000000.0,
    "quantity": 1
  },
  {
    "id": "6816174f-d94b-4df7-8845-cfec7f645034",
    "order_id": "d3bb8e51-4ee2-4c19-af75-15dd12d988bd",
    "sku_id": "29f2a32e-768f-4061-bfaf-5848e342f31f",
    "product_name": "RTX 4080 Super Suprim X",
    "sku_code": "SKU-RTX4080SUPERSUPRIMX-7706",
    "price_at_purchase": 32000000.0,
    "quantity": 2
  },
  {
    "id": "5051c97b-d9e8-4ce9-a9e8-efd813dc39f0",
    "order_id": "d3bb8e51-4ee2-4c19-af75-15dd12d988bd",
    "sku_id": "73567175-0545-4514-8633-529f72d5b99e",
    "product_name": "Ryzen 9 7950X3D",
    "sku_code": "SKU-RYZEN97950X3D-c75a",
    "price_at_purchase": 17000000.0,
    "quantity": 1
  },
  {
    "id": "525c1752-2bc0-4d05-a5e0-327d3f7612f0",
    "order_id": "1c5a777a-c47a-4b95-b0ca-18e928b43a68",
    "sku_id": "6fbec32f-f96f-4aa7-8317-224d892e45fe",
    "product_name": "990 PRO 2TB PCIe 4.0",
    "sku_code": "SKU-990PRO2TBPCIE4.0-7b83",
    "price_at_purchase": 5000000.0,
    "quantity": 2
  },
  {
    "id": "e356adda-49dd-4a92-a529-e92bb76fe005",
    "order_id": "1c5a777a-c47a-4b95-b0ca-18e928b43a68",
    "sku_id": "60dc3b95-ca94-4be3-884d-f7ce94208474",
    "product_name": "RTX 4090 ROG Strix",
    "sku_code": "SKU-RTX4090ROGSTRIX-c5e6",
    "price_at_purchase": 65000000.0,
    "quantity": 2
  },
  {
    "id": "ed08ead6-6654-4432-9d98-5a40dcecdf45",
    "order_id": "a7da5b0f-38ce-4add-b0fd-ba33a6bcec09",
    "sku_id": "3a865c62-803b-40a3-a4e3-0202c48960b7",
    "product_name": "Fury Beast 32GB (2x16) DDR5",
    "sku_code": "SKU-FURYBEAST32GB(2X16)DDR5-5821",
    "price_at_purchase": 4000000.0,
    "quantity": 2
  },
  {
    "id": "93597fa2-34ea-4f48-9156-5def6d7ceb55",
    "order_id": "8e13d59d-3c13-4680-87bd-6032cf9d0ee0",
    "sku_id": "870cbc7d-26c3-4225-872a-5c43dc55502f",
    "product_name": "RX 7900 XTX AORUS",
    "sku_code": "SKU-RX7900XTXAORUS-e866",
    "price_at_purchase": 30000000.0,
    "quantity": 1
  },
  {
    "id": "03a82f12-ed40-45a0-ab58-1a54ee82f9ae",
    "order_id": "a4dd6897-25b3-43c3-8679-b32fca240913",
    "sku_id": "73567175-0545-4514-8633-529f72d5b99e",
    "product_name": "Ryzen 9 7950X3D",
    "sku_code": "SKU-RYZEN97950X3D-c75a",
    "price_at_purchase": 17000000.0,
    "quantity": 2
  },
  {
    "id": "7d59b38d-fde8-475f-b6b3-8bebcc02d661",
    "order_id": "a4dd6897-25b3-43c3-8679-b32fca240913",
    "sku_id": "29f2a32e-768f-4061-bfaf-5848e342f31f",
    "product_name": "RTX 4080 Super Suprim X",
    "sku_code": "SKU-RTX4080SUPERSUPRIMX-7706",
    "price_at_purchase": 32000000.0,
    "quantity": 2
  },
  {
    "id": "41572154-975f-4426-9e9f-7ab4c8a7d37b",
    "order_id": "a4dd6897-25b3-43c3-8679-b32fca240913",
    "sku_id": "cab9b6db-1217-46ee-a2c5-450dee80ac65",
    "product_name": "Dominator Titanium 32GB (2x16) DDR5",
    "sku_code": "SKU-DOMINATORTITANIUM32GB(2X16)DDR5-1f51",
    "price_at_purchase": 5500000.0,
    "quantity": 2
  },
  {
    "id": "512c69ae-a70f-4429-9c47-08414561a2d4",
    "order_id": "3d293b3a-f830-4057-aa8c-9d1c50e2d159",
    "sku_id": "29f2a32e-768f-4061-bfaf-5848e342f31f",
    "product_name": "RTX 4080 Super Suprim X",
    "sku_code": "SKU-RTX4080SUPERSUPRIMX-7706",
    "price_at_purchase": 32000000.0,
    "quantity": 2
  },
  {
    "id": "ed83a87c-bd18-4db7-a32a-a678b521e8ad",
    "order_id": "3d293b3a-f830-4057-aa8c-9d1c50e2d159",
    "sku_id": "376ad42e-1d81-4bd1-9018-5434129adec4",
    "product_name": "Core i9-14900K",
    "sku_code": "SKU-COREI9-14900K-2f3a",
    "price_at_purchase": 16000000.0,
    "quantity": 2
  },
  {
    "id": "7b6e2623-731e-48bd-bf9c-74ce56c0882f",
    "order_id": "6a64f2ba-3253-47b9-a849-a0e2cb366c73",
    "sku_id": "73567175-0545-4514-8633-529f72d5b99e",
    "product_name": "Ryzen 9 7950X3D",
    "sku_code": "SKU-RYZEN97950X3D-c75a",
    "price_at_purchase": 17000000.0,
    "quantity": 2
  },
  {
    "id": "bb8e064a-02ec-48bb-910d-6b16573328ae",
    "order_id": "6a64f2ba-3253-47b9-a849-a0e2cb366c73",
    "sku_id": "cab9b6db-1217-46ee-a2c5-450dee80ac65",
    "product_name": "Dominator Titanium 32GB (2x16) DDR5",
    "sku_code": "SKU-DOMINATORTITANIUM32GB(2X16)DDR5-1f51",
    "price_at_purchase": 5500000.0,
    "quantity": 2
  },
  {
    "id": "b184b3b6-ec13-422b-aa31-35136d106b11",
    "order_id": "71900004-05bb-4608-981e-86b256daa935",
    "sku_id": "81e477c7-3991-490c-b2a9-5a155fb20f45",
    "product_name": "Z790 HERO",
    "sku_code": "SKU-Z790HERO-9e7b",
    "price_at_purchase": 16000000.0,
    "quantity": 1
  },
  {
    "id": "2b20cdf8-56ac-47d7-a30c-b16c1ea47e1f",
    "order_id": "71900004-05bb-4608-981e-86b256daa935",
    "sku_id": "537722f7-16dd-4be7-a30d-d11c2dd4419a",
    "product_name": "B650 TOMAHAWK WIFI",
    "sku_code": "SKU-B650TOMAHAWKWIFI-4ea2",
    "price_at_purchase": 6500000.0,
    "quantity": 1
  },
  {
    "id": "12ea2ec2-2f42-4813-a9a4-dbcfdc596b85",
    "order_id": "ef83a67e-df87-415f-a79f-6e0f5e259afe",
    "sku_id": "3a865c62-803b-40a3-a4e3-0202c48960b7",
    "product_name": "Fury Beast 32GB (2x16) DDR5",
    "sku_code": "SKU-FURYBEAST32GB(2X16)DDR5-5821",
    "price_at_purchase": 4000000.0,
    "quantity": 2
  },
  {
    "id": "88f5e9b0-79ef-4efe-84c3-730c160d6dbb",
    "order_id": "80b71372-fcba-46c1-a5fe-bb5529e3f5f1",
    "sku_id": "537722f7-16dd-4be7-a30d-d11c2dd4419a",
    "product_name": "B650 TOMAHAWK WIFI",
    "sku_code": "SKU-B650TOMAHAWKWIFI-4ea2",
    "price_at_purchase": 6500000.0,
    "quantity": 1
  },
  {
    "id": "56801248-fe1d-4b33-9ed9-af62c86ea4b9",
    "order_id": "7236fcc6-d0eb-4e2c-bbdf-cc13fc8801a7",
    "sku_id": "6fbec32f-f96f-4aa7-8317-224d892e45fe",
    "product_name": "990 PRO 2TB PCIe 4.0",
    "sku_code": "SKU-990PRO2TBPCIE4.0-7b83",
    "price_at_purchase": 5000000.0,
    "quantity": 2
  },
  {
    "id": "88e2419a-1cb6-41fe-99fb-dd9fe6131283",
    "order_id": "7236fcc6-d0eb-4e2c-bbdf-cc13fc8801a7",
    "sku_id": "73567175-0545-4514-8633-529f72d5b99e",
    "product_name": "Ryzen 9 7950X3D",
    "sku_code": "SKU-RYZEN97950X3D-c75a",
    "price_at_purchase": 17000000.0,
    "quantity": 2
  },
  {
    "id": "d26554c5-b069-4f1e-8a41-d59c26fb4f2d",
    "order_id": "5915fb47-fbc6-4fc4-860f-4ad03be9b165",
    "sku_id": "3a865c62-803b-40a3-a4e3-0202c48960b7",
    "product_name": "Fury Beast 32GB (2x16) DDR5",
    "sku_code": "SKU-FURYBEAST32GB(2X16)DDR5-5821",
    "price_at_purchase": 4000000.0,
    "quantity": 1
  },
  {
    "id": "7c8ecfd8-34eb-4a53-9deb-2672f326c917",
    "order_id": "830e2fc3-0e92-4179-8391-4435d1a65249",
    "sku_id": "537722f7-16dd-4be7-a30d-d11c2dd4419a",
    "product_name": "B650 TOMAHAWK WIFI",
    "sku_code": "SKU-B650TOMAHAWKWIFI-4ea2",
    "price_at_purchase": 6500000.0,
    "quantity": 2
  },
  {
    "id": "4311c9d3-1054-41a5-8b8e-ab79c59616b7",
    "order_id": "830e2fc3-0e92-4179-8391-4435d1a65249",
    "sku_id": "60dc3b95-ca94-4be3-884d-f7ce94208474",
    "product_name": "RTX 4090 ROG Strix",
    "sku_code": "SKU-RTX4090ROGSTRIX-c5e6",
    "price_at_purchase": 65000000.0,
    "quantity": 2
  },
  {
    "id": "73a16ed3-f106-4c46-98d5-929047140aed",
    "order_id": "830e2fc3-0e92-4179-8391-4435d1a65249",
    "sku_id": "6fbec32f-f96f-4aa7-8317-224d892e45fe",
    "product_name": "990 PRO 2TB PCIe 4.0",
    "sku_code": "SKU-990PRO2TBPCIE4.0-7b83",
    "price_at_purchase": 5000000.0,
    "quantity": 2
  },
  {
    "id": "525f6674-caf9-4563-b263-b70db3a0a4d5",
    "order_id": "0708b2be-e8f5-4212-955a-ef84c7834c11",
    "sku_id": "29f2a32e-768f-4061-bfaf-5848e342f31f",
    "product_name": "RTX 4080 Super Suprim X",
    "sku_code": "SKU-RTX4080SUPERSUPRIMX-7706",
    "price_at_purchase": 32000000.0,
    "quantity": 2
  },
  {
    "id": "09b2d2e6-3a30-43e3-bd0b-0ebb3c2f9253",
    "order_id": "0708b2be-e8f5-4212-955a-ef84c7834c11",
    "sku_id": "6fbec32f-f96f-4aa7-8317-224d892e45fe",
    "product_name": "990 PRO 2TB PCIe 4.0",
    "sku_code": "SKU-990PRO2TBPCIE4.0-7b83",
    "price_at_purchase": 5000000.0,
    "quantity": 2
  },
  {
    "id": "0ae88255-01a5-4eee-acc2-a8f2ffd29092",
    "order_id": "2f82932c-acc5-4b67-be55-eaa987dba056",
    "sku_id": "60dc3b95-ca94-4be3-884d-f7ce94208474",
    "product_name": "RTX 4090 ROG Strix",
    "sku_code": "SKU-RTX4090ROGSTRIX-c5e6",
    "price_at_purchase": 65000000.0,
    "quantity": 2
  },
  {
    "id": "b84a772a-cce6-4e18-a6cd-abcdadfb15ce",
    "order_id": "2f82932c-acc5-4b67-be55-eaa987dba056",
    "sku_id": "73567175-0545-4514-8633-529f72d5b99e",
    "product_name": "Ryzen 9 7950X3D",
    "sku_code": "SKU-RYZEN97950X3D-c75a",
    "price_at_purchase": 17000000.0,
    "quantity": 2
  },
  {
    "id": "3eb79be1-1561-4cc0-99fc-8622d9bd137c",
    "order_id": "5da9c60f-a1fb-41d7-89ec-be3c73553c66",
    "sku_id": "919e2b7b-fec0-4549-a303-79324ca02f6f",
    "product_name": "RM1000x 1000W 80 Plus Gold",
    "sku_code": "SKU-RM1000X1000W80PLUSGOLD-059d",
    "price_at_purchase": 4500000.0,
    "quantity": 2
  },
  {
    "id": "1bdc3c03-9ebe-4d52-b2a8-ee9f6d565d46",
    "order_id": "5da9c60f-a1fb-41d7-89ec-be3c73553c66",
    "sku_id": "376ad42e-1d81-4bd1-9018-5434129adec4",
    "product_name": "Core i9-14900K",
    "sku_code": "SKU-COREI9-14900K-2f3a",
    "price_at_purchase": 16000000.0,
    "quantity": 2
  },
  {
    "id": "db737f93-917e-4f03-9a96-2d7c5cbd1b46",
    "order_id": "5da9c60f-a1fb-41d7-89ec-be3c73553c66",
    "sku_id": "73567175-0545-4514-8633-529f72d5b99e",
    "product_name": "Ryzen 9 7950X3D",
    "sku_code": "SKU-RYZEN97950X3D-c75a",
    "price_at_purchase": 17000000.0,
    "quantity": 2
  },
  {
    "id": "27f39315-411d-4c84-91f7-c84f1c62c897",
    "order_id": "b0ac9510-b6de-4c40-842a-f8d342b2eb7c",
    "sku_id": "60dc3b95-ca94-4be3-884d-f7ce94208474",
    "product_name": "RTX 4090 ROG Strix",
    "sku_code": "SKU-RTX4090ROGSTRIX-c5e6",
    "price_at_purchase": 65000000.0,
    "quantity": 2
  },
  {
    "id": "f1e4fb92-3c66-4b5b-945b-90d41b57cac8",
    "order_id": "5845fc2c-a847-4439-bd32-efb3641bbf35",
    "sku_id": "537722f7-16dd-4be7-a30d-d11c2dd4419a",
    "product_name": "B650 TOMAHAWK WIFI",
    "sku_code": "SKU-B650TOMAHAWKWIFI-4ea2",
    "price_at_purchase": 6500000.0,
    "quantity": 2
  },
  {
    "id": "fa340cdf-9820-4323-9a5a-1d64d0440ae5",
    "order_id": "5845fc2c-a847-4439-bd32-efb3641bbf35",
    "sku_id": "870cbc7d-26c3-4225-872a-5c43dc55502f",
    "product_name": "RX 7900 XTX AORUS",
    "sku_code": "SKU-RX7900XTXAORUS-e866",
    "price_at_purchase": 30000000.0,
    "quantity": 2
  },
  {
    "id": "d2f0cb6a-d783-4ab2-ace0-736dfec5e4fe",
    "order_id": "4d744461-7495-417d-899b-bd701c22200f",
    "sku_id": "73567175-0545-4514-8633-529f72d5b99e",
    "product_name": "Ryzen 9 7950X3D",
    "sku_code": "SKU-RYZEN97950X3D-c75a",
    "price_at_purchase": 17000000.0,
    "quantity": 1
  },
  {
    "id": "d0610dc1-8182-4207-ac9b-1746d2c41ad6",
    "order_id": "4d744461-7495-417d-899b-bd701c22200f",
    "sku_id": "81e477c7-3991-490c-b2a9-5a155fb20f45",
    "product_name": "Z790 HERO",
    "sku_code": "SKU-Z790HERO-9e7b",
    "price_at_purchase": 16000000.0,
    "quantity": 2
  },
  {
    "id": "b65f77f8-ab55-4969-b534-cfc6cc55a9d4",
    "order_id": "4d744461-7495-417d-899b-bd701c22200f",
    "sku_id": "376ad42e-1d81-4bd1-9018-5434129adec4",
    "product_name": "Core i9-14900K",
    "sku_code": "SKU-COREI9-14900K-2f3a",
    "price_at_purchase": 16000000.0,
    "quantity": 1
  },
  {
    "id": "f0868fdf-7ab3-4008-91fc-4a41db80a06e",
    "order_id": "bf8aee23-12b7-4090-915f-2a51e04e519a",
    "sku_id": "870cbc7d-26c3-4225-872a-5c43dc55502f",
    "product_name": "RX 7900 XTX AORUS",
    "sku_code": "SKU-RX7900XTXAORUS-e866",
    "price_at_purchase": 30000000.0,
    "quantity": 1
  },
  {
    "id": "f6ccdd01-5ce1-4699-b188-39831d920428",
    "order_id": "bf8aee23-12b7-4090-915f-2a51e04e519a",
    "sku_id": "537722f7-16dd-4be7-a30d-d11c2dd4419a",
    "product_name": "B650 TOMAHAWK WIFI",
    "sku_code": "SKU-B650TOMAHAWKWIFI-4ea2",
    "price_at_purchase": 6500000.0,
    "quantity": 2
  },
  {
    "id": "da97a1a1-5e28-45d4-83b7-4ace0ce021f7",
    "order_id": "bf8aee23-12b7-4090-915f-2a51e04e519a",
    "sku_id": "919e2b7b-fec0-4549-a303-79324ca02f6f",
    "product_name": "RM1000x 1000W 80 Plus Gold",
    "sku_code": "SKU-RM1000X1000W80PLUSGOLD-059d",
    "price_at_purchase": 4500000.0,
    "quantity": 1
  },
  {
    "id": "1773a994-85da-4ffe-9643-4b52fbda143b",
    "order_id": "bb1667fb-b533-4892-b06f-242902fb8a38",
    "sku_id": "376ad42e-1d81-4bd1-9018-5434129adec4",
    "product_name": "Core i9-14900K",
    "sku_code": "SKU-COREI9-14900K-2f3a",
    "price_at_purchase": 16000000.0,
    "quantity": 2
  },
  {
    "id": "9e33f584-096e-428c-a3a2-0192abc20ea3",
    "order_id": "bb1667fb-b533-4892-b06f-242902fb8a38",
    "sku_id": "73567175-0545-4514-8633-529f72d5b99e",
    "product_name": "Ryzen 9 7950X3D",
    "sku_code": "SKU-RYZEN97950X3D-c75a",
    "price_at_purchase": 17000000.0,
    "quantity": 2
  },
  {
    "id": "f78a0e18-dd6c-4ae4-aa03-1bc2fe9e164c",
    "order_id": "5cbb90fd-f4b1-4e10-9bea-cb1d7d4aa7c9",
    "sku_id": "3a865c62-803b-40a3-a4e3-0202c48960b7",
    "product_name": "Fury Beast 32GB (2x16) DDR5",
    "sku_code": "SKU-FURYBEAST32GB(2X16)DDR5-5821",
    "price_at_purchase": 4000000.0,
    "quantity": 1
  },
  {
    "id": "2822103f-88ec-4a9a-9431-a4add439cc86",
    "order_id": "d8f00131-8436-4dcc-9525-e4b5e2a9c724",
    "sku_id": "3a865c62-803b-40a3-a4e3-0202c48960b7",
    "product_name": "Fury Beast 32GB (2x16) DDR5",
    "sku_code": "SKU-FURYBEAST32GB(2X16)DDR5-5821",
    "price_at_purchase": 4000000.0,
    "quantity": 2
  },
  {
    "id": "9fdfe305-427b-4733-98b6-92041b161a13",
    "order_id": "d8f00131-8436-4dcc-9525-e4b5e2a9c724",
    "sku_id": "919e2b7b-fec0-4549-a303-79324ca02f6f",
    "product_name": "RM1000x 1000W 80 Plus Gold",
    "sku_code": "SKU-RM1000X1000W80PLUSGOLD-059d",
    "price_at_purchase": 4500000.0,
    "quantity": 2
  }
]

REVIEWS_DATA = [
  {
    "id": "c754d39b-4c64-4bd8-b71e-ad4123f81aab",
    "user_id": "2efaf5ae-bc3b-47bc-90b9-632f3f6064da",
    "sku_id": "1bee753f-fcee-4c88-b440-d6dcd723ccdd",
    "rating": 5,
    "comment": "S\u1ea3n ph\u1ea9m d\u00f9ng r\u1ea5t th\u00edch, giao h\u00e0ng nhanh ch\u00f3ng!",
    "created_at": "2026-06-15T21:16:32.439937+07:00",
    "updated_at": "2026-06-15T21:16:32.439937+07:00"
  },
  {
    "id": "5541b848-1522-4ab2-8d82-7321c492ab07",
    "user_id": "f720b74c-ef1c-4b21-a158-a53619ef626c",
    "sku_id": "1bee753f-fcee-4c88-b440-d6dcd723ccdd",
    "rating": 4,
    "comment": "H\u00e0ng \u0111\u1eb9p, tuy nhi\u00ean \u0111\u00f3ng g\u00f3i h\u01a1i m\u00f3p m\u00e9o.",
    "created_at": "2026-06-15T21:16:32.439937+07:00",
    "updated_at": "2026-06-15T21:16:32.439937+07:00"
  },
  {
    "id": "75a77d7a-1f60-4493-882f-e156314e0a39",
    "user_id": "44e3fb18-124e-4107-a6a7-5f87440ca940",
    "sku_id": "1bee753f-fcee-4c88-b440-d6dcd723ccdd",
    "rating": 5,
    "comment": "Ch\u1ea5t l\u01b0\u1ee3ng tuy\u1ec7t v\u1eddi trong t\u1ea7m gi\u00e1.",
    "created_at": "2026-06-15T21:16:32.439937+07:00",
    "updated_at": "2026-06-15T21:16:32.439937+07:00"
  },
  {
    "id": "c980dfd6-8354-4e31-adb6-da072f0d487f",
    "user_id": "154be4a1-0712-4b7c-b589-3a4817cdb9d2",
    "sku_id": "919e2b7b-fec0-4549-a303-79324ca02f6f",
    "rating": 5,
    "comment": "\u0110\u00f3ng g\u00f3i c\u1ea9n th\u1eadn, test ok.",
    "created_at": "2026-06-15T22:01:08.256719+07:00",
    "updated_at": "2026-06-15T22:01:08.256719+07:00"
  },
  {
    "id": "d1c5e8cd-9016-4877-af54-634273f0b8fd",
    "user_id": "154be4a1-0712-4b7c-b589-3a4817cdb9d2",
    "sku_id": "6fbec32f-f96f-4aa7-8317-224d892e45fe",
    "rating": 5,
    "comment": "S\u1ea3n ph\u1ea9m tuy\u1ec7t v\u1eddi, giao h\u00e0ng si\u00eau nhanh!",
    "created_at": "2026-06-15T22:01:08.256719+07:00",
    "updated_at": "2026-06-15T22:01:08.256719+07:00"
  },
  {
    "id": "cd6ed9d6-5d54-49f8-9606-492e5b804fd0",
    "user_id": "76a3244d-33f7-4021-8f06-7287523f5537",
    "sku_id": "6fbec32f-f96f-4aa7-8317-224d892e45fe",
    "rating": 5,
    "comment": "T\u1ea1m \u1ed5n trong t\u1ea7m gi\u00e1.",
    "created_at": "2026-06-15T22:01:08.256719+07:00",
    "updated_at": "2026-06-15T22:01:08.256719+07:00"
  },
  {
    "id": "d4a8c358-5f93-46fb-a284-c8b9e3dc60ac",
    "user_id": "76a3244d-33f7-4021-8f06-7287523f5537",
    "sku_id": "537722f7-16dd-4be7-a30d-d11c2dd4419a",
    "rating": 4,
    "comment": "Gi\u00e1 h\u01a1i cao nh\u01b0ng d\u00f9ng r\u1ea5t s\u01b0\u1edbng.",
    "created_at": "2026-06-15T22:01:08.256719+07:00",
    "updated_at": "2026-06-15T22:01:08.256719+07:00"
  },
  {
    "id": "c3898aff-19c6-4aa9-90b7-1424d92ec721",
    "user_id": "e1bcc0f2-0197-4a78-85ce-919f74128daa",
    "sku_id": "870cbc7d-26c3-4225-872a-5c43dc55502f",
    "rating": 5,
    "comment": "Shop h\u1ed7 tr\u1ee3 nhi\u1ec7t t\u00ecnh, 5 sao!",
    "created_at": "2026-06-15T22:01:08.256719+07:00",
    "updated_at": "2026-06-15T22:01:08.256719+07:00"
  },
  {
    "id": "288bc225-efb8-4961-8bc9-600c1a89a01f",
    "user_id": "e1bcc0f2-0197-4a78-85ce-919f74128daa",
    "sku_id": "537722f7-16dd-4be7-a30d-d11c2dd4419a",
    "rating": 5,
    "comment": "\u0110\u00f3ng g\u00f3i c\u1ea9n th\u1eadn, test ok.",
    "created_at": "2026-06-15T22:01:08.256719+07:00",
    "updated_at": "2026-06-15T22:01:08.256719+07:00"
  },
  {
    "id": "1418f92f-9139-4883-a4af-e808f112df33",
    "user_id": "03d7ce37-b04c-44ee-be56-0c284d235a81",
    "sku_id": "537722f7-16dd-4be7-a30d-d11c2dd4419a",
    "rating": 5,
    "comment": "Gi\u00e1 h\u01a1i cao nh\u01b0ng d\u00f9ng r\u1ea5t s\u01b0\u1edbng.",
    "created_at": "2026-06-15T22:01:08.256719+07:00",
    "updated_at": "2026-06-15T22:01:08.256719+07:00"
  },
  {
    "id": "93233c26-65c4-4e6e-b406-f26007019b99",
    "user_id": "03d7ce37-b04c-44ee-be56-0c284d235a81",
    "sku_id": "3a865c62-803b-40a3-a4e3-0202c48960b7",
    "rating": 4,
    "comment": "S\u1ea3n ph\u1ea9m tuy\u1ec7t v\u1eddi, giao h\u00e0ng si\u00eau nhanh!",
    "created_at": "2026-06-15T22:01:08.256719+07:00",
    "updated_at": "2026-06-15T22:01:08.256719+07:00"
  },
  {
    "id": "f3a0d82f-eded-4bb2-b220-4e9691293b98",
    "user_id": "67df3dbf-027e-4bbc-8602-62cc4944ea21",
    "sku_id": "376ad42e-1d81-4bd1-9018-5434129adec4",
    "rating": 5,
    "comment": "Ch\u1ea5t l\u01b0\u1ee3ng \u0111\u00fang nh\u01b0 qu\u1ea3ng c\u00e1o.",
    "created_at": "2026-06-15T22:01:08.256719+07:00",
    "updated_at": "2026-06-15T22:01:08.256719+07:00"
  },
  {
    "id": "0067c7b0-d2c2-4dbe-94d5-80422aebcddb",
    "user_id": "67df3dbf-027e-4bbc-8602-62cc4944ea21",
    "sku_id": "870cbc7d-26c3-4225-872a-5c43dc55502f",
    "rating": 4,
    "comment": "\u0110\u00f3ng g\u00f3i c\u1ea9n th\u1eadn, test ok.",
    "created_at": "2026-06-15T22:01:08.256719+07:00",
    "updated_at": "2026-06-15T22:01:08.256719+07:00"
  },
  {
    "id": "fe9a010b-3470-4078-b54a-1db1bd11da12",
    "user_id": "33721469-b1e5-49c8-b557-eaf6cad16c88",
    "sku_id": "376ad42e-1d81-4bd1-9018-5434129adec4",
    "rating": 5,
    "comment": "S\u1ea3n ph\u1ea9m tuy\u1ec7t v\u1eddi, giao h\u00e0ng si\u00eau nhanh!",
    "created_at": "2026-06-15T22:01:08.256719+07:00",
    "updated_at": "2026-06-15T22:01:08.256719+07:00"
  },
  {
    "id": "6ef78137-4cc0-498a-a48b-82711950ff43",
    "user_id": "33721469-b1e5-49c8-b557-eaf6cad16c88",
    "sku_id": "3a865c62-803b-40a3-a4e3-0202c48960b7",
    "rating": 4,
    "comment": "Gi\u00e1 h\u01a1i cao nh\u01b0ng d\u00f9ng r\u1ea5t s\u01b0\u1edbng.",
    "created_at": "2026-06-15T22:01:08.256719+07:00",
    "updated_at": "2026-06-15T22:01:08.256719+07:00"
  },
  {
    "id": "1b8fca0b-d9f5-4382-b1ed-b634f1487cf6",
    "user_id": "95db6332-45a2-4e92-8d69-ec0b5a2f15de",
    "sku_id": "537722f7-16dd-4be7-a30d-d11c2dd4419a",
    "rating": 5,
    "comment": "S\u1ea3n ph\u1ea9m tuy\u1ec7t v\u1eddi, giao h\u00e0ng si\u00eau nhanh!",
    "created_at": "2026-06-15T22:01:08.256719+07:00",
    "updated_at": "2026-06-15T22:01:08.256719+07:00"
  },
  {
    "id": "7ce76239-56e0-41ab-8a48-ba17632325da",
    "user_id": "95db6332-45a2-4e92-8d69-ec0b5a2f15de",
    "sku_id": "73567175-0545-4514-8633-529f72d5b99e",
    "rating": 5,
    "comment": "\u0110\u00f3ng g\u00f3i c\u1ea9n th\u1eadn, test ok.",
    "created_at": "2026-06-15T22:01:08.256719+07:00",
    "updated_at": "2026-06-15T22:01:08.256719+07:00"
  },
  {
    "id": "f095827a-ea1f-4cf9-9b56-b99b9063a0e5",
    "user_id": "8cb44ebc-93c8-4a4d-a607-c35c4cb5eee6",
    "sku_id": "cab9b6db-1217-46ee-a2c5-450dee80ac65",
    "rating": 4,
    "comment": "Shop h\u1ed7 tr\u1ee3 nhi\u1ec7t t\u00ecnh, 5 sao!",
    "created_at": "2026-06-15T22:01:08.256719+07:00",
    "updated_at": "2026-06-15T22:01:08.256719+07:00"
  },
  {
    "id": "ef7d5cff-c7f2-408e-adf4-c776bd599930",
    "user_id": "8cb44ebc-93c8-4a4d-a607-c35c4cb5eee6",
    "sku_id": "29f2a32e-768f-4061-bfaf-5848e342f31f",
    "rating": 5,
    "comment": "Shop h\u1ed7 tr\u1ee3 nhi\u1ec7t t\u00ecnh, 5 sao!",
    "created_at": "2026-06-15T22:01:08.256719+07:00",
    "updated_at": "2026-06-15T22:01:08.256719+07:00"
  },
  {
    "id": "379ff2e0-ed11-4e05-8df1-c0c8d78d0abb",
    "user_id": "0d74d79b-4349-4693-b12f-c2968f25fc8d",
    "sku_id": "73567175-0545-4514-8633-529f72d5b99e",
    "rating": 5,
    "comment": "Hi\u1ec7u n\u0103ng c\u1ef1c m\u1ea1nh, m\u00e1t m\u1ebb.",
    "created_at": "2026-06-15T22:01:08.256719+07:00",
    "updated_at": "2026-06-15T22:01:08.256719+07:00"
  },
  {
    "id": "b4d11a7e-3916-4918-8089-bb8502312ffd",
    "user_id": "0d74d79b-4349-4693-b12f-c2968f25fc8d",
    "sku_id": "537722f7-16dd-4be7-a30d-d11c2dd4419a",
    "rating": 5,
    "comment": "Shop h\u1ed7 tr\u1ee3 nhi\u1ec7t t\u00ecnh, 5 sao!",
    "created_at": "2026-06-15T22:01:08.256719+07:00",
    "updated_at": "2026-06-15T22:01:08.256719+07:00"
  },
  {
    "id": "679f6c91-441e-4dec-8cc9-42a38a0f0050",
    "user_id": "7476e4d1-6750-4d72-afe0-0b6891eacb56",
    "sku_id": "73567175-0545-4514-8633-529f72d5b99e",
    "rating": 5,
    "comment": "\u0110\u00f3ng g\u00f3i c\u1ea9n th\u1eadn, test ok.",
    "created_at": "2026-06-15T22:01:08.256719+07:00",
    "updated_at": "2026-06-15T22:01:08.256719+07:00"
  },
  {
    "id": "5ccddd65-5334-42f0-ba07-83a5f0cfc3fb",
    "user_id": "7476e4d1-6750-4d72-afe0-0b6891eacb56",
    "sku_id": "cab9b6db-1217-46ee-a2c5-450dee80ac65",
    "rating": 4,
    "comment": "S\u1ea3n ph\u1ea9m tuy\u1ec7t v\u1eddi, giao h\u00e0ng si\u00eau nhanh!",
    "created_at": "2026-06-15T22:01:08.256719+07:00",
    "updated_at": "2026-06-15T22:01:08.256719+07:00"
  },
  {
    "id": "12985ee3-8edb-4527-b733-212037415a5f",
    "user_id": "838aada4-abdb-4205-8166-25c9332fb00c",
    "sku_id": "376ad42e-1d81-4bd1-9018-5434129adec4",
    "rating": 4,
    "comment": "Ch\u1ea5t l\u01b0\u1ee3ng \u0111\u00fang nh\u01b0 qu\u1ea3ng c\u00e1o.",
    "created_at": "2026-06-15T22:01:08.256719+07:00",
    "updated_at": "2026-06-15T22:01:08.256719+07:00"
  },
  {
    "id": "72de1cab-02d3-4b8d-92d8-6657941de86f",
    "user_id": "838aada4-abdb-4205-8166-25c9332fb00c",
    "sku_id": "6fbec32f-f96f-4aa7-8317-224d892e45fe",
    "rating": 4,
    "comment": "S\u1ea3n ph\u1ea9m tuy\u1ec7t v\u1eddi, giao h\u00e0ng si\u00eau nhanh!",
    "created_at": "2026-06-15T22:01:08.256719+07:00",
    "updated_at": "2026-06-15T22:01:08.256719+07:00"
  },
  {
    "id": "1b2ebe04-08b2-48b3-8996-b78942005c45",
    "user_id": "be078323-1783-4459-aafd-62ec93e671fd",
    "sku_id": "73567175-0545-4514-8633-529f72d5b99e",
    "rating": 4,
    "comment": "Hi\u1ec7u n\u0103ng c\u1ef1c m\u1ea1nh, m\u00e1t m\u1ebb.",
    "created_at": "2026-06-15T22:01:08.256719+07:00",
    "updated_at": "2026-06-15T22:01:08.256719+07:00"
  },
  {
    "id": "76e90e06-9095-4f4b-af02-2b10de4ed2ac",
    "user_id": "be078323-1783-4459-aafd-62ec93e671fd",
    "sku_id": "60dc3b95-ca94-4be3-884d-f7ce94208474",
    "rating": 4,
    "comment": "Hi\u1ec7u n\u0103ng c\u1ef1c m\u1ea1nh, m\u00e1t m\u1ebb.",
    "created_at": "2026-06-15T22:01:08.256719+07:00",
    "updated_at": "2026-06-15T22:01:08.256719+07:00"
  },
  {
    "id": "daf385bd-a315-48e2-bad5-c505fe4d2658",
    "user_id": "8e3a3275-b0b4-4c3d-9532-83c3e29926c7",
    "sku_id": "81e477c7-3991-490c-b2a9-5a155fb20f45",
    "rating": 5,
    "comment": "Shop h\u1ed7 tr\u1ee3 nhi\u1ec7t t\u00ecnh, 5 sao!",
    "created_at": "2026-06-15T22:01:08.256719+07:00",
    "updated_at": "2026-06-15T22:01:08.256719+07:00"
  },
  {
    "id": "1a87892d-b003-4b76-8bae-6aa7f0f26741",
    "user_id": "8e3a3275-b0b4-4c3d-9532-83c3e29926c7",
    "sku_id": "919e2b7b-fec0-4549-a303-79324ca02f6f",
    "rating": 4,
    "comment": "Thi\u1ebft k\u1ebf \u0111\u1eb9p, build ch\u1eafc ch\u1eafn.",
    "created_at": "2026-06-15T22:01:08.256719+07:00",
    "updated_at": "2026-06-15T22:01:08.256719+07:00"
  },
  {
    "id": "f1c8f39a-44fc-4473-ac4d-7417c615c04f",
    "user_id": "49053213-3c7f-4920-ae57-8020c45e461f",
    "sku_id": "537722f7-16dd-4be7-a30d-d11c2dd4419a",
    "rating": 5,
    "comment": "Ch\u1ea5t l\u01b0\u1ee3ng \u0111\u00fang nh\u01b0 qu\u1ea3ng c\u00e1o.",
    "created_at": "2026-06-15T22:01:08.256719+07:00",
    "updated_at": "2026-06-15T22:01:08.256719+07:00"
  },
  {
    "id": "0ebc5364-149f-4a85-8306-f425433c6337",
    "user_id": "49053213-3c7f-4920-ae57-8020c45e461f",
    "sku_id": "537722f7-16dd-4be7-a30d-d11c2dd4419a",
    "rating": 5,
    "comment": "Shop h\u1ed7 tr\u1ee3 nhi\u1ec7t t\u00ecnh, 5 sao!",
    "created_at": "2026-06-15T22:01:08.256719+07:00",
    "updated_at": "2026-06-15T22:01:08.256719+07:00"
  },
  {
    "id": "7cdeb8cb-1d3f-42c0-8338-728338a8db31",
    "user_id": "3ee7dd3b-c6d6-482f-9691-94d6d29019d6",
    "sku_id": "870cbc7d-26c3-4225-872a-5c43dc55502f",
    "rating": 5,
    "comment": "Gi\u00e1 h\u01a1i cao nh\u01b0ng d\u00f9ng r\u1ea5t s\u01b0\u1edbng.",
    "created_at": "2026-06-15T22:01:08.256719+07:00",
    "updated_at": "2026-06-15T22:01:08.256719+07:00"
  },
  {
    "id": "7e233dc1-dc51-48a9-9a0c-d27ae152b294",
    "user_id": "3ee7dd3b-c6d6-482f-9691-94d6d29019d6",
    "sku_id": "919e2b7b-fec0-4549-a303-79324ca02f6f",
    "rating": 5,
    "comment": "Ch\u1ea5t l\u01b0\u1ee3ng \u0111\u00fang nh\u01b0 qu\u1ea3ng c\u00e1o.",
    "created_at": "2026-06-15T22:01:08.256719+07:00",
    "updated_at": "2026-06-15T22:01:08.256719+07:00"
  },
  {
    "id": "54bf530e-4e42-4676-883a-fa5d0eef4f7e",
    "user_id": "916f3dc1-cfcf-4d52-98d2-f5b943ee2d87",
    "sku_id": "73567175-0545-4514-8633-529f72d5b99e",
    "rating": 5,
    "comment": "Shop h\u1ed7 tr\u1ee3 nhi\u1ec7t t\u00ecnh, 5 sao!",
    "created_at": "2026-06-15T22:01:08.256719+07:00",
    "updated_at": "2026-06-15T22:01:08.256719+07:00"
  },
  {
    "id": "49deeb94-915d-4cf0-9452-f9c54069563d",
    "user_id": "916f3dc1-cfcf-4d52-98d2-f5b943ee2d87",
    "sku_id": "81e477c7-3991-490c-b2a9-5a155fb20f45",
    "rating": 5,
    "comment": "Ch\u1ea5t l\u01b0\u1ee3ng \u0111\u00fang nh\u01b0 qu\u1ea3ng c\u00e1o.",
    "created_at": "2026-06-15T22:01:08.256719+07:00",
    "updated_at": "2026-06-15T22:01:08.256719+07:00"
  },
  {
    "id": "a1440ddf-7e05-4c3f-828a-84ccb7f3f282",
    "user_id": "42f1c24e-5b0b-4cb2-8c18-cce92319b708",
    "sku_id": "537722f7-16dd-4be7-a30d-d11c2dd4419a",
    "rating": 4,
    "comment": "T\u1ea1m \u1ed5n trong t\u1ea7m gi\u00e1.",
    "created_at": "2026-06-15T22:01:08.256719+07:00",
    "updated_at": "2026-06-15T22:01:08.256719+07:00"
  },
  {
    "id": "57ddce0c-0230-4e2d-8502-0c01672648ec",
    "user_id": "42f1c24e-5b0b-4cb2-8c18-cce92319b708",
    "sku_id": "537722f7-16dd-4be7-a30d-d11c2dd4419a",
    "rating": 5,
    "comment": "S\u1ea3n ph\u1ea9m tuy\u1ec7t v\u1eddi, giao h\u00e0ng si\u00eau nhanh!",
    "created_at": "2026-06-15T22:01:08.256719+07:00",
    "updated_at": "2026-06-15T22:01:08.256719+07:00"
  },
  {
    "id": "be78cec1-756a-4e35-8b99-970cfd62c9cb",
    "user_id": "b0066f5e-291f-4bc8-b7de-3b040aa967b1",
    "sku_id": "870cbc7d-26c3-4225-872a-5c43dc55502f",
    "rating": 5,
    "comment": "T\u1ea1m \u1ed5n trong t\u1ea7m gi\u00e1.",
    "created_at": "2026-06-15T22:01:08.256719+07:00",
    "updated_at": "2026-06-15T22:01:08.256719+07:00"
  },
  {
    "id": "db4730fd-5f61-44de-b58a-c1d6ee5b7425",
    "user_id": "b0066f5e-291f-4bc8-b7de-3b040aa967b1",
    "sku_id": "919e2b7b-fec0-4549-a303-79324ca02f6f",
    "rating": 5,
    "comment": "S\u1ea3n ph\u1ea9m tuy\u1ec7t v\u1eddi, giao h\u00e0ng si\u00eau nhanh!",
    "created_at": "2026-06-15T22:01:08.256719+07:00",
    "updated_at": "2026-06-15T22:01:08.256719+07:00"
  },
  {
    "id": "ba25b615-ac9a-4e58-bbb7-e59c437d13d1",
    "user_id": "f8ff4ecd-db2d-4bb9-8ebc-ad1a76a39b05",
    "sku_id": "537722f7-16dd-4be7-a30d-d11c2dd4419a",
    "rating": 5,
    "comment": "T\u1ea1m \u1ed5n trong t\u1ea7m gi\u00e1.",
    "created_at": "2026-06-15T22:01:08.256719+07:00",
    "updated_at": "2026-06-15T22:01:08.256719+07:00"
  },
  {
    "id": "1509e7c2-5ed6-4013-be98-4079f103de9c",
    "user_id": "f8ff4ecd-db2d-4bb9-8ebc-ad1a76a39b05",
    "sku_id": "919e2b7b-fec0-4549-a303-79324ca02f6f",
    "rating": 4,
    "comment": "Ch\u1ea5t l\u01b0\u1ee3ng \u0111\u00fang nh\u01b0 qu\u1ea3ng c\u00e1o.",
    "created_at": "2026-06-15T22:01:08.256719+07:00",
    "updated_at": "2026-06-15T22:01:08.256719+07:00"
  },
  {
    "id": "a9a6af57-ec29-4184-a31d-f95effc075e0",
    "user_id": "23b285fc-4f89-4941-bbaf-507e3cb87129",
    "sku_id": "73567175-0545-4514-8633-529f72d5b99e",
    "rating": 5,
    "comment": "Ch\u1ea5t l\u01b0\u1ee3ng \u0111\u00fang nh\u01b0 qu\u1ea3ng c\u00e1o.",
    "created_at": "2026-06-15T22:01:08.256719+07:00",
    "updated_at": "2026-06-15T22:01:08.256719+07:00"
  },
  {
    "id": "6096347e-1722-438b-b4fb-9aad14b19280",
    "user_id": "23b285fc-4f89-4941-bbaf-507e3cb87129",
    "sku_id": "376ad42e-1d81-4bd1-9018-5434129adec4",
    "rating": 4,
    "comment": "T\u1ea1m \u1ed5n trong t\u1ea7m gi\u00e1.",
    "created_at": "2026-06-15T22:01:08.256719+07:00",
    "updated_at": "2026-06-15T22:01:08.256719+07:00"
  }
]


def seed_all(db):
    print("Seeding Users...")
    for u in USERS_DATA:
        if not db.query(User).filter(User.id == u['id']).first():
            if not db.query(User).filter(User.email == u['email']).first():
                user = User(**u)
                db.add(user)
    db.flush()
    
    for mu in MOCK_USERS:
        if not db.query(User).filter(User.email == mu['email']).first():
            mu['password'] = hash_password(str(mu['password'])) # type: ignore
            user = User(**mu)
            db.add(user)
            db.flush()
    db.commit()

    print("Seeding Categories...")
    for c in CATEGORIES_DATA:
        if not db.query(Category).filter(Category.id == c['id']).first():
            cat = Category(**c)
            db.add(cat)
    db.commit()

    print("Seeding Brands...")
    for b in BRANDS_DATA:
        if not db.query(Brand).filter(Brand.id == b['id']).first():
            brand = Brand(**b)
            db.add(brand)
    db.commit()

    # Old PRODUCTS_DATA/SKUS_DATA/IMAGES_DATA skipped - handled by seed_all_products.py
    print("Skipping old product data (replaced by seed_all_products)...")

    print("Seeding News...")
    for n in NEWS_DATA:
        if not db.query(News).filter(News.id == n['id']).first():
            n['published_at'] = datetime.fromisoformat(str(n['published_at'])) if n.get('published_at') else datetime.now(timezone.utc) # type: ignore
            n['created_at'] = datetime.fromisoformat(str(n['created_at'])) if n.get('created_at') else datetime.now(timezone.utc) # type: ignore
            n['updated_at'] = datetime.fromisoformat(str(n['updated_at'])) if n.get('updated_at') else datetime.now(timezone.utc) # type: ignore
            db.add(News(**n))
    db.commit()

    print("Seeding Banners...")
    for b in BANNERS_DATA:
        if not db.query(Banner).filter(Banner.id == b['id']).first():
            b['start_date'] = datetime.fromisoformat(str(b['start_date'])) if b.get('start_date') else None # type: ignore
            b['end_date'] = datetime.fromisoformat(str(b['end_date'])) if b.get('end_date') else None # type: ignore
            b['created_at'] = datetime.fromisoformat(str(b['created_at'])) if b.get('created_at') else datetime.now(timezone.utc) # type: ignore
            b['updated_at'] = datetime.fromisoformat(str(b['updated_at'])) if b.get('updated_at') else datetime.now(timezone.utc) # type: ignore
            db.add(Banner(**b))
    db.commit()
    
    print("Seeding Orders...")
    try:
        for o in ORDERS_DATA:
            if not db.query(Order).filter(Order.id == o['id']).first():
                o['created_at'] = datetime.fromisoformat(str(o['created_at'])) if o.get('created_at') else datetime.now(timezone.utc) # type: ignore
                o['updated_at'] = datetime.fromisoformat(str(o['updated_at'])) if o.get('updated_at') else datetime.now(timezone.utc) # type: ignore
                db.add(Order(**o))
        db.commit()

        print("Seeding Order Items...")
        for oi in ORDER_ITEMS_DATA:
            if not db.query(OrderItem).filter(OrderItem.id == oi['id']).first():
                db.add(OrderItem(**oi))
        db.commit()
    except Exception as e:
        print(f"  ⚠️ Orders/OrderItems skipped (missing addresses): {str(e)[:60]}")
        db.rollback()

    # Seed Products (149 sản phẩm phủ hết menu)
    from seed_all_products import run_seed_products
    run_seed_products()

    print("Seeding Reviews...")
    try:
        for rv in REVIEWS_DATA:
            if not db.query(Review).filter(Review.id == rv['id']).first():
                rv['created_at'] = datetime.fromisoformat(str(rv['created_at'])) if rv.get('created_at') else datetime.now(timezone.utc) # type: ignore
                db.add(Review(**rv))
        db.commit()
    except Exception as e:
        print(f"  ⚠️ Reviews skipped: {str(e)[:60]}")
        db.rollback()

def main():
    print("Starting Mega Seed...")
    db = SessionLocal()
    try:
        seed_all(db)
        print("Mega Seed completed successfully!")
    except Exception as e:
        print(f"Error during seeding: {e}")
        db.rollback()
    finally:
        db.close()

if __name__ == "__main__":
    main()
