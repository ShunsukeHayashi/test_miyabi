#!/usr/bin/env python3
"""
Correct BytePlus I2V API Implementation
Using official BytePlus Python SDK v2 with task-based async API
"""

import os
import time
import json
from byteplussdkarkruntime import Ark

# Initialize Ark client
api_key = os.environ.get("BYTEPLUS_API_KEY") or os.environ.get("ARK_API_KEY")
if not api_key:
    raise ValueError("BYTEPLUS_API_KEY or ARK_API_KEY environment variable must be set")

client = Ark(
    base_url="https://ark.ap-southeast.bytepluses.com/api/v3",
    api_key=api_key,
)

# Scene 1 test image (replace with your actual image URL)
TEST_IMAGE_URL = os.environ.get("TEST_IMAGE_URL") or "https://example.com/your-image.jpg"

def generate_video_from_image(image_url: str, prompt: str, duration: int = 5):
    """
    Generate video from image using correct BytePlus I2V API

    Args:
        image_url: URL of source image
        prompt: Motion prompt for video generation
        duration: Video duration (5 or 10 seconds)

    Returns:
        Video URL if successful, None otherwise
    """
    print("=" * 60)
    print("🎬 BytePlus I2V - Correct API Implementation")
    print("=" * 60)

    # Create I2V task
    print("\n----- Creating I2V Task -----")
    print(f"Image: {image_url[:80]}...")
    print(f"Prompt: {prompt}")
    print(f"Duration: {duration}s")

    try:
        # Use correct API format with task-based system
        create_result = client.content_generation.tasks.create(
            model="seedance-1-0-pro-250528",  # Correct model ID
            content=[
                {
                    # Combination of text prompt and parameters
                    "type": "text",
                    "text": f"{prompt} --resolution 1080p --duration {duration} --camerafixed false"
                },
                {
                    # The URL of the first frame image
                    "type": "image_url",
                    "image_url": {
                        "url": image_url
                    }
                }
            ]
        )

        print(f"\n✅ Task created successfully!")
        print(f"Task ID: {create_result.id}")

        # Task created, now need to poll for status
        print(f"Task object type: {type(create_result)}")
        print(f"Task object attributes: {dir(create_result)}")

        # Polling query section
        print("\n----- Polling Task Status -----")
        task_id = create_result.id
        max_retries = 120  # 2 minutes max
        retry_count = 0

        while retry_count < max_retries:
            get_result = client.content_generation.tasks.get(task_id=task_id)
            status = get_result.status

            if status == "succeeded":
                print("\n✅ ----- Task Succeeded! -----")

                # Get full result as dict
                result_dict = get_result.model_dump() if hasattr(get_result, 'model_dump') else {}
                print(f"Full result: {json.dumps(result_dict, indent=2)}")

                # Extract video URL from result
                video_url = None
                if 'content' in result_dict and result_dict['content']:
                    content = result_dict['content']
                    if isinstance(content, dict):
                        video_url = content.get('video_url')
                elif 'output' in result_dict and result_dict['output']:
                    if isinstance(result_dict['output'], list) and len(result_dict['output']) > 0:
                        video_url = result_dict['output'][0].get('url') if isinstance(result_dict['output'][0], dict) else result_dict['output'][0]
                    elif isinstance(result_dict['output'], dict):
                        video_url = result_dict['output'].get('url')
                    else:
                        video_url = result_dict['output']

                if video_url:
                    print(f"\n✅ Video URL: {video_url}")
                else:
                    print(f"\n❌ Could not extract video URL from result")

                # Save result
                result_data = {
                    "task_id": task_id,
                    "status": "succeeded",
                    "video_url": video_url,
                    "full_result": result_dict,
                }

                with open('./i2v-success-result.json', 'w') as f:
                    json.dump(result_data, f, indent=2)

                return video_url

            elif status == "failed":
                print("\n❌ ----- Task Failed -----")
                print(f"Error: {get_result.error}")
                return None

            else:
                retry_count += 1
                print(f"[{retry_count}/{max_retries}] Status: {status}, waiting 1 second...")
                time.sleep(1)

        print("\n❌ Task timeout after 2 minutes")
        return None

    except Exception as e:
        print(f"\n❌ Error: {str(e)}")
        return None


if __name__ == "__main__":
    print("🎮 Gamer Grandma - I2V Video Generation Test")
    print("Using correct BytePlus SDK task-based API\n")

    if not os.environ.get("BYTEPLUS_API_KEY"):
        print("❌ Error: BYTEPLUS_API_KEY environment variable not set")
        exit(1)

    # Test with Scene 1: Peaceful Grandma
    prompt = "Slow gentle camera zoom in on peaceful grandmother's face. Her hands move gracefully knitting. Natural breathing. Soft ambient light. Calm and serene atmosphere."

    video_url = generate_video_from_image(
        image_url=TEST_IMAGE_URL,
        prompt=prompt,
        duration=5
    )

    if video_url:
        print("\n" + "=" * 60)
        print("🎉 SUCCESS! I2V API IS WORKING!")
        print("=" * 60)
        print(f"\n📹 Video URL: {video_url}")
        print("\n✅ Can now proceed with full video generation for all 7 scenes!")
    else:
        print("\n" + "=" * 60)
        print("❌ FAILED - I2V API still not working")
        print("=" * 60)
        print("\nPlease check:")
        print("1. API key has I2V permissions")
        print("2. BytePlus service status")
        print("3. Account tier supports I2V")
