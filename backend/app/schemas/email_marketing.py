from pydantic import BaseModel
from typing import Optional
from datetime import datetime

class EmailCampaignBase(BaseModel):
    subject: str
    content: str

class EmailCampaignCreate(EmailCampaignBase):
    pass

class EmailCampaignResponse(EmailCampaignBase):
    id: str
    recipient_count: int
    sent_count: int
    failed_count: int
    status: str
    sent_at: Optional[datetime] = None
    created_at: datetime
    updated_at: datetime

    class Config:
        from_attributes = True
