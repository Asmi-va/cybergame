"""Build an original SafeRon narration video for Modern Email Phishing.

The film is generated locally: original script, Windows speech synthesis,
and scene cards. It does not reuse CyberPlay footage.
"""

from __future__ import annotations

import json
import subprocess
import textwrap
import wave
from pathlib import Path

from PIL import Image, ImageDraw, ImageFont
from imageio_ffmpeg import get_ffmpeg_exe

ROOT = Path(__file__).resolve().parents[1]
OUT_DIR = ROOT / "public" / "courses" / "email-phishing"
TMP = ROOT / "scripts" / ".course-build"
FFMPEG = get_ffmpeg_exe()

SEGMENTS = [
    {
        "id": "requests",
        "checkpoint": True,
        "kicker": "01  ·  The request",
        "title": "Look at the ask,\nnot the costume",
        "card_from": "Priya Shah  ·  Accounts",
        "card_subject": "Please confirm your mailbox password so we can release the invoice",
        "card_body": "The layout is tidy. The logo is familiar.\nThe request is still a password.",
        "narration": (
            "Modern phishing rarely looks broken. The spelling is clean. The logo sits where you expect it. "
            "The tone is calm, or it sounds like a busy colleague. None of that proves the message is real. "
            "Phishing is a message that pretends to be someone you trust, so you will do something you would not do for a stranger. "
            "The usual asks are simple. Sign in. Pay. Download a file. Read out a code. Type a card number. "
            "Watch the request, not the decoration. A polished invoice that asks you to confirm your mailbox password is not an accounts process. "
            "Paying a supplier never requires your email password. A real HR note can be opened from the HR system you already use. "
            "It does not need a surprise button in a mail you were not expecting. "
            "Display name, logo, and tidy writing are costumes. The action the message wants is the clue. "
            "If a stranger would not be allowed to ask for it, do not hand it over from an email. "
            "Pause here, and decide what a password request tied to a payment is really asking."
        ),
    },
    {
        "id": "urgency",
        "checkpoint": True,
        "kicker": "02  ·  Pressure",
        "title": "A countdown is\nnot proof",
        "card_from": "Payment desk",
        "card_subject": "Supplier payment cancelled in 25 minutes unless you use this link",
        "card_body": "Large payments move on a schedule.\nThey do not move because an email is impatient.",
        "narration": (
            "Urgency is a tool. A real deadline can exist. A message that tries to outrun your normal check is a different thing. "
            "Attackers know that a frozen payment, a closing account, or a meeting in fifteen minutes makes careful people hurry. "
            "The hurry is the point. Once you skip the usual path, the costume does not have to be perfect. "
            "Read the clock they handed you. The supplier payment will be cancelled in twenty five minutes unless you use this link. "
            "That is not how a careful finance team moves a large payment. They have a payment run, a vendor record, and a person who can be reached on a number the company already stored. "
            "A countdown in an email is pressure, not proof. "
            "You can be polite and still slow down. Saying you will check this on the path you already use is a complete answer. "
            "If the request is real, it will still be real after you verify it. If it is not, the countdown was only there to stop you looking. "
            "Pause, and decide what to do with a deadline that asks you to skip the process."
        ),
    },
    {
        "id": "sender",
        "checkpoint": True,
        "kicker": "03  ·  The address",
        "title": "The display name\nis not the sender",
        "card_from": "Aarav Textiles Accounts",
        "card_subject": "From accounts@aarav-textiies.example",
        "card_body": "Your saved contact uses a different domain.\nAn invoice number can be real and the address still wrong.",
        "narration": (
            "The name you see and the address that sent the mail are not the same fact. "
            "Anyone can type Accounts payable, or a colleague's name, in the display name. The address behind it is where you look. "
            "Read the part after the at sign. Compare it with the domain your organisation already uses for that supplier or that team. "
            "Lookalikes are built to survive a glance. An extra letter. A hyphen. A dot co where your file says dot in. "
            "A free mailbox, when the real company writes from its own domain. "
            "The invoice number inside the mail can be copied from a genuine thread, and the address can still be wrong. "
            "Open a message you already trust from that supplier and put the two addresses next to each other. Do not rely on the logo. Logos are pictures. They can travel in any email. "
            "If the display name says a real company and the domain does not match the one on file, you are not looking at a small typo to ignore. You are looking at the reason to stop. "
            "Pause, and choose which part of the sender actually identifies them."
        ),
    },
    {
        "id": "channel",
        "checkpoint": True,
        "kicker": "04  ·  A trusted path",
        "title": "Do not let the\nmessage verify itself",
        "card_from": "Vendor master  ·  already on file",
        "card_subject": "Call the number stored yesterday",
        "card_body": "The phone number in the signature belongs to the sender.\nA pretender will confirm anything you ask.",
        "narration": (
            "A true request can arrive by email and still should be confirmed somewhere else. The mistake is to let the message choose the path. "
            "The link in the mail, the phone number in the signature, and the reply button all belong to the sender. "
            "If the sender is pretending, those paths lead back to them. They will say yes to whatever you ask. That is not verification. "
            "Use a path you already had before this message arrived. The supplier phone number on the vendor master. The portal you have bookmarked. "
            "The HR system you open from your own app, not from a button. The number printed on the back of your bank card, not the one in a text. "
            "For a bank detail change, call the number that was on file yesterday. Ask them to confirm the account already in your records. "
            "Do not read a new account out as if it were already decided. If they did change it, they can tell you through the relationship you already have. "
            "Never prove identity by answering the suspicious mail. A real person will understand a call to a known number. "
            "Pause, and pick the check that does not trust the message to verify itself."
        ),
    },
    {
        "id": "recovery",
        "checkpoint": True,
        "kicker": "05  ·  After a click",
        "title": "A clicked link\nis a report, not a secret",
        "card_from": "Your next step",
        "card_subject": "Change the password from a different device",
        "card_body": "Tell security on a channel you already had.\nDo not download a cleanup tool from the same mail.",
        "narration": (
            "Sometimes the click has already happened. That is a recovery problem, not a reason to hide. "
            "If you entered a password on a page you reached from the mail, assume that password is no longer secret. "
            "From a different device, one that did not open the link, change it. Change it anywhere you reused it. "
            "Turn on a second sign in check if the account offers one. "
            "Tell the people who can act. At work, that is your security or IT contact, using the channel your organisation already published, not a number from the email. "
            "At home, tell an adult you trust. If money moved, or a card number was typed, call the bank on the number printed on the card. "
            "Do not download a cleanup tool from the same message. Do not forward the link so colleagues can see if it works. Do not keep replying. "
            "Deleting the mail does not undo a sign in. "
            "Speed matters, and so does using your own paths. Report what you clicked, what you typed, and when. A clear report is more useful than a perfect one. "
            "Pause, and choose the first recovery step after a password has already been typed."
        ),
    },
    {
        "id": "close",
        "checkpoint": False,
        "kicker": "06  ·  Keep the sequence",
        "title": "Stop. Name the ask.\nCheck your own path.",
        "card_from": "SafeRon",
        "card_subject": "Play. Learn. Stay safe.",
        "card_body": "Legitimate teams can survive a phone call.\nFraudulent ones cannot survive a path they do not control.",
        "narration": (
            "You now have a sequence you can reuse on the next polished email. "
            "First, name the ask. Sign in, pay, download, or send a code. "
            "Second, notice pressure that tries to cancel your normal process. "
            "Third, read the real address, not the display name. "
            "Fourth, verify on a path you already trusted before the message arrived. "
            "Fifth, if you already handed over a secret, change it from a safe device and tell the right team. "
            "None of these steps require you to be rude, and none of them require you to be sure it is an attack before you pause. "
            "Legitimate teams can survive a phone call. Fraudulent ones cannot survive a path they do not control. "
            "The questions in this lesson were there to make you practise the decision while the example was still on screen. "
            "Your first result is the one that counts. You can replay the film whenever you want. "
            "The habit is the point. Stop, look at the ask, and check somewhere the sender did not choose. "
            "That is modern email phishing, and that is how you stay ahead of a message that looks finished."
        ),
    },
]


def font(size: int, bold: bool = False) -> ImageFont.FreeTypeFont | ImageFont.ImageFont:
    candidates = [
        "C:/Windows/Fonts/segoeuib.ttf" if bold else "C:/Windows/Fonts/segoeui.ttf",
        "C:/Windows/Fonts/arialbd.ttf" if bold else "C:/Windows/Fonts/arial.ttf",
    ]
    for path in candidates:
        if Path(path).exists():
            return ImageFont.truetype(path, size)
    return ImageFont.load_default()


def wrap(draw: ImageDraw.ImageDraw, text: str, face: ImageFont.ImageFont, width: int) -> list[str]:
    words = text.split()
    lines: list[str] = []
    current = ""
    for word in words:
        trial = word if not current else f"{current} {word}"
        if draw.textlength(trial, font=face) <= width:
            current = trial
        else:
            if current:
                lines.append(current)
            current = word
    if current:
        lines.append(current)
    return lines


def draw_segment(segment: dict, index: int) -> Path:
    image = Image.new("RGB", (1280, 720), "#07111f")
    draw = ImageDraw.Draw(image)
    draw.rectangle((0, 0, 1280, 8), fill="#3b82f6")
    draw.rounded_rectangle((48, 36, 1232, 664), radius=28, fill="#10192b", outline="#24344d", width=2)
    kicker_font = font(18, True)
    title_font = font(54, True)
    body_font = font(22)
    small = font(18)
    draw.text((84, 68), "SAFERON   ·   MODERN EMAIL PHISHING", font=kicker_font, fill="#7dd3fc")
    draw.text((84, 104), segment["kicker"], font=small, fill="#93a4bf")
    y = 150
    for line in segment["title"].split("\n"):
        draw.text((84, y), line, font=title_font, fill="#f8fafc")
        y += 64
    draw.rounded_rectangle((84, 340, 760, 600), radius=18, fill="#0c1424", outline="#2a3b56", width=2)
    draw.rectangle((84, 340, 760, 348), fill="#f0c575")
    draw.text((108, 366), segment["card_from"], font=font(16, True), fill="#f0c575")
    subject_lines = wrap(draw, segment["card_subject"], font(22, True), 610)
    sy = 404
    for line in subject_lines[:3]:
        draw.text((108, sy), line, font=font(22, True), fill="#e8eef8")
        sy += 30
    by = sy + 12
    for line in segment["card_body"].split("\n"):
        draw.text((108, by), line, font=body_font, fill="#b7c3d6")
        by += 30
    draw.rounded_rectangle((820, 340, 1196, 600), radius=18, fill="#122033", outline="#2a3b56", width=2)
    draw.text((848, 368), "ON SCREEN", font=kicker_font, fill="#93c5fd")
    notes = [
        "Original SafeRon lesson",
        "English narration",
        "The film pauses for a question",
        "Your first result is saved",
        f"Scene {index + 1} of {len(SEGMENTS)}",
    ]
    ny = 418
    for note in notes:
        draw.ellipse((848, ny + 6, 860, ny + 18), fill="#3b82f6")
        draw.text((874, ny), note, font=small, fill="#d5deea")
        ny += 32
    path = TMP / f"frame-{index:02d}.png"
    image.save(path)
    return path


def synthesize(text: str, wav_path: Path) -> None:
    script = TMP / "speak.ps1"
    safe = text.replace("'", "''")
    script.write_text(
        textwrap.dedent(
            f"""
            Add-Type -AssemblyName System.Speech
            $synth = New-Object System.Speech.Synthesis.SpeechSynthesizer
            $synth.Rate = 0
            $synth.SetOutputToWaveFile('{wav_path.as_posix()}')
            $synth.Speak('{safe}')
            $synth.Dispose()
            """
        ).strip(),
        encoding="utf-8-sig",
    )
    subprocess.run(["powershell", "-NoProfile", "-File", str(script)], check=True)


def wav_duration(path: Path) -> float:
    with wave.open(str(path), "rb") as handle:
        return handle.getnframes() / float(handle.getframerate())


def encode_segment(frame: Path, audio: Path, dest: Path) -> None:
    subprocess.run(
        [
            FFMPEG,
            "-y",
            "-loop",
            "1",
            "-framerate",
            "24",
            "-i",
            str(frame),
            "-i",
            str(audio),
            "-c:v",
            "libx264",
            "-tune",
            "stillimage",
            "-c:a",
            "aac",
            "-b:a",
            "160k",
            "-pix_fmt",
            "yuv420p",
            "-shortest",
            "-r",
            "24",
            "-movflags",
            "+faststart",
            str(dest),
        ],
        check=True,
        capture_output=True,
    )


def vtt_time(seconds: float) -> str:
    millis = int(round(seconds * 1000))
    hours, millis = divmod(millis, 3_600_000)
    minutes, millis = divmod(millis, 60_000)
    secs, millis = divmod(millis, 1000)
    return f"{hours:02d}:{minutes:02d}:{secs:02d}.{millis:03d}"


def main() -> None:
    OUT_DIR.mkdir(parents=True, exist_ok=True)
    TMP.mkdir(parents=True, exist_ok=True)
    list_path = TMP / "list.txt"
    pieces: list[str] = []
    cues: list[str] = []
    checkpoints: list[dict] = []
    cursor = 0.0
    words = 0
    for index, segment in enumerate(SEGMENTS):
        words += len(segment["narration"].split())
        frame = draw_segment(segment, index)
        audio = TMP / f"audio-{index:02d}.wav"
        clip = TMP / f"clip-{index:02d}.mp4"
        print(f"Speaking scene {index + 1}...")
        synthesize(segment["narration"], audio)
        duration = wav_duration(audio)
        print(f"  {duration:.1f}s")
        encode_segment(frame, audio, clip)
        pieces.append(f"file '{clip.as_posix()}'")
        start = cursor
        end = cursor + duration
        cues.append(f"{len(cues) + 1}\n{vtt_time(start)} --> {vtt_time(max(end - 0.2, start + 0.2))}\n{segment['narration']}\n")
        cursor = end
        if segment["checkpoint"]:
            checkpoints.append({"id": segment["id"], "at": round(cursor - 0.35, 2)})
    list_path.write_text("\n".join(pieces), encoding="utf-8")
    lesson = OUT_DIR / "lesson.mp4"
    subprocess.run(
        [FFMPEG, "-y", "-f", "concat", "-safe", "0", "-i", str(list_path), "-c", "copy", "-movflags", "+faststart", str(lesson)],
        check=True,
        capture_output=True,
    )
    vtt = "WEBVTT\n\n" + "\n".join(cues)
    (OUT_DIR / "lesson.en.vtt").write_text(vtt, encoding="utf-8")
    timeline = {
        "duration": round(cursor, 2),
        "language": "en",
        "words": words,
        "checkpoints": checkpoints,
        "video": "/courses/email-phishing/lesson.mp4",
        "subtitles": "/courses/email-phishing/lesson.en.vtt",
    }
    (OUT_DIR / "timeline.json").write_text(json.dumps(timeline, indent=2), encoding="utf-8")
    print(json.dumps(timeline, indent=2))


if __name__ == "__main__":
    main()
