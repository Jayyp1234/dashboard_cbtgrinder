import requests
import time
import random
import string


total_requests = 100_000

headers = {
    "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/135.0.0.0 Safari/537.36"
}

success_count = 0
fail_count = 0

for i in range(1, total_requests + 1):
    random_id = ''.join(random.choices(string.ascii_letters + string.digits, k=16))  # Generates a random 16-character alphanumeric string
    url = "https://cbtgrinder.com/test.php?visitor_id="+random_id
    try:
        response = requests.get(url, headers=headers, timeout=10)
        if response.status_code == 200:
            success_count += 1
        else:
            fail_count += 1
        print(f"Request {i} → Status: {response.status_code}")
        print("Response Body:", response.text.strip())
    except Exception as e:
        fail_count += 1
        print(f"Request {i} → Failed: {e}")

    # Optional: short delay to avoid overload
    # time.sleep(0.01)

print(f"\n✅ Done. Success: {success_count}, Failed: {fail_count}")
