#!/usr/bin/env python3
import json
import sys
from io import BytesIO
from PIL import Image


def validate():
    items = json.load(sys.stdin)
    valid = []
    for item in items:
        try:
            with Image.open(item["path"]) as image:
                image.verify()
            with Image.open(item["path"]) as image:
                if image.format == "WEBP" and image.width >= 100 and image.height >= 100:
                    valid.append(item["id"])
        except Exception:
            continue
    json.dump(valid, sys.stdout)


def encode():
    image = Image.open(BytesIO(sys.stdin.buffer.read())).convert("RGB")
    if image.width > 960:
        height = max(1, round(image.height * 960 / image.width))
        image = image.resize((960, height), Image.Resampling.LANCZOS)
    output = BytesIO()
    image.save(output, format="WEBP", quality=77, method=4)
    sys.stdout.buffer.write(output.getvalue())


if len(sys.argv) > 1 and sys.argv[1] == "validate":
    validate()
else:
    encode()
