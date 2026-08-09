import mailchimp_marketing as MailchimpMarketing
from mailchimp_marketing.api_client import ApiClientError
import hashlib
from typing import Optional
from app.config import settings

def get_mailchimp_client():
    if not settings.MAILCHIMP_API_KEY or not settings.MAILCHIMP_SERVER_PREFIX:
        return None
    try:
        client = MailchimpMarketing.Client()
        client.set_config({
            "api_key": settings.MAILCHIMP_API_KEY,
            "server": settings.MAILCHIMP_SERVER_PREFIX
        })
        return client
    except Exception as e:
        print(f"Failed to initialize Mailchimp client: {e}")
        return None

def sync_user_to_mailchimp(email: str, full_name: Optional[str] = None):
    """
    Add or update a user in the Mailchimp Audience (List).
    """
    if not settings.MAILCHIMP_LIST_ID:
        return False, "Missing MAILCHIMP_LIST_ID"
        
    client = get_mailchimp_client()
    if not client:
        return False, "Missing Mailchimp config"

    try:
        # Split name for merge fields
        first_name = ""
        last_name = ""
        if full_name:
            parts = full_name.strip().split(" ")
            if len(parts) > 1:
                first_name = parts[-1]
                last_name = " ".join(parts[:-1])
            else:
                first_name = full_name

        member_info = {
            "email_address": email,
            "status_if_new": "subscribed",
            "merge_fields": {
                "FNAME": first_name,
                "LNAME": last_name
            }
        }

        subscriber_hash = hashlib.md5(email.lower().encode('utf-8')).hexdigest()

        response = client.lists.set_list_member(
            settings.MAILCHIMP_LIST_ID,
            subscriber_hash,
            member_info
        )
        print(f"Mailchimp Sync Success for {email}. Status: {response.get('status')}")
        return True, response
    except ApiClientError as error:
        print(f"Mailchimp API Error for {email}: {error.text}")
        return False, error.text
    except Exception as e:
        print(f"Mailchimp Sync Error: {e}")
        return False, str(e)

def create_and_send_campaign(subject: str, plain_text_content: str, target_emails: Optional[str] = None):
    if not settings.MAILCHIMP_LIST_ID:
        return False, "Missing MAILCHIMP_LIST_ID"
        
    client = get_mailchimp_client()
    if not client:
        return False, "Missing Mailchimp config"

    try:
        segment_opts = None
        if target_emails:
            emails = [email.strip() for email in target_emails.split(",") if email.strip()]
            
            if not emails:
                return False, "Danh sách email không hợp lệ."
            
            import time
            segment_name = f"Custom list {len(emails)} users - {int(time.time())}"
            segment_data = {
                "name": segment_name,
                "static_segment": emails
            }
            segment_response = client.lists.create_segment(settings.MAILCHIMP_LIST_ID, segment_data)
            segment_id = segment_response.get("id")
            
            segment_opts = {
                "saved_segment_id": segment_id
            }

        import time
        campaign_name = f"{subject} - {int(time.time())}"
        
        campaign_settings = {
            "subject_line": subject,
            "title": campaign_name,
            "from_name": "EZ4GEAR Store",
            "reply_to": settings.SMTP_EMAIL or "noreply@ez4gear.com"
        }
        
        recipients = {
            "list_id": settings.MAILCHIMP_LIST_ID
        }
        if segment_opts:
            recipients["segment_opts"] = segment_opts

        campaign_data = {
            "type": "regular",
            "recipients": recipients,
            "settings": campaign_settings
        }

        campaign_response = client.campaigns.create(campaign_data)
        campaign_id = campaign_response.get("id")

        html_content = f"<p style='white-space: pre-wrap; font-family: sans-serif; font-size: 15px;'>{plain_text_content}</p>"
        
        content_data = {
            "plain_text": plain_text_content,
            "html": html_content
        }
        client.campaigns.set_content(campaign_id, content_data)

        client.campaigns.send(campaign_id)
        
        return True, "Chiến dịch Email đã được gửi thành công!"
        
    except ApiClientError as error:
        print(f"Mailchimp API Error: {error.text}")
        return False, error.text
    except Exception as e:
        print(f"Mailchimp Campaign Error: {e}")
        return False, str(e)
