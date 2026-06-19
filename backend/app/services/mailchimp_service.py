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
                first_name = parts[-1]  # Vietnamese names usually have last name first, so first name is the last word
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

        # Mailchimp uses MD5 hash of lowercase email for the subscriber hash
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
