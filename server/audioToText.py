import sys
import whisper

model = whisper.load_model("base")

def transcribe_audio(audio_path):
    try:
        result = model.transcribe(audio_path)
        return result["text"]
    except Exception as e:
        print(f"Error transcribing audio: {e}")
        sys.exit(1)

if __name__ == "__main__":
    if len(sys.argv) < 2:
        print("No audio file path provided")
        sys.exit(1)

    audio_file_path = sys.argv[1]
    transcript = transcribe_audio(audio_file_path)
    sys.stdout.write(transcript)