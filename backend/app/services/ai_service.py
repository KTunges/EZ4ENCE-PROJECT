from groq import AsyncGroq
from app.config import settings
from loguru import logger

SYSTEM_PROMPT = """Bạn là trợ lý AI của cửa hàng EZ4GEAR — chuyên bán gear gaming cao cấp (chuột, bàn phím, tai nghe, màn hình, ghế gaming, linh kiện PC và các phụ kiện công nghệ).

NHIỆM VỤ:
- Tư vấn sản phẩm phù hợp với nhu cầu và ngân sách của khách hàng
- Giải đáp các câu hỏi về chính sách cửa hàng
- Hỗ trợ theo dõi đơn hàng cơ bản
- Chào hỏi thân thiện và chuyên nghiệp

THÔNG TIN CỬA HÀNG:
- Tên: EZ4GEAR
- Chuyên: Gear Gaming & Phụ kiện công nghệ
- Chính sách đổi trả: 7 ngày đổi trả miễn phí với sản phẩm lỗi kỹ thuật
- Bảo hành: Theo hãng (thường 12-24 tháng)
- Giao hàng: Toàn quốc, miễn phí cho đơn từ 500.000đ
- Thanh toán: COD, chuyển khoản, VNPay, PayPal

PHONG CÁCH:
- Thân thiện, nhiệt tình, chuyên nghiệp
- Trả lời ngắn gọn, đúng trọng tâm
- Dùng tiếng Việt tự nhiên
- Nếu không biết thông tin cụ thể (giá, tồn kho), hãy đề nghị khách để lại thông tin để nhân viên liên hệ lại
"""

class GroqChatService:
    def __init__(self):
        self._client = None

    def _get_client(self) -> AsyncGroq:
        if self._client is None:
            if not settings.GROQ_API_KEY:
                raise ValueError("GROQ_API_KEY chưa được cấu hình trong .env")
            self._client = AsyncGroq(api_key=settings.GROQ_API_KEY)
        return self._client

    async def get_ai_response(self, history: list[dict], new_message: str) -> str:
        try:
            client = self._get_client()

            # Xây dựng messages theo format OpenAI-compatible của Groq
            messages = [{"role": "system", "content": SYSTEM_PROMPT}]

            # Thêm lịch sử chat (10 tin gần nhất)
            for msg in history[-10:]:
                role = "user" if msg.get("sender") == "customer" else "assistant"
                content = msg.get("content") or ""
                if content:
                    messages.append({"role": role, "content": content})

            # Tin nhắn mới nhất
            messages.append({"role": "user", "content": new_message})

            response = await client.chat.completions.create(
                model="llama-3.3-70b-versatile",  # Model mạnh nhất, miễn phí
                messages=messages,
                max_tokens=512,
                temperature=0.7,
            )
            return response.choices[0].message.content

        except ValueError as e:
            logger.warning(f"AI Service: {e}")
            return "Xin lỗi, hệ thống AI tạm thời chưa được cấu hình. Vui lòng để lại tin nhắn, nhân viên sẽ phản hồi sớm nhất!"
        except Exception as e:
            logger.error(f"Groq API error: {e}")
            return "Xin lỗi, mình đang gặp chút sự cố kỹ thuật. Bạn vui lòng để lại câu hỏi, nhân viên EZ4GEAR sẽ hỗ trợ bạn ngay khi online nhé! 😊"


# Singleton instance
ai_service = GroqChatService()
