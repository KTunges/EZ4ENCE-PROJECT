from fastapi import APIRouter, Depends, BackgroundTasks, HTTPException
from sqlalchemy.orm import Session
from app.database import get_db
from app.routers.auth import get_current_admin, get_current_super_admin
from app.models.user import User

from app.services.mailchimp_service import sync_user_to_mailchimp, create_and_send_campaign
from pydantic import BaseModel
from typing import Optional

router = APIRouter(tags=["Admin Mailchimp Sync"])

class CampaignRequest(BaseModel):
    subject: str
    content: str
    target_emails: Optional[str] = None

def sync_all_users_task(db: Session):
    users = db.query(User).filter(User.is_email_verified == True, User.email.isnot(None)).all()
    success_count = 0
    failed_count = 0
    for user in users:
        success, _ = sync_user_to_mailchimp(user.email, user.full_name)
        if success:
            success_count += 1
        else:
            failed_count += 1
    print(f"Mailchimp Sync Task Finished: {success_count} success, {failed_count} failed")

@router.post("/admin/mailchimp/sync")
def trigger_manual_sync(background_tasks: BackgroundTasks, db: Session = Depends(get_db), current_admin = Depends(get_current_super_admin)):
    background_tasks.add_task(sync_all_users_task, db)
    return {"message": "Tiến trình đồng bộ đã được bắt đầu chạy ngầm."}

@router.get("/admin/mailchimp/stats")
def get_mailchimp_stats(db: Session = Depends(get_db), current_admin = Depends(get_current_super_admin)):
    verified_users = db.query(User).filter(User.is_email_verified == True, User.email.isnot(None)).count()
    return {"verified_users": verified_users}

@router.post("/admin/mailchimp/campaign")
def send_mailchimp_campaign(request: CampaignRequest, db: Session = Depends(get_db), current_admin = Depends(get_current_super_admin)):
    success, message = create_and_send_campaign(request.subject, request.content, request.target_emails)
    if not success:
        raise HTTPException(status_code=400, detail=message)
    return {"message": message}
