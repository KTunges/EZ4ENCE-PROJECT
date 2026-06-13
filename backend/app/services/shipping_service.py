import requests
import os
from fastapi import HTTPException
from app.config import settings
from dotenv import load_dotenv

load_dotenv()

# Lấy token từ ENV, lưu ý .env có dạng GHN_TOKEN="d6fd..."
GHN_TOKEN = os.getenv("GHN_TOKEN", "d6fd69b2-66c1-11f1-b8b0-2eefbe471c64")
GHN_SHOP_ID = os.getenv("GHN_SHOP_ID", "6488700")

# GHTK Config
GHTK_TOKEN = os.getenv("GHTK_TOKEN", "47LZuwNJqX2rQkoHaQauSPJru9c9r0HvOO9YrES")
GHTK_API_URL = "https://services.giaohangtietkiem.vn/services/shipment/fee"

# API GHN Production URLs
GHN_API_URL = "https://online-gateway.ghn.vn/shiip/public-api/master-data"
GHN_FEE_URL = "https://online-gateway.ghn.vn/shiip/public-api/v2/shipping-order/fee"

def get_ghn_headers():
    return {
        "Token": GHN_TOKEN,
        "Content-Type": "application/json"
    }

def get_ghtk_headers():
    return {
        "Token": GHTK_TOKEN
    }

class ShippingService:
    @staticmethod
    def get_ghn_provinces():
        try:
            res = requests.get(f"{GHN_API_URL}/province", headers=get_ghn_headers())
            data = res.json()
            if data.get("code") == 200:
                # Trả về format chuẩn: id, name
                return [{"id": p["ProvinceID"], "name": p["ProvinceName"]} for p in data.get("data", [])]
            return []
        except Exception as e:
            print("Error fetching provinces:", e)
            return []

    @staticmethod
    def get_ghn_districts(province_id: int):
        try:
            res = requests.post(f"{GHN_API_URL}/district", headers=get_ghn_headers(), json={"province_id": province_id})
            data = res.json()
            if data.get("code") == 200:
                return [{"id": d["DistrictID"], "name": d["DistrictName"]} for d in data.get("data", [])]
            return []
        except Exception as e:
            print("Error fetching districts:", e)
            return []

    @staticmethod
    def get_ghn_wards(district_id: int):
        try:
            res = requests.post(f"{GHN_API_URL}/ward", headers=get_ghn_headers(), json={"district_id": district_id})
            data = res.json()
            if data.get("code") == 200:
                return [{"id": w["WardCode"], "name": w["WardName"]} for w in data.get("data", [])]
            return []
        except Exception as e:
            print("Error fetching wards:", e)
            return []

    @staticmethod
    def calculate_real_fee(to_district_id: int, to_ward_code: str, weight_grams: int,
                           to_province_name: str = None, to_district_name: str = None, to_ward_name: str = None) -> list:
        # Shop base district is 1452 (Quận 7, HCM) as seen from the user's screenshot
        from_district_id = 1452 
        options = []
        
        # 1. GHN
        try:
            payload = {
                "service_type_id": 2, # 2 = E-commerce delivery
                "from_district_id": from_district_id,
                "to_district_id": to_district_id,
                "to_ward_code": str(to_ward_code) if to_ward_code else None,
                "weight": weight_grams or 1000,
                "length": 20,
                "width": 20,
                "height": 10,
                "insurance_value": 0,
                "coupon": None
            }
            
            headers = get_ghn_headers()
            headers["ShopId"] = str(GHN_SHOP_ID)
            
            res = requests.post(GHN_FEE_URL, headers=headers, json=payload, timeout=5)
            data = res.json()
            
            if data.get("code") == 200:
                fee = data["data"]["total"]
                options.append({
                    "id": "ghn_standard",
                    "provider": "Giao Hàng Nhanh",
                    "service_name": "Giao Nhanh",
                    "fee": fee,
                    "estimated_delivery": "Dự kiến 1-3 ngày",
                    "logo": "/ghn-logo.png"
                })
            else:
                print("GHN Fee Error:", data)
                options.append({
                    "id": "ghn_standard",
                    "provider": "Giao Hàng Nhanh",
                    "service_name": "Giao Nhanh",
                    "fee": 30000,
                    "estimated_delivery": "Dự kiến 2-3 ngày",
                    "logo": "/ghn-logo.png"
                })
        except Exception as e:
            print("Error calculating GHN fee:", e)
            
        # 2. GHTK
        if to_province_name and to_district_name:
            try:
                ghtk_params = {
                    "pick_province": "Hồ Chí Minh",
                    "pick_district": "Quận 7",
                    "province": to_province_name,
                    "district": to_district_name,
                    "ward": to_ward_name if to_ward_name else "",
                    "weight": weight_grams or 1000,
                    "deliver_option": "none"
                }
                res = requests.get(GHTK_API_URL, headers=get_ghtk_headers(), params=ghtk_params, timeout=5)
                data = res.json()
                if data.get("success"):
                    fee = data["fee"]["fee"]
                    options.append({
                        "id": "ghtk_standard",
                        "provider": "Giao Hàng Tiết Kiệm",
                        "service_name": "Giao Tiết Kiệm",
                        "fee": fee,
                        "estimated_delivery": "Dự kiến 2-4 ngày",
                        "logo": "/ghtk-logo.svg" # Assuming frontend will handle logo
                    })
                else:
                    print("GHTK Fee Error:", data)
            except Exception as e:
                print("Error calculating GHTK fee:", e)

        return options
